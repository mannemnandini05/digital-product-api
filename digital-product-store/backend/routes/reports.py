from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Order, OrderItem, Product, User

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/revenue")
def total_revenue(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    revenue = (
        db.query(func.sum(Order.total_amount))
        .filter(Order.status == "PAID")
        .scalar()
    ) or 0

    return {
        "total_revenue": float(revenue)
    }


@router.get("/most-purchased-products")
def most_purchased_products(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    results = (
        db.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label("total_quantity")
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status == "PAID")
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .all()
    )

    return [
        {
            "product_id": product_id,
            "product_name": name,
            "total_quantity": int(total_quantity)
        }
        for product_id, name, total_quantity in results
    ]


@router.get("/user-order-history")
def user_order_history(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    results = (
        db.query(
            User.id,
            User.name,
            User.email,
            func.count(Order.id).label("order_count")
        )
        .join(Order, User.id == Order.user_id)
        .group_by(User.id, User.name, User.email)
        .all()
    )

    return [
        {
            "user_id": user_id,
            "name": name,
            "email": email,
            "order_count": int(order_count)
        }
        for user_id, name, email, order_count in results
    ]