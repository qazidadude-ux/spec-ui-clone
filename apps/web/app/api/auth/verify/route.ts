import { NextRequest, NextResponse } from "next/server"
import { tokenStore } from "../magic-link/route"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/auth/error?reason=missing-token", req.url))
  }

  const entry = tokenStore.get(token)

  if (!entry) {
    return NextResponse.redirect(new URL("/auth/error?reason=invalid-token", req.url))
  }

  if (Date.now() > entry.expires) {
    tokenStore.delete(token)
    return NextResponse.redirect(new URL("/auth/error?reason=expired", req.url))
  }

  tokenStore.delete(token)

  return NextResponse.redirect(new URL(`/auth/success?email=${encodeURIComponent(entry.email)}`, req.url))
}
