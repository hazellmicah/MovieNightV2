import express from 'express'
import { PORT } from './config.js'
import { getFavs, getMovie, getMovies, getYears, getRating } from './readUtils.js'
import { addToFavs, deletefromFavs, updateFavs } from './createUtils.js'
import { connectMongo } from './myMongo.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const startServer = async () => {
    try {
        await connectMongo()
        const port = process.env.PORT || PORT
        app.listen(port, () => {
            console.log(`App is listening on port http://localhost:${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()

app.get('/', (req, res) => {
    res.send('Welcome to Movie Night')
})

//Get all movies
app.get('/movies', (req, res) => {
    const {
        type = 'movie',
        page = 1,
        rating,
        year
    } = req.query

    const query = {}

    if (rating) query.rating = Number(rating)
    if (year) query.year = Number(year)
    getMovies(res, type, Number(page), query)
})

app.get('/movie/:id', (req, res) => {
    const movieID = req.params.id
    if (!movieID || movieID.length !== 24) {
        res.status(400).send({ error: "Invalid movie ID" })
        return
    }
    getMovie(res, movieID)
})

//search by rating
app.get('/rating/:rating', (req, res) => {
    const rating = Number(req.params.rating);
    getRating(res, rating)
})

app.get('/year/:year', (req, res) => {
    const year = Number(req.params.year)
    getYears(res, year)
})

//Get all favourites
app.get('/favs', (req, res) => {
    getFavs(res)
})

//add to favourites
app.post("/favs/add/:id", (req, res) => {
    let showID = req.params.id
    if (!showID || showID.length != 24) {
        res.status(400).send({ error: "Invalid ID" })
    return
    }
        addToFavs(res, showID)
})

//delete from favourites
app.delete('/favs/delete/:id', (req, res) => {
    let showID = req.params.id
    if (!showID || showID.length !== 24) {
        res.status(400).send({ error: "Invalid show ID" })
        return
    }
    deletefromFavs(res, showID)
})

//update favourite
app.put('/update/:id', (req, res) => {
    const data = req.body
    const showID = req.params.id

    if (!data || !showID || !data.note) {
        res.status(400).json({ error: "Missing data" })
        return
    }
    if (data.note.length > 200) {
        res.status(400).json({ error: "Note is too long, maximum length is 200 characters" })
        return
    }
    updateFavs(res, showID, {
        note: data.note,
        watched: data.watched
    })
})



