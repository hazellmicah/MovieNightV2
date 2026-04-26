import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import { getMovies, getMovie, getFaves } from './ReadUtils.js';
import { addToFaves } from './CreateUtils.js';
import { deleteFromFaves, updateFave } from './MyFaves.js';

const app = express()
app.use(cors())
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    res.send('<h1><a href="/show">Goodnight Moon, Brad!</a></h1>')
})

app.get("/calc/rect/:length/:width", (req, res) => {
    let data = req.params
    res.status(206).send(`The area of a rectangle ${data.length} x ${data.width} is ${data.length * data.width}`)
})

app.get("/info/:id", (req, res) => {
    let movieID = req.params.id
    if (!movieID || movieID.length != 24) {
        res.status(400).send({ "error": "Invalid ID" })
        return
    }
    getMovie(res, movieID)
})

app.get("/faves/show", (req, res) => {
    getFaves(res)
})

app.post("/faves/add/:id", (req, res) => {
    let showID = req.params.id
    if (!showID || showID.length != 24)
        res.status(400).send({ error: "Invalid ID" })
    else
        addToFaves(res, showID)
})

app.get("/:type", (req, res) => {
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    getMovies(res, type)
})

app.get("/:type/p:page", (req, res) => {
    const pageSize = 10
    let type = req.params.type.toLowerCase()
    if (type != "movie" && type != "series") {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    let page = parseInt(req.params.page)
    if (!page || isNaN(page) || page < 1) {
        res.status(400).send({ "error": "Invalid URI" })
        return
    }
    page = (page - 1) * pageSize
    getMovies(res, type, page)
})

