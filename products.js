// ============================================================
//  SANDAL STUDIO: store settings and products
//  Edit this file to change the brand, contact details, prices,
//  sizes and products. No other file needs to change.
// ============================================================

const CONFIG = {
  brand: "Sandal Studio",
  currency: "GH₵",
  whatsappNumber: "233000000000",       // country code first, no + or spaces
  phoneDisplay: "+233 000 000 000",
  email: "hello@sandalstudio.example",
  address: "Osu Oxford Street, Accra, Ghana",
  hours: "Monday to Saturday, 9:00 am to 7:00 pm",
  deliveryFee: 20,                      // GH₵ charged on smaller orders
  freeDeliveryAbove: 300                // orders at or above this get free delivery
};

// Field guide:
//  id          unique number
//  name        product name shown on the card
//  gender      "women" or "men" (controls the tabs and filters)
//  style       short style label, e.g. "Slide", "Wedge sandal"
//  price       current price in GH₵
//  oldPrice    optional, shows a crossed-out price (leave out or set to null)
//  sizes       sizes customers can choose from
//  color       main strap colour of the built-in illustration
//  sole        sole colour of the built-in illustration
//  badge       optional: "New", "Bestseller", "Sale" or ""
//  description text shown in the product window
//  image       optional photo link or file path, e.g. "images/rosa-strap.jpg".
//              Leave as "" to show the built-in illustration.

const WOMEN_SIZES = [36, 37, 38, 39, 40, 41];
const MEN_SIZES = [39, 40, 41, 42, 43, 44, 45];

const products = [
  {
    id: 1,
    name: "Rosa Strap Sandal",
    gender: "women",
    style: "Strap sandal",
    price: 150,
    sizes: WOMEN_SIZES,
    color: "#e7a9a0",
    sole: "#3a2c2a",
    badge: "New",
    description: "A delicate strappy sandal with a cushioned insole and a soft ankle buckle. Made for weddings, church and everyday wear.",
    image: ""
  },
  {
    id: 2,
    name: "Ivory Flat Slide",
    gender: "women",
    style: "Flat slide",
    price: 95,
    oldPrice: 110,
    sizes: WOMEN_SIZES,
    color: "#e9dcc7",
    sole: "#8a7b68",
    badge: "Sale",
    description: "A lightweight slide with a padded footbed and a textured strap. Easy to slip on for the market, the office or the weekend.",
    image: ""
  },
  {
    id: 3,
    name: "Gold Wedge Sandal",
    gender: "women",
    style: "Wedge sandal",
    price: 220,
    sizes: WOMEN_SIZES,
    color: "#d9ad5c",
    sole: "#2b2622",
    badge: "Bestseller",
    description: "Elevated comfort with a 6 cm wedge heel and a gold-finish strap. Ideal for parties and evening events.",
    image: ""
  },
  {
    id: 4,
    name: "Noir Block-Heel Sandal",
    gender: "women",
    style: "Block-heel sandal",
    price: 190,
    sizes: WOMEN_SIZES,
    color: "#2b2826",
    sole: "#111111",
    badge: "",
    description: "A classic black block heel that is stable and comfortable for long days on your feet.",
    image: ""
  },
  {
    id: 5,
    name: "Nude Gladiator Sandal",
    gender: "women",
    style: "Gladiator sandal",
    price: 170,
    sizes: WOMEN_SIZES,
    color: "#c99b78",
    sole: "#6b4f3d",
    badge: "",
    description: "Crisscross straps and a flat sole for a relaxed, summer-ready look.",
    image: ""
  },
  {
    id: 6,
    name: "Classic Leather Sandal",
    gender: "men",
    style: "Leather sandal",
    price: 180,
    sizes: MEN_SIZES,
    color: "#7a5636",
    sole: "#3b2a1e",
    badge: "Bestseller",
    description: "Full-grain leather straps on a durable rubber sole. A versatile sandal for the office, the weekend or travel.",
    image: ""
  },
  {
    id: 7,
    name: "Comfort Slide",
    gender: "men",
    style: "Slide",
    price: 85,
    sizes: MEN_SIZES,
    color: "#3a3a3a",
    sole: "#1a1a1a",
    badge: "",
    description: "A soft, cushioned slide with an anti-slip sole. Perfect for home, the gym and quick errands.",
    image: ""
  },
  {
    id: 8,
    name: "Sport Strap Sandal",
    gender: "men",
    style: "Sport sandal",
    price: 130,
    oldPrice: 150,
    sizes: MEN_SIZES,
    color: "#2f5d62",
    sole: "#1d2b2e",
    badge: "Sale",
    description: "Adjustable hook-and-loop straps and a grippy sole for active days, walks and beach trips.",
    image: ""
  },
  {
    id: 9,
    name: "Woven Casual Sandal",
    gender: "men",
    style: "Casual sandal",
    price: 120,
    sizes: MEN_SIZES,
    color: "#9c7c57",
    sole: "#5a4630",
    badge: "",
    description: "Hand-woven straps give a natural look. Light, breathable and comfortable for everyday wear.",
    image: ""
  },
  {
    id: 10,
    name: "Double-Strap Brown Sandal",
    gender: "men",
    style: "Double-strap sandal",
    price: 160,
    sizes: MEN_SIZES,
    color: "#5a3d2b",
    sole: "#2c1f16",
    badge: "New",
    description: "Two sturdy straps and a contoured footbed for support and a smart, modern finish.",
    image: ""
  }
];
