import { supabase } from "@/integrations/supabase/client";

const BUCKET = "imported-prints";

/**
 * Extrai o path do objeto dentro do bucket "imported-prints" a partir de uma
 * URL assinada do Supabase Storage. Retorna null quando não for possível.
 *
 * Ex.: "https://.../storage/v1/object/sign/imported-prints/<userId>/<file>?token=..."
 *      -> "<userId>/<file>"
 */
export function extractImportedPrintPath(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  try {
    const u = new URL(imageUrl);
    const marker = `/${BUCKET}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const raw = u.pathname.slice(idx + marker.length);
    if (!raw) return null;
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

/**
 * Apaga um registro de `imported_prints` e tenta remover o arquivo correspondente
 * do Storage. RLS já garante que apenas o próprio usuário consegue apagar.
 * Falha do Storage é tolerada (apenas logada); falha no DELETE do banco propaga.
 */
export async function deleteImportedPrint(
  id: string,
  imageUrl: string | null,
): Promise<void> {
  const path = extractImportedPrintPath(imageUrl);
  if (path) {
    const { error: storageErr } = await supabase.storage.from(BUCKET).remove([path]);
    if (storageErr) {
      console.warn("Falha ao remover imagem do storage:", storageErr.message);
    }
  }
  const { error } = await supabase.from("imported_prints").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
