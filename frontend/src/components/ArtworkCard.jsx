import { useNavigate } from 'react-router-dom'

export default function ArtworkCard({ artwork }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/artworks/${artwork._id}`)}
      className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200"
    >
      <img
        src={artwork.imageUrl}
        alt={artwork.title}
        className="w-full h-52 object-cover bg-stone-100"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = `https://picsum.photos/seed/${artwork._id}/800/600`
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-stone-800 truncate">{artwork.title}</h3>
        {artwork.artist && (
          <p className="text-sm text-stone-500 mt-1">{artwork.artist.name}</p>
        )}
        {artwork.year && (
          <p className="text-xs text-stone-400 mt-1">{artwork.year}</p>
        )}
      </div>
    </div>
  )
}