import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"

// In-memory token store (resets on server restart — fine for learning)
export const tokenStore = new Map<string, { email: string; expires: number }>()

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const token = crypto.randomBytes(32).toString("hex")
  const expires = Date.now() + 1000 * 60 * 15 // 15 minutes

  tokenStore.set(token, { email, expires })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const magicLink = `${appUrl}/api/auth/verify?token=${token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: "Specretary <onboarding@resend.dev>",
    to: email,
    subject: "Your magic link to Specretary",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #fff;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; letter-spacing: 0.2em; color: #0a0e19;">SPEC</span><span style="color: #fe6901; font-size: 20px; font-weight: 700;">C</span><span style="font-size: 20px; font-weight: 700; letter-spacing: 0.2em; color: #0a0e19;">RETARY</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 600; color: #0a0e19; margin: 0 0 8px;">Sign in to Specretary</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px;">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${magicLink}" style="display: inline-block; background: #fe6901; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600;">Sign in to Specretary</a>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 28px;">If you didn't request this, you can ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #d1d5db; font-size: 11px; margin: 0;">Or copy this link: <span style="color: #6b7280;">${magicLink}</span></p>
      </div>
    `,
  })

  if (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
