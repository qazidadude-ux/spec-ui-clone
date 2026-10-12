import Image from "next/image"
import Link from "next/link"
import { Zap, ArrowRight, Plus } from "lucide-react"
import { StarDecoration } from "@/components/star-decoration"

function HorizontalLine({ top, delay }: { top: number; delay: number }) {
  return (
    <div
      className="absolute left-0 right-0 h-px overflow-hidden bg-border/50"
      style={{
        top,
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
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

function VerticalLine({ left, delay }: { left: string; delay: number }) {
  return (
    <div
      className="absolute top-0 bottom-0 w-px overflow-hidden bg-border"
      style={{ left }}
    >
      <div
        className="absolute w-full h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent animate-slide-y"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  )
}

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <VerticalLine left="calc(50% - 240px)" delay={0} />
      <VerticalLine left="calc(50% + 240px)" delay={-3} />

      <div className="relative w-full" style={{ maxWidth: 480 }}>
        {/* Top line + logo */}
        <HorizontalLine top={-64} delay={-7} />
        <StarDecoration top={-64} side="left" offset={240} />
        <StarDecoration top={-64} side="right" offset={240} />

        <div
          className="absolute left-0 right-0 flex items-center justify-center px-5"
          style={{ top: -64, height: 64 }}
        >
          <Image
            alt="Specretary"
            width={140}
            height={28}
            src="/specretary-logos/main-dark.svg"
          />
        </div>

        {/* Middle line */}
        <HorizontalLine top={0} delay={-2} />
        <StarDecoration top={0} side="left" offset={240} />
        <StarDecoration top={0} side="right" offset={240} />

        {/* Workspace list */}
        <div className="p-5">
          <div className="space-y-2">
            {/* Existing workspace */}
            <Link href="/workspaces/brandcave" className="w-full border rounded-lg p-4 text-left bg-card hover:border-foreground/20 hover:bg-muted/50 transition-colors group flex">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 shrink-0">
                    <Zap className="h-4 w-4 text-white" aria-hidden />
                  </div>
                  <h3 className="font-medium text-foreground truncate">Brandcave</h3>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
              </div>
            </Link>

            {/* New workspace */}
            <Link href="/workspaces/new" className="w-full border border-dashed rounded-lg p-4 text-left hover:border-foreground/20 hover:bg-muted/50 transition-colors group flex">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  New Workspace
                </span>
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden />
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <HorizontalLine top={0} delay={-10} />
          <StarDecoration top={0} side="left" offset={240} />
          <StarDecoration top={0} side="right" offset={240} />

          <div className="flex items-center justify-center" style={{ height: 64 }}>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log out
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
