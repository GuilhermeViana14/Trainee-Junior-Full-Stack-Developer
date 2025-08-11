// Main logic for Amazon Scraper frontend
// Handles search input, button click, AJAX call, and result rendering

const searchBtn = document.getElementById('searchBtn'); // Search button element
const keywordInput = document.getElementById('keyword'); // Input field for keyword
const resultsDiv = document.getElementById('results');   // Div to display results

// Add click event listener to the search button
searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim(); // Get the keyword from input
  if (!keyword) {
    // Show message if keyword is empty
    resultsDiv.innerHTML = '<p>Please enter a keyword to search.</p>';
    return;
  }
  // Show loading message
  resultsDiv.innerHTML = '<p>Loading...</p>';
  try {
    // Make AJAX request to backend API
    const res = await fetch(`http://localhost:3001/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    // Check if products exist in response
    if (!data.products || data.products.length === 0) {
      resultsDiv.innerHTML = '<p>No products found.</p>';
      return;
    }
    // Render product cards
    resultsDiv.innerHTML = data.products.map(prod => `
      <div class="product">
        <img src="${prod.image}" alt="${prod.title}">
        <div class="product-info">
          <div class="product-title">${prod.title}</div>
          <div class="product-rating">${prod.rating} ⭐</div>
          <div class="product-reviews">${prod.reviews} reviews</div>
        </div>
      </div>
    `).join('');
    // Show mock data info if present
    if (data.mock) {
      resultsDiv.innerHTML += '<p style="color:#888;font-size:0.9em;">(Mock data)</p>';
    }
  } catch (err) {
    // Show error message if request fails
    resultsDiv.innerHTML = '<p>Error fetching products. Please try again.</p>';
  }
});
