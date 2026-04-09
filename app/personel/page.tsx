import { getVatRecords, VatRecord } from "../supabase";

function formatCurrency(value: number | null | undefined) {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const safeValue =
    typeof value === "string" && !value.endsWith("Z") ? `${value}Z` : value;

  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(safeValue));
}

function alarmBadge(record: VatRecord) {
  const alarm = record.alarm ?? "";

  if (alarm.includes("VAR")) {
    return {
      text: "🔴 KDV ÖDEMESİ VAR",
      bg: "#fee2e2",
      color: "#b91c1c",
    };
  }

  if (alarm.includes("NÖTR")) {
    return {
      text: "🟡 KDV NÖTR",
      bg: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    text: "🟢 KDV ÖDEMESİ YOK",
    bg: "#dcfce7",
    color: "#166534",
  };
}

function moneyStyle(type: "positive" | "negative" | "neutral"): React.CSSProperties {
  if (type === "positive") {
    return {
      color: "#15803d",
      fontWeight: 800,
    };
  }

  if (type === "negative") {
    return {
      color: "#b91c1c",
      fontWeight: 800,
    };
  }

  return {
    color: "#111827",
    fontWeight: 700,
  };
}

export default async function PersonelPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const selectedYearParam = typeof params?.year === "string" ? params.year : "";

  const records = await getVatRecords();

  const yearSet = new Set<number>();
  records.forEach((r) => {
    const y = Number(r.year);
    if (Number.isFinite(y)) yearSet.add(y);
  });

  const availableYears = Array.from(yearSet).sort((a, b) => b - a);

  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
    }).format(new Date())
  );

  const selectedYear =
    selectedYearParam && selectedYearParam !== "all" && !Number.isNaN(Number(selectedYearParam))
      ? Number(selectedYearParam)
      : currentYear;

  const filteredRecords =
    selectedYearParam === "all"
      ? records
      : records.filter((row) => Number(row.year) === selectedYear);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1650, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  }}
>
  <img
    src="/catas-logo.svg"
    alt="Çataş Mühendislik"
    style={{
      height: 62,
      width: "auto",
      display: "block",
      marginBottom: 8,
    }}
  />
  <div
    style={{
      fontSize: 28,
      fontWeight: 800,
      color: "#111827",
      lineHeight: 1.1,
    }}
  >
    KDV TAKİP PROGRAMI
  </div>
</div>

          <a
            href="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              textDecoration: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Admin Paneli
          </a>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 18,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Aylık KDV Kayıtları
            </div>

            <form
              action="/personel"
              method="GET"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <label
                htmlFor="yearFilter"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Yıl Filtresi
              </label>

              <select
                id="yearFilter"
                name="year"
                defaultValue={selectedYearParam || String(currentYear)}
                style={{
                  height: 40,
                  minWidth: 140,
                  padding: "0 12px",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  background: "#fff",
                }}
              >
                <option value="all">Tüm Yıllar</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Filtrele
              </button>

              <a
                href="/personel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: "#e5e7eb",
                  color: "#111827",
                  fontWeight: 700,
                }}
              >
                Bu Yıl
              </a>
            </form>
          </div>

          <div
            style={{
              padding: "12px 18px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              fontSize: 14,
              fontWeight: 700,
              color: "#374151",
            }}
          >
            Aktif filtre: {selectedYearParam === "all" ? "Tüm Yıllar" : `${selectedYear} Yılı`}
          </div>

          <div style={{ padding: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {[
                    "YIL",
                    "AY",
                    "GELEN",
                    "KES. E-FATURA",
                    "KES. E-ARŞİV",
                    "DEVREDEN KDV",
                    "FARK",
                    "KDV DEVİR",
                    "KESİLEBİLECEK",
                    "MİN. FATURA",
                    "ALARM",
                    "GÜNCELLEME",
                  ].map((title) => (
                    <th key={title} style={thStyle}>
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={emptyCellStyle}>
                      Bu filtrede kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((row) => {
                    const badge = alarmBadge(row);

                    return (
                      <tr key={row.id}>
                        <td style={cellStyle}>{row.year}</td>
                        <td style={cellStyle}>{row.month_name ?? row.month}</td>
                        <td style={{ ...cellStyle, ...moneyStyle("positive") }}>
                          {formatCurrency(row.e_fatura_gelen)}
                        </td>
                        <td style={{ ...cellStyle, ...moneyStyle("negative") }}>
                          {formatCurrency(row.e_fatura_kesilen)}
                        </td>
                        <td style={{ ...cellStyle, ...moneyStyle("negative") }}>
                          {formatCurrency(row.e_arsiv_kesilen)}
                        </td>
                        <td style={cellStyle}>{formatCurrency(row.devreden)}</td>
                        <td
                          style={{
                            ...cellStyle,
                            ...(Number(row.fark ?? 0) >= 0
                              ? moneyStyle("positive")
                              : moneyStyle("negative")),
                          }}
                        >
                          {formatCurrency(row.fark)}
                        </td>
                        <td
                          style={{
                            ...cellStyle,
                            ...(Number(row.kdv_devir ?? 0) >= 0
                              ? moneyStyle("positive")
                              : moneyStyle("negative")),
                          }}
                        >
                          {formatCurrency(row.kdv_devir)}
                        </td>
                        <td style={{ ...cellStyle, ...moneyStyle("positive") }}>
                          {formatCurrency(row.kesilebilecek_fatura)}
                        </td>
                        <td
                          style={{
                            ...cellStyle,
                            ...(Number(row.min_gelmesi_gereken_fatura ?? 0) > 0
                              ? moneyStyle("negative")
                              : moneyStyle("neutral")),
                          }}
                        >
                          {formatCurrency(row.min_gelmesi_gereken_fatura)}
                        </td>
                        <td style={cellStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontWeight: 700,
                              background: badge.bg,
                              color: badge.color,
                              fontSize: 12,
                              textAlign: "center",
                              lineHeight: 1.2,
                            }}
                          >
                            {badge.text}
                          </span>
                        </td>
                        <td style={cellStyle}>{formatDate(row.updated_at)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 8px",
  borderBottom: "1px solid #e5e7eb",
  color: "#111827",
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.2,
};

const cellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 8px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 13,
  color: "#111827",
  verticalAlign: "middle",
  lineHeight: 1.25,
  wordBreak: "break-word",
};

const emptyCellStyle: React.CSSProperties = {
  padding: 20,
  textAlign: "center",
  color: "#6b7280",
};
