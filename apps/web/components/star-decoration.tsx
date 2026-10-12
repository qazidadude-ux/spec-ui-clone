export function StarDecoration({
  top,
  side,
  offset = 200,
}: {
  top: number
  side: "left" | "right"
  offset?: number
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="absolute fill-border"
      style={{
        top,
        left: side === "left" ? `calc(50% - ${offset}px)` : `calc(50% + ${offset}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <path d="M8 0C8 4.5 4.5 8 0 8C4.5 8 8 11.5 8 16C8 11.5 11.5 8 16 8C11.5 8 8 4.5 8 0Z" />
    </svg>
  )
}
