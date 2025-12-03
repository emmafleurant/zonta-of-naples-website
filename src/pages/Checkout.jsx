import React from "react";
import "../styles/App.css";

export default function Checkout() {
  return (
    <div id="checkout">
      <section className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
          style={{ maxWidth: 240 }}
        />
        <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </section>

      {/*
        Simple form that posts to the local server endpoint which creates a
        Stripe Checkout Session. By default this posts to http://localhost:4242
        — change if your server runs on another host/port.
      */}
      <form action="/create-checkout-session" method="POST">
        <button type="submit">Checkout</button>
      </form>
      <p style={{ marginTop: 12, fontSize: 13 }}>
        Use Stripe test cards in the Checkout page. The server must have
        `STRIPE_SECRET_KEY` and `PRICE_ID` set in `server/.env`.
      </p>
    </div>
  );
}
