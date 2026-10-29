import { useCallback, useEffect, useState } from 'react'
import GridBackground from './components/GridBackground'
import TopTabs, { type Tab } from './components/TopTabs'
import { listStickers, type Sticker } from './lib/stickers'
import { supabase } from './lib/supabase'
import CanvasScreen from './screens/CanvasScreen'
import Splash from './screens/Splash'
import StickerBookScreen from './screens/StickerBookScreen'
import SubwayDecoScreen from './screens/SubwayDecoScreen'

export default function App() {
  const [started, setStarted] = useState(false)
  const [tab, setTab] = useState<Tab>('canvas')
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [error, setError] = useState('')

  const refresh = useCallback(() => {
    listStickers()
      .then((list) => {
        setStickers(list)
        setError('')
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  useEffect(refresh, [refresh])

  if (!started) return <Splash onStart={() => setStarted(true)} />

  // 지하철 꾸미기는 가로 화면이라 탭 없이 전체를 쓴다
  if (tab === 'deco') return <SubwayDecoScreen stickers={stickers} onChange={refresh} onBack={() => setTab('canvas')} />

  return (
    <div className="relative h-full overflow-hidden">
      <GridBackground />
      <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+18px)] z-10">
        <TopTabs tab={tab} onChange={setTab} />
      </div>
      {(!supabase || error) && (
        <p className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+2px)] z-10 text-center text-[10px] font-medium text-muted">
          {error ? `DB 오류: ${error}` : 'DB 미연결 · 메모리에만 저장 (.env.local 확인)'}
        </p>
      )}
      {tab === 'canvas' && (
        <CanvasScreen
          onSaved={() => {
            refresh()
            setTab('book')
          }}
        />
      )}
      {tab === 'book' && <StickerBookScreen stickers={stickers} onChange={refresh} />}
    </div>
  )
}
