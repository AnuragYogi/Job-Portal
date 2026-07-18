import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">JobPortal</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/jobs" className="hover:text-indigo-200 transition">Jobs</Link>
          {!user ? (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-indigo-700 px-3 py-1 rounded font-medium hover:bg-indigo-100 transition">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'user' && <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>}
              {user.role === 'recruiter' && <Link to="/recruiter" className="hover:text-indigo-200">Recruiter</Link>}
              {user.role === 'admin' && <Link to="/admin" className="hover:text-indigo-200">Admin</Link>}
              <span className="text-indigo-200 hidden sm:inline">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-white text-indigo-700 px-3 py-1 rounded font-medium hover:bg-indigo-100 transition">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
