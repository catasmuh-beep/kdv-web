import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function num(v: FormDataEntryValue | null) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("vat_records")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Kayıtlar alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const year = Number(formData.get("year"));
    const month = Number(formData.get("month"));

    if (!year || !month) {
      return NextResponse.redirect(new URL("/admin?error=year_month_required", req.url));
    }

    const e_fatura_gelen = num(formData.get("e_fatura_gelen"));
    const e_fatura_kesilen = num(formData.get("e_fatura_kesilen"));
    const e_arsiv_kesilen = num(formData.get("e_arsiv_kesilen"));
    const devreden = num(formData.get("devreden"));

const toplam_kesilen = e_fatura_kesilen + e_arsiv_kesilen;

// %20 KDV dahil toplamdan KDV ayırma
const gelen_kdv = e_fatura_gelen / 6;
const kesilen_kdv = toplam_kesilen / 6;

// Tabloda FARK brüt fark olarak görünsün
const fark = e_fatura_gelen - toplam_kesilen;

// KDV farkı ve yeni devir
const aylik_kdv_farki = gelen_kdv - kesilen_kdv;
const kdv_devir = devreden + aylik_kdv_farki;

// POZİTİF devir = ödenecek yok, kesilebilecek var
const kdv_paneli = kdv_devir > 0 ? kdv_devir : 0;
const kesilebilecek_fatura = kdv_devir > 0 ? kdv_devir * 6 : 0;

// NEGATİF devir = ödenecek var, bunu kapatmak için min fatura gerekir
const min_gelmesi_gereken_fatura = kdv_devir < 0 ? Math.abs(kdv_devir) * 6 : 0;

let alarm = "KDV NÖTR";
if (kdv_devir > 0) {
  alarm = "KDV ÖDEMESİ YOK";
} else if (kdv_devir < 0) {
  alarm = "KDV ÖDEMESİ VAR";
}

    const monthNames = [
      "",
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];

    const payload = {
      year,
      month,
      month_name: monthNames[month] || "",
      e_fatura_gelen,
      e_fatura_kesilen,
      e_arsiv_kesilen,
      devreden,
      fark,
      kdv_devir,
      kesilebilecek_fatura,
      kdv_paneli,
      min_gelmesi_gereken_fatura,
      alarm,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("vat_records")
      .upsert(payload, { onConflict: "year,month" });

    if (error) {
      return NextResponse.redirect(
        new URL(`/admin?error=${encodeURIComponent(error.message)}`, req.url)
      );
    }

    return NextResponse.redirect(new URL("/admin?success=updated", req.url));
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Kayıt kaydedilemedi.";
    return NextResponse.redirect(
      new URL(`/admin?error=${encodeURIComponent(message)}`, req.url)
    );
  }
}