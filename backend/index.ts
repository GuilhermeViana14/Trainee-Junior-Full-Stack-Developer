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

        res.json({message: "Amazon page fetched successfully!"})
    }catch (error){
        console.error("Error fetching Amazon page:", error);
        res.status(500).json({error: "Failed to fetch Amazon page"});
    }
})