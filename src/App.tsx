import { useCallback, useEffect, useState } from 'react'
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

  return (
    <div className="flex h-full flex-col pt-[env(safe-area-inset-top)]">
      <TopTabs tab={tab} onChange={setTab} />
      {!supabase && (
        <p className="pb-2 text-center text-[10px] text-muted">DB 미연결 · 메모리에만 저장 (.env.local 확인)</p>
      )}
      {error && <p className="pb-2 text-center text-[10px] text-red-700">DB 오류: {error}</p>}
      {tab === 'canvas' && (
        <CanvasScreen
          onSaved={() => {
            refresh()
            setTab('book')
          }}
        />
      )}
      {tab === 'book' && <StickerBookScreen stickers={stickers} onChange={refresh} />}
      {tab === 'deco' && <SubwayDecoScreen stickers={stickers} onChange={refresh} />}
    </div>
  )
}
