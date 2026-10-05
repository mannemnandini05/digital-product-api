from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Order, Product, User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total_products = db.query(Product).count()

    total_orders = db.query(Order).count()

    paid_orders = db.query(Order).filter(
        Order.status == "PAID"
    ).count()

    total_revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == "PAID")
        .scalar()
    ) or 0

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "total_revenue": float(total_revenue)
    }


@router.get("/orders")
def get_all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )