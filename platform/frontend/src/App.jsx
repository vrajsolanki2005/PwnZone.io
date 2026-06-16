import { Toaster } from 'react-hot-toast'
import AppRouter from './routes/AppRouter'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-right" toastOptions={{ style: { background: 'var(--clr-surface)', color: 'var(--clr-text-primary)', border: '1px solid var(--clr-border)' } }} />
      </AuthProvider>
    </ThemeProvider>
  )
}
