// 와이어프레임: 시작 화면 (Subway Seal 노선 표지)
export default function Splash({ onStart }: { onStart: () => void }) {
  return (
    <button onClick={onStart} className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-line" />
      <div className="relative flex items-center gap-2 rounded-full border-4 border-line bg-white py-1 pr-5 pl-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-line text-xs font-bold text-white">
          001
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-bold">Subway Seal</span>
          <span className="block text-[10px] text-muted">찌부씰 · 탭해서 시작</span>
        </span>
      </div>
    </button>
  )
}
