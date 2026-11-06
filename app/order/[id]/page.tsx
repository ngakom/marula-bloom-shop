"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DELIVERY_OPTIONS, ORDER_STATUSES } from "@/lib/catalog";
import { currentUser, rand, useShop } from "@/lib/store";

function OrderView() {
  const { id } = useParams<{ id: string }>();
  const isNew = useSearchParams().get("new") === "1";
  const s = useShop();
  const user = currentUser(s);
  const o = s.orders.find((x) => x.id === id);

  if (!o || (o.customer.email !== user?.email && !s.admin)) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-forest">Order not found</h1>
        <p className="mt-3 text-muted">Log in to see your orders.</p>
        <Link href="/account" className="btn-primary mt-8">
          My account
        </Link>
      </div>
    );
  }

  const steps = ORDER_STATUSES.filter((st) => st !== "Cancelled" && st !== "Awaiting payment");
  const reached = steps.indexOf(o.status as (typeof steps)[number]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      {isNew && (
        <div className="fade-up mb-8 rounded-2xl bg-forest p-7 text-cream">
          <p className="font-display text-3xl font-semibold">Thank you for your order!</p>
          <p className="mt-2 text-cream/85">
            {o.payment === "eft" ? "Your order ships once your EFT payment reflects." : "Your payment was successful."} In a live shop, a confirmation email would also go to {o.customer.email}.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold text-forest">Order {o.id}</h1>
        <p className="text-muted">{new Date(o.createdAt).toLocaleString("en-ZA", { dateStyle: "long", timeStyle: "short" })}</p>
      </div>

      {o.status === "Cancelled" ? (
        <p className="mt-6 rounded-xl bg-clay/10 px-5 py-4 font-bold text-clay">This order was cancelled.</p>
      ) : (
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {steps.map((st, i) => (
            <li key={st} className="text-center">
              <span className={`mx-auto block h-2 rounded-full ${i <= reached ? "bg-forest" : "bg-line"}`} />
              <span className={`mt-2 block text-xs font-bold sm:text-sm ${i <= reached ? "text-forest" : "text-muted"}`}>{st}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="card mt-8 p-6 sm:p-8">
        <ul className="space-y-3">
          {o.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4">
              <span>
                {l.qty} × {l.name}
              </span>
              <span className="font-bold">{rand(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{DELIVERY_OPTIONS.find((d) => d.id === o.delivery)?.name}</dt>
            <dd className="font-bold">{o.deliveryFee ? rand(o.deliveryFee) : "Free"}</dd>
          </div>
          <div className="flex justify-between text-lg">
            <dt className="font-extrabold">Total paid</dt>
            <dd className="font-extrabold text-forest">{rand(o.total)}</dd>
          </div>
        </dl>
        <p className="mt-5 text-sm text-muted">Delivering to: {o.address}</p>
      </div>

      {o.status === "Awaiting payment" && (
        <div className="card mt-6 p-6 text-sm">
          <p className="font-bold text-forest">EFT details (demo)</p>
          <p className="mt-2 text-muted">Bank: Demo Bank · Account: 000 000 000 · Reference: {o.id}</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/account" className="btn-outline">
          All my orders
        </Link>
        <Link href="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderView />
    </Suspense>
  );
}
