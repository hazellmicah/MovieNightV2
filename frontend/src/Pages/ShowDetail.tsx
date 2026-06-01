import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Movie {
  _id: string
  title: string
  year: number
  poster: string
  plot: string
  runtime: string | number
  genres?: string[]
  imdb?: {
    rating?: number
  }
}

const ShowDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favMessage, setFavMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:3000/movie/${id}`)
        if (!response.ok) {
          throw new Error('Movie not found')
        }
        const data = await response.json()
        setMovie(data)
      } catch (err) {
        setError('Could not load movie details. Verify the backend is running.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) {
    return <div className="p-8 text-white">Loading movie details...</div>
  }

  if (error) {
    return <div className="p-8 text-red-400">{error}</div>
  }

  if (!movie) {
    return <div className="p-8 text-white">Movie not found.</div>
  }

  return (
    <div className="p-4">
      <button
        className="mb-6 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full rounded-xl border border-blue-600 object-cover"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          <p className="text-gray-300">{movie.plot}</p>

          <div className="grid gap-2 sm:grid-cols-2">
            <p className="text-gray-200">Year: {movie.year}</p>
            <p className="text-gray-200">Rating: {movie.imdb?.rating ?? 'N/A'}</p>
            <p className="text-gray-200">Runtime: {movie.runtime}</p>
            <p className="text-gray-200">Genres: {movie.genres?.join(', ') ?? 'N/A'}</p>
          </div>

          <div>
            <button
              className="mt-3 rounded bg-green-600 px-4 py-2 text-white"
              onClick={async () => {
                setFavMessage(null)
                try {
                  const resp = await fetch(`http://localhost:3000/favs/add/${movie._id}`, { method: 'POST' })
                  const data = await resp.json()
                  if (!resp.ok) throw new Error(data.error || data.message || 'Failed')
                  // navigate to favorites page so user sees the added item
                  navigate('/favorites')
                } catch (e) {
                  setFavMessage('Could not add to favorites')
                  console.error(e)
                }
              }}
            >
              Add to Faves
            </button>
            {favMessage && <p className="mt-2 text-sm text-gray-200">{favMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowDetail
