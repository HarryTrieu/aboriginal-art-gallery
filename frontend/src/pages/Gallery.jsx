import { useEffect, useState } from 'react'
import api from '../services/api'
import ArtworkCard from '../components/ArtworkCard'

export default function Gallery() {
  const [artworks, setArtworks] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/artworks?page=${page}&limit=12`)
        setArtworks(res.data.artworks)
        setTotalPages(res.data.totalPages)
      } catch (error) {
        console.error('Failed to load artworks:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Gallery</h1>
      <p className="text-stone-500 mb-8">Explore works by Aboriginal Australian artists</p>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Loading artworks...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-300 hover:shadow-sm transition-all cursor-pointer"
            >
              Previous
            </button>
            <span className="text-stone-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-300 hover:shadow-sm transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}