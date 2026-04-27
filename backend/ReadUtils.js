import { ObjectId } from "mongodb";
import { moviesCollection, favCollection } from "./myMongo.js";

const getMovies = (res, type, skip, limit, filters) => {
    let query = { type: type };

    if (filters.year) {
        query.year = filters.year;
    }
    if (filters.rating) {
        query["imdb.rating"] = { $gte: filters.rating }; 
    }

    moviesCollection
        .find(query)
        .project({ 
            title: 1, 
            poster: 1, 
            year: 1, 
            _id: 1 
        }) 
        .skip(skip)
        .limit(limit)
        .toArray()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(err => res.status(500).json({ error: err.message }));
};


const getMovie = (res, movieID) => {
    moviesCollection
        .findOne(
            { _id: new ObjectId(movieID) },
            { 
                projection: { 
                    title: 1, 
                    poster: 1, 
                    year: 1, 
                    fullplot: 1
                } 
            }
        )
        .then(result => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ error: "Show not found" });
        });
};

const getFaves = (res) => {
    favesCollection
        .find({})
        .toArray()
        .then(results => res.status(200).json(results));
};

export { getMovies, getMovie, getFaves };