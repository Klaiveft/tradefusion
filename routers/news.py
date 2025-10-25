from fastapi import APIRouter, Query
from services.newsapi import get_financial_news

router = APIRouter()

@router.get("/stocks")
def get_stock_news():
    """Return recent news about stocks."""
    return get_financial_news(query="stock market")

@router.get("/crypto")
def get_crypto_news():
    """Return recent news about cryptocurrencies."""
    return get_financial_news(query="cryptocurrency OR bitcoin OR ethereum")