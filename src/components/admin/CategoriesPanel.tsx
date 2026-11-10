"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { Plus, Pencil, EyeOff, Eye, ArrowUpRight, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { compressImageToWebp } from "@/lib/client-image";
import { categoryInputSchema, categorySlug, type CategoryInput } from "@/lib/category-input";
import type { SellingCategory } from "@/lib/selling-categories";

type Draft = Omit<CategoryInput, "types"> & { types: string };
const emptyDraft: Draft = {
  id: "",
  name: "",
  description: "",
  image_url: "",
  tagline: "",
  accent_color: "#e3efff",
  types: "",
  preparation: "",
  intro: "",
  seo_title: "",
  seo_description: "",
  sort_order: 0,
  is_active: true,
};
async function saveCategory(value: CategoryInput, creating: boolean) {
  const response = await fetch("/api/admin/categories", {
    method: creating ? "POST" : "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not save category.");
}
export function CategoriesPanel() {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const {
    data,
    error,
    isLoading,
    mutate: reload,
  } = useSWR<SellingCategory[]>(["admin", "categories"], async () => {
    const response = await fetch("/api/admin/categories");
    if (!response.ok) throw new Error("Could not load categories.");
    return response.json();
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [formError, setFormError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [visibilityTarget, setVisibilityTarget] = useState<SellingCategory | null>(null);
  const [filter, setFilter] = useState("");
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const refresh = async () => {
    await Promise.all([reload(), mutate("/api/categories")]);
    router.refresh();
  };
  const start = (category?: SellingCategory) => {
    setEditing(Boolean(category));
    setSlugTouched(Boolean(category));
    setImageFile(null);
    setPreview("");
    setFormError("");
    setDraft(
      category
        ? ({ ...emptyDraft, ...category, types: category.types.join("\n") } as Draft)
        : {
            ...emptyDraft,
            sort_order: Math.min(
              9999,
              Math.max(0, ...(data || []).map((c) => c.sort_order || 0)) + 10,
            ),
          },
    );
    setOpen(true);
  };
  const onImage = async (file?: File) => {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setFormError("Choose a JPG, PNG or WebP image smaller than 10 MB.");
      return;
    }
    try {
      const compressed = await compressImageToWebp(file, 720, 0.85);
      setPreview(compressed);
      setImageFile(file);
      setFormError("");
    } catch {
      setFormError("Could not open this image. Try another JPG, PNG or WebP.");
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (savingRef.current) return;
    setFormError("");
    const parsed = categoryInputSchema.safeParse({
      ...draft,
      image_url: imageFile ? "pending-upload" : draft.image_url,
      types: [
        ...new Set(
          draft.types
            .split(/\r?\n/)
            .map((value) => value.trim())
            .filter(Boolean),
        ),
      ],
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Check the category details.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    let uploadedPath: string | undefined;
    let saved = false;
    try {
      const value = parsed.data;
      if (imageFile) {
        const blob = await (await fetch(preview)).blob();
        if (blob.size > 2 * 1024 * 1024)
          throw new Error("The processed image is too large. Choose a smaller image.");
        uploadedPath = `categories/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage
          .from("category-images")
          .upload(uploadedPath, blob, { contentType: "image/webp", upsert: false });
        if (error) throw new Error("Could not upload the category image. Please try again.");
        value.image_url = supabase.storage
          .from("category-images")
          .getPublicUrl(uploadedPath).data.publicUrl;
      }
      await saveCategory(value, !editing);
      saved = true;
      setOpen(false);
      toast.success(editing ? "Category updated." : "Category added.");
      await refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not save category.");
      if (saved)
        toast.error("Category saved, but the list could not refresh. Reload the dashboard.");
    } finally {
      if (uploadedPath && !saved)
        await supabase.storage.from("category-images").remove([uploadedPath]);
      savingRef.current = false;
      setSaving(false);
    }
  };
  const changeVisibility = async () => {
    if (!visibilityTarget || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const value = categoryInputSchema.parse({
        ...visibilityTarget,
        types: [...visibilityTarget.types],
        is_active: !visibilityTarget.is_active,
      });
      await saveCategory(value, false);
      setVisibilityTarget(null);
      toast.success(
        value.is_active
          ? "Category published."
          : "Category hidden. Existing pickups are preserved.",
      );
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change visibility.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };
  const categories = (data || []).filter((category) =>
    (category.name + " " + category.id).toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold">Selling categories</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add images and details, then publish categories across your website and pickup flow.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {(data || []).filter((c) => c.is_active).length} published /{" "}
            {(data || []).filter((c) => !c.is_active).length} hidden
          </p>
        </div>
        <Button onClick={() => start()}>
          <Plus size={17} />
          Add category
        </Button>
      </div>
      <Input
        aria-label="Search categories"
        placeholder="Search categories..."
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        className="my-5 max-w-md"
      />
      {error ? (
        <div role="alert">
          <p>Could not load categories.</p>
          <Button variant="outline" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <p className="py-10 text-sm">Loading categories...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              data-managed-category={category.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div
                className="relative rounded-xl p-3"
                style={{ backgroundColor: category.accent_color }}
              >
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="h-36 w-full object-contain"
                />
                <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold">
                  {category.is_active ? "Published" : "Hidden"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {category.types.length} item examples / Order {category.sort_order}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => start(category)}>
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setVisibilityTarget(category)}>
                  {category.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  {category.is_active ? "Hide" : "Publish"}
                </Button>
                {category.is_active && (
                  <a
                    href={`/sell/${category.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-9 items-center gap-1 px-2 text-xs font-bold text-primary"
                  >
                    View page
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {!isLoading && !error && !categories.length && (
        <p className="py-8 text-sm text-muted-foreground">
          No matching categories. Add one to get started.
        </p>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!saving) setOpen(value);
        }}
      >
        <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col overflow-hidden p-0">
          <DialogHeader className="border-b px-6 pb-4 pt-6">
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>
              Control the category image, item examples and public page details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="min-h-0 overflow-y-auto px-6 pb-6">
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="category-name">Category name</Label>
                <Input
                  id="category-name"
                  value={draft.name}
                  maxLength={80}
                  required
                  onChange={(e) => {
                    update("name", e.target.value);
                    if (!editing && !slugTouched) update("id", categorySlug(e.target.value));
                  }}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category-slug">Category URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">/sell/</span>
                  <Input
                    id="category-slug"
                    value={draft.id}
                    required
                    disabled={editing}
                    maxLength={60}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update("id", e.target.value);
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {editing
                    ? "URL stays fixed so existing links and pickup history continue working."
                    : "Use lowercase words separated by hyphens."}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category-description">Short description</Label>
                <Textarea
                  id="category-description"
                  value={draft.description}
                  required
                  minLength={10}
                  maxLength={600}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category-image">Category image</Label>
                {(preview || draft.image_url) && (
                  <img
                    src={preview || draft.image_url}
                    alt="Category image preview"
                    className="my-3 h-36 w-full rounded-xl bg-secondary object-contain"
                  />
                )}
                <Input
                  id="category-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => void onImage(e.target.files?.[0])}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  <ImagePlus className="mr-1 inline size-3" />
                  JPG, PNG or WebP, up to 10 MB. Images are optimized before upload.
                </p>
              </div>
              <div>
                <Label htmlFor="category-tagline">Card tagline</Label>
                <Input
                  id="category-tagline"
                  value={draft.tagline}
                  maxLength={100}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category-order">Display order</Label>
                <Input
                  id="category-order"
                  type="number"
                  min={0}
                  max={9999}
                  value={draft.sort_order}
                  onChange={(e) => update("sort_order", Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-muted-foreground">Lower numbers appear first.</p>
              </div>
              <div>
                <Label htmlFor="category-color">Card background color</Label>
                <Input
                  id="category-color"
                  type="color"
                  value={draft.accent_color}
                  onChange={(e) => update("accent_color", e.target.value)}
                />
              </div>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="size-4"
                />
                Show category on website
              </label>
              <div className="sm:col-span-2">
                <Label htmlFor="category-types">Item examples (one per line)</Label>
                <Textarea
                  id="category-types"
                  value={draft.types}
                  required
                  rows={5}
                  maxLength={6000}
                  onChange={(e) => update("types", e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Up to 50 examples. These appear in the pickup guide and category page.
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="category-preparation">Preparation instructions</Label>
                <Textarea
                  id="category-preparation"
                  value={draft.preparation}
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                  onChange={(e) => update("preparation", e.target.value)}
                />
              </div>
              <details className="sm:col-span-2 rounded-xl border p-4">
                <summary className="cursor-pointer text-sm font-bold">
                  Page introduction & SEO (optional)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="category-intro">Page introduction</Label>
                    <Textarea
                      id="category-intro"
                      value={draft.intro}
                      maxLength={2000}
                      onChange={(e) => update("intro", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-seo-title">SEO title</Label>
                    <Input
                      id="category-seo-title"
                      value={draft.seo_title}
                      maxLength={120}
                      onChange={(e) => update("seo_title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-seo-description">SEO description</Label>
                    <Textarea
                      id="category-seo-description"
                      value={draft.seo_description}
                      maxLength={300}
                      onChange={(e) => update("seo_description", e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave blank to use defaults based on the category name and description.
                  </p>
                </div>
              </details>
            </div>
            {formError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
              >
                {formError}
              </p>
            )}
            <div className="sticky -bottom-6 mt-6 flex justify-end gap-3 border-t bg-card py-4">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={Boolean(visibilityTarget)}
        onOpenChange={(value) => {
          if (!value && !saving) setVisibilityTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {visibilityTarget?.is_active ? "Hide" : "Publish"} {visibilityTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {visibilityTarget?.is_active
                ? "This removes the category from public choices. Existing pickup requests and their history stay intact."
                : "This category will appear on the homepage, area pages, category directory and pickup flow."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <Button disabled={saving} onClick={() => void changeVisibility()}>
              {saving ? "Saving..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
