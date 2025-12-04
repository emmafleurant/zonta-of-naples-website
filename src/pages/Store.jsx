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
    // Try to fetch from Stripe first, then fall back to Strapi, then local fallback
    const checkoutServerUrl = import.meta.env.VITE_CHECKOUT_SERVER_URL || 'http://localhost:4242';
    const strapiUrl = import.meta.env.VITE_API_URL;

    let mounted = true;
    setLoading(true);

    // First attempt: Fetch from Stripe via checkout server
    fetch(`${checkoutServerUrl}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Stripe fetch error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (json.products && Array.isArray(json.products)) {
          setProducts(json.products);
          setError(null);
          setLoading(false);
          return;
        }
        throw new Error('Invalid response from Stripe');
      })
      .catch((stripeErr) => {
        console.warn('Could not fetch from Stripe, trying Strapi:', stripeErr);
        
        // Second attempt: Try Strapi if configured
        if (!strapiUrl || !mounted) {
          if (mounted) {
            setError('Using local products');
            setLoading(false);
          }
          return;
        }

        fetch(`${strapiUrl}/api/products?populate=image`)
          .then((res) => {
            if (!res.ok) throw new Error(`Strapi fetch error ${res.status}`);
            return res.json();
          })
          .then((json) => {
            if (!mounted) return;
            if (!json.data) throw new Error('Unexpected API response');

            const mapped = json.data.map((item) => {
              const attrs = item.attributes || {};
              const imgData = attrs.image?.data;
              let imageUrl = null;
              if (imgData) {
                const rel = imgData.attributes?.url;
                imageUrl = rel?.startsWith('http') ? rel : `${strapiUrl}${rel}`;
              }

              return {
                id: item.id,
                name: attrs.name || 'Untitled',
                price: Number(attrs.price) || 0,
                img: imageUrl || '/placeholder.png',
                desc: attrs.description || '',
              };
            });

            setProducts(mapped);
            setError(null);
          })
          .catch((strapiErr) => {
            console.warn('Could not fetch from Strapi, using fallback:', strapiErr);
            if (mounted) setError('Using local products');
          })
          .finally(() => mounted && setLoading(false));
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CartProvider>
      <div className="container site-row">
        <main className="site-main">
          <h1>Store</h1>
          <p>Support the Zonta Club of Naples by purchasing official merchandise and making donations. .</p>

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
