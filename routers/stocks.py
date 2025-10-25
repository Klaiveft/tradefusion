from fastapi import APIRouter, Query
from services.alpha_vantage import get_stock_summary, search_stocks_alpha_vantage
from services.finnhub import get_company_profile
import logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/search")
def search_stocks(query: str = Query(..., description="Nom ou symbole de l’entreprise")):
    results = search_stocks_alpha_vantage(query)
    return {"results": results}

@router.get("/profile/{symbol}")
def company_profile(symbol: str):
    print("Fetching profile for:", symbol)
    profile = get_company_profile(symbol)
    return profile

@router.get("/{symbol}")
def get_stock(symbol: str):
    data = get_stock_summary(symbol)
    return data
