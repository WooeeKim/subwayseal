import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// 키가 없으면 null — 앱은 메모리 저장으로 동작한다 (새로고침하면 사라짐)
export const supabase = url && anonKey ? createClient(url, anonKey) : null
