import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register:  (data) => api.post('/auth/register', data),
  login:     (data) => api.post('/auth/login', data),
  me:        ()     => api.get('/auth/me'),
  logout:    ()     => api.post('/auth/logout'),
  googleUrl: () => '/api/auth/google',
}

export const labApi = {
  getAll: (params) => api.get('/labs', { params }),
  getOne: (slug)   => api.get(`/labs/${slug}`),
}

export const progressApi = {
  startSession:    (slug)        => api.post(`/progress/${slug}/session`),
  complete:        (labId)       => api.post(`/progress/${labId}/complete`),
  submitFlag:      (slug, flag)  => api.post(`/progress/${slug}/flag`, { flag }),
  unlockHint:      (slug)        => api.post(`/progress/${slug}/hint`),
  stats:           ()            => api.get('/progress/stats'),
  recent:          ()            => api.get('/progress/recent'),
  map:             ()            => api.get('/progress/map'),
  recommendations: ()            => api.get('/progress/recommendations'),
}

export const userApi = {
  getProfile:     ()     => api.get('/users/profile'),
  updateProfile:  (data) => api.patch('/users/profile', data),
  changePassword: (data) => api.patch('/users/password', data),
  resetProgress:  ()     => api.delete('/users/progress'),
  deleteAccount:  ()     => api.delete('/users/account'),
}

export const leaderboardApi = {
  get: (period = 'all') => api.get('/leaderboard', { params: { period } }),
}

export const adminApi = {
  getStats:          ()        => api.get('/admin/stats'),
  getUsers:          (params)  => api.get('/admin/users', { params }),
  updateUser:        (id, data)=> api.patch(`/admin/users/${id}`, data),
  resetUserProgress: (id)      => api.delete(`/admin/users/${id}/progress`),
  deleteUser:        (id)      => api.delete(`/admin/users/${id}`),
  getLabs:           (params)  => api.get('/admin/labs', { params }),
  createLab:         (data)    => api.post('/admin/labs', data),
  updateLab:         (id, data)=> api.patch(`/admin/labs/${id}`, data),
  deleteLab:         (id)      => api.delete(`/admin/labs/${id}`),
}

export default api;
