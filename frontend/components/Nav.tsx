import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { ThemeContext } from './ThemeProvider'

export default function Nav(){
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const theme = useContext(ThemeContext)

  useEffect(()=>{
    setToken(typeof window !== 'undefined' ? localStorage.getItem('jwt') : null)
    const handler = () => setToken(localStorage.getItem('jwt'))
    window.addEventListener('storage', handler)
    return ()=>window.removeEventListener('storage', handler)
  }, [])

  function logout(){
    localStorage.removeItem('jwt')
    setToken(null)
    router.push('/')
  }

  return (
    <header className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur sticky top-0 z-30">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Click Frenzy</Link>
          <Link href="/leaderboard" className="text-sm text-gray-600 dark:text-gray-300">Leaderboard</Link>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Logout</button>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 rounded border text-sm">Login</Link>
              <Link href="/signup" className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
