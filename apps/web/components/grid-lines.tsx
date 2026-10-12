"use client"

export function GridLines() {
  return (
    <>
      {/* Left vertical line */}
      <div
        className="absolute top-0 bottom-0 w-px overflow-hidden bg-border"
        style={{ left: "calc(50% - 200px)" }}
      >
        <div className="absolute w-full h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent animate-slide-y" />
      </div>

      {/* Right vertical line */}
      <div
        className="absolute top-0 bottom-0 w-px overflow-hidden bg-border"
        style={{ left: "calc(50% + 200px)" }}
      >
        <div
          className="absolute w-full h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent animate-slide-y"
          style={{ animationDelay: "-3s" }}
        />
      </div>
    </>
  )
}
