import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <Link to="/gallery" className="text-xl font-bold tracking-wide hover:text-amber-400 transition">
        Aboriginal Art Gallery
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/gallery" className="text-stone-300 hover:text-white transition text-sm">
          Gallery
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition text-sm font-medium">
            Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-amber-400 transition-all duration-200" />
            )}
            <span className="text-stone-300 text-sm">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-stone-700 px-3 py-1 rounded-lg hover:bg-stone-600 transition"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="text-sm bg-amber-600 px-4 py-2 rounded-lg hover:bg-amber-700 transition font-medium"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  )
}