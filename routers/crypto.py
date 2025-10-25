from fastapi import APIRouter, Query
from services.coingecko import get_crypto_data

router = APIRouter()

@router.get("/summary")
def get_crypto_summary():
    ids = ["bitcoin", "ethereum", "solana", "ripple", "cardano"]
    return get_crypto_data(ids)

@router.get("/")
def list_cryptos(ids: str = Query("bitcoin,ethereum", description="Comma-separated crypto ids")):
    id_list = ids.split(",")
    return get_crypto_data(id_list)