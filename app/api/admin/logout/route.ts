import { NextResponse } from "next/server";

const ADMIN_COOKIE = "ghostlayer_admin_session";

export async function POST(request: Request) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", "logged-out");

  const response = NextResponse.redirect(loginUrl, 303);

  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
