# Trainee-Junior-Full-Stack-Developer
This repository refers to an activity carried out for a trainee position at Carvalho Aleixo Inc.

Amazon Product Scraper
A simple full stack application to scrape Amazon product listings from the first page of search results for a given keyword.
Amazon Product Scraper
A simple full stack application to scrape Amazon product listings from the first page of search results for a given keyword.


Technologies Used
Backend: Bun, Express, Axios, JSDOM
Frontend: Vite, HTML, CSS, Vanilla JavaScript

Features
Search for products on Amazon by keyword
Displays product title, rating, number of reviews, and image
Handles errors and shows mock data if scraping fails
User-friendly and responsive interface
How to Run
1. Clone the repository
git clone https://github.com/GuilhermeViana14/Trainee-Junior-Full-Stack-Developer.git



## Install Bun

To install Bun, follow the official guide:
```bash
# On Windows (PowerShell)
iwr https://bun.sh/install.ps1 -UseBasicParsing | iex
# On Linux/macOS
curl -fsSL https://bun.sh/install | bash
```
See [Bun installation guide](https://bun.sh/docs/installation) for more details.

## Install Vite (Frontend)

Vite is already included in this project. If you want to create a new Vite project, use:
```bash
npm create vite@latest
```
Or, to install Vite globally:
```bash
npm install -g create-vite
```

For this project, just run the frontend setup commands below.

## How to Run

### Backend Setup
```bash
cd backend
bun install
bun index.ts
```
The backend will run on http://localhost:3001.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on http://localhost:5173 (or the port shown in your terminal).


Usage
Open the frontend in your browser.
Enter a search keyword and click "Search".
Results will be displayed below.


Amazon Scraping Limitations
Amazon blocks scraping attempts: The backend tries to fetch real data from Amazon, but requests may be blocked or limited by Amazon’s anti-bot protections.
Fallback to mock data: If scraping fails, the backend returns mock product data so the frontend always works.
No guarantee of real results: Sometimes you may see real products, but often you will see mock data. This is expected due to Amazon’s restrictions.
Searches for random or numeric keywords: If you search for random strings or numbers, the backend will return an empty result to simulate “no products found.”


Error Handling
The frontend displays clear messages for empty searches, no results, and network errors.
The backend always returns a valid JSON response.
License
MIT
