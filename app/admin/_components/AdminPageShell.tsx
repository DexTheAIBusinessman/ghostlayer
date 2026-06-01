"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AdminPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function AdminPageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: AdminPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] px-6 py-10 text-white">
      <AdminBackground />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin/analytics"
              className="adminLogoGlow inline-block text-lg font-bold tracking-[0.38em] text-white"
            >
              GHOSTLAYER ADMIN
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.48em] text-cyan-300">
              {eyebrow}
            </p>

            <h1 className="mt-5 max-w-4xl sm: sm: text-4xl font-black tracking-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {actions ?? (
              <>
                <Link
                  href="/admin/analytics"
                  className="rounded-2xl border border-white/15 bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_0_35px_rgba(255,255,255,0.16)] transition hover:scale-[1.02]"
                >
                  Analytics
                </Link>

                <Link
                  href="/admin/reports"
                  className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
                >
                  Reports
                </Link>
              </>
            )}
          </div>
        </div>

        {children}
      </section>

      <style>{`
        .adminNightSky {
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

        .adminNightSky::before {
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
          animation: adminTwinkle 4.8s ease-in-out infinite;
        }

        .adminMoon {
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
          animation: adminMoonGlow 4.8s ease-in-out infinite;
        }

        .adminFogOne,
        .adminFogTwo {
          position: fixed;
          z-index: 1;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.18;
        }

        .adminFogOne {
          left: -12%;
          bottom: 8%;
          width: 36rem;
          height: 14rem;
          background: rgba(34, 211, 238, 0.22);
          animation: adminFogDriftOne 28s ease-in-out infinite;
        }

        .adminFogTwo {
          right: 8%;
          bottom: -8%;
          width: 34rem;
          height: 16rem;
          background: rgba(16, 185, 129, 0.18);
          animation: adminFogDriftTwo 34s ease-in-out infinite;
        }

        .adminLogoGlow {
          animation: adminLogoPulse 2.8s ease-in-out infinite;
          text-shadow:
            0 0 8px rgba(255,255,255,0.70),
            0 0 18px rgba(255,255,255,0.45),
            0 0 34px rgba(96,165,250,0.36),
            0 0 52px rgba(59,130,246,0.24);
        }

        @keyframes adminTwinkle {
          0%, 100% { opacity: 0.34; }
          50% { opacity: 0.58; }
        }

        @keyframes adminMoonGlow {
          0%, 100% {
            opacity: 0.22;
            transform: scale(1);
          }
          50% {
            opacity: 0.38;
            transform: scale(1.015);
          }
        }

        @keyframes adminFogDriftOne {
          0%, 100% { transform: translateX(-2%) translateY(0px) scale(1); }
          50% { transform: translateX(5%) translateY(-8px) scale(1.06); }
        }

        @keyframes adminFogDriftTwo {
          0%, 100% { transform: translateX(3%) translateY(0px) scale(1.02); }
          50% { transform: translateX(-4%) translateY(8px) scale(1.08); }
        }

        @keyframes adminLogoPulse {
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
      `}</style>
    </main>
  );
}

function AdminBackground() {
  return (
    <div className="adminNightSky" aria-hidden="true">
      <span className="adminFogOne" />
      <span className="adminFogTwo" />
      <span className="adminMoon" />
    </div>
  );
}
