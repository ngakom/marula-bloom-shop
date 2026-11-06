"use client";

import Image from "next/image";
import Link from "next/link";
import Price from "@/components/Price";
import { BRAND } from "@/lib/catalog";
import { cartTotals, priceOf, rand, setQty, useShop } from "@/lib/store";

export default function CartPage() {
  const s = useShop();
  const t = cartTotals(s);
  const toFree = Math.max(0, BRAND.freeDeliveryFrom - t.subtotal);

  if (!t.lines.length) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-forest">Your cart is empty</h1>
        <p className="mt-3 text-muted">Find something lovely for your skin or hair.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1.6fr_1fr] lg:px-8">
      <div>
        <h1 className="font-display text-5xl font-semibold text-forest">Your cart</h1>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {t.lines.map(({ product: p, qty }) => (
            <li key={p.id} className="flex gap-4 py-5">
              <Link href={`/product/${p.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image src={p.image} alt={p.name} fill sizes="6rem" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <Link href={`/product/${p.slug}`} className="font-display text-lg font-semibold text-forest hover:text-clay">
                    {p.name}
                  </Link>
                  <Price product={p} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-line bg-white">
                    <button type="button" onClick={() => setQty(p.id, qty - 1)} className="px-3 py-1.5 font-bold" aria-label={`Fewer ${p.name}`}>
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{qty}</span>
                    <button type="button" onClick={() => setQty(p.id, qty + 1)} className="px-3 py-1.5 font-bold" aria-label={`More ${p.name}`}>
                      +
                    </button>
                  </div>
                  <p className="w-20 text-right font-extrabold text-forest">{rand(priceOf(p) * qty)}</p>
                  <button type="button" onClick={() => setQty(p.id, 0)} className="text-sm font-semibold text-muted underline hover:text-clay">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="card h-fit p-7 lg:mt-20">
        <div>
          <p className="text-sm font-bold text-forest">{toFree > 0 ? `Add ${rand(toFree)} more for free delivery` : "You've unlocked free delivery 🎉"}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${Math.min(100, (t.subtotal / BRAND.freeDeliveryFrom) * 100)}%` }} />
          </div>
        </div>
        <dl className="mt-6 space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal ({t.count} items)</dt>
            <dd className="font-bold">{rand(t.subtotal)}</dd>
          </div>
          {t.savings > 0 && (
            <div className="flex justify-between text-clay">
              <dt>You save</dt>
              <dd className="font-bold">−{rand(t.savings)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-sm text-muted">Chosen at checkout</dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn-primary mt-6 w-full">
          Checkout
        </Link>
        <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-muted underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
