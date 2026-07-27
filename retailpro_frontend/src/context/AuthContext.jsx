import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    if (token && name) setUser({ token, name, email, role })
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, name, email: em, role } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('email', em)
    localStorage.setItem('role', role)
    setUser({ token, name, email: em, role })
    return role
  }

  const register = async (data) => {
    await api.post('/auth/register', data)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
