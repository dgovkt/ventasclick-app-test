import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

    const url = new URL(req.url);
    const socioId = url.searchParams.get("socio_id");

    let query = supabase
      .from("customer_reviews")
      .select(`
        id,
        nombre_cliente,
        score_nps,
        comentario,
        created_at,
        profiles:socio_id (
          nombre,
          apellido
        )
      `)
      .eq("estatus", "aprobado")
      .order("created_at", { ascending: false });

    if (socioId) {
      query = query.eq("socio_id", socioId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      throw error;
    }

    const reviewsFormateadas = reviews.map((review: any) => {
      const category = review.score_nps >= 9 ? 'promotor' : review.score_nps >= 7 ? 'pasivo' : 'detractor';

      return {
        id: review.id,
        nombre_cliente: review.nombre_cliente,
        score_nps: review.score_nps,
        categoria: category,
        comentario: review.comentario,
        socio: review.profiles ? `${review.profiles.nombre} ${review.profiles.apellido}` : "Anónimo",
        fecha_publicacion: review.created_at,
      };
    });

    const npsStats = {
      total: reviewsFormateadas.length,
      promedio: reviewsFormateadas.length > 0
        ? Math.round((reviewsFormateadas.reduce((sum: number, r: any) => sum + r.score_nps, 0) / reviewsFormateadas.length) * 10) / 10
        : 0,
      promotores: reviewsFormateadas.filter((r: any) => r.categoria === 'promotor').length,
      pasivos: reviewsFormateadas.filter((r: any) => r.categoria === 'pasivo').length,
      detractores: reviewsFormateadas.filter((r: any) => r.categoria === 'detractor').length,
    };

    const npsScore = npsStats.total > 0
      ? Math.round(((npsStats.promotores - npsStats.detractores) / npsStats.total) * 100)
      : 0;

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          ...npsStats,
          nps_score: npsScore,
        },
        reviews: reviewsFormateadas,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);

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
