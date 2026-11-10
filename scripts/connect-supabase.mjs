import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Only public application credentials are persisted. CLI access tokens and
// service-role keys are never printed, written to the checkout or sent to it.
function cliPath() {
  if (process.env.SUPABASE_CLI_PATH) return process.env.SUPABASE_CLI_PATH;
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    const cache = path.join(process.env.LOCALAPPDATA, "npm-cache", "_npx");
    if (existsSync(cache)) {
      for (const entry of readdirSync(cache)) {
        const candidate = path.join(
          cache,
          entry,
          "node_modules",
          "supabase",
          "bin",
          "supabase.exe",
        );
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return "supabase";
}

const cli = cliPath();
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
function runJson(command) {
  const result = spawnSync(cli, [...command, "--output", "json"], {
    encoding: "utf8",
    timeout: 30_000,
    windowsHide: true,
  });
  if (result.error?.code === "ENOENT")
    throw new Error("Supabase CLI not found. Install it or set SUPABASE_CLI_PATH.");
  if (result.status !== 0) {
    // Do not echo CLI output: API-key commands can include privileged keys.
    throw new Error(
      "Supabase CLI access failed. Run npm run supabase:login, then retry. Confirm this account can access Zapiboo Kids.",
    );
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error("The Supabase CLI returned an unexpected response.");
  }
}

try {
  if (args.includes("--login")) {
    const result = spawnSync(cli, ["login"], { stdio: "inherit", windowsHide: true });
    process.exit(result.status ?? 1);
  }
  const name = option("--project-name") ?? "Zapiboo Kids";
  const projects = runJson(["projects", "list"]);
  const matches = projects.filter((project) =>
    option("--project-ref")
      ? project.id === option("--project-ref")
      : project.name?.toLowerCase() === name.toLowerCase(),
  );
  if (matches.length !== 1)
    throw new Error(
      `Expected one project named ${name}. Pass --project-ref with the exact reference from your dashboard.`,
    );
  const project = matches[0];
  if (!/^[a-z]{20}$/.test(project.id))
    throw new Error("Invalid project reference returned by the CLI.");
  const keys = runJson(["projects", "api-keys", "--project-ref", project.id]);
  const key =
    keys.find((item) => item.api_key?.startsWith("sb_publishable_"))?.api_key ??
    keys.find((item) => item.name === "anon")?.api_key;
  if (!key) throw new Error("No publishable or legacy anon key is available for this project.");
  if (!key.startsWith("sb_publishable_")) {
    const claims = JSON.parse(Buffer.from(key.split(".")[1] ?? "", "base64url").toString());
    if (claims.role !== "anon")
      throw new Error("Refusing to expose a privileged key to the website.");
  }
  const url = `https://${project.id}.supabase.co`;
  const settings = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: key },
    signal: AbortSignal.timeout(15_000),
  });
  if (!settings.ok)
    throw new Error(
      `Project authentication health check returned HTTP ${settings.status}. Configuration was not changed.`,
    );
  // Verify schema visibility without downloading customer data.
  const schema = await fetch(
    `${url}/rest/v1/leads?select=id,user_id,items,message,photo_url,vehicle_type,status&limit=0`,
    { headers: { apikey: key }, signal: AbortSignal.timeout(15_000) },
  );
  if (!schema.ok)
    throw new Error(
      `The project's leads table is unavailable (HTTP ${schema.status}). Configuration was not changed; check its schema and grants.`,
    );
  const envPath = path.resolve(".env.local");
  let contents = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  for (const [name, value] of Object.entries({
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
    NEXT_SUPABASE_URL: url,
    NEXT_SUPABASE_PUBLISHABLE_KEY: key,
  })) {
    const line = `${name}=${value}`;
    const pattern = new RegExp(`^${name}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.trimEnd()}\n${line}\n`;
  }
  writeFileSync(envPath, contents.trimStart(), { mode: 0o600 });
  console.log(
    `Connected ${project.name} (${project.id}). Auth and database endpoints responded successfully. Public credentials saved to ignored .env.local. Restart Next.js.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : "Supabase setup failed.");
  process.exitCode = 1;
}
