import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

// Reusable styled image picker: shows a dashed upload zone, then a preview once chosen
function ImagePicker({ label, required, previewUrl, onChange, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      // Synthesise a fake event matching the shape onChange expects
      onChange({ target: { files: [file] } })
    }
  }

  return (
    <div>
      <label className="block text-sm text-stone-600 mb-1">{label}{required && ' *'}</label>
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="preview"
            className="h-36 w-auto rounded-xl object-cover shadow border border-stone-200"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow transition-colors cursor-pointer"
            title="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-all duration-200 group
            ${dragging
              ? 'border-amber-500 bg-amber-100 scale-[1.01]'
              : 'border-stone-300 hover:border-amber-400 hover:bg-amber-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 transition-colors ${dragging ? 'text-amber-500' : 'text-stone-400 group-hover:text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className={`text-sm font-medium transition-colors ${dragging ? 'text-amber-700' : 'text-stone-500 group-hover:text-amber-700'}`}>
            {dragging ? 'Drop to upload' : 'Click or drag & drop an image'}
          </span>
          <span className="text-xs text-stone-400">PNG, JPG, WEBP supported</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        required={required && !previewUrl}
        onChange={onChange}
      />
    </div>
  )
}

export default function AdminDashboard() {
  const [artists, setArtists] = useState([])
  const [artistForm, setArtistForm] = useState({ name: '', tribe: '', region: '', birthYear: '', bio: '' })
  const [artistImage, setArtistImage] = useState(null)
  const [artistImagePreview, setArtistImagePreview] = useState(null)
  const [artworkForm, setArtworkForm] = useState({ title: '', description: '', medium: '', year: '', artist: '', tags: '' })
  const [artworkImage, setArtworkImage] = useState(null)
  const [artworkImagePreview, setArtworkImagePreview] = useState(null)
  const [message, setMessage] = useState('')

  // searchable artist picker state
  const [artistSearch, setArtistSearch] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    api.get('/artists?limit=100').then(res => setArtists(res.data.artists))
  }, [])

  // close picker when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAddArtist = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(artistForm).forEach(([k, v]) => formData.append(k, v))
    if (artistImage) formData.append('profileImage', artistImage)

    try {
      await api.post('/artists', formData)
      setMessage('Artist created successfully!')
      setArtistForm({ name: '', tribe: '', region: '', birthYear: '', bio: '' })
      setArtistImage(null)
      setArtistImagePreview(null)
      const res = await api.get('/artists?limit=100')
      setArtists(res.data.artists)
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleAddArtwork = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(artworkForm).forEach(([k, v]) => formData.append(k, v))
    if (artworkImage) formData.append('image', artworkImage)

    try {
      await api.post('/artworks', formData)
      setMessage('Artwork created successfully!')
      setArtworkForm({ title: '', description: '', medium: '', year: '', artist: '', tags: '' })
      setArtworkImage(null)
      setArtworkImagePreview(null)
      setArtistSearch('')
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Admin Dashboard</h1>
      <p className="text-stone-500 mb-8">Manage artists and artworks</p>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">Add New Artist</h2>
        <form onSubmit={handleAddArtist} className="flex flex-col gap-4">
          <input
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Name *"
            value={artistForm.name}
            onChange={e => setArtistForm({ ...artistForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Tribe"
              value={artistForm.tribe}
              onChange={e => setArtistForm({ ...artistForm, tribe: e.target.value })}
            />
            <input
              className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Region"
              value={artistForm.region}
              onChange={e => setArtistForm({ ...artistForm, region: e.target.value })}
            />
          </div>
          <input
            type="number"
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Birth Year"
            value={artistForm.birthYear}
            onChange={e => setArtistForm({ ...artistForm, birthYear: e.target.value })}
          />
          <textarea
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Bio"
            rows={4}
            value={artistForm.bio}
            onChange={e => setArtistForm({ ...artistForm, bio: e.target.value })}
          />
          <ImagePicker
            label="Profile Image"
            previewUrl={artistImagePreview}
            onChange={e => {
              const file = e.target.files[0]
              setArtistImage(file)
              setArtistImagePreview(file ? URL.createObjectURL(file) : null)
            }}
            onClear={() => { setArtistImage(null); setArtistImagePreview(null) }}
          />
          <button type="submit" className="bg-amber-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-amber-700 transition">
            Add Artist
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">Add New Artwork</h2>
        <form onSubmit={handleAddArtwork} className="flex flex-col gap-4">
          <input
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Title *"
            value={artworkForm.title}
            onChange={e => setArtworkForm({ ...artworkForm, title: e.target.value })}
            required
          />
          <textarea
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Description"
            rows={3}
            value={artworkForm.description}
            onChange={e => setArtworkForm({ ...artworkForm, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Medium (e.g. Acrylic on canvas)"
              value={artworkForm.medium}
              onChange={e => setArtworkForm({ ...artworkForm, medium: e.target.value })}
            />
            <input
              type="number"
              className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Year"
              value={artworkForm.year}
              onChange={e => setArtworkForm({ ...artworkForm, year: e.target.value })}
            />
          </div>
          <input
            className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Tags (comma separated: dot painting, Dreamtime)"
            value={artworkForm.tags}
            onChange={e => setArtworkForm({ ...artworkForm, tags: e.target.value })}
          />
          {/* Searchable artist picker */}
          <div ref={pickerRef} className="relative">
            <input
              type="text"
              className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Search or select artist *"
              value={artistSearch}
              onChange={e => {
                setArtistSearch(e.target.value)
                setArtworkForm({ ...artworkForm, artist: '' })
                setPickerOpen(true)
              }}
              onFocus={() => setPickerOpen(true)}
              autoComplete="off"
              required={!artworkForm.artist}
            />
            {/* hidden native input so HTML5 required validation works on the actual ID */}
            <input type="hidden" name="artist" value={artworkForm.artist} required />
            {artworkForm.artist && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-sm font-medium pointer-events-none">
                ✓
              </span>
            )}
            {pickerOpen && (
              <ul className="absolute z-10 w-full bottom-full mb-1 bg-white border border-stone-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                {artists
                  .filter(a => a.name.toLowerCase().includes(artistSearch.toLowerCase()))
                  .map(a => (
                    <li
                      key={a._id}
                      onMouseDown={() => {
                        setArtworkForm({ ...artworkForm, artist: a._id })
                        setArtistSearch(a.name)
                        setPickerOpen(false)
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-amber-50 hover:text-amber-800 transition-colors text-stone-700 text-sm ${
                        artworkForm.artist === a._id ? 'bg-amber-50 font-semibold text-amber-800' : ''
                      }`}
                    >
                      {a.name}
                    </li>
                  ))}
                {artists.filter(a => a.name.toLowerCase().includes(artistSearch.toLowerCase())).length === 0 && (
                  <li className="px-4 py-2 text-stone-400 text-sm">No artists found</li>
                )}
              </ul>
            )}
          </div>
          <ImagePicker
            label="Artwork Image"
            required
            previewUrl={artworkImagePreview}
            onChange={e => {
              const file = e.target.files[0]
              setArtworkImage(file)
              setArtworkImagePreview(file ? URL.createObjectURL(file) : null)
            }}
            onClear={() => { setArtworkImage(null); setArtworkImagePreview(null) }}
          />
          <button type="submit" className="bg-amber-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-amber-700 transition">
            Add Artwork
          </button>
        </form>
      </section>
    </div>
  )
}