import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete("ghostlayer_client_access_token");
  cookieStore.delete("ghostlayer_client_refresh_token");
  cookieStore.delete("ghostlayer_client_email");

  return NextResponse.redirect(new URL("/login?logged_out=1", request.url));
}
