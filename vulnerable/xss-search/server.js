const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = 5175;
const FLAG = 'FLAG{tm-41-reflected-xss}';

const BASE = '/labs/tm-41';

app.use(cors({ origin: '*' }));

const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones',   price: '$49.99',  category: 'Electronics' },
  { id: 2, name: 'Running Shoes',          price: '$89.99',  category: 'Footwear'    },
  { id: 3, name: 'Coffee Maker',           price: '$34.99',  category: 'Kitchen'     },
  { id: 4, name: 'Yoga Mat',               price: '$24.99',  category: 'Sports'      },
  { id: 5, name: 'Bluetooth Speaker',      price: '$59.99',  category: 'Electronics' },
  { id: 6, name: 'Stainless Water Bottle', price: '$19.99',  category: 'Sports'      },
];

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  background: #0f1117;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #e2e8f0;
}
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,.06) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.shell { max-width: 860px; margin: 0 auto; padding: 32px 24px 64px; position: relative; z-index: 1; }
.site-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #2d3148;
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.brand-name { font-size: 17px; font-weight: 700; color: #f1f5f9; }
.brand-sub  { font-size: 11px; color: #64748b; letter-spacing: .5px; text-transform: uppercase; }
.lab-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3);
  color: #f87171; font-size: 11px; font-weight: 600;
  padding: 4px 10px; border-radius: 20px; letter-spacing: .4px; text-transform: uppercase;
}
h1 { font-size: 26px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
.lead { font-size: 14px; color: #64748b; margin-bottom: 28px; }
.search-form { display: flex; gap: 10px; margin-bottom: 24px; }
.search-input {
  flex: 1; background: #1a1d27; border: 1px solid #2d3148;
  border-radius: 8px; padding: 11px 14px; font-size: 14px; color: #e2e8f0;
  outline: none; transition: border-color .2s;
}
.search-input:focus { border-color: #6366f1; }
.search-input::placeholder { color: #475569; }
.btn {
  padding: 11px 22px; background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; border-radius: 8px; color: #fff; font-size: 14px;
  font-weight: 600; cursor: pointer; transition: opacity .2s; white-space: nowrap;
}
.btn:hover { opacity: .88; }
.results-label { font-size: 13px; color: #64748b; margin-bottom: 14px; }
.results-label strong { color: #a5b4fc; }
.results-table {
  width: 100%; border-collapse: collapse; background: #1a1d27;
  border: 1px solid #2d3148; border-radius: 10px; overflow: hidden;
}
.results-table th {
  background: #12141e; padding: 12px 16px; text-align: left;
  font-size: 11px; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: .5px; border-bottom: 1px solid #2d3148;
}
.results-table td { padding: 13px 16px; font-size: 14px; border-bottom: 1px solid #1e2235; color: #cbd5e1; }
.results-table tr:last-child td { border-bottom: none; }
.results-table tr:hover td { background: rgba(99,102,241,.04); }
.no-results { color: #64748b; font-style: italic; text-align: center; }
.empty-state { text-align: center; padding: 60px 20px; color: #475569; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state p { font-size: 14px; }
`;

// INTENTIONALLY VULNERABLE — query param reflected unsanitized into HTML
app.get('/search', (req, res) => {
  const q = req.query.q ?? '';

  const results = q
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
    : [];

  const rows = results.length
    ? results.map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.price}</td>
        </tr>`).join('')
    : `<tr><td colspan="3" class="no-results">No products found for "<span>${q}</span>"</td></tr>`;

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="flag" content="${FLAG}"/>
  <title>ShopZone — Product Search</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="shell">
    <header class="site-header">
      <div class="brand">
        <span class="brand-icon">🛒</span>
        <div>
          <div class="brand-name">PWNZone.io</div>
          <div class="brand-sub">ShopZone Store</div>
        </div>
      </div>
      <span class="lab-badge">⚠ PwnZone Lab — Reflected XSS</span>
    </header>

    <main>
      <h1>Product Search</h1>
      <p class="lead">Search our catalog to find what you need.</p>

      <form class="search-form" action="${BASE}/search" method="GET">
        <input
          class="search-input"
          type="text"
          name="q"
          value="${q}"
          placeholder="Search products…"
          autocomplete="off"
        />
        <button class="btn" type="submit">Search</button>
      </form>

      ${q ? `<p class="results-label">Results for: <strong>${q}</strong></p>` : ''}

      ${q ? `
      <table class="results-table">
        <thead>
          <tr><th>Product</th><th>Category</th><th>Price</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>` : `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Enter a search term above to find products.</p>
      </div>`}
    </main>

  </div>
</body>
</html>`);
});

app.get('/', (req, res) => res.redirect(`${BASE}/search`));

app.get('/health', (_, res) => res.json({ status: 'ok', lab: 'xss-search' }));

app.listen(PORT, () => console.log(`[XSS-Search Lab] Running on http://localhost:${PORT}`));
