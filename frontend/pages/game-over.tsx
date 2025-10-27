import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import api from '../lib/api'

export default function GameOver() {
  const router = useRouter()
  const [score, setScore] = useState<number>(0)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const q = router.query
    if (q.score) setScore(Number(q.score))
    else {
      const s = localStorage.getItem('lastScore')
      if (s) setScore(Number(s))
    }
  }, [router.query])

  async function submit() {
    if (!name) return alert('Enter a name')
    setLoading(true)
    try {
      await api.post('/scores', { name, score })
      setDone(true)
    } catch (err:any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to submit')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Game Over</h2>
        <p className="text-gray-600 mb-4">Your score: <span className="font-bold">{score}</span></p>
        {done ? (
          <div className="p-4 bg-green-50 rounded">
            <p className="text-green-800">Score submitted! Check the leaderboard.</p>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>router.push('/leaderboard')} className="px-4 py-2 bg-indigo-600 text-white rounded">Leaderboard</button>
              <button onClick={()=>router.push('/')} className="px-4 py-2 border rounded">Home</button>
            </div>
          </div>
        ) : (
          <div>
            <input className="w-full border p-2 rounded mb-3" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={submit} disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">{loading? 'Submitting...':'Submit Score'}</button>
              <button onClick={()=>router.push('/game')} className="px-4 py-2 border rounded">Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
