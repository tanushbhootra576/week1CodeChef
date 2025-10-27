import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'

const instance = axios.create({ baseURL: API_BASE })

instance.interceptors.request.use(config=>{
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default instance
