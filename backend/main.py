from fastapi import FastAPI
from routes.auth import router as auth_router
from database import Base, engine
from routes.products import router as product_router
from routes.cart import router as cart_router
from routes.orders import router as order_router
from routes.payments import router as payment_router
from routes.reports import router as report_router
from routes.admin import router as admin_router
from routes.reports import router as report_router
import models
from routes.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Product Store API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(report_router)
app.include_router(payment_router)
app.include_router(report_router)
app.include_router(admin_router)
app.include_router(admin_router)
@app.get("/")
def home():
    return {"message": "Digital Product Store API is running"}