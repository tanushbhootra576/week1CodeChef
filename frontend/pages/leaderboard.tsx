import { useEffect, useState } from 'react'
import api from '../lib/api'
import Link from 'next/link'

type Score = { name: string; score: number; createdAt: string }

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[] | null>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        const res = await api.get('/scores/top')
        // ensure we always set an array
        const data = Array.isArray(res.data) ? res.data : []
        if (mounted) setScores(data)
      }catch(err){
        console.error(err)
        if (mounted) setScores([])
      }finally{
        if (mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white dark:from-slate-900 dark:to-gray-900 p-6 transition-colors duration-500">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-soft p-6 transition-colors duration-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Leaderboard</h2>
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-300">Home</Link>
        </div>
        <ol className="space-y-3">
          {loading ? (
            <li className="text-sm text-gray-500 dark:text-gray-400">Loading...</li>
          ) : ( (scores ?? []).length === 0 ? (
            <li className="text-sm text-gray-500 dark:text-gray-400">No scores yet  be the first!</li>
          ) : (
            (scores ?? []).map((s, i) => (
              <li key={i} className="p-3 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-gray-900 shadow-sm flex justify-between items-center transition-colors duration-500">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{s.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-lg font-semibold text-indigo-600 dark:text-purple-400">{s.score}</div>
              </li>
            ))
          ))}
        </ol>
      </div>
    </div>
  )
}
