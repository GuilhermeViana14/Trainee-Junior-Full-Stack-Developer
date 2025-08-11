import { JSDOM } from 'jsdom';
import  axios  from 'axios';
import express from 'express';

const app = express()
const PORT = ProcessingInstruction.env.PORT || 3001


app.get("/", (req, res) =>{
    res.send("Amazon Scraper Backend is WORKING")
})

app.get("/api/scrape", async (req, res) =>{
    const keyword = req.query.keyword as string
    if(!keyword){
        return res.status(400).json({error: "Keyword is required"})
    }

    //searching for amazon page with axios
    try{
        const url =`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        const response = await axios.get(url,{
            headers:{
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
        
    document.querySelectorAll("div.s-result-item[data-component-type='s-search-result']").forEach(item => {
      const title = item.querySelector("h2 span")?.textContent?.trim() || "";
      const rating = item.querySelector("span.a-icon-alt")?.textContent?.split(" ")[0] || "";
      const reviews = item.querySelector("span.a-size-base")?.textContent?.replace(/[^\d]/g, "") || "";
      const image = item.querySelector("img.s-image")?.getAttribute("src") || "";
      if (title) {
        products.push({ title, rating, reviews, image });
      }
    });

    res.json({ products });
  } catch (error: any) {
    const mockProducts = [
      {
        title: "Mock Product 1",
        rating: "4.7",
        reviews: "1523",
        image: "https://via.placeholder.com/80"
    },
    {
        title: "Mock Product 2",
        rating: "4.5",
        reviews: "987",
        image: "https://via.placeholder.com/80"
    }
    ];
    res.json({ products: mockProducts, mock: true, error: "Mock data due to scraping failure." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});