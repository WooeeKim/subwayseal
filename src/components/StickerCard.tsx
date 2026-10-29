import { useState } from 'react'
import type { Sticker } from '../lib/stickers'

// 스티커북·꾸미기에서 쓰는 작은 씰. 탭하면 뒷면(메모)으로 뒤집힌다.
export default function StickerCard({ sticker, flippable = false }: { sticker: Sticker; flippable?: boolean }) {
  const [back, setBack] = useState(false)
  return (
    <div
      className="flex aspect-square w-full flex-col bg-white p-1 shadow-sm"
      onClick={flippable ? () => setBack((b) => !b) : undefined}
    >
      <div className="flex items-center gap-1 text-[8px] leading-none">
        {sticker.place && <span className="rounded-full bg-line px-1 py-0.5 text-white">{sticker.place}</span>}
        <span className="truncate">{sticker.name}</span>
      </div>
      {back ? (
        <p className="flex-1 overflow-hidden p-1 text-[9px] text-muted">{sticker.memo || '메모 없음'}</p>
      ) : (
        <img src={sticker.imageUrl} alt={sticker.name} className="min-h-0 flex-1 object-contain" draggable={false} />
      )}
      <span className="self-end text-[7px] text-muted">{sticker.createdAt.slice(0, 10)}</span>
    </div>
  )
}
