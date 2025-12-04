import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img className="media" src={product.img} alt={product.name} />
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{product.name}</h3>
          <strong>${product.price.toFixed(2)}</strong>
        </div>
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{product.desc}</p>
        <div className="card-actions">
          <button
            onClick={() => addToCart(product, 1)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 6,
              border: "none",
              background: "#000",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add to cart
          </button>
          <button
            onClick={() => window.open(product.img, "_blank")}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer", 
              color: "#000",
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
