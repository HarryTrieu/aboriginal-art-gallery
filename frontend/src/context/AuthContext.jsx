import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken()
          setAuthToken(token)
          const res = await api.post('/users/login', {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(res.data)
        } catch (error) {
          console.error('Failed to sync user with backend:', error)
        }
      } else {
        setUser(null)
        setAuthToken(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)