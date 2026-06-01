import { useEffect, useState } from 'react'
import MovieCard from '../Components/MovieCard'

interface Movie {
  _id: string
  title: string
  year: number
  poster: string
}

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMovies(page)
  }, [page])

  const fetchMovies = async (pageNumber: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3000/movies?type=movie&page=${pageNumber}`)
      if (!response.ok) {
        throw new Error('Failed to load movies')
      }

      const data = await response.json()
      setMovies(data)
    } catch (err) {
      setError('Could not load movies. Make sure the backend is running on port 3000.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white">Movie Night</h1>
        <p className="text-sm text-gray-400 mt-1">Browse the movie collection and click a card for details.</p>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-white">Loading movies...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie._id} show={movie} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">Page {page}</span>
        <button
          onClick={() => setPage((current) => current + 1)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Home
