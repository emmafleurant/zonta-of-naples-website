import React, { useEffect, useState } from "react";
import fallbackProducts from "../data/products";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";
import { CartProvider } from "../context/CartContext";

export default function Store() {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:1337";
    const url = `${apiBase}/api/products?populate=image`;

    let mounted = true;
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (!json.data) throw new Error("Unexpected API response");

        const mapped = json.data.map((item) => {
          const attrs = item.attributes || {};
          const imgData = attrs.image?.data;
          let imageUrl = null;
          if (imgData) {
            const rel = imgData.attributes?.url;
            imageUrl = rel?.startsWith("http") ? rel : `${apiBase}${rel}`;
          }

          return {
            id: item.id,
            name: attrs.name || "Untitled",
            price: Number(attrs.price) || 0,
            img: imageUrl || "/placeholder.png",
            desc: attrs.description || "",
          };
        });

        setProducts(mapped);
        setError(null);
      })
      .catch((err) => {
        console.warn("Could not fetch products from Strapi, using fallback:", err);
        if (mounted) setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CartProvider>
      <div className="container site-row">
        <main className="site-main">
          <h1>Store</h1>
          <p>Support the Zonta Club of Naples by purchasing official merchandise.</p>


          <section aria-label="product-grid" className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        </main>

        <Cart />
      </div>
    </CartProvider>
  );
}
