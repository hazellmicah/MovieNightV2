import express from "express";
import { port } from "../config.js";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json())

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

app.get("/", (req, res) => {
    res.send("Welcome To Movie Night!")
})

export default app;