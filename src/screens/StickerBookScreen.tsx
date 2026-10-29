import { useRef, useState } from 'react'
import labelIcon from '../assets/figma/label-book.svg'
import StickerCard from '../components/StickerCard'
import { updateSticker, type Sticker } from '../lib/stickers'

const SLOTS_PER_PAGE = 9
// 인덱스 어안 효과: 현재 페이지가 가장 크고 멀어질수록 작아진다 (Figma 132:892)
const INDEX_SIZES = [19.483, 21.919, 24.354, 36.531, 24.354, 21.919, 19.483]
const GRID_WIDTH = 'min(361px, 100vw - 41px)'
// 그리드 맨 아래가 스티커 더미에 가리지 않게 남기는 여백
const TRAY_SPACE = 220

// Figma: 03 스티커 북(132:679) · 03-1 스크롤(132:939)
// 아래 펼쳐진 안 붙인 스티커를 고른 뒤 빈 칸을 탭하면 붙는다. 스크롤하면 스티커 더미는 구석으로 비켜난다.
export default function StickerBookScreen({ stickers, onChange }: { stickers: Sticker[]; onChange: () => void }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const [scrolled, setScrolled] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const unplaced = stickers.filter((s) => s.bookPage === null)
  const lastUsedPage = Math.max(0, ...stickers.map((s) => s.bookPage ?? 0))
  const pageCount = Math.max(3, lastUsedPage + 1)

  function pageHeight() {
    const el = scroller.current
    return el ? (el.scrollHeight - TRAY_SPACE) / pageCount : 1
  }

  function goTo(p: number) {
    scroller.current?.scrollTo({ top: (p - 1) * pageHeight(), behavior: 'smooth' })
  }

  async function place(p: number, slot: number) {
    if (!selected) return
    await updateSticker(selected, { bookPage: p, bookSlot: slot })
    setSelected(null)
    onChange()
  }

  const tray = unplaced.slice(0, 3)

  return (
    <>
      {/* 라벨 */}
      <span className="absolute top-[calc(env(safe-area-inset-top)+70px)] left-0 z-10 h-[43px] w-[70.5px]">
        <span className="absolute inset-[-2.33%_-4.26%_-6.98%_-1.42%]">
          <img src={labelIcon} alt="" className="block size-full max-w-none" />
        </span>
      </span>

      {/* 페이지 그리드 */}
      <div
        ref={scroller}
        onScroll={(e) => {
          const top = e.currentTarget.scrollTop
          setScrolled(top > 8)
          setPage(Math.min(pageCount, Math.floor((top + 1) / pageHeight()) + 1))
        }}
        className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+100px)] bottom-0 overflow-y-auto [scrollbar-width:none]"
      >
        <div className="@container mx-auto" style={{ width: GRID_WIDTH, paddingBottom: TRAY_SPACE }}>
          <div className="grid grid-cols-3 gap-[2.8077cqw]">
            {Array.from({ length: pageCount * SLOTS_PER_PAGE }, (_, i) => {
              const p = Math.floor(i / SLOTS_PER_PAGE) + 1
              const slot = i % SLOTS_PER_PAGE
              const sticker = stickers.find((s) => s.bookPage === p && s.bookSlot === slot)
              return sticker ? (
                <StickerCard key={i} sticker={sticker} flippable />
              ) : (
                <button
                  key={i}
                  onClick={() => place(p, slot)}
                  aria-label={`${p}쪽 ${slot + 1}번 칸`}
                  className={`aspect-[361/451] rounded-[0.831%] border border-dashed border-slot ${selected ? 'bg-white/70' : 'bg-white/40'}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* 페이지 인덱스 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[calc(env(safe-area-inset-top)+100px)] right-[4.35px] h-[330px] w-[41.402px] rounded-[12.177px] blur-[20.95px]"
      >
        <div className="absolute inset-0 rounded-[12.177px] bg-[rgba(221,215,200,0.13)] backdrop-blur-[1px]" />
      </div>
      <ol className="absolute top-[calc(env(safe-area-inset-top)+110.96px)] right-[12.87px] flex h-[309.299px] w-[24.354px] flex-col items-end justify-center gap-[18.266px] text-right leading-normal font-semibold">
        {INDEX_SIZES.map((fontSize, i) => {
          const p = page - 3 + i
          const visible = p >= 1 && p <= pageCount
          return (
            <li key={i} className={visible ? '' : 'invisible'}>
              <button onClick={() => goTo(p)} className={p === page ? 'text-ink' : 'text-muted'} style={{ fontSize }}>
                {p}
              </button>
            </li>
          )
        })}
      </ol>

      {/* 안 붙인 스티커 더미 */}
      <div
        className="absolute bottom-0 left-1/2 h-[260px] w-[402px] transition-transform duration-300"
        style={{ transform: `translateX(-50%) ${scrolled ? 'translate(105px, 170px)' : ''}` }}
      >
        {tray.map((s, i) => {
          const layout = [
            { left: 123.1, top: 2, rotate: 0, z: 3 },
            { left: -15.76 + 22.481, top: 57.99 + 16.807, rotate: -15, z: 1 },
            { left: 216.99 + 22.481, top: 57.99 + 16.807, rotate: 15, z: 2 },
          ][i]
          const isSelected = s.id === selected
          return (
            <button
              key={s.id}
              onClick={() => setSelected(isSelected ? null : s.id)}
              aria-label="스티커 고르기"
              className="absolute w-[155.435px] shadow-sticker transition-transform"
              style={{
                left: layout.left,
                top: layout.top,
                zIndex: layout.z,
                transform: `rotate(${layout.rotate}deg) translateY(${isSelected ? -28 : 0}px)`,
              }}
            >
              <StickerCard sticker={s} />
            </button>
          )
        })}
      </div>
    </>
  )
}
