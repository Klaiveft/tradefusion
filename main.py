from dotenv import load_dotenv
import os

load_dotenv()
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from routers import stocks, crypto, news
from fastapi.middleware.cors import CORSMiddleware


ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

app = FastAPI(
    title="TradeFusion API",
    description="Fusion de données financières (stocks, crypto, news)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(crypto.router, prefix="/crypto", tags=["Crypto"])
app.include_router(news.router, prefix="/news", tags=["News"])

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.mount("/", StaticFiles(directory="static", html=True), name="static")
