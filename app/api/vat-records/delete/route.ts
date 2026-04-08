import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID bulunamadı" }, { status: 400 });
    }

    const { error } = await supabase
      .from("vat_records")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.redirect(new URL("/admin?success=deleted", req.url));

  } catch (err) {
    return NextResponse.redirect(new URL("/admin?error=delete_failed", req.url));
  }
}