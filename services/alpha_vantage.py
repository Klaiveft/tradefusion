import requests
import logging
import random
import os
from datetime import datetime, timedelta

BASE_URL = "https://www.alphavantage.co/query"

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

logger = logging.getLogger("uvicorn.error")

def get_stock_summary(symbol: str):
    """Get a mock or real stock summary depending on API availability."""
    try:
        url = f"{BASE_URL}"
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        if "Information" in data or "Error Message" in data:
            logger.warning("API limit reached or error detected — using mock data. pd")
            return generate_mock_stock(symbol)

        time_series = data.get("Time Series (Daily)", {})
        dates = sorted(time_series.keys(), reverse=True)

        if len(dates) < 2:
            return {"error": "Not enough data"}

        latest, previous = dates[0], dates[1]
        latest_data = time_series[latest]
        prev_data = time_series[previous]

        close_price = float(latest_data["4. close"])
        prev_close = float(prev_data["4. close"])
        change = close_price - prev_close
        change_percent = (change / prev_close) * 100

        return {
            "symbol": symbol,
            "date": latest,
            "close": round(close_price, 2),
            "change": round(change, 2),
            "change_percent": round(change_percent, 2),
            "volume": int(latest_data["5. volume"]),
        }

    except Exception as e:
        logger.error(f"Error fetching stock data: {e}")
        return generate_mock_stock(symbol)


def search_stocks_alpha_vantage(query: str):
    """Mock search if rate-limited."""
    try:
        params = {
            "function": "SYMBOL_SEARCH",
            "keywords": query,
            "apikey": ALPHA_VANTAGE_API_KEY
        }

        response = requests.get(BASE_URL, params=params)
        data = response.json()

        if "Information" in data or "Error Message" in data:
            logger.warning("Using mock search data. search")
            return generate_mock_search(query)

        matches = data.get("bestMatches", [])
        return [
            {
                "symbol": m.get("1. symbol"),
                "name": m.get("2. name"),
                "region": m.get("4. region"),
            }
            for m in matches
        ]
    except Exception:
        return generate_mock_search(query)


# === Mock Helpers ===

def generate_mock_stock(symbol: str):
    """Generate fake stock data for testing."""
    price = round(random.uniform(100, 300), 2)
    change = round(random.uniform(-5, 5), 2)
    percent = round((change / price) * 100, 2)
    volume = random.randint(1000000, 5000000)
    date = datetime.now().strftime("%Y-%m-%d")

    return {
        "symbol": symbol,
        "date": date,
        "close": price,
        "change": change,
        "change_percent": percent,
        "volume": volume,
    }


def generate_mock_search(query: str):
    """Generate fake search results."""
    mock_companies = [
        {"symbol": "AAPL", "name": "Apple Inc.", "region": "United States"},
        {"symbol": "MSFT", "name": "Microsoft Corporation", "region": "United States"},
        {"symbol": "TSLA", "name": "Tesla Inc.", "region": "United States"},
        {"symbol": "GOOG", "name": "Alphabet Inc.", "region": "United States"},
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "region": "United States"},
    ]

    return [
        c for c in mock_companies if query.lower() in c["name"].lower() or query.lower() in c["symbol"].lower()
    ]
