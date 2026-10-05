import os

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Cart, CartItem, Order, OrderItem, Payment, User

router = APIRouter(prefix="/payments", tags=["Payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@router.post("/create-checkout-session")
def create_checkout_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    if not cart or not cart.items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total_amount = sum(
        float(item.product.price) * item.quantity
        for item in cart.items
    )

    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="PENDING"
    )

    db.add(order)
    db.flush()

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )
        db.add(order_item)

    payment = Payment(
        order_id=order.id,
        amount=total_amount,
        status="PENDING"
    )

    db.add(payment)
    db.commit()

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": item.product.name
                        },
                        "unit_amount": int(
                            float(item.product.price) * 100
                        )
                    },
                    "quantity": item.quantity
                }
                for item in cart.items
            ],
            mode="payment",
            success_url="http://localhost:5174/orders",
            cancel_url="http://localhost:5174/cart",
            metadata={
                "order_id": str(order.id)
            }
        )

        payment.stripe_session_id = session.id
        db.commit()

        return {
            "checkout_url": session.url
        }

    except stripe.StripeError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Stripe checkout failed"
        )


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    payload = await request.body()

    signature = request.headers.get(
        "stripe-signature"
    )

    webhook_secret = os.getenv(
        "STRIPE_WEBHOOK_SECRET"
    )

    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            webhook_secret
        )

    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(
            status_code=400,
            detail="Invalid Stripe webhook"
        )

    if event["type"] == "checkout.session.completed":

        session = event["data"]["object"]

        order_id = session["metadata"]["order_id"]

        order = db.query(Order).filter(
            Order.id == int(order_id)
        ).first()

        payment = db.query(Payment).filter(
            Payment.order_id == int(order_id)
        ).first()

        if order:
            order.status = "PAID"

        if payment:
            payment.status = "PAID"

        db.commit()

    return {"received": True}