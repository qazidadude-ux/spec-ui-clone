"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Button } from "@workspace/ui/components/button"
import { GridLines } from "@/components/grid-lines"
import { StarDecoration } from "@/components/star-decoration"

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!submitted) return
    const timer = setTimeout(() => router.push("/workspaces"), 5000)
    return () => clearTimeout(timer)
  }, [submitted, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <GridLines />

      <div className="relative w-full" style={{ maxWidth: 400 }}>
        {/* Top horizontal line with stars — only on login */}
        {!submitted && (
          <>
            <HorizontalLine top={-84} delay={-7} />
            <StarDecoration top={-84} side="left" />
            <StarDecoration top={-84} side="right" />
          </>
        )}

        {/* Middle horizontal line with stars */}
        <HorizontalLine top={0} delay={-2} />
        <StarDecoration top={0} side="left" />
        <StarDecoration top={0} side="right" />

        {/* Logo area — only on login */}
        {!submitted && (
          <div
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{ top: -84, height: 84, padding: 20 }}
          >
            <Image
              alt="Specretary"
              width={140}
              height={28}
              src="/specretary-logos/main-dark.svg"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-6">
          {submitted ? (
            <div className="p-5 text-center">
              {/* Mail icon */}
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-brand-muted flex items-center justify-center relative overflow-hidden">
                <Mail className="w-6 h-6 text-brand relative z-10" aria-hidden />
              </div>

              <h2 className="text-lg font-semibold text-foreground mb-2">
                Check your inbox
              </h2>
              <p className="text-muted-foreground text-sm mb-1">
                We sent a magic link to
              </p>
              <p className="text-foreground font-medium text-sm mb-6">{email}</p>

              <Button
                variant="ghost"
                onClick={() => { setEmail(""); setSubmitted(false) }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form className="space-y-4 p-5" onSubmit={handleSubmit}>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-10 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Button
                type="submit"
                className="w-full h-10 rounded-lg bg-brand text-brand-foreground hover:bg-brand-hover"
              >
                Send Magic Link
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="relative">
          <HorizontalLine top={0} delay={-10} />
          <StarDecoration top={0} side="left" />
          <StarDecoration top={0} side="right" />

          {!submitted && (
            <p className="text-center text-[10px] text-muted-foreground leading-relaxed px-3 py-4 whitespace-nowrap">
              By signing up, you agree to our{" "}
              <a
                href="/terms"
                className="text-foreground/60 underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-foreground/60 underline underline-offset-2 hover:text-foreground transition-colors whitespace-nowrap"
              >
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function HorizontalLine({ top, delay }: { top: number; delay: number }) {
  return (
    <div
      className="absolute left-0 right-0 h-px overflow-hidden bg-border"
      style={{
        top,
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        width: "100vw",
      }}
    >
      <div
        className="absolute h-full w-24 bg-gradient-to-r from-transparent via-muted-foreground to-transparent animate-slide-x"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  )
}
