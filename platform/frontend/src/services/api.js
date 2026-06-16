import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const authApi = {
  register:  (data) => api.post('/auth/register', data),
  login:     (data) => api.post('/auth/login', data),
  me:        ()     => api.get('/auth/me'),
  logout:    ()     => api.post('/auth/logout'),
  googleUrl: () => 'http://localhost:3000/api/auth/google',
}

export default api
