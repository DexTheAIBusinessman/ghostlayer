import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Client Account | Ghostlayer",
  description: "Create your Ghostlayer client account.",
};

async function signupClient(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!email || !password || !confirmPassword) {
    redirect("/signup?error=missing");
  }

  if (password.length < 6) {
    redirect("/signup?error=short");
  }

  if (password !== confirmPassword) {
    redirect("/signup?error=mismatch");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ghostlayerhq.com";

  if (!supabaseUrl || !anonKey) {
    redirect("/signup?error=config");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      options: {
        email_redirect_to: `${siteUrl.replace(/\/$/, "")}/login?verified=1`,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/signup?error=failed");
  }

  redirect("/login?signup=check-email");
}

function NightSkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.06),transparent_38%)]" />
      <div className="absolute left-[-18%] top-[12%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-cyan-200/10 to-transparent blur-[105px] animate-[signupFogOne_42s_ease-in-out_infinite]" />
      <div className="absolute left-[-18%] top-[52%] h-[260px] w-[140%] rounded-full bg-gradient-to-r from-transparent via-blue-300/10 to-transparent blur-[110px] animate-[signupFogTwo_48s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-16%] left-[-10%] h-[22rem] w-[52rem] rounded-full bg-emerald-300/10 blur-[120px] animate-[signupLowGlow_12s_ease-in-out_infinite]" />

      {[
        ["6%", "10%", "2px", "0s"],
        ["12%", "32%", "2px", "1.1s"],
        ["25%", "18%", "3px", "1.6s"],
        ["42%", "12%", "2px", "2.5s"],
        ["51%", "38%", "2px", "1.3s"],
        ["68%", "20%", "2px", "2.9s"],
        ["77%", "50%", "3px", "1.8s"],
        ["86%", "16%", "2px", "0.4s"],
        ["94%", "70%", "2px", "2.2s"],
        ["30%", "88%", "2px", "2.4s"],
      ].map(([left, top, size, delay], index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95),0_0_18px_rgba(147,197,253,0.62),0_0_34px_rgba(34,211,238,0.25)] animate-[signupTwinkle_5.5s_ease-in-out_infinite]"
          style={{
            left,
            top,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        />
      ))}
    </div>
  );
}

function SignupStyles() {
  return (
    <style>{`
      .signupLogoGlow {
        animation: signupLogoGlow 2.8s ease-in-out infinite;
        color: #ffffff;
        text-shadow:
          0 0 8px rgba(255, 255, 255, 0.70),
          0 0 18px rgba(255, 255, 255, 0.45),
          0 0 34px rgba(96, 165, 250, 0.36),
          0 0 52px rgba(59, 130, 246, 0.24);
      }

      @keyframes signupLogoGlow {
        0%, 100% {
          opacity: 0.82;
          text-shadow:
            0 0 7px rgba(255, 255, 255, 0.46),
            0 0 16px rgba(96, 165, 250, 0.24),
            0 0 34px rgba(59, 130, 246, 0.16);
        }

        50% {
          opacity: 1;
          text-shadow:
            0 0 12px rgba(255, 255, 255, 0.95),
            0 0 26px rgba(255, 255, 255, 0.58),
            0 0 48px rgba(147, 197, 253, 0.42),
            0 0 76px rgba(59, 130, 246, 0.30);
        }
      }

      @keyframes signupTwinkle {
        0%, 100% { transform: translateY(0px) scale(0.75); opacity: 0.18; }
        25% { transform: translateY(-4px) scale(1.2); opacity: 1; }
        50% { transform: translateY(0px) scale(0.95); opacity: 0.42; }
        75% { transform: translateY(3px) scale(1.08); opacity: 0.78; }
      }

      @keyframes signupFogOne {
        0%, 100% { transform: translateX(-3%) translateY(0px) scaleX(1); opacity: 0.62; }
        50% { transform: translateX(4%) translateY(-10px) scaleX(1.08); opacity: 0.9; }
      }

      @keyframes signupFogTwo {
        0%, 100% { transform: translateX(4%) translateY(0px) scaleX(1.02); opacity: 0.52; }
        50% { transform: translateX(-3%) translateY(9px) scaleX(1.1); opacity: 0.88; }
      }

      @keyframes signupLowGlow {
        0%, 100% { opacity: 0.34; transform: translateY(0px) scale(1); }
        50% { opacity: 0.7; transform: translateY(-12px) scale(1.04); }
      }
    `}</style>
  );
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const errorMessage =
    resolvedSearchParams.error === "missing"
      ? "Complete all fields."
      : resolvedSearchParams.error === "short"
      ? "Password must be at least 6 characters."
      : resolvedSearchParams.error === "mismatch"
      ? "Passwords do not match."
      : resolvedSearchParams.error === "config"
      ? "Signup is not configured yet."
      : resolvedSearchParams.error === "failed"
      ? "Signup failed. This email may already have an account."
      : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <NightSkyBackground />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="signupLogoGlow mb-10 inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Client Account
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Create your account.
          </h1>

          <p className="mt-5 text-sm leading-7 text-gray-300">
            Use the same email connected to your Ghostlayer Workflow Scan. Your
            dashboard will show reports tied to that email.
          </p>

          {errorMessage ? (
            <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
              {errorMessage}
            </div>
          ) : null}

          <form action={signupClient} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="client@example.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                Confirm Password
              </span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm your password"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-300/50 focus:bg-black/40"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition hover:scale-[1.02] hover:opacity-90"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-cyan-100">
              Log in
            </Link>
          </p>
        </div>
      </section>

      <SignupStyles />
    </main>
  );
}
