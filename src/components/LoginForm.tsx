import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type State = {
  email: string
  password: string
  loading: boolean
  error: string | null
  message: string | null
}

export default function LoginForm() {
  const [state, setState] = useState<State>({
    email: '',
    password: '',
    loading: false,
    error: null,
    message: null,
  })
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function applyTheme(dark: boolean) {
    const el = document.documentElement
    if (dark) el.classList.add('dark')
    else el.classList.remove('dark')
    setIsDark(dark)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      setState(s => ({
        ...s,
        error:
          'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      }))
      return
    }
    setState(s => ({ ...s, loading: true, error: null, message: null }))
    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      })
      if (error) {
        const msg = error.message
        const custom = /invalid login credentials/i.test(msg)
          ? 'Gab, Jent and Cosy not approved'
          : msg
        setState(s => ({ ...s, loading: false, error: custom }))
        return
      }
      const userEmail = data.user?.email ?? state.email
      setState(s => ({
        ...s,
        loading: false,
        message: `Logged in as ${userEmail}`,
        password: '',
      }))
    } catch (err: unknown) {
      setState(s => ({
        ...s,
        loading: false,
        error:
          (err instanceof Error ? err.message : undefined) ??
          'Unexpected error',
      }))
    }
  }

  return (
    <div className="relative w-full max-w-sm bg-card text-card-foreground border border-border rounded-lg shadow p-6">
      <button
        type="button"
        onClick={() => applyTheme(!isDark)}
        aria-pressed={isDark}
        role="switch"
        className="absolute top-3 right-3 inline-flex items-center rounded-full border border-border h-9 w-20 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-muted to-accent" />
        {!isDark && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        )}
        {isDark && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
            </svg>
          </span>
        )}
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-card shadow-sm border border-border transition-all ${
            isDark ? 'right-1' : 'left-1'
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="currentColor" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        </span>
      </button>
      <div className="mb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with Supabase email and password.
          </p>
        </div>
      </div>
      {!isSupabaseConfigured && (
        <div className="mb-3 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm">
          VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set.
        </div>
      )}
      {state.error && (
        <div className="mb-3 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm">
          {state.error}
        </div>
      )}
      {state.message && (
        <div className="mb-3 rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm">
          {state.message}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={state.email}
            onChange={e =>
              setState(s => ({ ...s, email: e.target.value }))
            }
            className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={state.password}
            onChange={e =>
              setState(s => ({ ...s, password: e.target.value }))
            }
            className="w-full rounded-md border border-border bg-background text-foreground px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            placeholder="your password"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={state.loading || !isSupabaseConfigured}
          className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-2 font-medium disabled:opacity-50"
        >
          {state.loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
