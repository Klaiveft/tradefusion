import requests

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

def get_crypto_data(ids: list[str], vs_currency: str = "usd"):
    """Return prices, market stats, icons, and websites for a list of cryptos."""
    price_url = f"{COINGECKO_BASE}/simple/price"
    params = {
        "ids": ",".join(ids),
        "vs_currencies": vs_currency,
        "include_market_cap": "true",
        "include_24hr_vol": "true",
        "include_24hr_change": "true",
    }
    price_data = requests.get(price_url, params=params).json()

    results = {}
    for crypto_id in ids:
        info = {
            "id": crypto_id,
            **price_data.get(crypto_id, {}),
            "icon": None,
            "website": None,
        }

        try:
            detail_url = f"{COINGECKO_BASE}/coins/{crypto_id}"
            detail_data = requests.get(detail_url).json()
            info["icon"] = detail_data.get("image", {}).get("small")
            homepages = detail_data.get("links", {}).get("homepage", [])
            info["website"] = homepages[0] if homepages else None
        except Exception as e:
            print(f"⚠️ Failed to fetch extra data for {crypto_id}: {e}")

        results[crypto_id] = info
    print(results)
    return results
