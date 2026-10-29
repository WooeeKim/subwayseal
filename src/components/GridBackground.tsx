// Figma "배경": 6×9 격자(2px 간격)를 화면 세로 가운데에 깐다
export default function GridBackground({ lineColor = 'var(--color-grid)' }: { lineColor?: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute top-1/2 left-0 grid h-[983.5px] w-full -translate-y-1/2 grid-cols-6 grid-rows-9 gap-[2px]"
        style={{ background: lineColor }}
      >
        {Array.from({ length: 54 }, (_, i) => (
          <div key={i} className="bg-paper" />
        ))}
      </div>
    </div>
  )
}
