import { ObjectId } from "mongodb"
import { format } from "date-and-time"
import { moviesCollection } from "./myMongo.js"

const getMovies = (res, type, page = 1) => {

    const safePage = Math.max(Number(page) || 1, 1)

    moviesCollection
        .find({ type: type }, {
            limit: 30,
            skip: (safePage - 1) * 30,
            sort: { year: -1 }
        })
        .project({
            _id: 1,
            plot: 1,
            title: 1,
            genres: 1,
            year: 1,
            imdb: { rating: 1 },
            languages: 1,
            runtime: 1,
            poster: 1,
            countries: 1,
            type: 1,
            rated: 1

        })
        .toArray()
        .then(resp => {
            if (!resp)
                resp = { "error": "no data found" }
            else {
                for (let doc of resp) {
                    if (doc.runtime) {
                        let hours = Math.floor(doc.runtime / 60)
                        let minutes = doc.runtime % 60
                        doc.runtime = `${hours == 1 ? "hr" : "hrs"} ${minutes} ${minutes == 1 ? "min" : "mins"}`

                    }
                }
            }
            res.status(200).send(resp)
        })
}


const getMovie = (res, movieID) => {
    moviesCollection
        .findOne(
            { _id: new ObjectId(movieID) },
            {
                projection: {
                    _id: 1,
                    plot: 1,
                    title: 1,
                    genres: 1,
                    year: 1,
                    imdb: { rating: 1 },
                    languages: 1,
                    runtime: 1,
                    poster: 1,
                    countries: 1,
                    type: 1,
                    rated: 1
                }
            }
        )
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ error: "no data found" })
            }
            if (doc.runtime) {
                let hours = Math.floor(doc.runtime / 60)
                let minutes = doc.runtime % 60
                doc.runtime = `${hours == 1 ? "hr" : "hrs"} ${minutes} ${minutes == 1 ? "min" : "mins"}`
            }

            if (doc.released) {
                doc.released = format(doc.released, "DD, MM, YYYY")
            }

            res.status(200).json(doc)
        })

}

const getFavs = (res, showID) => {
    moviesCollection
        .find({ showID: { $exists: true } })
        .toArray()
        .then(favDocs => {
            if (!favDocs)
                favDocs = { "error": "no data found" }
            res.status(200).json(favDocs)
        })
}

const getYears = (res, year) => {

    moviesCollection
        .find({ year: Number(year) })
        .project({
            _id: 1,
            plot: 1,
            title: 1,
            genres: 1,
            year: 1,
            countries: 1,
            type: 1,
            rated: 1
        })
        .toArray()
        .then(docs => {
            if (!docs || docs.length === 0) {
                res.status(404).json({ error: "no data found" })
                return
            }

            res.status(200).json(docs)
        })
}

const getRating = (res, rating) => {

    moviesCollection
        .find({ "imdb.rating": { $eq: Number(rating) } })
        // $gt = greater than, $lt = less than, $gte = greater than or equal to, $lte = less than or equal to
        .project({
            _id: 1,
            plot: 1,
            title: 1,
            genres: 1,
            year: 1,
            imdb: { rating: 1 }
        })
        .toArray()
        .then(docs => {
            if (!docs || docs.length === 0) {
                res.status(404).json({ error: "no data found" })
                return
            }

            res.status(200).json(docs)
        })
}



export { getMovies, getMovie, getFavs, getYears, getRating }   