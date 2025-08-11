// Backend principal do scraper Amazon
import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const PORT = process.env.PORT || 3001;

// Endpoint principal de scraping
app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword é obrigatória." });
  }

  try {
    // Monta a URL de busca da Amazon
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    // User-Agent para evitar bloqueio
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

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const products: any[] = [];

    // Seleciona os cards de produto
    document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']").forEach(item => {
      const title = item.querySelector("h2 span")?.textContent?.trim() || "";
      const rating = item.querySelector("span.a-icon-alt")?.textContent?.split(" ")[0] || "";
      const reviews = item.querySelector("span.a-size-base")?.textContent?.replace(/[^\d]/g,"") || "";
      const image = item.querySelector("img.s-image")?.getAttribute("src") || "";
      if (title) {
        products.push({ title, rating, reviews, image });
      }
    });

    res.json({ products });
  } catch (error: any) {
    // Fallback: retorna dados simulados se o scraping falhar
    const mockProducts = [
      {
        title: "Caneca de Porcelana Branca",
        rating: "4.7",
        reviews: "1523",
        image: "https://images-na.ssl-images-amazon.com/images/I/61v5ZpF1pZL._AC_SX679_.jpg"
      },
      {
        title: "Caneca Personalizada Geek",
        rating: "4.5",
        reviews: "987",
        image: "https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L._AC_SX679_.jpg"
      },
      {
        title: "Caneca Térmica Inox",
        rating: "4.8",
        reviews: "204",
        image: "https://images-na.ssl-images-amazon.com/images/I/71v6z1QKpRL._AC_SX679_.jpg"
      }
    ];
    res.json({ products: mockProducts, mock: true, error: "Dados simulados devido a falha no scraping." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
