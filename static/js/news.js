const newsContainer = document.getElementById("newsContainer");
const stockBtn = document.getElementById("stockNewsBtn");
const cryptoBtn = document.getElementById("cryptoNewsBtn");
const cryptoCards = document.getElementById("cryptoCards");

// Load initial stock news
loadNews("stocks");
loadCryptoSummary();

stockBtn.addEventListener("click", () => {
  stockBtn.classList.replace("bg-gray-700", "bg-blue-600");
  cryptoBtn.classList.replace("bg-blue-600", "bg-gray-700");
  loadNews("stocks");
});

cryptoBtn.addEventListener("click", () => {
  cryptoBtn.classList.replace("bg-gray-700", "bg-blue-600");
  stockBtn.classList.replace("bg-blue-600", "bg-gray-700");
  loadNews("crypto");
});

async function loadNews(type = "stocks") {
  try {
    const res = await fetch(`/news/${type}`);
    const data = await res.json();
    newsContainer.innerHTML = "";

    if (!data.articles?.length) {
      newsContainer.innerHTML = "<p class='text-gray-400'>No news found.</p>";
      return;
    }

    data.articles.forEach((article) => {
      const div = document.createElement("div");
      div.className =
        "bg-gray-800 p-3 rounded shadow hover:bg-gray-700 transition";
      div.innerHTML = `
        <a href="${
          article.url
        }" target="_blank" class="text-lg font-semibold hover:text-blue-400">${
        article.title
      }</a>
        <p class="text-gray-400 text-sm">${article.source}</p>
        <p class="text-gray-300 text-xs mt-1">${new Date(
          article.publishedAt
        ).toLocaleString()}</p>
      `;
      newsContainer.appendChild(div);
    });
  } catch (err) {
    newsContainer.innerHTML =
      "<p class='text-gray-400'>Error loading news.</p>";
  }
}

async function loadCryptoSummary() {
  const res = await fetch("/crypto/summary");
  const data = await res.json();
  cryptoCards.innerHTML = "";

  Object.entries(data).forEach(([id, c]) => {
    const change = c.usd_24h_change?.toFixed(2) ?? 0;
    const isUp = change >= 0;

    const card = document.createElement("div");
    card.className =
      "bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col";
    card.innerHTML = `
      <div class="flex justify-between mb-2">
        <span class="font-semibold capitalize">${id}</span>
        <span class="${isUp ? "text-green-400" : "text-red-400"}">${
      isUp ? "▲" : "▼"
    } ${Math.abs(change)}%</span>
      </div>
      <p>💲 ${c.usd.toLocaleString()}</p>
      <p class="text-gray-400 text-xs">Mkt Cap: $${(
        c.usd_market_cap / 1e9
      ).toFixed(2)}B</p>
    `;
    cryptoCards.appendChild(card);
  });
}
