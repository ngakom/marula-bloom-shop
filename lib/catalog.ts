// Demo catalogue for the fictional "Marula Bloom" brand. These are only the starting values:
// the owner dashboard (/admin) edits prices, sales and stock, and those edits are saved in the store.

export const BRAND = {
  name: "Marula Bloom",
  tagline: "Natural skin & hair care, made in South Africa",
  email: "hello@marulabloom.demo",
  phone: "012 345 6789",
  freeDeliveryFrom: 500,
};

export const CATEGORIES = [
  { id: "face", name: "Face", blurb: "Oils, serums and masks for a healthy glow" },
  { id: "body", name: "Body", blurb: "Butters, scrubs and washes for soft skin" },
  { id: "hair", name: "Hair", blurb: "Growth oils and gentle cleansers for natural hair" },
  { id: "soap", name: "Soap & Bath", blurb: "Handmade soaps and relaxing soaks" },
  { id: "sets", name: "Gift Sets", blurb: "Ready-to-gift rituals" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number; // regular price, rand
  salePrice?: number | null; // shown with the regular price crossed out
  saleEnds?: string | null; // YYYY-MM-DD, last day of the sale
  stock: number;
  size: string;
  image: string;
  description: string;
  ingredients: string;
  howToUse: string;
  featured?: boolean;
  bestseller?: boolean;
  createdAt: string;
};

const img = (slug: string) => `/images/products/${slug}.jpg`;

const P = (p: Omit<Product, "id" | "image">): Product => ({ ...p, id: p.slug, image: img(p.slug) });

export const SEED_PRODUCTS: Product[] = [
  P({
    slug: "marula-face-oil", name: "Marula Face Oil", category: "face", price: 289, salePrice: 229, stock: 24, size: "30 ml",
    description: "A lightweight, fast-absorbing facial oil with cold-pressed marula oil to nourish and balance all skin types.",
    ingredients: "Marula oil, jojoba oil, vitamin E, rosehip oil.", howToUse: "Warm 3–4 drops between your palms and press into clean skin, morning and night.",
    featured: true, bestseller: true, createdAt: "2026-08-02",
  }),
  P({
    slug: "vitamin-c-glow-serum", name: "Vitamin C Glow Serum", category: "face", price: 320, stock: 18, size: "30 ml",
    description: "Brightening serum with stabilised vitamin C and baobab extract to even out skin tone and boost radiance.",
    ingredients: "Vitamin C, baobab extract, hyaluronic acid, aloe vera.", howToUse: "Apply 2–3 drops to clean skin in the morning, then moisturise and use sunscreen.",
    bestseller: true, createdAt: "2026-09-10",
  }),
  P({
    slug: "rooibos-clay-mask", name: "Rooibos Clay Mask", category: "face", price: 210, salePrice: 175, stock: 15, size: "100 g",
    description: "Detoxifying clay mask with rooibos to draw out impurities and calm the skin.",
    ingredients: "Kaolin clay, rooibos extract, honey, tea tree oil.", howToUse: "Apply an even layer to clean skin, leave for 10 minutes and rinse with warm water. Use twice a week.",
    createdAt: "2026-07-15",
  }),
  P({
    slug: "whipped-shea-butter", name: "Whipped Shea Body Butter", category: "body", price: 165, stock: 40, size: "250 ml",
    description: "Rich, whipped shea and marula butter that melts into dry skin for all-day softness. Gentle enough for the whole family.",
    ingredients: "Shea butter, marula oil, coconut oil, vitamin E.", howToUse: "Massage into damp skin after bathing, focusing on dry areas.",
    featured: true, bestseller: true, createdAt: "2026-06-20",
  }),
  P({
    slug: "sugar-body-scrub", name: "Brown Sugar Body Scrub", category: "body", price: 190, stock: 22, size: "250 ml",
    description: "Exfoliating scrub with brown sugar and marula oil that buffs away dry skin and leaves a soft glow.",
    ingredients: "Brown sugar, marula oil, shea butter, vanilla.", howToUse: "Massage onto wet skin in circular motions, then rinse. Use 2–3 times a week.",
    createdAt: "2026-08-25",
  }),
  P({
    slug: "botanical-body-wash-duo", name: "Botanical Body Wash Duo", category: "body", price: 240, salePrice: 199, stock: 12, size: "2 × 300 ml",
    description: "Two sulphate-free body washes, Citrus Fresh and Eucalyptus Calm, for a gentle everyday cleanse.",
    ingredients: "Coconut-based cleansers, aloe vera, essential oils.", howToUse: "Lather in the shower and rinse well.",
    createdAt: "2026-09-01",
  }),
  P({
    slug: "gentle-hand-wash", name: "Gentle Hand Wash", category: "body", price: 120, stock: 30, size: "300 ml",
    description: "A softening hand wash with aloe and marula that cleans without drying.",
    ingredients: "Aloe vera, marula oil, glycerin.", howToUse: "Pump into wet hands, lather and rinse.",
    createdAt: "2026-05-30",
  }),
  P({
    slug: "scalp-growth-oil", name: "Scalp & Growth Hair Oil", category: "hair", price: 180, salePrice: 149, stock: 35, size: "100 ml",
    description: "A nourishing scalp oil with castor and rosemary to support healthy growth and reduce breakage in natural hair.",
    ingredients: "Castor oil, rosemary oil, marula oil, peppermint oil.", howToUse: "Massage a few drops into the scalp 3 times a week. Can be used on braids and protective styles.",
    featured: true, bestseller: true, createdAt: "2026-07-01",
  }),
  P({
    slug: "restore-shampoo-conditioner", name: "Restore Shampoo & Conditioner", category: "hair", price: 260, stock: 16, size: "2 × 300 ml",
    description: "Sulphate-free shampoo and moisture-rich conditioner made for coils, curls and kinks.",
    ingredients: "Aloe vera, shea butter, coconut oil, panthenol.", howToUse: "Shampoo, rinse, then apply conditioner for 3–5 minutes before rinsing.",
    createdAt: "2026-08-12",
  }),
  P({
    slug: "honey-oat-soap", name: "Honey & Oat Soap", category: "soap", price: 65, stock: 60, size: "120 g",
    description: "Handmade cold-process soap with raw honey and oats, kind to sensitive skin.",
    ingredients: "Olive oil, coconut oil, raw honey, oats, shea butter.", howToUse: "Lather between wet hands or on a cloth and rinse.",
    bestseller: true, createdAt: "2026-04-18",
  }),
  P({
    slug: "charcoal-soap-trio", name: "Charcoal Soap Trio", category: "soap", price: 180, stock: 20, size: "3 × 120 g",
    description: "Three deep-cleansing handmade bars: activated charcoal, rose clay and rooibos.",
    ingredients: "Activated charcoal, rose clay, rooibos, olive oil, coconut oil.", howToUse: "Use daily on face or body and rinse well.",
    createdAt: "2026-06-05",
  }),
  P({
    slug: "artisan-soap-bundle", name: "Artisan Soap Bundle", category: "soap", price: 220, salePrice: 185, stock: 14, size: "4 × 120 g",
    description: "Four colourful handmade soaps, each with its own natural scent. Lovely for gifting.",
    ingredients: "Olive oil, coconut oil, shea butter, natural clays and essential oils.", howToUse: "Lather and rinse. Keep dry between uses to make them last.",
    featured: true, createdAt: "2026-09-18",
  }),
  P({
    slug: "rose-bath-soak", name: "Rose Petal Bath Soak", category: "soap", price: 150, stock: 25, size: "400 g",
    description: "Relaxing mineral bath salts with rose petals and lavender.",
    ingredients: "Epsom salt, Himalayan salt, rose petals, lavender oil.", howToUse: "Dissolve two handfuls in a warm bath and soak for 20 minutes.",
    createdAt: "2026-07-22",
  }),
  P({
    slug: "marula-lip-balm", name: "Marula Lip Balm", category: "face", price: 55, stock: 80, size: "15 ml",
    description: "Softening lip balm with marula oil and beeswax.",
    ingredients: "Beeswax, marula oil, shea butter, vitamin E.", howToUse: "Apply as often as needed.",
    createdAt: "2026-05-10",
  }),
  P({
    slug: "daily-glow-ritual-set", name: "Daily Glow Ritual Set", category: "sets", price: 650, salePrice: 520, stock: 8, size: "4 products",
    description: "Our complete daily routine: Marula Face Oil, Vitamin C Glow Serum, Marula Lip Balm and a Honey & Oat Soap.",
    ingredients: "See each product.", howToUse: "Cleanse with the soap, apply serum, then face oil. Finish with lip balm.",
    featured: true, createdAt: "2026-10-01",
  }),
  P({
    slug: "complete-skin-gift-set", name: "Complete Skin Gift Set", category: "sets", price: 890, stock: 5, size: "6 products",
    description: "A generous gift box with our face, body and bath favourites, beautifully packed.",
    ingredients: "See each product.", howToUse: "Enjoy, or gift to someone special.",
    createdAt: "2026-10-05",
  }),
];

export type CartLine = { productId: string; qty: number };

export const DELIVERY_OPTIONS = [
  { id: "courier", name: "Courier to your door", detail: "2–4 working days", price: 99 },
  { id: "paxi", name: "PAXI collection point", detail: "5–7 working days", price: 60 },
  { id: "collect", name: "Collect in store", detail: "Ready in 1 working day", price: 0 },
] as const;

export type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export const ORDER_STATUSES = ["Awaiting payment", "Paid", "Packed", "Shipped", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  createdAt: string; // ISO
  customer: { name: string; email: string; phone: string };
  address: string;
  lines: { productId: string; name: string; unitPrice: number; qty: number }[];
  delivery: DeliveryId;
  deliveryFee: number;
  total: number;
  payment: "card" | "eft";
  status: OrderStatus;
};

/** Sample orders so the owner dashboard isn't empty in the demo. */
export const SEED_ORDERS: Order[] = [
  {
    id: "MB-1004", createdAt: "2026-11-04T10:12:00Z", customer: { name: "Thando M.", email: "thando@example.com", phone: "072 000 0001" },
    address: "Pretoria, Gauteng", lines: [{ productId: "scalp-growth-oil", name: "Scalp & Growth Hair Oil", unitPrice: 149, qty: 2 }],
    delivery: "courier", deliveryFee: 99, total: 397, payment: "card", status: "Paid",
  },
  {
    id: "MB-1003", createdAt: "2026-11-02T15:40:00Z", customer: { name: "Lerato K.", email: "lerato@example.com", phone: "072 000 0002" },
    address: "Polokwane, Limpopo", lines: [{ productId: "daily-glow-ritual-set", name: "Daily Glow Ritual Set", unitPrice: 520, qty: 1 }],
    delivery: "paxi", deliveryFee: 0, total: 520, payment: "eft", status: "Shipped",
  },
  {
    id: "MB-1002", createdAt: "2026-10-29T08:05:00Z", customer: { name: "Naledi S.", email: "naledi@example.com", phone: "072 000 0003" },
    address: "Johannesburg, Gauteng", lines: [
      { productId: "whipped-shea-butter", name: "Whipped Shea Body Butter", unitPrice: 165, qty: 1 },
      { productId: "honey-oat-soap", name: "Honey & Oat Soap", unitPrice: 65, qty: 3 },
    ],
    delivery: "courier", deliveryFee: 99, total: 459, payment: "card", status: "Delivered",
  },
  {
    id: "MB-1001", createdAt: "2026-10-21T12:30:00Z", customer: { name: "Ayanda D.", email: "ayanda@example.com", phone: "072 000 0004" },
    address: "Durban, KwaZulu-Natal", lines: [{ productId: "marula-face-oil", name: "Marula Face Oil", unitPrice: 229, qty: 1 }],
    delivery: "collect", deliveryFee: 0, total: 229, payment: "card", status: "Delivered",
  },
];

export const DEMO_ADMIN = { email: "owner@marulabloom.demo", password: "demo1234" };
