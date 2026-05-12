import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Gallery from './pages/Gallery'
import ArtworkDetail from './pages/ArtworkDetail'
import ArtistDetail from './pages/ArtistDetail'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/gallery" replace />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/artworks/:id" element={<ArtworkDetail />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}