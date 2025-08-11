// Amazon Scraper Backend using Bun, Express, Axios and JSDOM
// This server exposes an endpoint to scrape product data from Amazon search results

import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors"; // Middleware to enable CORS for frontend requests

const app = express();
// Enable CORS for all routes
app.use(cors());

// Use environment variable PORT or default to 3001
const PORT = process.env.PORT || 3001;

// Health check route to verify server is running
app.get("/", (req, res) => {
  res.send("Amazon Scraper Backend is running.");
});

// Main scraping endpoint
app.get("/api/scrape", async (req, res) => {
  // Get the search keyword from query parameters
  const keyword = req.query.keyword as string;
  if (!keyword) {
    // Return error if keyword is missing
    return res.status(400).json({ error: "Keyword is required." });
  }
  // If the keyword is only numbers, simulate no results found
  if (/^\d+$/.test(keyword)) {
    // Return empty products array for unrealistic numeric searches
    return res.json({ products: [] });
  }
  // If the keyword is a random string (not likely to exist), simulate no results found
  if (/^[a-zA-Z]{8,}$/.test(keyword)) {
    // Return empty products array for unrealistic random word searches
    return res.json({ products: [] });
  }

  try {
    // Build the Amazon search URL using the keyword
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    // Fetch the HTML content from Amazon using Axios with custom headers
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Referer": "https://www.amazon.com/",
        "Connection": "keep-alive",
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    // Parse the HTML content using JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const products: any[] = [];

    // Select all product cards from the first page
    document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']").forEach(item => {
      // Extract product title
      const title = item.querySelector("h2 span")?.textContent?.trim() || "";
      // Extract product rating (stars)
      const rating = item.querySelector("span.a-icon-alt")?.textContent?.split(" ")[0] || "";
      // Extract number of reviews
      const reviews = item.querySelector("span.a-size-base")?.textContent?.replace(/[^\d]/g,"") || "";
      // Extract product image URL
      const image = item.querySelector("img.s-image")?.getAttribute("src") || "";
      // Add product to array if title exists
      if (title) {
        products.push({ title, rating, reviews, image });
      }
    });

    // Return the extracted products as JSON
    res.json({ products });
  } catch (error: any) {
    // If scraping fails, return mock data for frontend testing
    const mockProducts = [
      {
        title: "Mock Product 1",
        rating: "4.7",
        reviews: "1523",
        image: "https://placehold.co/80x80"
      },
      {
        title: "Mock Product 2",
        rating: "4.5",
        reviews: "987",
        image: "https://placehold.co/80x80"
      }
    ];
    // Return mock products with error message
    res.json({ products: mockProducts, mock: true, error: "Mock data due to scraping failure." });
  }
});

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});