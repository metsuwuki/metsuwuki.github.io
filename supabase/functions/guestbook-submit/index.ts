import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, message } = await req.json();

    // Get client IP
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Check rate limit: count messages from this IP in the last hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();

    const { data: recentMessages, error: countError } = await supabase
      .from("guestbook")
      .select("id")
      .eq("ip_address", clientIp)
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
      throw countError;
    }

    // If more than 1 message from this IP in the last hour, reject
    if ((recentMessages?.length || 0) >= 1) {
      return new Response(
        JSON.stringify({
          error: "rate_limit_exceeded",
          message: "Вы можете отправлять только одно сообщение в час",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert the new message with IP address
    const { error: insertError } = await supabase
      .from("guestbook")
      .insert({
        name: name.trim(),
        message: message.trim(),
        ip_address: clientIp,
      });

    if (insertError) {
      console.error("Error inserting message:", insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Сообщение отправлено" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: "Ошибка при отправке сообщения",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
