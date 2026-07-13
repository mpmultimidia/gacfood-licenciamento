import { createClient } from "@supabase/supabase-js";
import type { Database } from "../tipos/database.js";
import { ambiente } from "../config/ambiente.js";

export const supabase = createClient<
  Database,
  "lic"
>(
  ambiente.supabaseUrl,
  ambiente.supabaseServiceRoleKey,
  {
    db: {
      schema: "lic",
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function testarConexao(): Promise<void> {
  const inicio = Date.now();

  const { error, count } =
    await supabase
      .from("empresas")
      .select("id", {
        count: "exact",
        head: true,
      });

  if (error) {
    console.error(
      "❌ Falha na conexão Supabase:",
      error.message
    );

    throw error;
  }

  console.log(
    `✅ Supabase conectado. Empresas: ${count ?? 0}. Tempo: ${
      Date.now() - inicio
    }ms`
  );
}