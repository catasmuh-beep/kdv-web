import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("kdv_admin")?.value === "1";

  if (isAdmin) {
    redirect("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
<img
  src="/logo.svg"
  style={{
    height: 60,
    marginBottom: 14,
    display: "block",
  }}
/>
        <img
  src="/catas-logo.svg"
  style={{
    height: 70,
    marginBottom: 16
  }}
/>
        <h1
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 28,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          KDV Takip Sistemi
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: "#6b7280",
            fontSize: 15,
          }}
        >
          Admin girişi yaparak yönetim paneline geçin.
        </p>

        <form action="/api/login" method="POST">
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Admin Şifresi
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Şifreyi girin"
            required
            style={{
              width: "100%",
              height: 46,
              padding: "0 14px",
              borderRadius: 12,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 15,
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              height: 46,
              border: "none",
              borderRadius: 12,
              background: "#111827",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Giriş Yap
          </button>
        </form>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <a
            href="/personel"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Personel ekranına git
          </a>
        </div>
      </div>
    </main>
  );
}
