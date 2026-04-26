import { ObjectId } from "mongodb"
import { favCollection } from "./myMongo.js"

// Activity: Add a specific movie or series to faves
const addToFaves = (res, showID) => {
    favCollection
        .countDocuments({ showId: showID })
        .then(counted => {
            if (counted > 0) {
                res.status(200).json({ message: `Show ID: ${showID} is already in your favorites.` })
                return
            }
            // Logic updated to include: showId, empty notes, and watched flag
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

// Activity: Delete a specified fave
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

// Activity: Update faves by adding a note and flagging as watched/not watched
const updateFave = (res, fID, theNotes, isWatched) => {
    // convert fID to ObjectID
    fID = new ObjectId(fID)

    // update the notes field and the watched status.
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