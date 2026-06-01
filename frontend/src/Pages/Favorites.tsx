import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface FavoriteItem {
  _id: string
  showID: string
  note: string
  watched: boolean
}

interface Movie {
  _id: string
  title: string
  year: number
  poster: string
  plot: string
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<(FavoriteItem & { movie?: Movie })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch('http://localhost:3000/favs')
        if (!response.ok) {
          throw new Error('Failed to load favorites')
        }

        const data: FavoriteItem[] = await response.json()
        const withMovies = await Promise.all(
          data.map(async (fav) => {
            try {
              const movieResponse = await fetch(`http://localhost:3000/movie/${fav.showID}`)
              const movieData = await movieResponse.json()
              return { ...fav, movie: movieData }
            } catch {
              return fav
            }
          })
        )

        setFavorites(withMovies)
      } catch (err) {
        setError('Could not load favorites. Verify the backend is running.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-3xl font-bold text-white">My Favorites</h1>

      {loading && <p className="text-white">Loading favorites...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p className="text-gray-300">No favorites yet. Add a movie to favorites from the home page.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {favorites.map((fav) => (
          <div key={fav._id} className="rounded-xl border border-blue-600 bg-slate-950 p-4">
            <h2 className="text-xl font-semibold text-white">{fav.movie?.title ?? fav.showID}</h2>
            <p className="text-sm text-gray-400">Year: {fav.movie?.year ?? 'Unknown'}</p>
            <p className="mt-2 text-gray-300">{fav.movie?.plot ?? 'No movie details available'}</p>
            {fav.note && <p className="mt-3 text-gray-200">Note: {fav.note}</p>}
            <p className="mt-2 text-sm text-gray-400">Status: {fav.watched ? 'Watched' : 'Not watched'}</p>
            <div className="mt-3 flex gap-3">
              <Link to={`/show/${fav.showID}`} className="rounded bg-blue-600 px-3 py-1 text-white">Watch</Link>
              <button
                className="rounded bg-red-600 px-3 py-1 text-white"
                onClick={async () => {
                  if (!confirm('Remove this favourite?')) return
                  try {
                    const resp = await fetch(`http://localhost:3000/favs/delete/${fav.showID}`, { method: 'DELETE' })
                    const data = await resp.json()
                    if (!resp.ok) throw new Error(data.error || 'Delete failed')
                    setFavorites(prev => prev.filter(p => p._id !== fav._id))
                  } catch (e) {
                    console.error('Failed to delete favourite', e)
                    alert('Could not delete favourite')
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites
