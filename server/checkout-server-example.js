// server/checkout-server-example.js
require('dotenv').config();
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in environment. Set it in a .env file or your environment.');
  process.exit(1);
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// Endpoint to fetch products from Stripe
app.get('/products', async (req, res) => {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
      limit: 100,
    });

    const formattedProducts = products.data.map((product) => {
      const price = product.default_price;
      const priceAmount = price && typeof price === 'object' 
        ? (price.unit_amount / 100) 
        : 0;

      return {
        id: product.id,
        name: product.name,
        price: priceAmount,
        img: product.images && product.images.length > 0 ? product.images[0] : null,
        desc: product.description || '',
        priceId: price && typeof price === 'object' ? price.id : null,
      };
    });

    res.json({ products: formattedProducts });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    // If no items sent, allow single-price flow via PRICE_ID
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      const priceId = process.env.PRICE_ID || req.body.price;
      if (!priceId) {
        return res.status(400).json({ error: 'No items or price provided' });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });

      return res.json({ url: session.url, id: session.id });
    }

    const items = req.body.items;

    // Build line_items for Stripe and validate
    const line_items = items.map((it) => {
      const unitAmount = Number(it.unit_amount);
      const qty = Number(it.quantity) || 1;
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw { status: 400, message: 'Invalid unit_amount for item', item: it };
      }
      return {
        price_data: {
          currency: it.currency || 'usd',
          product_data: {
            name: it.name || 'Item',
            ...(it.image ? { images: [it.image] } : {}),
          },
          unit_amount: Math.round(unitAmount),
        },
        quantity: qty,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    const status = err && err.status ? err.status : 500;
    const stripeInfo = err && err.raw && err.raw.message ? {
      stripe_message: err.raw.message,
      stripe_type: err.type,
      stripe_code: err.code,
      requestId: err.requestId,
    } : {};

    const validation = err && err.item ? { validation_item: err.item } : {};

    res.status(status).json({
      error: err && err.message ? err.message : 'Internal Server Error',
      ...stripeInfo,
      ...validation,
    });
  }
});

app.listen(4242, () => console.log('Checkout server running on port 4242'));