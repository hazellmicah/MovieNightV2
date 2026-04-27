import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import { getMovies, getMovie, getFaves } from './ReadUtils.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Main Home Page (The white screen with your links)
app.get('/', (req, res) => {
    res.send(`
        <h1>Couch Potato Backend is running</h1>
        <ul>
            <li><a href="/movie/p1">View Movies (Page 1)</a></li>
            <li><a href="/series/p1">View Series (Page 1)</a></li>
            <li><a href="/faves">View Faves</a></li>
        </ul>
    `);
});

app.get("/:type/p:page", (req, res) => {
    getMovies(req, res);
});

app.get("/:type", (req, res) => {
    getMovies(req, res);
});

app.get('/faves', (req, res) => {
    getFaves(req, res);
});

app.get("/info/:id", (req, res) => {
    getMovie(req, res);
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});