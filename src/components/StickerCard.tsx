import { useState } from 'react'
import type { Sticker } from '../lib/stickers'
import StickerFrame, { StickerChip, formatDate } from './StickerFrame'

// 저장된 찌부씰. flippable 이면 뒤집기 아이콘으로 뒷면(메모)을 본다.
export default function StickerCard({ sticker, flippable = false }: { sticker: Sticker; flippable?: boolean }) {
  const [back, setBack] = useState(false)
  return (
    <StickerFrame
      chip={back ? null : <StickerChip place={sticker.place} name={sticker.name} />}
      date={formatDate(sticker.createdAt)}
      onFlip={flippable ? () => setBack((b) => !b) : undefined}
    >
      {back ? (
        <p className="p-[4cqw] text-center text-[5.54cqw] leading-normal font-medium break-words text-muted">
          {sticker.memo || 'No memo'}
        </p>
      ) : (
        <img src={sticker.imageUrl} alt={sticker.name} draggable={false} className="size-full object-contain" />
      )}
    </StickerFrame>
  )
}
