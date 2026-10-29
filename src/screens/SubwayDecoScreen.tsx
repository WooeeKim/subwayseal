import { useState } from 'react'
import StickerCard from '../components/StickerCard'
import { updateSticker, type Sticker } from '../lib/stickers'

// 와이어프레임: Subway Deco (Additional)
// 지하철 칸 박스 위 아무 데나 탭하면 고른 스티커가 그 자리에 붙는다.
export default function SubwayDecoScreen({ stickers, onChange }: { stickers: Sticker[]; onChange: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const placed = stickers.filter((s) => s.decoX !== null && s.decoY !== null)

  async function placeAt(e: React.MouseEvent<HTMLDivElement>) {
    if (!selected) return
    const rect = e.currentTarget.getBoundingClientRect()
    await updateSticker(selected, {
      decoX: (e.clientX - rect.left) / rect.width,
      decoY: (e.clientY - rect.top) / rect.height,
    })
    setSelected(null)
    onChange()
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 지하철 칸 (가로로 긴 박스, 좌우 스크롤) */}
      <div className="overflow-x-auto px-4">
        <div
          onClick={placeAt}
          className="relative h-64 w-[720px] border border-muted/50 bg-box"
          aria-label="지하철 칸"
        >
          <div className="absolute inset-x-0 top-6 flex justify-around">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 w-28 border border-muted/50 bg-white" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-8 h-10 border-y border-muted/50 bg-white/60" />
          <span className="absolute top-1 left-2 text-[10px] text-muted">창문 · 좌석 자리 (와이어프레임)</span>
          {placed.map((s) => (
            <div
              key={s.id}
              className="absolute w-14 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.decoX! * 100}%`, top: `${s.decoY! * 100}%` }}
            >
              <StickerCard sticker={s} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-muted/30 bg-white/30 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
        <p className="pb-2 text-[11px] text-muted">
          {stickers.length ? '스티커를 고르고 지하철 칸을 탭' : 'Canvas에서 먼저 스티커를 만들어 주세요'}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {stickers.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`w-16 shrink-0 ${s.id === selected ? '-translate-y-2 ring-2 ring-line' : ''}`}
            >
              <StickerCard sticker={s} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
