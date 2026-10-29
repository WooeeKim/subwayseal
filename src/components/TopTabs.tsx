export type Tab = 'deco' | 'canvas' | 'book'

// 탭은 순환한다: Subway Deco → Canvas → Sticker Book → (Subway Deco)
// 현재 탭이 가운데, 이전 탭이 왼쪽, 다음 탭이 오른쪽.
const ORDER: Tab[] = ['deco', 'canvas', 'book']
const LABEL: Record<Tab, string> = { deco: 'Subway Deco', canvas: 'Canvas', book: 'Sticker Book' }

export default function TopTabs({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  const i = ORDER.indexOf(tab)
  const prev = ORDER[(i + 2) % 3]
  const next = ORDER[(i + 1) % 3]
  return (
    <nav className="flex items-end justify-center gap-[15px] leading-normal">
      <button onClick={() => onChange(prev)} className="w-[110px] text-right text-[17px] font-medium text-muted">
        {LABEL[prev]}
      </button>
      <span className="text-center text-[22px] font-semibold whitespace-nowrap text-ink underline">{LABEL[tab]}</span>
      <button onClick={() => onChange(next)} className="w-[110px] text-left text-[17px] font-medium text-muted">
        {LABEL[next]}
      </button>
    </nav>
  )
}
