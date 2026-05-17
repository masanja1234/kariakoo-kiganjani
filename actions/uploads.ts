"use server";

import { auth } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient, STORAGE_BUCKETS } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function validateImage(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Aina ya faili si sahihi. Tumia JPEG, PNG, au WebP tu.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Faili ni kubwa sana. Ukubwa wa juu ni 5 MB.");
  }
  if (file.size === 0) {
    throw new Error("Faili haliwezi kuwa tupu.");
  }
}

async function uploadToStorage(
  bucket: string,
  formData: FormData
): Promise<{ url: string; path: string }> {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Hakuna faili lililotolewa.");
  validateImage(file);

  const supabase = createAdminClient();
  const ext = MIME_TO_EXT[file.type] ?? "jpg";
  const path = `${uuidv4()}.${ext}`;

  const buffer = await file.arrayBuffer();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw new Error("Imeshindwa kupakia picha. Jaribu tena.");

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: urlData.publicUrl, path: data.path };
}

/** Admin only — upload product image */
export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  return uploadToStorage(STORAGE_BUCKETS.PRODUCT_IMAGES, formData);
}

/** Admin only — upload category image */
export async function uploadCategoryImage(formData: FormData) {
  await requireAdmin();
  return uploadToStorage(STORAGE_BUCKETS.CATEGORY_IMAGES, formData);
}

/** Authenticated users — upload budget request reference image */
export async function uploadBudgetRequestImage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Tafadhali ingia kwanza ili kupakia picha.");
  return uploadToStorage(STORAGE_BUCKETS.BUDGET_REQUEST_IMAGES, formData);
}

/** Admin only — delete a file from Supabase storage */
export async function deleteStorageFile(bucket: string, path: string) {
  await requireAdmin();
  if (!path || !bucket) throw new Error("Bucket na path zinahitajika.");
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error("Imeshindwa kufuta faili.");
}
