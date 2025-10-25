# APIs integrated:

- Alpha Vantage - stock summaries and prices
- Finnhub - company profiles and metadata
- CoinGecko - cryptocurrency prices, icons, and websites
- NewsAPI - financial and crypto-related headlines

### - Environment Variables are loaded securely from a .env file using python-dotenv:
```js
ALPHA_VANTAGE_API_KEY=your_alpha_key
FINNHUB_API_KEY=your_finnhub_key
NEWS_API_KEY=your_news_key
```
### Use of Generative AI Tools

During the development of TradeFusion, I utilized ChatGPT (GPT-5) as a collaborative assistant throughout the design, coding, and optimization phases.
The AI contributed to several key aspects of the project:

Interface design: The AI was used to co-design the modern dark-mode interface using TailwindCSS and to integrate ApexCharts for dynamic sparkline visualizations.

Prompt engineering and documentation: ChatGPT was employed to draft concise technical documentation.

Environment and deployment setup:
It provided secure patterns for managing API keys via .env and python-dotenv, and guidance for local versus cloud deployment using uvicorn.

_The AI’s role was assistive, not generative - all source code was manually verified, integrated, and tested. This collaborative process accelerated development, reduced debugging time, and ensured best practices for performance and security._

### Documentation References & Component	Documentation

FastAPI	https://fastapi.tiangolo.com

Alpha Vantage API	https://www.alphavantage.co/documentation/

Finnhub API	https://finnhub.io/docs/api

CoinGecko API	https://www.coingecko.com/en/api/documentation

NewsAPI	https://newsapi.org/docs


made by Pierre Bourgery