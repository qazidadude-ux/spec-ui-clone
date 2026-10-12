import Link from "next/link"

const messages: Record<string, string> = {
  "missing-token": "No token was provided in the link.",
  "invalid-token": "This magic link is invalid or has already been used.",
  "expired": "This magic link has expired. Please request a new one.",
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams
  const message = (reason && messages[reason]) ?? "Something went wrong."

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-foreground mb-2">Link invalid</h1>
        <p className="text-muted-foreground text-sm mb-6">{message}</p>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          Try again
        </Link>
      </div>
    </div>
  )
}
