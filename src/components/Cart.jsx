import React from "react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { summary, setQty, removeFromCart, clearCart } = useCart();
  const { items, subtotal, totalItems } = summary;

  const checkout = async () => {
    // Prepare items payload for server
    const payload = items.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      unit_amount: Math.round(Number(product.price || 0) * 100), // cents
      quantity: qty,
      image: product.img || null,
    }));

    try {
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const data = await res.json();

      // If server returns a full url, redirect directly
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Otherwise attempt to use Stripe.js to redirect with sessionId
      const sessionId = data.sessionId || data.id;
      if (!sessionId) throw new Error('No session id returned');

      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) throw new Error('Missing publishable key (VITE_STRIPE_PUBLISHABLE_KEY)');

      // Load Stripe.js if needed
      if (!window.Stripe) {
        const stripeJs = document.createElement('script');
        stripeJs.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(stripeJs);
        await new Promise((resolve) => { stripeJs.onload = resolve; });
      }

      const stripe = window.Stripe(publishableKey);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (err) {
      // fallback to mailto if Stripe fails
      console.error('Checkout error', err);
      const lines = items.map(it => `${it.qty} x ${it.product.name} — $${(it.product.price * it.qty).toFixed(2)}`);
      const body = `Order:\n\n${lines.join("\n")}\n\nTotal: $${subtotal.toFixed(2)}`;
      window.location.href = `mailto:orders@yourclub.org?subject=Zonta%20Store%20Order&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <aside className="cart-aside">
      <h3 style={{ marginTop: 0 }}>Cart ({totalItems})</h3>
      {items.length === 0 ? (
        <p style={{ color: "#666" }}>Your cart is empty.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(({ product, qty }) => (
            <div key={product.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img src={product.img} alt={product.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 14 }}>{product.name}</div>
                  <div style={{ fontWeight: 600 }}>${(product.price * qty).toFixed(2)}</div>
                </div>
                <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={() => setQty(product.id, qty - 1)} style={{ width: 28 }}>−</button>
                  <div>{qty}</div>
                  <button onClick={() => setQty(product.id, qty + 1)} style={{ width: 28 }}>+</button>
                  <button onClick={() => removeFromCart(product.id)} style={{ marginLeft: "auto", color: "#a00", background: "transparent", border: "none" }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #eee", paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>Subtotal</div>
              <div style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</div>
            </div>
            <div style>
              <button onClick={checkout}  style={{ flex: 1, background: "#0077cc", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 6 }}>Checkout </button>

            </div>
           
            </div>
          </div>
      )}
    </aside>
  );
}
