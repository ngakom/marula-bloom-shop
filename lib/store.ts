"use client";

// Demo shop state: products (owner-editable), customer accounts, cart and orders.
// It lives in the visitor's browser (localStorage), so anyone can try the full shop and owner dashboard safely.
// A real client shop swaps this module for a database and a payment gateway (PayFast / Yoco); the pages stay the same.

import { useSyncExternalStore } from "react";
import { DEMO_ADMIN, DELIVERY_OPTIONS, SEED_ORDERS, SEED_PRODUCTS, BRAND, type CartLine, type DeliveryId, type Order, type OrderStatus, type Product } from "./catalog";

type User = { name: string; email: string; phone: string; passwordHash: string };

export type ShopState = {
  products: Product[];
  orders: Order[];
  users: User[];
  session: string | null; // logged-in customer's email
  admin: boolean;
  cart: CartLine[];
  lastAdded?: { productId: string; at: number } | null; // drives the "Added to cart" notice
  nextOrderNo: number;
};

const KEY = "marula-bloom-demo-v1";

const initial = (): ShopState => ({
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  users: [],
  session: null,
  admin: false,
  cart: [],
  nextOrderNo: 1005,
});

let state: ShopState = initial();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) state = { ...initial(), ...JSON.parse(saved), lastAdded: null };
  } catch {
    // Private mode or corrupt data: start fresh.
  }
}

function set(next: Partial<ShopState>) {
  state = { ...state, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, lastAdded: null }));
  } catch {
    // Storage full or blocked: the demo keeps working for this visit.
  }
  listeners.forEach((l) => l());
}

const serverState = initial();

export function useShop(): ShopState {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return state;
    },
    () => serverState
  );
}

// ---------- prices ----------

const today = () => new Date().toISOString().slice(0, 10);

export function onSale(p: Product): boolean {
  return p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price && (!p.saleEnds || p.saleEnds >= today());
}

export const priceOf = (p: Product) => (onSale(p) ? p.salePrice! : p.price);

export const rand = (n: number) => `R${n.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace(/ /g, " ")}`;

export function cartTotals(s: ShopState, delivery?: DeliveryId) {
  const lines = s.cart
    .map((l) => ({ ...l, product: s.products.find((p) => p.id === l.productId) }))
    .filter((l): l is CartLine & { product: Product } => !!l.product);
  const subtotal = lines.reduce((sum, l) => sum + priceOf(l.product) * l.qty, 0);
  const savings = lines.reduce((sum, l) => sum + (l.product.price - priceOf(l.product)) * l.qty, 0);
  const option = DELIVERY_OPTIONS.find((d) => d.id === delivery);
  const deliveryFee = !option || subtotal >= BRAND.freeDeliveryFrom ? 0 : option.price;
  return { lines, subtotal, savings, deliveryFee, total: subtotal + deliveryFee, count: lines.reduce((n, l) => n + l.qty, 0) };
}

// ---------- cart ----------

export function addToCart(productId: string, qty = 1) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return;
  const existing = state.cart.find((l) => l.productId === productId);
  const wanted = Math.min(p.stock, (existing?.qty ?? 0) + qty);
  if (wanted <= 0) return;
  set({
    cart: existing ? state.cart.map((l) => (l.productId === productId ? { ...l, qty: wanted } : l)) : [...state.cart, { productId, qty: wanted }],
    lastAdded: { productId, at: Date.now() },
  });
}

export function setQty(productId: string, qty: number) {
  const p = state.products.find((x) => x.id === productId);
  if (qty <= 0) return set({ cart: state.cart.filter((l) => l.productId !== productId) });
  set({ cart: state.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, p?.stock ?? qty) } : l)) });
}

// ---------- accounts ----------

async function hash(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function register(name: string, email: string, phone: string, password: string): Promise<string | null> {
  const e = email.trim().toLowerCase();
  if (state.users.some((u) => u.email === e)) return "An account with this email already exists. Please log in.";
  if (password.length < 6) return "Please use a password of at least 6 characters.";
  set({ users: [...state.users, { name: name.trim(), email: e, phone: phone.trim(), passwordHash: await hash(password) }], session: e });
  return null;
}

export async function login(email: string, password: string): Promise<string | null> {
  const e = email.trim().toLowerCase();
  const u = state.users.find((x) => x.email === e);
  if (!u || u.passwordHash !== (await hash(password))) return "Incorrect email or password.";
  set({ session: e });
  return null;
}

export const logout = () => set({ session: null });

export const currentUser = (s: ShopState) => s.users.find((u) => u.email === s.session) ?? null;

// ---------- checkout ----------

export function placeOrder(input: { name: string; email: string; phone: string; address: string; delivery: DeliveryId; payment: "card" | "eft" }): string | null {
  const t = cartTotals(state, input.delivery);
  if (!t.lines.length) return null;
  const id = `MB-${state.nextOrderNo}`;
  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    customer: { name: input.name, email: input.email.toLowerCase(), phone: input.phone },
    address: input.address,
    lines: t.lines.map((l) => ({ productId: l.product.id, name: l.product.name, unitPrice: priceOf(l.product), qty: l.qty })),
    delivery: input.delivery,
    deliveryFee: t.deliveryFee,
    total: t.total,
    payment: input.payment,
    status: input.payment === "eft" ? "Awaiting payment" : "Paid",
  };
  // Sold items come off stock, like a real shop.
  const products = state.products.map((p) => {
    const line = t.lines.find((l) => l.product.id === p.id);
    return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p;
  });
  set({ orders: [order, ...state.orders], products, cart: [], nextOrderNo: state.nextOrderNo + 1 });
  return id;
}

// ---------- owner dashboard ----------

export function adminLogin(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) set({ admin: true });
  return ok;
}

export const adminLogout = () => set({ admin: false });

export function updateProduct(id: string, patch: Partial<Product>) {
  set({ products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
}

export function addProduct(p: Omit<Product, "id" | "slug" | "createdAt">) {
  const base = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";
  let slug = base;
  for (let i = 2; state.products.some((x) => x.slug === slug); i++) slug = `${base}-${i}`;
  set({ products: [{ ...p, id: slug, slug, createdAt: today() }, ...state.products] });
  return slug;
}

export function deleteProduct(id: string) {
  set({ products: state.products.filter((p) => p.id !== id), cart: state.cart.filter((l) => l.productId !== id) });
}

export function setOrderStatus(id: string, status: OrderStatus) {
  set({ orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)) });
}

/** Puts the demo back to its starting products and sample orders (keeps the visitor logged in as owner). */
export function resetDemo() {
  set({ ...initial(), admin: state.admin });
}
