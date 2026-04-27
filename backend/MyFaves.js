import { ObjectId } from "mongodb"
import { favCollection } from "./myMongo.js"

const addToFaves = (res, showID) => {
    favCollection
        .countDocuments({ showId: showID })
        .then(counted => {
            if (counted > 0) {
                res.status(200).json({ message: `Show ID: ${showID} is already in your favorites.` })
                return
            }

            favCollection
                .insertOne({ 
                    showId: showID, 
                    notes: "", 
                    watched: false 
                })
                .then(results => {
                    if (results.insertedId)
                        res.status(200).json({ message: "Show added to favourites." })
                    else
                        res.status(400).json({ error: "An error occurred while adding to favourites." })
                })
        })
}

const deleteFromFaves = (res, fID) => {
    favCollection
        .deleteOne({ _id: new ObjectId(fID) })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Deleted successfully." })
            }
            else
                res.status(200).json({ error: "An error occurred while attempting to delete that fave." })
        })
}

const updateFave = (res, fID, theNotes, isWatched) => {
    fID = new ObjectId(fID)

    const query = { _id: fID }
    const updateData = {
        $set: {
            notes: theNotes,
            watched: isWatched
        }
    }
    const options = { upsert: true }
    favCollection
        .updateOne(query, updateData, options)
        .then(result => {
            if (result.matchedCount == 0 && result.upsertedCount == 0) {
                res.status(400).json({
                    error: "Update failed: Fave not found."
                })
                return
            }
            res.status(200).json({
                message: "Fave updated successfully."
            })
        })
}

export { addToFaves, deleteFromFaves, updateFave }