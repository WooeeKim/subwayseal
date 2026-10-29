import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

export type Tool = 'pen' | 'eraser'

type Point = { x: number; y: number }
type Stroke = { tool: Tool; color: string; size: number; points: Point[] }

export type DrawingCanvasHandle = {
  undo: () => void
  redo: () => void
  clear: () => void
  isEmpty: () => boolean
  toBlob: () => Promise<Blob>
}

type Props = {
  tool: Tool
  color: string
  size: number
  ref?: Ref<DrawingCanvasHandle>
}

// 정사각형 캔버스. 좌표는 0~1 비율로 저장해 크기가 바뀌어도 다시 그릴 수 있게 한다.
export default function DrawingCanvas({ tool, color, size, ref }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokes = useRef<Stroke[]>([])
  const redoStack = useRef<Stroke[]>([])
  const current = useRef<Stroke | null>(null)

  function redraw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const w = canvas.width
    ctx.clearRect(0, 0, w, w)
    for (const s of [...strokes.current, ...(current.current ? [current.current] : [])]) {
      ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.strokeStyle = s.color
      ctx.lineWidth = s.size * (w / 300)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      s.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x * w, p.y * w) : ctx.lineTo(p.x * w, p.y * w)))
      if (s.points.length === 1) ctx.lineTo(s.points[0].x * w + 0.01, s.points[0].y * w)
      ctx.stroke()
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const resize = () => {
      const px = Math.round(canvas.clientWidth * window.devicePixelRatio)
      canvas.width = px
      canvas.height = px
      redraw()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  useImperativeHandle(ref, () => ({
    undo() {
      const s = strokes.current.pop()
      if (s) redoStack.current.push(s)
      redraw()
    },
    redo() {
      const s = redoStack.current.pop()
      if (s) strokes.current.push(s)
      redraw()
    },
    clear() {
      strokes.current = []
      redoStack.current = []
      redraw()
    },
    isEmpty: () => strokes.current.length === 0,
    toBlob: () =>
      new Promise((resolve, reject) =>
        canvasRef.current!.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
      ),
  }))

  function toPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height }
  }

  return (
    <canvas
      ref={canvasRef}
      className="block aspect-square w-full touch-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        current.current = { tool, color, size, points: [toPoint(e)] }
        redraw()
      }}
      onPointerMove={(e) => {
        if (!current.current) return
        current.current.points.push(toPoint(e))
        redraw()
      }}
      onPointerUp={() => {
        if (!current.current) return
        strokes.current.push(current.current)
        redoStack.current = []
        current.current = null
      }}
      onPointerCancel={() => {
        current.current = null
        redraw()
      }}
    />
  )
}
