# Sandal Studio: Women's and Men's Sandals

A ready-to-deploy sandals shop. Customers browse women's and men's sandals, choose a size, build a bag, check out, and send the order to your WhatsApp.

This is a demo store. Payment buttons are simulated and no money is charged.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Page layout and sections |
| `style.css` | Colours, fonts and layout |
| `products.js` | **Your settings and products** (edit this file) |
| `script.js` | Shop, bag, checkout and WhatsApp logic (no need to edit) |
| `README.md` | This guide |

## 1. Set your details (in `products.js`)

Open `products.js` and change the `CONFIG` block at the top:

- `brand`: your store name
- `whatsappNumber`: your WhatsApp number with country code and no `+` (for example `233241234567`). Orders are sent here.
- `phoneDisplay`, `email`, `address`, `hours`: shown in the contact section and footer
- `deliveryFee` and `freeDeliveryAbove`: delivery charge and the order amount for free delivery

## 2. Add or change products (in `products.js`)

Each product is one block in the `products` list. Copy a block, then change:

- `name`, `style`, `price`, `oldPrice` (optional), `description`
- `gender`: `"women"` or `"men"`
- `sizes`: use `WOMEN_SIZES` or `MEN_SIZES`, or write your own list such as `[37, 38, 39]`
- `badge`: `"New"`, `"Bestseller"`, `"Sale"`, or `""` for none

### Using real photos

Every product shows a built-in sandal illustration, so the page always looks complete. To use real photos:

1. Create an `images` folder inside the `sandals website` folder and copy your photos into it.
2. In `products.js`, set the product's `image` to the photo path, for example `"images/rosa-strap.jpg"`.

If a photo link is wrong or missing, the illustration shows instead, so nothing is left blank.

## 3. Deploy the website

### Netlify (easiest)
1. Go to app.netlify.com and log in.
2. Drag the whole `sandals website` folder onto the page.
3. Netlify gives you a live link. You can change the site name in Site settings.

### GitHub Pages
1. Create a new repository on GitHub.
2. Upload the files inside the `sandals website` folder to the repository (keep `index.html` at the top level).
3. Go to Settings → Pages, choose the `main` branch and the `/ (root)` folder, then save.
4. Your site will be live at `https://<your-username>.github.io/<repository-name>/`.

## How the shop works

- **Browse:** Customers filter by Women's, Men's or All, and sort by price or name.
- **Choose:** Tapping a product opens its window, where the customer picks a size and quantity.
- **Bag:** Items are saved in the customer's browser, so the bag stays after a page refresh.
- **Delivery:** Orders at or above the free-delivery amount get free delivery. Smaller orders pay the delivery fee.
- **Checkout:** The customer enters name, phone, city and address, then picks a payment method.
- **Order:** The order gets a reference number, the bag is cleared, and the customer taps **Send order on WhatsApp**. Your WhatsApp opens with the full order written out.

## Notes for a live store

- The payment options (Mobile Money and card) are demo only. To take real payments, connect a payment provider such as Paystack or Flutterwave, which needs a small server or a hosted checkout.
- The customer reviews and FAQ answers are sample text. Replace them with your own.
