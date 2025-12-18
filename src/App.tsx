import { useEffect, useState } from 'react'
import DashboardLayout from './components/DashboardLayout'
import LoginForm from './components/LoginForm'
import { supabase, isSupabaseConfigured } from './lib/supabase'

export function App() {
  const [user, setUser] = useState<unknown | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function init() {
      if (!isSupabaseConfigured) {
        if (active) {
          setUser(null)
          setLoading(false)
        }
        return
      }
      const { data } = await supabase!.auth.getUser()
      if (active) setUser(data.user ?? null)
      const { data: sub } = supabase!.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      if (active) setLoading(false)
      return () => {
        sub.subscription.unsubscribe()
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
        <LoginForm />
      </div>
    )
  }

  return <DashboardLayout />
}

export default App
