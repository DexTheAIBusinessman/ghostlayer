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
    redirect(
      `/admin/login?error=config&next=${encodeURIComponent(nextPath)}`
    );
  }

  if (username !== adminUser || password !== adminPassword) {
    redirect(
      `/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`
    );
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
    <main className="min-h-screen bg-[#05070b] px-6 py-16 text-white">
      <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center">
        <Link
          href="/"
          className="mb-10 inline-block text-lg font-bold tracking-[0.35em] text-white"
        >
          GHOSTLAYER
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Admin Login
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
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

          <form action={loginAdmin} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                Username
              </span>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
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
    </main>
  );
}
