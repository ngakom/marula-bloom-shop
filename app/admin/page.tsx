"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Price from "@/components/Price";
import { CATEGORIES, DEMO_ADMIN, ORDER_STATUSES, type CategoryId, type OrderStatus, type Product } from "@/lib/catalog";
import { addProduct, adminLogin, adminLogout, deleteProduct, onSale, rand, resetDemo, setOrderStatus, updateProduct, useShop } from "@/lib/store";

type Tab = "overview" | "products" | "orders";

export default function AdminPage() {
  const s = useShop();
  const [tab, setTab] = useState<Tab>("products");

  if (!s.admin) return <AdminLogin />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1 className="font-display mt-1 text-4xl font-semibold text-forest">Manage your shop</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (!confirm("Reset all products and orders to the demo starting point?")) return;
              resetDemo();
              location.reload();
            }}
            className="btn-outline !py-2.5"
          >
            Reset demo
          </button>
          <button type="button" onClick={adminLogout} className="btn-primary !py-2.5">
            Log out
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-line" role="tablist">
        {(["overview", "products", "orders"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-bold capitalize ${tab === t ? "border-forest text-forest" : "border-transparent text-muted hover:text-forest"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === "overview" ? <Overview /> : tab === "products" ? <Products /> : <Orders />}</div>
    </div>
  );
}

function AdminLogin() {
  const [error, setError] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(!adminLogin(String(f.get("email")), String(f.get("password"))));
  }
  return (
    <div className="px-5 py-14">
      <div className="card mx-auto max-w-md p-8">
        <p className="eyebrow">Owner dashboard</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-forest">Shop owner login</h1>
        <p className="mt-3 text-sm text-muted">This is where the shop owner updates products, prices, sales, stock and orders. No developer needed.</p>
        <div className="mt-5 rounded-xl bg-gold-soft/60 p-4 text-sm">
          <p className="font-bold text-forest">Demo login</p>
          <p className="mt-1">
            Email: <b>{DEMO_ADMIN.email}</b>
            <br />
            Password: <b>{DEMO_ADMIN.password}</b>
          </p>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="a-email" className="label">
              Email
            </label>
            <input id="a-email" name="email" type="email" required defaultValue={DEMO_ADMIN.email} className="field" />
          </div>
          <div>
            <label htmlFor="a-pass" className="label">
              Password
            </label>
            <input id="a-pass" name="password" type="password" required defaultValue={DEMO_ADMIN.password} className="field" />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">
              Incorrect login. Use the demo details above.
            </p>
          )}
          <button type="submit" className="btn-primary w-full">
            Log in to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function Overview() {
  const { orders, products } = useShop();
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((n, o) => n + o.total, 0);
  const toShip = orders.filter((o) => o.status === "Paid" || o.status === "Packed");
  const low = products.filter((p) => p.stock <= 5);
  const stats = [
    { label: "Revenue (all orders)", value: rand(revenue) },
    { label: "Orders", value: String(live.length) },
    { label: "Waiting to ship", value: String(toShip.length) },
    { label: "Products on sale", value: String(products.filter(onSale).length) },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((st) => (
          <div key={st.label} className="card p-5">
            <p className="text-sm text-muted">{st.label}</p>
            <p className="font-display mt-1 text-3xl font-semibold text-forest">{st.value}</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-display text-2xl font-semibold text-forest">Low stock</h2>
        {low.length ? (
          <ul className="mt-4 divide-y divide-line">
            {low.map((p) => (
              <li key={p.id} className="flex justify-between py-3">
                <span className="font-semibold">{p.name}</span>
                <span className={`font-bold ${p.stock === 0 ? "text-clay" : "text-forest-soft"}`}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted">All products are well stocked.</p>
        )}
      </div>
    </div>
  );
}

function Products() {
  const { products } = useShop();
  const [adding, setAdding] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          Change a price, add a <b className="text-clay">sale price</b> (the old price is crossed out automatically), set when the sale ends, or update stock. Changes show
          in the shop immediately.
        </p>
        <button type="button" onClick={() => setAdding((a) => !a)} className="btn-gold !py-2.5">
          {adding ? "Close" : "+ Add product"}
        </button>
      </div>
      {adding && <AddProduct onDone={() => setAdding(false)} />}
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product: p }: { product: Product }) {
  const [saved, setSaved] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    updateProduct(p.id, {
      price: Number(f.price) || p.price,
      salePrice: f.salePrice ? Number(f.salePrice) : null,
      saleEnds: f.saleEnds || null,
      stock: Math.max(0, Math.round(Number(f.stock) || 0)),
      featured: f.featured === "on",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }
  const salePriceInvalid = p.salePrice != null && p.salePrice >= p.price;
  return (
    <form onSubmit={submit} className="card grid items-center gap-4 p-4 md:grid-cols-[3.5rem_1.4fr_repeat(4,minmax(0,0.8fr))_15.5rem]">
      <div className="relative hidden h-14 w-14 overflow-hidden rounded-lg bg-sand md:block">
        <Image src={p.image} alt="" fill sizes="3.5rem" className="object-cover" />
      </div>
      <div>
        <Link href={`/product/${p.slug}`} className="font-bold text-forest hover:text-clay">
          {p.name}
        </Link>
        <Price product={p} className="text-sm" />
        {salePriceInvalid && <p className="text-xs font-semibold text-clay">Sale price must be lower than the price.</p>}
      </div>
      <Field label="Price (R)" name="price" type="number" defaultValue={p.price} min={1} />
      <Field label="Sale price (R)" name="salePrice" type="number" defaultValue={p.salePrice ?? ""} min={1} placeholder="No sale" />
      <Field label="Sale ends" name="saleEnds" type="date" defaultValue={p.saleEnds ?? ""} />
      <Field label="Stock" name="stock" type="number" defaultValue={p.stock} min={0} />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs font-bold text-muted">
          <input type="checkbox" name="featured" defaultChecked={!!p.featured} className="accent-[var(--forest)]" /> Featured
        </label>
        <button type="submit" className="btn-primary !px-4 !py-2">
          {saved ? "Saved" : "Save"}
        </button>
        <button type="button" onClick={() => confirm(`Delete ${p.name}?`) && deleteProduct(p.id)} className="text-xs font-bold text-muted underline hover:text-clay">
          Delete
        </button>
      </div>
    </form>
  );
}

function Field({ label, ...input }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted">{label}</span>
      <input {...input} className="field !rounded-lg !px-3 !py-2 text-sm" />
    </label>
  );
}

function AddProduct({ onDone }: { onDone: () => void }) {
  const { products } = useShop();
  const images = [...new Set(products.map((p) => p.image))];
  const [image, setImage] = useState(images[0]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    addProduct({
      name: f.name,
      category: f.category as CategoryId,
      price: Number(f.price),
      salePrice: f.salePrice ? Number(f.salePrice) : null,
      saleEnds: null,
      stock: Number(f.stock) || 0,
      size: f.size,
      image,
      description: f.description,
      ingredients: f.ingredients || "Natural ingredients.",
      howToUse: f.howToUse || "Use as needed.",
      featured: false,
    });
    onDone();
  }
  return (
    <form onSubmit={submit} className="card mt-5 grid gap-4 p-6 md:grid-cols-2">
      <h2 className="font-display text-2xl font-semibold text-forest md:col-span-2">New product</h2>
      <Field label="Product name" name="name" required />
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted">Category</span>
        <select name="category" className="field !rounded-lg !px-3 !py-2 text-sm">
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Price (R)" name="price" type="number" min={1} required />
        <Field label="Sale price (R)" name="salePrice" type="number" min={1} placeholder="Optional" />
        <Field label="Stock" name="stock" type="number" min={0} defaultValue={10} />
      </div>
      <Field label="Size" name="size" placeholder="e.g. 250 ml" required />
      <label className="block md:col-span-2">
        <span className="mb-1 block text-xs font-bold text-muted">Description</span>
        <textarea name="description" required rows={3} className="field !rounded-lg !px-3 !py-2 text-sm" />
      </label>
      <Field label="Ingredients" name="ingredients" />
      <Field label="How to use" name="howToUse" />
      <div className="md:col-span-2">
        <span className="mb-2 block text-xs font-bold text-muted">Photo (in a live shop the owner uploads her own)</span>
        <div className="flex flex-wrap gap-2">
          {images.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setImage(src)}
              aria-label={`Use photo ${src.split("/").pop()}`}
              aria-pressed={image === src}
              className={`relative h-14 w-14 overflow-hidden rounded-lg border-2 ${image === src ? "border-clay" : "border-transparent"}`}
            >
              <Image src={src} alt="" fill sizes="3.5rem" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="btn-primary">
          Add to shop
        </button>
      </div>
    </form>
  );
}

function Orders() {
  const { orders } = useShop();
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card grid gap-3 p-5 md:grid-cols-[1fr_1.4fr_auto_auto] md:items-center">
          <div>
            <Link href={`/order/${o.id}`} className="font-extrabold text-forest hover:text-clay">
              {o.id}
            </Link>
            <p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="text-sm">
            <p className="font-bold">
              {o.customer.name} · {o.customer.phone}
            </p>
            <p className="text-muted">{o.lines.map((l) => `${l.qty} × ${l.name}`).join(", ")}</p>
          </div>
          <p className="font-extrabold">{rand(o.total)}</p>
          <select
            value={o.status}
            onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
            aria-label={`Status of ${o.id}`}
            className="field !w-auto !rounded-lg !py-2 text-sm font-bold"
          >
            {ORDER_STATUSES.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
