import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Login | Ghostlayer",
  description: "Log in to the Ghostlayer admin workspace.",
};

const ADMIN_COOKIE = "ghostlayer_admin_session";

async function loginAdmin(formData: FormData) {
  "use server";

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "/admin/analytics").trim();

  const nextPath =
    nextRaw.startsWith("/admin") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/admin/analytics";

  const adminUser = process.env.ADMIN_USERNAME?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!adminUser || !adminPassword || !adminSessionSecret) {
    redirect(`/admin/login?error=config&next=${encodeURIComponent(nextPath)}`);
  }

  if (username !== adminUser || password !== adminPassword) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE, adminSessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(nextPath);
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const nextPath =
    resolvedSearchParams.next &&
    resolvedSearchParams.next.startsWith("/admin") &&
    !resolvedSearchParams.next.startsWith("//")
      ? resolvedSearchParams.next
      : "/admin/analytics";

  const errorMessage =
    resolvedSearchParams.error === "missing"
      ? "Enter your admin username and password."
      : resolvedSearchParams.error === "invalid"
      ? "Admin login failed. Check your username and password."
      : resolvedSearchParams.error === "config"
      ? "Admin login is not configured yet."
      : resolvedSearchParams.error === "admin-login-required"
      ? "Admin login required."
      : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white">
      <AdminLoginBackground />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col justify-center">
        <Link
          href="/"
          className="mb-10 inline-block text-center text-lg font-bold tracking-[0.38em] text-white adminLoginLogoGlow"
        >
          GHOSTLAYER ADMIN
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-300">
            Admin Login
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Access admin workspace.
          </h1>

          <p className="mt-5 text-sm leading-7 text-gray-300">
            Admin access is restricted to authorized Ghostlayer operators.
          </p>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <form action={loginAdmin} className="mt-8 space-y-5">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
                Username
              </span>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300/70 focus:bg-white/[0.11]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300/70 focus:bg-white/[0.11]"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_35px_rgba(255,255,255,0.16)] transition hover:scale-[1.01]"
            >
              Log in
            </button>
          </form>
        </div>
      </section>

      <AdminLoginStyles />
    </main>
  );
}

function AdminLoginBackground() {
  return (
    <div className="adminLoginNightSky" aria-hidden="true">
      <span className="adminLoginFogOne" />
      <span className="adminLoginFogTwo" />
      <span className="adminLoginMoon" />
    </div>
  );
}

function AdminLoginStyles() {
  return (
    <style>{`
      .adminLoginNightSky {
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 12%, rgba(34, 211, 238, 0.10), transparent 30%),
          radial-gradient(circle at 82% 18%, rgba(139, 92, 246, 0.14), transparent 34%),
          radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.07), transparent 38%),
          linear-gradient(135deg, #071517 0%, #060910 44%, #030409 100%);
      }

      .adminLoginNightSky::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 12% 14%, rgba(255,255,255,0.90) 0 1.2px, transparent 2px),
          radial-gradient(circle at 26% 32%, rgba(255,255,255,0.72) 0 1px, transparent 2px),
          radial-gradient(circle at 43% 18%, rgba(125,249,255,0.70) 0 1px, transparent 2px),
          radial-gradient(circle at 69% 24%, rgba(255,255,255,0.78) 0 1.2px, transparent 2px),
          radial-gradient(circle at 88% 68%, rgba(255,255,255,0.70) 0 1px, transparent 2px),
          radial-gradient(circle at 31% 86%, rgba(125,249,255,0.62) 0 1px, transparent 2px),
          radial-gradient(circle at 76% 78%, rgba(255,255,255,0.68) 0 1px, transparent 2px);
        background-repeat: no-repeat;
        opacity: 0.46;
        animation: adminLoginTwinkle 4.8s ease-in-out infinite;
      }

      .adminLoginMoon {
        position: fixed;
        right: 3%;
        top: 5%;
        z-index: 1;
        width: min(34vw, 30rem);
        height: min(34vw, 30rem);
        border-radius: 9999px;
        background:
          radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.86) 12%, rgba(226,232,240,0.68) 30%, rgba(148,163,184,0.38) 54%, rgba(30,41,59,0.18) 78%, rgba(15,23,42,0.04) 100%);
        box-shadow:
          0 0 44px rgba(255,255,255,0.38),
          0 0 95px rgba(191,219,254,0.30),
          0 0 165px rgba(96,165,250,0.22),
          inset -42px -34px 70px rgba(15,23,42,0.42),
          inset 18px 14px 44px rgba(255,255,255,0.30);
        opacity: 0.28;
        animation: adminLoginMoonGlow 4.8s ease-in-out infinite;
      }

      .adminLoginFogOne,
      .adminLoginFogTwo {
        position: fixed;
        z-index: 1;
        border-radius: 9999px;
        filter: blur(90px);
        opacity: 0.18;
      }

      .adminLoginFogOne {
        left: -12%;
        bottom: 8%;
        width: 36rem;
        height: 14rem;
        background: rgba(34, 211, 238, 0.22);
        animation: adminLoginFogDriftOne 28s ease-in-out infinite;
      }

      .adminLoginFogTwo {
        right: 8%;
        bottom: -8%;
        width: 34rem;
        height: 16rem;
        background: rgba(16, 185, 129, 0.18);
        animation: adminLoginFogDriftTwo 34s ease-in-out infinite;
      }

      .adminLoginLogoGlow {
        animation: adminLoginLogoPulse 2.8s ease-in-out infinite;
        text-shadow:
          0 0 8px rgba(255,255,255,0.70),
          0 0 18px rgba(255,255,255,0.45),
          0 0 34px rgba(96,165,250,0.36),
          0 0 52px rgba(59,130,246,0.24);
      }

      @keyframes adminLoginTwinkle {
        0%, 100% { opacity: 0.34; }
        50% { opacity: 0.58; }
      }

      @keyframes adminLoginMoonGlow {
        0%, 100% {
          opacity: 0.22;
          transform: scale(1);
        }
        50% {
          opacity: 0.38;
          transform: scale(1.015);
        }
      }

      @keyframes adminLoginFogDriftOne {
        0%, 100% { transform: translateX(-2%) translateY(0px) scale(1); }
        50% { transform: translateX(5%) translateY(-8px) scale(1.06); }
      }

      @keyframes adminLoginFogDriftTwo {
        0%, 100% { transform: translateX(3%) translateY(0px) scale(1.02); }
        50% { transform: translateX(-4%) translateY(8px) scale(1.08); }
      }

      @keyframes adminLoginLogoPulse {
        0%, 100% {
          opacity: 0.84;
          text-shadow:
            0 0 8px rgba(255,255,255,0.60),
            0 0 18px rgba(255,255,255,0.35),
            0 0 34px rgba(96,165,250,0.28);
        }
        50% {
          opacity: 1;
          text-shadow:
            0 0 12px rgba(255,255,255,0.95),
            0 0 26px rgba(255,255,255,0.58),
            0 0 48px rgba(147,197,253,0.42),
            0 0 76px rgba(59,130,246,0.30);
        }
      }

      @media (max-width: 768px) {
        .adminLoginMoon {
          right: -28%;
          top: 2%;
          width: 22rem;
          height: 22rem;
        }
      }
    `}</style>
  );
}
