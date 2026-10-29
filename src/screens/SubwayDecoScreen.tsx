import { useEffect, useState } from 'react'
import backIcon from '../assets/figma/back.svg'
import label1 from '../assets/figma/label-1.svg'
import label2 from '../assets/figma/label-2.svg'
import label3 from '../assets/figma/label-3.svg'
import label4 from '../assets/figma/label-4.svg'
import label5 from '../assets/figma/label-5.svg'
import label6 from '../assets/figma/label-6.svg'
import subwayImage from '../assets/figma/subway.png'
import StickerCard from '../components/StickerCard'
import { updateSticker, type Sticker } from '../lib/stickers'

// Figma 프레임 874×402 (가로). 세로로 들고 있으면 통째로 90° 돌려서 폰을 눕혀 보게 한다.
const W = 874
const H = 402
// 라벨 깃발: 오른쪽부터 차례로. x = 프레임 기준 왼쪽 위치
const LABELS = [
  { src: label6, x: 482 },
  { src: label5, x: 545 },
  { src: label4, x: 608 },
  { src: label3, x: 671 },
  { src: label2, x: 734 },
  { src: label1, x: 797 },
]

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight })
  const [size, setSize] = useState(read)
  useEffect(() => {
    const onResize = () => setSize(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

// Figma: 04 지하철 꾸미기(132:1320)
// 아래 줄에서 스티커를 고르고 지하철 칸 아무 데나 탭하면 그 자리에 붙는다.
export default function SubwayDecoScreen({
  stickers,
  onChange,
  onBack,
}: {
  stickers: Sticker[]
  onChange: () => void
  onBack: () => void
}) {
  const { w: vw, h: vh } = useViewport()
  const [selected, setSelected] = useState<string | null>(null)
  const [label, setLabel] = useState(2)

  const portrait = vh > vw
  const long = Math.max(vw, vh)
  const short = Math.min(vw, vh)
  const scale = short / H
  const innerWidth = long / scale
  const placed = stickers.filter((s) => s.decoX !== null && s.decoY !== null)

  async function placeAt(e: React.MouseEvent<HTMLDivElement>) {
    if (!selected || e.target !== e.currentTarget) return
    // offsetX/Y 는 회전·확대를 되돌린 프레임 좌표
    await updateSticker(selected, { decoX: e.nativeEvent.offsetX / W, decoY: e.nativeEvent.offsetY / H })
    setSelected(null)
    onChange()
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-paper">
      <div
        className="absolute top-0 left-0 origin-top-left overflow-hidden"
        style={{ width: long, height: short, transform: portrait ? `translateX(${vw}px) rotate(90deg)` : undefined }}
      >
        <div className="relative origin-top-left" style={{ width: innerWidth, height: H, transform: `scale(${scale})` }}>
          <div className="absolute top-0 h-full" style={{ width: W, left: (innerWidth - W) / 2 }} onClick={placeAt}>
            <img
              src={subwayImage}
              alt=""
              draggable={false}
              className="pointer-events-none absolute max-w-none opacity-80"
              style={{ left: -7, top: -30, width: 889, height: 501 }}
            />

            {placed.map((s) => (
              <div
                key={s.id}
                className="pointer-events-none absolute w-[80.044px] -translate-1/2 shadow-[0_3px_3px_0_rgba(0,0,0,0.2)]"
                style={{ left: s.decoX! * W, top: s.decoY! * H }}
              >
                <StickerCard sticker={s} />
              </div>
            ))}

            {/* 라벨 깃발 (Figma 에셋은 오른쪽을 향해 있어 90° 돌려 아래로 늘어뜨린다) */}
            {LABELS.map((l, i) => (
              <button
                key={i}
                onClick={() => setLabel(i)}
                aria-label={`라벨 ${i + 1}`}
                className="absolute h-[70.5px] w-[43px] transition-[top]"
                style={{ left: l.x, top: i === label ? 0 : -30 }}
              >
                <span className="absolute top-1/2 left-1/2 h-[43px] w-[70.5px] -translate-1/2 rotate-90">
                  <span className="absolute inset-[-2.33%_-4.26%_-6.98%_-1.42%]">
                    <img src={l.src} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </button>
            ))}

            {/* 뒤로 */}
            <button onClick={onBack} aria-label="뒤로" className="absolute top-[17px] left-[65px] size-[60px]">
              <span className="absolute inset-0 rounded-[50px] blur-[16.2px]">
                <span className="absolute inset-0 rounded-[50px] bg-[rgba(185,181,169,0.5)] backdrop-blur-[5.9px]" />
              </span>
              <span className="absolute top-[17px] left-[12.43px] h-[26.408px] w-[35.572px]">
                <span className="absolute top-1/2 left-1/2 h-[35.572px] w-[26.408px] -translate-1/2 rotate-90">
                  <span className="absolute inset-[-2.81%_-3.79%]">
                    <img src={backIcon} alt="" className="block size-full max-w-none" />
                  </span>
                </span>
              </span>
            </button>
          </div>

          {/* 스티커 줄 */}
          <div
            className="absolute top-[272px] right-0 flex h-[120px] items-end gap-[7.143px] overflow-x-auto pr-[16px] pb-[10px]"
            style={{ left: (innerWidth - W) / 2 + 65 }}
          >
            {stickers.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id === selected ? null : s.id)}
                aria-label="스티커 고르기"
                className="w-[80.044px] shrink-0 shadow-[0_3px_3px_0_rgba(0,0,0,0.2)] transition-transform"
                style={{ transform: s.id === selected ? 'translateY(-12px)' : undefined }}
              >
                <StickerCard sticker={s} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
