import { useRef, useState } from 'react'
import DrawingCanvas, { type DrawingCanvasHandle, type Tool } from '../components/DrawingCanvas'
import { createSticker } from '../lib/stickers'

const COLORS = ['#1a1a1a', '#e5e5e5', '#c0392b', '#e67e22', '#f1c40f', '#2f6f1e', '#2e86de', '#8e44ad']
const SIZES = [2, 4, 8, 14]

// 와이어프레임: Instant sticker canvas + Rough drawing + Flip & note
export default function CanvasScreen({ onSaved }: { onSaved: () => void }) {
  const canvas = useRef<DrawingCanvasHandle>(null)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(SIZES[1])
  const [place, setPlace] = useState('')
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function reset() {
    canvas.current?.clear()
    setPlace('')
    setName('')
    setMemo('')
    setFlipped(false)
  }

  async function save() {
    if (!canvas.current || canvas.current.isEmpty()) {
      setMessage('먼저 그려주세요')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const image = await canvas.current.toBlob()
      await createSticker({ place, name, memo, image })
      reset()
      onSaved()
    } catch (e) {
      setMessage(`저장 실패: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="flex items-center justify-between pb-2 text-2xl">
        <button onClick={reset} aria-label="새 스티커">+</button>
        <button onClick={save} disabled={saving} aria-label="저장">
          {saving ? '…' : '✓'}
        </button>
      </div>

      {/* 스티커 카드: 앞면 = 그림, 뒷면 = 메모 */}
      <div className="bg-white p-2 shadow">
        <div className="flex items-center gap-2 pb-2 text-xs">
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Place"
            className="w-20 rounded-full bg-line px-2 py-1 text-white placeholder:text-white/70"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Drawing Name"
            className="min-w-0 flex-1 rounded-full border border-box px-2 py-1"
          />
          <button onClick={() => setFlipped((f) => !f)} aria-label="뒤집기" className="text-base">
            ↻
          </button>
        </div>
        <div className="relative border border-dashed border-muted/50">
          <DrawingCanvas ref={canvas} tool={tool} color={color} size={size} />
          {flipped && (
            <textarea
              autoFocus
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Leaving memo…"
              className="absolute inset-0 resize-none bg-white p-3 text-sm"
            />
          )}
        </div>
        <p className="pt-1 text-right text-[10px] text-muted">{today}</p>
      </div>

      {message && <p className="pt-2 text-center text-xs text-red-700">{message}</p>}

      {/* 도구: 펜/지우개, 두께, 색, undo/redo */}
      <div className="mt-auto flex flex-col gap-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs">
            {(['pen', 'eraser'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTool(t)}
                className={`rounded border px-3 py-2 ${tool === t ? 'border-ink bg-white' : 'border-muted/40'}`}
              >
                {t === 'pen' ? '펜' : '지우개'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-label={`두께 ${s}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${size === s ? 'bg-white' : ''}`}
              >
                <span className="rounded-full bg-ink" style={{ width: s + 2, height: s + 2 }} />
              </button>
            ))}
          </div>
          <div className="flex gap-2 text-lg">
            <button onClick={() => canvas.current?.undo()} aria-label="실행 취소">↶</button>
            <button onClick={() => canvas.current?.redo()} aria-label="다시 실행">↷</button>
          </div>
        </div>
        <div className="flex justify-between">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c)
                setTool('pen')
              }}
              aria-label={`색 ${c}`}
              className={`h-8 w-8 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-ink' : 'border-white'}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
