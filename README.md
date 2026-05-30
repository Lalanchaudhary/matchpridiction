# Match Predictor Pro

Lightweight, responsive static Match Prediction Website.

How to use
- Open `index.html` in a browser.
- `predictions.html` shows upcoming matches with filtering.
- `premium.html` simulates subscription (mock payment) and unlocks premium predictions via `localStorage`.

Notes
- The payment form is a placeholder. Integrate Stripe/PayPal in `app.js` via `integratePayment()`.
- To reset premium flag run `localStorage.removeItem('isPremium')` in the browser console.
