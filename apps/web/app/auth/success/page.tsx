import Link from "next/link"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-foreground mb-2">You&apos;re signed in!</h1>
        {email && (
          <p className="text-muted-foreground text-sm mb-6">
            Signed in as <span className="text-foreground font-medium">{email}</span>
          </p>
        )}
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  )
}
