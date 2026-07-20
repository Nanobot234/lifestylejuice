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
    const { orderId, email, phone } = await req.json();

    if (typeof orderId !== "string" || !orderId.trim()) {
      return new Response(JSON.stringify({ error: "Order ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedId = orderId.trim();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Support lookup by full UUID or by last 5-8 chars
    let query = admin.from("orders").select("*");
    if (trimmedId.length >= 32) {
      query = query.eq("id", trimmedId);
    } else {
      // fuzzy last-chars match (cast uuid to text for ilike)
      query = query.filter("id::text", "ilike", `%${trimmedId}`);
    }

    const { data: orders, error } = await query.limit(10);
    if (error) {
      console.error("lookup-order query error", error);
      return new Response(JSON.stringify({ error: "Lookup failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const list = orders ?? [];
    let match: any = null;

    if (normalizedEmail) {
      match = list.find((o: any) =>
        (o.order_details?.email ?? "").toString().trim().toLowerCase() === normalizedEmail
      );
    } else if (normalizedPhone) {
      match = list.find((o: any) => {
        const p = (o.order_details?.phone ?? "").toString().replace(/\D/g, "");
        return p && p === normalizedPhone;
      });
    } else if (list.length === 1) {
      match = list[0];
    } else if (list.length > 1) {
      return new Response(
        JSON.stringify({ error: "Multiple orders match that ID. Please provide the email or phone used at checkout." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!match) {
      return new Response(JSON.stringify({ error: "No order found matching those details" }), {
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