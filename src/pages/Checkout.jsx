import React from "react";
import "../styles/App.css";

export default function Checkout() {
  return (
    <div id="checkout">
      <section className="product">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
          alt="The cover of Stubborn Attachments"
          style={{ maxWidth: 240 }}
        />
        <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </section>

     
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
