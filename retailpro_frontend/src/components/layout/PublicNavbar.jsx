import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MdMenu, MdClose } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'

export default function PublicNavbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-blue-600 text-lg">RetailPro</Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[['/', 'Home'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <NavLink key={path} to={path} end={path === '/'}
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`
                }>
                {label}
              </NavLink>
            ))}
            {user ? (
              <Link to="/dashboard" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-1 text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {[['/', 'Home'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block text-sm py-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`
              }>
              {label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            {user ? (
              <Link to="/dashboard" className="flex-1 text-center bg-blue-600 text-white text-sm py-1.5 rounded">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="flex-1 text-center border border-gray-300 text-gray-700 text-sm py-1.5 rounded">Login</Link>
                <Link to="/register" className="flex-1 text-center bg-blue-600 text-white text-sm py-1.5 rounded">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
