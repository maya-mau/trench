// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const ADZUNA_API_ID = process.env.ADZUNA_API_ID;

console.log("ADZUNA_API_ID:", ADZUNA_API_ID);
console.log("ADZUNA_API_KEY:", ADZUNA_API_KEY);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

// Proxy endpoint
app.get("/api/jobs/:country/search/:page", async (req, res) => {
  const { country, page } = req.params;
  const query = new URLSearchParams({
    app_id: ADZUNA_API_ID,
    app_key: ADZUNA_API_KEY,
    results_per_page: 20,
    sort_by: "relevance",
    what: req.query.what || "software", // from frontend
  });

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${query.toString()}`;

  console.log("URLLLLLL", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
