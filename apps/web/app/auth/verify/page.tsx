import { redirect } from "next/navigation"

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) redirect("/auth/error?reason=missing-token")

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const res = await fetch(`${appUrl}/api/auth/verify?token=${token}`, {
    redirect: "manual",
  })

  const location = res.headers.get("location")
  if (location) redirect(location)

  redirect("/auth/error?reason=unknown")
}
