import { useState } from 'react'
import StickerCard from '../components/StickerCard'
import { updateSticker, type Sticker } from '../lib/stickers'

const SLOTS_PER_PAGE = 9

// 와이어프레임: Stick it in by hand + Pages
// 아래 트레이의 안 붙인 스티커를 고른 뒤 빈 칸을 탭하면 붙는다.
export default function StickerBookScreen({ stickers, onChange }: { stickers: Sticker[]; onChange: () => void }) {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)

  const unplaced = stickers.filter((s) => s.bookPage === null)
  const lastUsedPage = Math.max(0, ...stickers.map((s) => s.bookPage ?? 0))
  const pageCount = Math.max(3, lastUsedPage + 1)

  async function place(slot: number) {
    if (!selected) return
    await updateSticker(selected, { bookPage: page, bookSlot: slot })
    setSelected(null)
    onChange()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 gap-2 px-4">
        <div className="grid flex-1 grid-cols-3 content-start gap-2">
          {Array.from({ length: SLOTS_PER_PAGE }, (_, slot) => {
            const sticker = stickers.find((s) => s.bookPage === page && s.bookSlot === slot)
            return sticker ? (
              <StickerCard key={slot} sticker={sticker} flippable />
            ) : (
              <button
                key={slot}
                onClick={() => place(slot)}
                className={`aspect-square border border-dashed ${selected ? 'border-line bg-white/40' : 'border-muted/40'}`}
                aria-label={`${page}쪽 ${slot + 1}번 칸`}
              />
            )
          })}
        </div>

        {/* 페이지 인덱스 */}
        <ol className="flex flex-col gap-1 text-right text-xs">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <li key={p}>
              <button
                onClick={() => setPage(p)}
                className={`w-6 py-1 ${p === page ? 'text-base font-bold' : 'text-muted'}`}
              >
                {p}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* 안 붙인 스티커 트레이 */}
      <div className="mt-3 border-t border-muted/30 bg-white/30 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
        <p className="pb-2 text-[11px] text-muted">
          {unplaced.length ? `안 붙인 스티커 ${unplaced.length}개 · 골라서 빈 칸을 탭` : '모든 스티커를 붙였어요'}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {unplaced.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`w-20 shrink-0 ${s.id === selected ? '-translate-y-2 ring-2 ring-line' : ''}`}
            >
              <StickerCard sticker={s} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
