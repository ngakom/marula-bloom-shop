"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Price from "@/components/Price";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/catalog";
import { addToCart, onSale, useShop } from "@/lib/store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useShop();
  const p = products.find((x) => x.slug === slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-forest">Product not found</h1>
        <Link href="/shop" className="btn-primary mt-6">
          Back to the shop
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === p.category);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const lowStock = p.stock > 0 && p.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="text-sm text-muted">
        <Link href="/shop" className="hover:text-clay">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?cat=${p.category}`} className="hover:text-clay">
          {category?.name}
        </Link>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand">
          <Image src={p.image} alt={p.name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          {onSale(p) && <span className="absolute left-5 top-5 rounded-full bg-clay px-4 py-1.5 text-sm font-extrabold text-white">Sale!</span>}
        </div>

        <div className="fade-up">
          <h1 className="font-display text-4xl font-semibold leading-tight text-forest sm:text-5xl">{p.name}</h1>
          <p className="mt-2 text-muted">{p.size}</p>
          <Price product={p} large className="mt-5" />
          {onSale(p) && p.saleEnds && <p className="mt-2 text-sm font-semibold text-clay">Sale ends {new Date(p.saleEnds).toLocaleDateString("en-ZA", { day: "numeric", month: "long" })}</p>}

          <p className="mt-6 text-lg leading-relaxed text-ink/85">{p.description}</p>

          <p className={`mt-5 text-sm font-bold ${p.stock <= 0 ? "text-clay" : lowStock ? "text-gold" : "text-forest-soft"}`}>
            {p.stock <= 0 ? "Sold out" : lowStock ? `Only ${p.stock} left in stock` : "In stock"}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border-2 border-forest">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg font-bold" aria-label="Fewer">
                −
              </button>
              <span className="w-8 text-center font-bold" aria-live="polite">
                {qty}
              </span>
              <button type="button" onClick={() => setQty((q) => Math.min(p.stock, q + 1))} className="px-4 py-2.5 text-lg font-bold" aria-label="More">
                +
              </button>
            </div>
            <button
              type="button"
              disabled={p.stock <= 0}
              onClick={() => {
                addToCart(p.id, qty);
                setAdded(true);
              }}
              className="btn-primary flex-1 sm:flex-none"
            >
              Add to cart
            </button>
          </div>
          {added && (
            <p className="mt-4 rounded-xl bg-sage/20 px-4 py-3 text-sm font-semibold text-forest">
              Added to your cart.{" "}
              <Link href="/cart" className="underline">
                View cart
              </Link>
            </p>
          )}

          <div className="mt-8 space-y-3">
            <details className="card p-5" open>
              <summary className="cursor-pointer font-bold text-forest">Ingredients</summary>
              <p className="mt-2 text-muted">{p.ingredients}</p>
            </details>
            <details className="card p-5">
              <summary className="cursor-pointer font-bold text-forest">How to use</summary>
              <p className="mt-2 text-muted">{p.howToUse}</p>
            </details>
            <details className="card p-5">
              <summary className="cursor-pointer font-bold text-forest">Delivery</summary>
              <p className="mt-2 text-muted">Courier (2–4 working days), PAXI collection or collect in store. Free delivery on orders over R500.</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-semibold text-forest">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
