import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import ArtworkCard from '../components/ArtworkCard'

export default function ArtistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await api.get(`/artists/${id}`)
        setData(res.data)
      } catch (error) {
        console.error('Failed to load artist:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArtist()
  }, [id])

  if (loading) return <div className="text-center py-20 text-stone-400">Loading...</div>
  if (!data) return <div className="text-center py-20 text-red-500">Artist not found</div>

  const { artist, artworks } = data

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
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
        {artist.profileImageUrl && (
          <img
            src={artist.profileImageUrl}
            alt={artist.name}
            className="w-40 h-40 rounded-2xl object-cover shadow"
          />
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-stone-800">{artist.name}</h1>
          <p className="text-stone-500">{artist.tribe} · {artist.region}</p>
          {artist.birthYear && <p className="text-stone-500">Born {artist.birthYear}</p>}
          <p className="text-stone-700 leading-relaxed mt-2 max-w-xl">{artist.bio}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-stone-800 mb-4">
        Works by {artist.name}
      </h2>

      {artworks.length === 0 ? (
        <p className="text-stone-400">No artworks yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artworks.map(artwork => (
            <ArtworkCard key={artwork._id} artwork={{ ...artwork, artist }} />
          ))}
        </div>
      )}
    </div>
  )
}