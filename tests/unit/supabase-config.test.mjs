import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("../../src/integrations/supabase/config.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { resolveSupabaseConfig } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const jwt = (role) =>
  `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;

test("accepts trimmed publishable and legacy anon credentials", () => {
  assert.deepEqual(
    resolveSupabaseConfig(" https://project.supabase.co/ ", " sb_publishable_test "),
    { url: "https://project.supabase.co", key: "sb_publishable_test" },
  );
  assert.equal(resolveSupabaseConfig("https://project.supabase.co", jwt("anon")).key, jwt("anon"));
  assert.ok(resolveSupabaseConfig("http://127.0.0.1:54321", jwt("anon")));
});

test("rejects privileged keys and malformed or insecure remote endpoints", () => {
  for (const key of ["sb_secret_test", jwt("service_role"), jwt("authenticated"), "not-a-key"])
    assert.equal(resolveSupabaseConfig("https://project.supabase.co", key), null);
  for (const url of [
    "http://project.supabase.co",
    "https://user:password@project.supabase.co",
    "https://project.supabase.co/rest/v1",
    "https://project.supabase.co?key=value",
    "not-a-url",
  ])
    assert.equal(resolveSupabaseConfig(url, jwt("anon")), null);
  assert.equal(resolveSupabaseConfig(undefined, undefined), null);
});
