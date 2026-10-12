"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Building2, Briefcase, Folder, House, Rocket, Zap, Star, Heart,
  Globe, Code, Palette, Music, Camera, Book, Coffee, Gamepad2,
  ChevronDown, Check, Pipette,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { StarDecoration } from "@/components/star-decoration"

// ── shared layout pieces ────────────────────────────────────────────────────

function HorizontalLine({ top, delay }: { top: number; delay: number }) {
  return (
    <div
      className="absolute left-0 right-0 h-px overflow-hidden bg-border"
      style={{ top, marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw" }}
    >
      <div
        className="absolute h-full w-24 bg-gradient-to-r from-transparent via-muted-foreground to-transparent animate-slide-x"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  )
}

function VerticalLine({ left, delay }: { left: string; delay: number }) {
  return (
    <div className="absolute top-0 bottom-0 w-px overflow-hidden bg-border" style={{ left }}>
      <div
        className="absolute w-full h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent animate-slide-y"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  )
}

// ── icon picker data ────────────────────────────────────────────────────────

type IconEntry = { name: string; icon: LucideIcon }

const ICONS: IconEntry[] = [
  { name: "Building", icon: Building2 },
  { name: "Briefcase", icon: Briefcase },
  { name: "Folder", icon: Folder },
  { name: "Home", icon: House },
  { name: "Rocket", icon: Rocket },
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Globe", icon: Globe },
  { name: "Code", icon: Code },
  { name: "Palette", icon: Palette },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Book", icon: Book },
  { name: "Coffee", icon: Coffee },
  { name: "Gaming", icon: Gamepad2 },
]

// ── color picker data ───────────────────────────────────────────────────────

type ColorEntry = { name: string; value: string }

const COLORS: ColorEntry[] = [
  { name: "Indigo",   value: "#6366f1" },
  { name: "Violet",   value: "#8b5cf6" },
  { name: "Purple",   value: "#a855f7" },
  { name: "Fuchsia",  value: "#d946ef" },
  { name: "Pink",     value: "#ec4899" },
  { name: "Rose",     value: "#f43f5e" },
  { name: "Red",      value: "#ef4444" },
  { name: "Orange",   value: "#f97316" },
  { name: "Amber",    value: "#f59e0b" },
  { name: "Yellow",   value: "#eab308" },
  { name: "Lime",     value: "#84cc16" },
  { name: "Green",    value: "#22c55e" },
  { name: "Emerald",  value: "#10b981" },
  { name: "Teal",     value: "#14b8a6" },
  { name: "Cyan",     value: "#06b6d4" },
  { name: "Sky",      value: "#0ea5e9" },
  { name: "Blue",     value: "#3b82f6" },
  { name: "Gray",     value: "#6b7280" },
]

// ── helpers ─────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// ── page ────────────────────────────────────────────────────────────────────

export default function NewWorkspacePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [icon, setIcon] = useState<IconEntry>(ICONS[0]!)
  const [color, setColor] = useState<ColorEntry>(COLORS[0]!)

  function handleNameChange(val: string) {
    setName(val)
    setSlug(slugify(val))
  }

  const IconComp = icon.icon

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <VerticalLine left="calc(50% - 240px)" delay={0} />
      <VerticalLine left="calc(50% + 240px)" delay={-3} />

      <div className="relative w-full" style={{ maxWidth: 480 }}>
        {/* Top line + logo */}
        <HorizontalLine top={-64} delay={-7} />
        <StarDecoration top={-64} side="left" offset={240} />
        <StarDecoration top={-64} side="right" offset={240} />
        <div className="absolute left-0 right-0 flex items-center justify-center px-5" style={{ top: -64, height: 64 }}>
          <Image alt="Specretary" width={140} height={28} src="/specretary-logos/main-dark.svg" />
        </div>

        {/* Middle line */}
        <HorizontalLine top={0} delay={-2} />
        <StarDecoration top={0} side="left" offset={240} />
        <StarDecoration top={0} side="right" offset={240} />

        {/* Form */}
        <div className="p-5">
          <div className="py-6">
            <h2 className="text-base font-medium text-center mb-6">Create a New Workspace</h2>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push("/workspaces") }}>

              {/* Icon preview */}
              <div className="flex pb-2 justify-center">
                <div className="flex items-center justify-center rounded-xl shadow-sm shrink-0 h-16 w-16" style={{ backgroundColor: color.value }}>
                  <IconComp className="h-8 w-8 text-white" aria-hidden />
                </div>
              </div>

              {/* Workspace Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Workspace"
                  className="h-10 rounded-lg"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/w/</span>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="my-workspace"
                    className="h-10 rounded-lg"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL to access your workspace
                </p>
              </div>

              {/* Icon + Color pickers */}
              <div className="grid grid-cols-2 gap-3">

                {/* Icon picker */}
                <div className="space-y-1.5">
                  <Label>Icon</Label>
                  <Popover>
                    <PopoverTrigger className="w-full h-10 flex items-center justify-between rounded-lg border border-border bg-white px-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <span className="flex items-center gap-2">
                        <IconComp className="h-4 w-4 text-muted-foreground" aria-hidden />
                        <span>{icon.name}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--anchor-width)] p-1 rounded-xl">
                      <div className="max-h-[280px] overflow-y-auto">
                        {ICONS.map((entry) => {
                          const Icon = entry.icon
                          const selected = icon.name === entry.name
                          return (
                            <button
                              key={entry.name}
                              type="button"
                              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${selected ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                              onClick={() => setIcon(entry)}
                            >
                              <Icon className="h-4 w-4 shrink-0" aria-hidden />
                              <span className="flex-1 text-left">{entry.name}</span>
                              {selected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                            </button>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Color picker */}
                <div className="space-y-1.5">
                  <Label>Color</Label>
                  <Popover>
                    <PopoverTrigger className="w-full h-10 flex items-center justify-between rounded-lg border border-border bg-white px-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: color.value }} />
                        <span>{color.name}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[var(--anchor-width)] p-1 rounded-xl">
                      <div className="max-h-[280px] overflow-y-auto">
                        {COLORS.map((c) => {
                          const selected = color.name === c.name
                          return (
                            <button
                              key={c.name}
                              type="button"
                              className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${selected ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                              onClick={() => setColor(c)}
                            >
                              <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                              <span className="flex-1 text-left">{c.name}</span>
                              {selected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                            </button>
                          )
                        })}
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors border-t border-border mt-1 pt-2 hover:bg-muted"
                        >
                          <Pipette className="h-4 w-4 shrink-0" aria-hidden />
                          <span className="flex-1 text-left">Custom</span>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-col pt-2">
                <Button type="submit" className="h-10 rounded-lg bg-brand text-brand-foreground hover:bg-brand-hover shadow-none w-full">
                  Create Workspace
                </Button>
                <Button type="button" variant="ghost" className="w-full h-10 rounded-lg" onClick={() => router.push("/workspaces")}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <HorizontalLine top={0} delay={-10} />
          <StarDecoration top={0} side="left" offset={240} />
          <StarDecoration top={0} side="right" offset={240} />
          <div className="flex items-center justify-center" style={{ height: 64 }}>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.push("/")}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  )
}
