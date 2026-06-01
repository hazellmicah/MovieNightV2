import { setServers } from "dns";
import { MongoClient, ServerApiVersion } from "mongodb";
import { MDBURI } from "./config.js";

setServers(["8.8.8.8", "1.1.1.1"]);
//i dont know what was wrong with my mongo so i had to add this based on YT video

const client = new MongoClient(MDBURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

const mflixDB = client.db("sample_mflix")
const moviesCollection = mflixDB.collection("movies")

const connectMongo = async () => {
    try {
        await client.connect()
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        throw error
    }
}

export { moviesCollection, connectMongo }