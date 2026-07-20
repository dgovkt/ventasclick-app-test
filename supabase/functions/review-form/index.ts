import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "GET") {
      const url = new URL(req.url);
      const socioId = url.searchParams.get("socio_id");

      if (!socioId) {
        return new Response(
          JSON.stringify({ success: false, error: "socio_id requerido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("nombre, apellido")
        .eq("id", socioId)
        .eq("rol", "socio")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return new Response(
          JSON.stringify({ success: false, error: "Socio no encontrado" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, nombre: `${data.nombre} ${data.apellido}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { socio_id, nombre_cliente, contacto_cliente, score_nps, comentario } = body;

      if (!socio_id || !nombre_cliente || !comentario || score_nps === undefined) {
        return new Response(
          JSON.stringify({ success: false, error: "Campos requeridos: socio_id, nombre_cliente, score_nps, comentario" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: socio } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", socio_id)
        .eq("rol", "socio")
        .maybeSingle();

      if (!socio) {
        return new Response(
          JSON.stringify({ success: false, error: "Socio no válido" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: insertError } = await supabase
        .from("customer_reviews")
        .insert({
          socio_id,
          nombre_cliente: nombre_cliente.trim(),
          contacto_cliente: contacto_cliente?.trim() || null,
          score_nps: Number(score_nps),
          comentario: comentario.trim(),
          estatus: "pendiente",
        });

      if (insertError) {
        throw insertError;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Método no soportado" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in review-form:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error interno",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
