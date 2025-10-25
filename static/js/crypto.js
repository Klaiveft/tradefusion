const cryptoCardsContainer = document.getElementById("cryptoCardsContainer");

async function loadCryptoSummary() {
  try {
    const res = await fetch("/crypto/summary");
    const data = await res.json();
    cryptoCardsContainer.innerHTML = "";

    Object.entries(data).forEach(([id, c]) => {
      const change = c.usd_24h_change?.toFixed(2) ?? 0;
      const domain = c.website
        ? new URL(c.website).hostname.replace("www.", "")
        : null;
      const isUp = change >= 0;

      const card = document.createElement("a");
      card.href = c.website || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.style.animation = "fadeSlide 0.4s ease forwards";
      card.className =
        "group relative bg-gradient-to-br from-[#0b1320] via-[#111827] to-[#1e293b] border border-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-transform duration-300";

      card.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <img src="${data[id].icon}
                 alt="${id}"
                 onerror="this.src='https://cdn-icons-png.flaticon.com/512/616/616408.png'"
                 class="w-8 h-8 rounded-full bg-white/10 p-1 shadow-inner">
            <h3 class="text-lg font-semibold text-gray-100 uppercase tracking-wide">${id}</h3>
          </div>
          <span class="${
            isUp ? "text-green-400" : "text-red-400"
          } font-medium text-sm">
            ${isUp ? "▲" : "▼"} ${Math.abs(change)}%
          </span>
        </div>

        <div class="flex items-end justify-between">
          <div>
            <p class="text-2xl font-bold text-white">$${c.usd.toLocaleString()}</p>
            <p class="text-xs text-gray-400 mt-1">Market Cap: $${(
              c.usd_market_cap / 1e9
            ).toFixed(2)}B</p>
            <p class="text-xs text-gray-500 mt-0.5">24h Vol: $${(
              c.usd_24h_vol / 1e9
            ).toFixed(2)}B</p>
          </div>
          <div id="spark-${id}" class="w-15 h-6 mt-2"></div>
        </div>

        <div class="absolute bottom-0 left-0 h-1 w-full bg-gray-700 rounded-b-2xl overflow-hidden">
          <div class="${
            isUp ? "bg-green-500" : "bg-red-500"
          } h-full transition-all duration-700" style="width:${Math.min(
        Math.abs(change),
        20
      )}%"></div>
        </div>
        ${
          domain
            ? `<div class='absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded-lg shadow-lg'>
             🌐 Visit ${domain}
           </div>`
            : ""
        }
      `;
      cryptoCardsContainer.appendChild(card);

      const sparkData = Array.from(
        { length: 10 },
        () => c.usd + (Math.random() - 0.5) * (c.usd * 0.02)
      );

      const chart = new ApexCharts(document.querySelector(`#spark-${id}`), {
        chart: {
          type: "line",
          height: 35,
          sparkline: { enabled: true },
          animations: { enabled: true, easing: "easeinout", speed: 600 },
        },
        series: [{ data: sparkData }],
        stroke: { width: 1.8, curve: "smooth" },
        fill: {
          type: "gradient",
          gradient: { opacityFrom: 1, opacityTo: 0 },
        },
        grid: { show: false },
        colors: [isUp ? "#22c55e" : "#ef4444"],
        tooltip: { enabled: false },
      });
      chart.render();
    });
  } catch (err) {
    cryptoCardsContainer.innerHTML =
      "<p class='text-gray-400'>⚠️ Error loading crypto data.</p>";
  }
}

loadCryptoSummary();
