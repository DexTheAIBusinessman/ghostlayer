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
          className="ghostlayerLogoGlow mb-8 block text-center text-lg font-bold tracking-[0.38em] text-white"
        >
          GHOSTLAYER ADMIN
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-10">
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
  const stars = [
    { left: "6%", top: "10%", size: 2, delay: "0s", duration: "4.8s", opacity: 0.75 },
    { left: "12%", top: "32%", size: 2, delay: "1.1s", duration: "5.4s", opacity: 0.7 },
    { left: "25%", top: "18%", size: 3, delay: "1.6s", duration: "5.8s", opacity: 0.78 },
    { left: "42%", top: "12%", size: 2, delay: "2.5s", duration: "5.6s", opacity: 0.72 },
    { left: "51%", top: "38%", size: 2, delay: "1.3s", duration: "5.2s", opacity: 0.82 },
    { left: "68%", top: "20%", size: 2, delay: "2.9s", duration: "5.3s", opacity: 0.76 },
    { left: "77%", top: "50%", size: 3, delay: "1.8s", duration: "4.7s", opacity: 0.85 },
    { left: "86%", top: "16%", size: 2, delay: "0.4s", duration: "5.7s", opacity: 0.72 },
    { left: "94%", top: "70%", size: 2, delay: "2.2s", duration: "5.1s", opacity: 0.7 },
    { left: "30%", top: "88%", size: 2, delay: "2.4s", duration: "5.2s", opacity: 0.58 },
    { left: "59%", top: "74%", size: 2, delay: "0.9s", duration: "5.5s", opacity: 0.6 },
    { left: "90%", top: "40%", size: 2, delay: "0.6s", duration: "4.9s", opacity: 0.68 },
  ];

  return (
    <div className="legalNightSky" aria-hidden="true">
      <div className="legalSkyGradient" />
      <div className="legalFog legalFogA" />
      <div className="legalFog legalFogB" />
      <div className="legalOrb legalOrbA" />
      <div className="legalOrb legalOrbB" />

      {stars.map((star, index) => (
        <span
          key={index}
          className="legalStar"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}

      <span className="adminLoginMoon" />
    </div>
  );
}

function AdminLoginStyles() {
  return (
    <style>{`
      .legalNightSky {
        pointer-events: none;
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background:
          radial-gradient(circle at 20% 12%, rgba(59,130,246,0.11), transparent 28%),
          radial-gradient(circle at 82% 18%, rgba(147,51,234,0.08), transparent 26%),
          radial-gradient(circle at 50% 100%, rgba(6,182,212,0.045), transparent 34%),
          #05070b;
      }

      .legalSkyGradient {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(2,6,23,0.15), rgba(0,0,0,0.38)),
          radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.32) 78%);
      }

      .legalStar {
        position: absolute;
        display: block;
        border-radius: 9999px;
        background: #fff;
        box-shadow:
          0 0 8px rgba(255,255,255,0.95),
          0 0 18px rgba(147,197,253,0.62),
          0 0 30px rgba(59,130,246,0.35);
        animation-name: legalTwinkle;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }

      .legalOrb {
        position: absolute;
        border-radius: 9999px;
        filter: blur(92px);
        opacity: 0.24;
      }

      .legalOrbA {
        left: -10%;
        top: -8%;
        height: 26rem;
        width: 26rem;
        background: rgba(34,211,238,0.07);
        animation: legalFloatSlow 26s ease-in-out infinite;
      }

      .legalOrbB {
        right: -10%;
        top: 18%;
        height: 22rem;
        width: 22rem;
        background: rgba(59,130,246,0.07);
        animation: legalFloatSlow 28s ease-in-out infinite;
      }

      .legalFog {
        position: absolute;
        left: -10%;
        right: -10%;
        height: 170px;
        border-radius: 9999px;
        filter: blur(92px);
        opacity: 0.075;
        mix-blend-mode: screen;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(147,197,253,0.12), rgba(96,165,250,0.11), rgba(255,255,255,0));
      }

      .legalFogA {
        top: 18%;
        animation: legalFogDriftOne 42s ease-in-out infinite;
      }

      .legalFogB {
        top: 58%;
        animation: legalFogDriftTwo 46s ease-in-out infinite;
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

      .ghostlayerLogoGlow {
        animation: legalLogoPulseGlow 2.8s ease-in-out infinite;
        text-shadow:
          0 0 8px rgba(255,255,255,0.70),
          0 0 18px rgba(255,255,255,0.45),
          0 0 34px rgba(96,165,250,0.36),
          0 0 52px rgba(59,130,246,0.24);
      }

      @keyframes legalTwinkle {
        0%, 100% {
          transform: translateY(0px) scale(0.85);
          opacity: 0.22;
        }
        25% {
          transform: translateY(-4px) scale(1.18);
          opacity: 1;
        }
        50% {
          transform: translateY(0px) scale(0.95);
          opacity: 0.42;
        }
        75% {
          transform: translateY(3px) scale(1.08);
          opacity: 0.78;
        }
      }

      @keyframes legalFloatSlow {
        0%, 100% {
          transform: translate3d(0,0,0);
        }
        50% {
          transform: translate3d(0,10px,0);
        }
      }

      @keyframes legalFogDriftOne {
        0%, 100% {
          transform: translateX(-2%) translateY(0px) scale(1);
        }
        50% {
          transform: translateX(3%) translateY(-4px) scale(1.04);
        }
      }

      @keyframes legalFogDriftTwo {
        0%, 100% {
          transform: translateX(3%) translateY(0px) scale(1.02);
        }
        50% {
          transform: translateX(-2%) translateY(5px) scale(1.06);
        }
      }

      @keyframes adminLoginMoonGlow {
        0%, 100% {
          opacity: 0.22;
          box-shadow:
            0 0 44px rgba(255,255,255,0.26),
            0 0 95px rgba(191,219,254,0.20),
            0 0 165px rgba(96,165,250,0.14),
            inset -42px -34px 70px rgba(15,23,42,0.42),
            inset 18px 14px 44px rgba(255,255,255,0.24);
        }
        50% {
          opacity: 0.38;
          box-shadow:
            0 0 54px rgba(255,255,255,0.46),
            0 0 120px rgba(191,219,254,0.36),
            0 0 190px rgba(96,165,250,0.28),
            inset -42px -34px 70px rgba(15,23,42,0.42),
            inset 18px 14px 44px rgba(255,255,255,0.34);
        }
      }

      @keyframes legalLogoPulseGlow {
        0%, 100% {
          opacity: 0.82;
          text-shadow:
            0 0 7px rgba(255,255,255,0.46),
            0 0 16px rgba(96,165,250,0.24),
            0 0 34px rgba(59,130,246,0.16);
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
