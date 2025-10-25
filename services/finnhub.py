import requests
import os
import logging

BASE_URL = "https://finnhub.io/api/v1"

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")

logger = logging.getLogger(__name__)

def get_company_profile(symbol: str):
    """Fetch company profile info including logo, market cap, etc."""
    url = f"{BASE_URL}/stock/profile2"
    params = {"symbol": symbol, "token": FINNHUB_API_KEY}

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if not data or "error" in data:
            return {"error": f"No data found for {symbol}"}

        return {
            "name": data.get("name"),
            "symbol": data.get("ticker"),
            "industry": data.get("finnhubIndustry"),
            "exchange": data.get("exchange"),
            "marketCap": data.get("marketCapitalization"),
            "currency": data.get("currency"),
            "ipo": data.get("ipo"),
            "logo": data.get("logo"),
            "website": data.get("weburl"),
            "country": data.get("country"),
        }
    except Exception as e:
        logger.error(f"Error fetching profile for {symbol}: {e}")
        return {"error": "Internal server error"}