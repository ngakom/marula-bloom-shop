"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthForms from "@/components/AuthForms";
import { BRAND, DELIVERY_OPTIONS, type DeliveryId } from "@/lib/catalog";
import { cartTotals, currentUser, placeOrder, priceOf, rand, useShop } from "@/lib/store";

export default function CheckoutPage() {
  const s = useShop();
  const router = useRouter();
  const user = currentUser(s);
  const [delivery, setDelivery] = useState<DeliveryId>("courier");
  const [payment, setPayment] = useState<"card" | "eft">("card");
  const [paying, setPaying] = useState(false);
  const t = cartTotals(s, delivery);

  if (!t.lines.length && !paying) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-forest">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-5 py-12">
        <h1 className="font-display mb-8 text-center text-5xl font-semibold text-forest">Checkout</h1>
        <AuthForms intro="Create an account or log in to complete your order. Your cart is saved." />
      </div>
    );
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const address = delivery === "collect" ? "Collect in store" : `${f.street}, ${f.suburb}, ${f.city}, ${f.postal}`;
    setPaying(true);
    // Stands in for the redirect to a payment gateway such as PayFast or Yoco.
    setTimeout(() => {
      const id = placeOrder({ name: f.name, email: user!.email, phone: f.phone, address, delivery, payment });
      if (id) router.push(`/order/${id}?new=1`);
    }, payment === "card" ? 1800 : 600);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-5xl font-semibold text-forest">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-forest">1. Your details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label">
                  Full name
                </label>
                <input id="name" name="name" required defaultValue={user.name} className="field" />
              </div>
              <div>
                <label htmlFor="phone" className="label">
                  Cellphone
                </label>
                <input id="phone" name="phone" required defaultValue={user.phone} className="field" />
              </div>
            </div>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-forest">2. Delivery</h2>
            <div className="mt-5 space-y-3">
              {DELIVERY_OPTIONS.map((d) => (
                <label key={d.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 p-4 ${delivery === d.id ? "border-forest bg-sand/50" : "border-line"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" value={d.id} checked={delivery === d.id} onChange={() => setDelivery(d.id)} className="accent-[var(--forest)]" />
                    <span>
                      <span className="block font-bold">{d.name}</span>
                      <span className="text-sm text-muted">{d.detail}</span>
                    </span>
                  </span>
                  <span className="font-bold">{d.price === 0 || t.subtotal >= BRAND.freeDeliveryFrom ? "Free" : rand(d.price)}</span>
                </label>
              ))}
            </div>
            {delivery !== "collect" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="street" className="label">
                    Street address
                  </label>
                  <input id="street" name="street" required autoComplete="street-address" className="field" />
                </div>
                <div>
                  <label htmlFor="suburb" className="label">
                    Suburb
                  </label>
                  <input id="suburb" name="suburb" required className="field" />
                </div>
                <div>
                  <label htmlFor="city" className="label">
                    City
                  </label>
                  <input id="city" name="city" required autoComplete="address-level2" className="field" />
                </div>
                <div>
                  <label htmlFor="postal" className="label">
                    Postal code
                  </label>
                  <input id="postal" name="postal" required inputMode="numeric" autoComplete="postal-code" className="field" />
                </div>
              </div>
            )}
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-forest">3. Payment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["card", "Card / Instant EFT", "Secure payment via PayFast (demo)"],
                  ["eft", "Manual EFT", "Pay into our account; we ship once paid"],
                ] as const
              ).map(([id, name, detail]) => (
                <label key={id} className={`cursor-pointer rounded-xl border-2 p-4 ${payment === id ? "border-forest bg-sand/50" : "border-line"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="accent-[var(--forest)]" />
                    <span className="font-bold">{name}</span>
                  </span>
                  <span className="mt-1 block pl-7 text-sm text-muted">{detail}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="card h-fit p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl font-semibold text-forest">Order summary</h2>
          <ul className="mt-5 space-y-3">
            {t.lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex justify-between gap-3 text-sm">
                <span>
                  {qty} × {p.name}
                </span>
                <span className="font-bold">{rand(priceOf(p) * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-5">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold">{rand(t.subtotal)}</dd>
            </div>
            {t.savings > 0 && (
              <div className="flex justify-between text-clay">
                <dt>Sale savings</dt>
                <dd className="font-bold">−{rand(t.savings)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-bold">{t.deliveryFee ? rand(t.deliveryFee) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg">
              <dt className="font-extrabold">Total</dt>
              <dd className="font-extrabold text-forest">{rand(t.total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={paying} className="btn-primary mt-6 w-full">
            {paying ? (payment === "card" ? "Connecting to secure payment…" : "Placing order…") : `Pay ${rand(t.total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted">Demo checkout: no money is taken.</p>
        </aside>
      </form>
    </div>
  );
}
