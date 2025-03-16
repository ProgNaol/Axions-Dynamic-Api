import "dotenv/config";
import express from "express";
import apiRoutes from "./api/index.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";


// Connect to MongoDB
await connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("The api is running on port 3000")
})



app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
})