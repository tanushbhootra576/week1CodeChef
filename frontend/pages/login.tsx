import { useState } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e:any){
    e.preventDefault()
    setLoading(true)
    try{
      const res = await api.post('/auth/login', { email, password })
      const token = res.data?.token
      if (token) {
        localStorage.setItem('jwt', token)
        router.push('/')
      } else {
        alert('No token returned')
      }
    }catch(err:any){
      alert(err?.response?.data?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-gray-900 p-6 transition-colors duration-500">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-soft p-6 transition-colors duration-500">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border p-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full border p-2 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 rounded bg-indigo-600 dark:bg-purple-700 text-white shadow-neon hover:scale-105 transition-transform">{loading? 'Signing in...':'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
