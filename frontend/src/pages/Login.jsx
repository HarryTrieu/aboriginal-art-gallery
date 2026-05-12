import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/gallery')
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center gap-6 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-stone-800 text-center">
          Aboriginal Art Gallery
        </h1>
        <p className="text-stone-500 text-center">
          Sign in to explore, comment on artworks, and connect with Aboriginal artists.
        </p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white border border-stone-300 rounded-lg px-6 py-3 text-stone-700 font-medium hover:bg-stone-100 hover:border-stone-400 hover:shadow-md active:scale-[0.98] transition-all shadow-sm cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}