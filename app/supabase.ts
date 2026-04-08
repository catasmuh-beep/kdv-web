import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export type VatRecord = {
  id: string;
  year: number;
  month: number;
  month_name: string | null;
  e_fatura_gelen: number | null;
  e_fatura_kesilen: number | null;
  e_arsiv_kesilen: number | null;
  devreden: number | null;
  fark: number | null;
  kdv_devir: number | null;
  kesilebilecek_fatura: number | null;
  kdv_paneli: number | null;
  min_gelmesi_gereken_fatura: number | null;
  alarm: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type VatInput = {
  year: number;
  month: number;
  month_name: string;
  e_fatura_gelen: number;
  e_fatura_kesilen: number;
  e_arsiv_kesilen: number;
  devreden: number;
};

function ensureEnv() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL eksik");
  }

  if (!supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY eksik");
  }
}

export function getSupabaseBrowser() {
  ensureEnv();
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseServer() {
  ensureEnv();
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseAdmin() {
  ensureEnv();
  const keyToUse = supabaseServiceRoleKey || supabaseAnonKey;
  return createClient(supabaseUrl, keyToUse);
}

export const MONTHS_TR = [
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

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function monthNameFromNumber(month: number) {
  return MONTHS_TR[month - 1] || `Ay-${month}`;
}

export function calculateVatFields(input: VatInput) {
  const gelen = Number(input.e_fatura_gelen || 0);
  const kesilenEFatura = Number(input.e_fatura_kesilen || 0);
  const kesilenEArsiv = Number(input.e_arsiv_kesilen || 0);
  const devredenKdv = Number(input.devreden || 0);

  const fark = gelen - kesilenEFatura - kesilenEArsiv;
  const kdvDevir = devredenKdv + fark / 6;
  const kesilebilecekFatura = kdvDevir > 0 ? kdvDevir * 6 : 0;
  const minGelmesiGerekenFatura = kdvDevir < 0 ? Math.abs(kdvDevir) * 6 : 0;
  const kdvPaneli = kdvDevir > 0 ? kdvDevir : 0;

  let alarm = "KDV NÖTR";
  if (kdvDevir > 0) {
    alarm = "KDV ÖDEMESİ YOK";
  } else if (kdvDevir < 0) {
    alarm = "KDV ÖDEMESİ VAR";
  }

  return {
    year: Number(input.year),
    month: Number(input.month),
    month_name: input.month_name,
    e_fatura_gelen: round2(gelen),
    e_fatura_kesilen: round2(kesilenEFatura),
    e_arsiv_kesilen: round2(kesilenEArsiv),
    devreden: round2(devredenKdv),
    fark: round2(fark),
    kdv_devir: round2(kdvDevir),
    kesilebilecek_fatura: round2(kesilebilecekFatura),
    kdv_paneli: round2(kdvPaneli),
    min_gelmesi_gereken_fatura: round2(minGelmesiGerekenFatura),
    alarm,
  };
}

export async function getVatRecords(): Promise<VatRecord[]> {
  ensureEnv();

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("vat_records")
    .select("*")
    .order("year", { ascending: true })
    .order("month", { ascending: true });

  if (error) {
    console.error("vat_records fetch error:", error);
    throw new Error(`vat_records okunamadı: ${error.message}`);
  }

  return (data ?? []) as VatRecord[];
}