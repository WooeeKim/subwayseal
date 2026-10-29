export type Tab = 'deco' | 'canvas' | 'book'

const TABS: { id: Tab; label: string }[] = [
  { id: 'deco', label: 'Subway Deco' },
  { id: 'canvas', label: 'Canvas' },
  { id: 'book', label: 'Sticker Book' },
]

export default function TopTabs({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="flex justify-center gap-4 pt-2 pb-3 text-xs">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={t.id === tab ? 'font-bold underline underline-offset-4' : 'text-muted'}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
