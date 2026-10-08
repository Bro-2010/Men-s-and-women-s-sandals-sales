// ============================================================
//  Sandal Studio: shop, bag, checkout and WhatsApp ordering
// ============================================================

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fmt = n => `${CONFIG.currency} ${Number(n).toFixed(2)}`;
const genderLabel = p => (p.gender === "women" ? "Women's" : "Men's");
const findProduct = id => products.find(p => p.id === Number(id));

// ---------- State ----------
const STORAGE_KEY = "sandalStudioBag";
let filter = "all";
let sortBy = "featured";
let bag = loadBag();
let active = null;      // product open in the product window
let chosenSize = null;
let qty = 1;

function loadBag() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return saved.filter(line => findProduct(line.id) && line.qty > 0);
  } catch (err) {
    return [];
  }
}
function saveBag() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
}

// ---------- Sandal illustration (always shows, no internet needed) ----------
function sandalSVG(p) {
  return `
  <svg viewBox="0 0 240 160" aria-hidden="true" focusable="false">
    <ellipse cx="120" cy="140" rx="92" ry="7" fill="rgba(0,0,0,0.08)"/>
    <path d="M28 112c-4-12 6-16 20-16l138-6c22-1 28 14 22 26-4 12-18 14-34 14l-118 2c-18 0-26-8-28-20z" fill="${p.sole}"/>
    <path d="M40 104c24-4 84-6 160 0" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M52 96c8-38 58-56 88-30 16 14 30 24 50 24" fill="none" stroke="${p.color}" stroke-width="10" stroke-linecap="round"/>
    <path d="M96 94c8-20 28-22 40-10" fill="none" stroke="${p.color}" stroke-width="8" stroke-linecap="round"/>
  </svg>`;
}

// Shows a photo if one is set, with the illustration underneath as a backup
function mediaHTML(p) {
  const photo = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove()">`
    : "";
  return `${photo}${sandalSVG(p)}`;
}

// ---------- Product grid ----------
function visibleProducts() {
  let list = filter === "all" ? [...products] : products.filter(p => p.gender === filter);
  if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function cardHTML(p) {
  const badge = p.badge
    ? `<span class="badge badge-${p.badge.toLowerCase()}">${p.badge}</span>`
    : "";
  return `
  <article class="card">
    <button class="card-media" data-open="${p.id}" aria-label="View ${p.name}">
      ${mediaHTML(p)}
      ${badge}
    </button>
    <div class="card-body">
      <p class="meta">${genderLabel(p)} · ${p.style}</p>
      <h3>${p.name}</h3>
      <p class="price">${fmt(p.price)}${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}</p>
      <button class="btn btn-dark btn-block" data-open="${p.id}">Choose size</button>
    </div>
  </article>`;
}

function renderProducts() {
  const list = visibleProducts();
  $("#productGrid").innerHTML = list.map(cardHTML).join("");
  $("#emptyMsg").hidden = list.length > 0;
  $("#shopTitle").textContent =
    filter === "women" ? "Women's Sandals" :
    filter === "men" ? "Men's Sandals" : "All Sandals";
  $$(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.filter === filter));
}

function setFilter(value) {
  filter = value;
  renderProducts();
}

// ---------- Product window ----------
function openProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  active = p;
  chosenSize = null;
  qty = 1;

  $("#modalMedia").innerHTML = mediaHTML(p);
  $("#modalMeta").textContent = `${genderLabel(p)} · ${p.style}`;
  $("#modalName").textContent = p.name;
  $("#modalPrice").innerHTML = `${fmt(p.price)}${p.oldPrice ? ` <s>${fmt(p.oldPrice)}</s>` : ""}`;
  $("#modalDesc").textContent = p.description;
  $("#sizeOptions").innerHTML = p.sizes
    .map(s => `<button type="button" class="size-btn" data-size="${s}">${s}</button>`)
    .join("");
  $("#sizeHelp").textContent = "Please choose a size";
  $("#qtyValue").textContent = qty;

  openLayer("#productModal");
}

// ---------- Bag ----------
const subtotal = () => bag.reduce((sum, l) => sum + findProduct(l.id).price * l.qty, 0);
const deliveryFor = sub => (sub === 0 || sub >= CONFIG.freeDeliveryAbove ? 0 : CONFIG.deliveryFee);

function renderBag() {
  const count = bag.reduce((sum, l) => sum + l.qty, 0);
  $("#bagCount").textContent = count;
  $("#bagEmpty").hidden = bag.length > 0;
  $("#bagFooter").hidden = bag.length === 0;

  $("#bagItems").innerHTML = bag.map((line, i) => {
    const p = findProduct(line.id);
    return `
    <div class="bag-line">
      <div class="bag-thumb">${mediaHTML(p)}</div>
      <div class="bag-info">
        <strong>${p.name}</strong>
        <small>${genderLabel(p)} · Size ${line.size}</small>
        <div class="bag-controls">
          <button data-act="dec" data-i="${i}" aria-label="Decrease quantity">&minus;</button>
          <span>${line.qty}</span>
          <button data-act="inc" data-i="${i}" aria-label="Increase quantity">+</button>
          <button class="link-btn" data-act="remove" data-i="${i}">Remove</button>
        </div>
      </div>
      <strong class="bag-line-total">${fmt(p.price * line.qty)}</strong>
    </div>`;
  }).join("");

  const sub = subtotal();
  const fee = deliveryFor(sub);
  $("#bagSubtotal").textContent = fmt(sub);
  $("#bagDelivery").textContent = fee === 0 ? "Free" : fmt(fee);
  $("#bagTotal").textContent = fmt(sub + fee);
  $("#freeNote").textContent = sub >= CONFIG.freeDeliveryAbove
    ? "You qualify for free delivery"
    : `Add ${fmt(CONFIG.freeDeliveryAbove - sub)} more for free delivery`;
}

function addToBag(id, size, quantity) {
  const line = bag.find(l => l.id === id && l.size === size);
  if (line) line.qty = Math.min(10, line.qty + quantity);
  else bag.push({ id, size, qty: quantity });
  saveBag();
  renderBag();
}

// ---------- Checkout ----------
const PAYMENT_NOTES = {
  momo: "Demo: in the live store, a Mobile Money approval prompt would appear on your phone. No money is charged in this demo.",
  card: "Demo: card payment is simulated. No money is charged in this demo.",
  cod: "Pay in cash when your order arrives. Please have the exact amount ready."
};
const PAYMENT_LABELS = {
  momo: "Mobile Money (demo)",
  card: "Card (demo)",
  cod: "Pay on delivery"
};

function renderSummary() {
  $("#checkoutLines").innerHTML = bag
    .map(l => {
      const p = findProduct(l.id);
      return `<li><span>${p.name}, size ${l.size} × ${l.qty}</span><span>${fmt(p.price * l.qty)}</span></li>`;
    })
    .join("");
  const sub = subtotal();
  const fee = deliveryFor(sub);
  $("#sumSubtotal").textContent = fmt(sub);
  $("#sumDelivery").textContent = fee === 0 ? "Free" : fmt(fee);
  $("#sumTotal").textContent = fmt(sub + fee);
}

function openCheckout() {
  if (!bag.length) {
    toast("Your bag is empty");
    return;
  }
  renderSummary();
  openLayer("#checkoutModal");
}

function buildWhatsAppMessage(orderNo, data, sub, fee) {
  const lines = bag.map(l => {
    const p = findProduct(l.id);
    return `• ${p.name} (${genderLabel(p)}, size ${l.size}) x${l.qty} = ${fmt(p.price * l.qty)}`;
  });
  return [
    `*New order ${orderNo}* – ${CONFIG.brand}`,
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    data.email ? `*Email:* ${data.email}` : null,
    `*City:* ${data.city}`,
    `*Delivery address:* ${data.address}`,
    `*Payment:* ${PAYMENT_LABELS[data.payment]}`,
    data.note ? `*Note:* ${data.note}` : null,
    "",
    "*Items:*",
    ...lines,
    "",
    `*Subtotal:* ${fmt(sub)}`,
    `*Delivery:* ${fee === 0 ? "Free" : fmt(fee)}`,
    `*Total:* ${fmt(sub + fee)}`
  ].filter(line => line !== null).join("\n");
}

// ---------- Layers (modals, drawer, overlay) ----------
function openLayer(...selectors) {
  closeAll();
  $("#overlay").classList.add("is-open");
  selectors.forEach(sel => $(sel).classList.add("is-open"));
  document.body.classList.add("locked");
}
function closeAll() {
  $$(".modal.is-open, .drawer.is-open, .overlay.is-open").forEach(el => el.classList.remove("is-open"));
  document.body.classList.remove("locked");
}

// ---------- Toast ----------
let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ============================================================
//  Event wiring
// ============================================================

// Clicks: filters, product windows, close buttons
document.addEventListener("click", e => {
  const filterEl = e.target.closest("[data-filter]");
  if (filterEl) {
    setFilter(filterEl.dataset.filter);
    $("#nav").classList.remove("open");
  }
  const openEl = e.target.closest("[data-open]");
  if (openEl) openProduct(openEl.dataset.open);
  if (e.target.closest("[data-close]")) closeAll();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeAll();
});

$("#sortSelect").addEventListener("change", e => {
  sortBy = e.target.value;
  renderProducts();
});

// Mobile menu
$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));

// Product window: size and quantity
$("#sizeOptions").addEventListener("click", e => {
  const btn = e.target.closest(".size-btn");
  if (!btn) return;
  chosenSize = btn.dataset.size;
  $$(".size-btn").forEach(b => b.classList.toggle("selected", b === btn));
  $("#sizeHelp").textContent = `Size ${chosenSize} selected`;
});

$("#qtyMinus").addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  $("#qtyValue").textContent = qty;
});
$("#qtyPlus").addEventListener("click", () => {
  qty = Math.min(10, qty + 1);
  $("#qtyValue").textContent = qty;
});

$("#addToBagBtn").addEventListener("click", () => {
  if (!active) return;
  if (!chosenSize) {
    toast("Please choose a size first");
    return;
  }
  addToBag(active.id, chosenSize, qty);
  toast(`${active.name} (size ${chosenSize}) added to your bag`);
  closeAll();
});

// Bag drawer
$("#bagBtn").addEventListener("click", () => {
  renderBag();
  openLayer("#bagDrawer");
});

$("#bagItems").addEventListener("click", e => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const line = bag[i];
  if (!line) return;
  if (btn.dataset.act === "inc") line.qty = Math.min(10, line.qty + 1);
  if (btn.dataset.act === "dec") line.qty = Math.max(1, line.qty - 1);
  if (btn.dataset.act === "remove") bag.splice(i, 1);
  saveBag();
  renderBag();
});

$("#checkoutBtn").addEventListener("click", openCheckout);

// Checkout form
$("#checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  if (!form.reportValidity()) return;

  const phone = $("#custPhone").value.replace(/[\s-]/g, "");
  if (!/^(0\d{9}|\+?233\d{9})$/.test(phone)) {
    toast("Please enter a valid Ghana phone number");
    return;
  }

  const data = {
    name: $("#custName").value.trim(),
    phone,
    email: $("#custEmail").value.trim(),
    city: $("#custCity").value,
    address: $("#custAddress").value.trim(),
    note: $("#custNote").value.trim(),
    payment: form.querySelector('input[name="payment"]:checked').value
  };

  const sub = subtotal();
  const fee = deliveryFor(sub);
  const orderNo = "SS-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  const message = buildWhatsAppMessage(orderNo, data, sub, fee);

  $("#orderNo").textContent = orderNo;
  $("#orderTotalText").textContent = fmt(sub + fee);
  $("#paymentNote").textContent = PAYMENT_NOTES[data.payment];
  $("#waOrderBtn").href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  bag = [];
  saveBag();
  renderBag();
  form.reset();
  openLayer("#confirmModal");
});

// Contact form (demo)
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  e.target.reset();
  toast("Thank you! We will get back to you soon.");
});

// ============================================================
//  Start up
// ============================================================

// Fill brand, contact details and WhatsApp links from CONFIG
$$("[data-config]").forEach(el => {
  const value = CONFIG[el.dataset.config];
  if (value !== undefined) el.textContent = value;
});
$$("a[data-config]").forEach(el => {
  if (el.dataset.config === "email") el.href = `mailto:${CONFIG.email}`;
});
const waLink = `https://wa.me/${CONFIG.whatsappNumber}`;
$("#contactWa").href = waLink;
$("#footerWa").href = waLink;
$("#year").textContent = new Date().getFullYear();

// Hero and category illustrations
$("#heroArt").innerHTML = sandalSVG(products[2]);
$("#tileWomen").innerHTML = sandalSVG(products[1]);
$("#tileMen").innerHTML = sandalSVG(products[5]);

renderProducts();
renderBag();
