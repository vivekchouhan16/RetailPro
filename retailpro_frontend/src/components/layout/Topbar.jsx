import { useState, useRef, useEffect } from 'react'
import { MdMenu, MdPerson, MdLogout } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      <button onClick={onMenuToggle} className="lg:hidden p-1 text-gray-500">
        <MdMenu className="text-xl" />
      </button>

      <div className="relative ml-auto" ref={ref}>
        <button
          onClick={() => setDropOpen(!dropOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <MdPerson className="text-blue-600 text-sm" />
          </div>
          <span className="text-sm text-gray-700">{user?.name}</span>
          <span className="text-xs text-gray-400">({user?.role})</span>
        </button>

        {dropOpen && (
          <div className="absolute right-0 mt-1 w-44 bg-white rounded border border-gray-200 shadow-md py-1 z-50">
            <p className="px-3 py-1.5 text-xs text-gray-500 border-b border-gray-100">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <MdLogout className="text-sm" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
