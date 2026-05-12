import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import CommentSection from '../components/CommentSection'

export default function ArtworkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await api.get(`/artworks/${id}`)
        setArtwork(res.data)
      } catch (error) {
        console.error('Failed to load artwork:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArtwork()
  }, [id])

  if (loading) return <div className="text-center py-20 text-stone-400">Loading...</div>
  if (!artwork) return <div className="text-center py-20 text-red-500">Artwork not found</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 mb-6 px-3 py-1.5 rounded-lg transition-all -ml-3 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-stone-800">{artwork.title}</h1>
          <p className="text-stone-500">{artwork.year} · {artwork.medium}</p>
          <p className="text-stone-700 leading-relaxed">{artwork.description}</p>

          {artwork.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map(tag => (
                <span key={tag} className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {artwork.artist && (
            <Link
              to={`/artists/${artwork.artist._id}`}
              className="flex items-center gap-4 mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 hover:bg-stone-100 hover:border-amber-300 hover:shadow-md transition-all duration-200"
            >
              {artwork.artist.profileImageUrl && (
                <img
                  src={artwork.artist.profileImageUrl}
                  alt={artwork.artist.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-stone-800">{artwork.artist.name}</p>
                <p className="text-sm text-stone-500">{artwork.artist.tribe} · {artwork.artist.region}</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-12">
        <CommentSection artworkId={id} />
      </div>
    </div>
  )
}