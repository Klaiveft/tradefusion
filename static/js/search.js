const searchBox = document.getElementById("searchBox");
const suggestionsDiv = document.getElementById("suggestions");
const companyCard = document.getElementById("companyCard");

let timeout = null;

searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim();
  if (!query) {
    suggestionsDiv.innerHTML = "";
    return;
  }

  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `/stocks/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      suggestionsDiv.innerHTML = "";

      if (!data.results?.length) {
        suggestionsDiv.innerHTML =
          "<div class='suggestion'>No results found.</div>";
        return;
      }
      data.results.forEach((r) => {
        const div = document.createElement("div");
        div.className = "suggestion";
        div.textContent = `${r.symbol} — ${r.name}`;
        div.onclick = () => selectCompany(r.symbol);
        suggestionsDiv.appendChild(div);
      });
    } catch (err) {
      console.error("Error:", err);
    }
  }, 400);
});

async function selectCompany(symbol) {
  searchBox.value = symbol;
  suggestionsDiv.innerHTML = "";
  companyCard.innerHTML = `<div class='card'>Loading ${symbol}...</div>`;
  console.log("Fetching profile for", symbol);

  const [summaryResult, profileResult] = await Promise.allSettled([
    fetch(`/stocks/${symbol}`),
    fetch(`/stocks/profile/${symbol}`),
  ]);

  const summary =
    summaryResult.status === "fulfilled"
      ? await summaryResult.value.json()
      : { error: "Stock summary failed" };

  const profile =
    profileResult.status === "fulfilled"
      ? await profileResult.value.json()
      : { error: "Profile fetch failed" };

  if (summary.error && profile.error) {
    companyCard.innerHTML = `<div class='card'>Error fetching data.</div>`;
    return;
  }

  companyCard.innerHTML = `
  <div class="bg-[#0f172a] rounded-2xl border border-gray-800 shadow-lg overflow-hidden transition hover:shadow-blue-600/20 hover:-translate-y-1 duration-300">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 border-b border-gray-700">
      <img src="${profile.logo}" alt="Logo"
           class="w-24 h-24 rounded-2xl bg-white/90 p-3 shadow-lg shadow-black/30" />
      <div>
        <h2 class="text-3xl font-bold text-white tracking-tight">${
          profile.name
        }</h2>
        <p class="text-blue-400 text-sm font-medium mt-1">${symbol}</p>
        <div class="grid grid-cols-2 sm:grid-cols-2 gap-x-8 gap-y-1 mt-3 text-sm text-gray-300 leading-relaxed">
          <p>🏭 <span class="font-semibold text-gray-100">Industry:</span> ${
            profile.industry || "N/A"
          }</p>
          <p>💹 <span class="font-semibold text-gray-100">Exchange:</span> ${
            profile.exchange || "N/A"
          }</p>
          <p>💰 <span class="font-semibold text-gray-100">Market Cap:</span> $${
            profile.marketCap?.toLocaleString() || "N/A"
          } ${profile.currency || ""}</p>
          <p>📅 <span class="font-semibold text-gray-100">IPO:</span> ${
            profile.ipo || "N/A"
          }</p>
        </div>
        <a href="${profile.website}" target="_blank"
           class="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium">
          🌐 Visit Website
        </a>
      </div>
    </div>

    <!-- Summary -->
    <div class="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm border-b border-gray-800">
      <div>
        <p class="text-gray-400 font-medium">Latest Close</p>
        <p class="text-xl font-semibold text-white">$${summary.close}</p>
      </div>
      <div>
        <p class="text-gray-400 font-medium">Change</p>
        <p class="text-lg font-semibold ${
          summary.change >= 0 ? "text-green-400" : "text-red-400"
        }">
          ${summary.change >= 0 ? "▲" : "▼"} ${summary.change} (${
    summary.change_percent
  }%)
        </p>
      </div>
      <div>
        <p class="text-gray-400 font-medium">Volume</p>
        <p class="text-white">${summary.volume.toLocaleString()}</p>
      </div>
      <div>
        <p class="text-gray-400 font-medium">Date</p>
        <p class="text-white">${summary.date}</p>
      </div>
    </div>

    <!-- Sparkline Chart -->
    <div class="p-4 bg-[#0b1320]">
      <div id="sparkline"></div>
    </div>
  </div>
`;

  const sparkline = new ApexCharts(document.querySelector("#sparkline"), {
    chart: {
      type: "line",
      height: 100,
      sparkline: { enabled: true },
      animations: { enabled: true },
    },
    series: [
      {
        data: summary.history || [
          summary.close - 2,
          summary.close - 1,
          summary.close,
        ],
      },
    ],
    stroke: { width: 3, curve: "smooth" },
    colors: [summary.change >= 0 ? "#22c55e" : "#ef4444"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    tooltip: { enabled: false },
  });
  sparkline.render();
}
