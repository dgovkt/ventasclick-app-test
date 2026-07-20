import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: casos, error } = await supabase
      .from("casos_exito")
      .select(`
        id,
        url_sitio,
        tipo_plan,
        titulo,
        descripcion_corta,
        descripcion_completa,
        created_at,
        updated_at,
        profiles:socio_id (
          nombre,
          apellido
        )
      `)
      .eq("estatus", "aprobado")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const casosFormateados = casos.map((caso: any) => ({
      id: caso.id,
      url_sitio: caso.url_sitio,
      tipo_plan: caso.tipo_plan === "presencia_web" ? "Presencia Web" : "Tienda en Línea",
      titulo: caso.titulo,
      descripcion_corta: caso.descripcion_corta,
      descripcion_completa: caso.descripcion_completa,
      socio: caso.profiles ? `${caso.profiles.nombre} ${caso.profiles.apellido}` : "Anónimo",
      fecha_publicacion: caso.created_at,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        total: casosFormateados.length,
        casos: casosFormateados,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching casos:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
