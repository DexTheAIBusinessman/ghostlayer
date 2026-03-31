import { supabase } from "@/lib/supabase";

export async function trackCtaClick(source: "homepage" | "dashboard") {
  try {
    await supabase.from("cta_clicks").insert([
      {
        source,
      },
    ]);
  } catch (error) {
    console.error("CTA tracking failed:", error);
  }
}
