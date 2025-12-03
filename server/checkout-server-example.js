// Load secret keys from environment variables instead of hard-coding them.
require('dotenv').config();
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY in environment. Set it in a .env file or your environment.');
  process.exit(1);
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
app.use(express.static('public'));

// The frontend URL where Stripe should redirect after checkout.
// Set FRONTEND_URL in `server/.env` to your dev frontend (e.g. http://localhost:5173)
const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Use the PRICE_ID from environment (set in server/.env)
          price: process.env.PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(4242, () => console.log('Running on port 4242'));