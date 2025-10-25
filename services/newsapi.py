import requests
import os
from datetime import datetime, timedelta

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def get_financial_news(query: str = "stock market", language: str = "en"):
    url = "https://newsapi.org/v2/everything"
    date_from = (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")

    params = {
        "q": query,
        "from": date_from,
        "language": language,
        "sortBy": "publishedAt",
        "apiKey": NEWS_API_KEY,
        "pageSize": 5,
    }

    response = requests.get(url, params=params)
    data = response.json()


    if data.get("status") != "ok":
        return {"error": data.get("message", "Failed to fetch news")}

    articles = data.get("articles", [])
    formatted_articles = [
        {
            "title": a["title"],
            "source": a["source"]["name"],
            "url": a["url"],
            "publishedAt": a["publishedAt"],
            "description": a["description"]
        }
        for a in articles
    ]

    return {"query": query, "count": len(formatted_articles), "articles": formatted_articles}
