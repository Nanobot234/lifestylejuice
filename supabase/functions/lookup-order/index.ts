import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, email } = await req.json();

    if (typeof orderId !== "string" || typeof email !== "string" || !orderId.trim() || !email.trim()) {
      return new Response(JSON.stringify({ error: "Order ID and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedId = orderId.trim();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Support lookup by full UUID or by last 5-8 chars
    let query = admin.from("orders").select("*");
    if (trimmedId.length >= 32) {
      query = query.eq("id", trimmedId);
    } else {
      // fuzzy last-chars match
      query = query.ilike("id", `%${trimmedId}`);
    }

    const { data: orders, error } = await query.limit(5);
    if (error) {
      console.error("lookup-order query error", error);
      return new Response(JSON.stringify({ error: "Lookup failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const match = (orders ?? []).find((o: any) => {
      const orderEmail = (o.order_details?.email ?? "").toString().trim().toLowerCase();
      return orderEmail === normalizedEmail;
    });

    if (!match) {
      return new Response(JSON.stringify({ error: "No order found matching that ID and email" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: items } = await admin
      .from("order_items")
      .select("quantity, price_at_purchase, special_instructions, products(*)")
      .eq("order_id", match.id);

    return new Response(
      JSON.stringify({ order: match, items: items ?? [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("lookup-order error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});