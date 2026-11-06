"use client";

import Link from "next/link";
import AuthForms from "@/components/AuthForms";
import { currentUser, logout, rand, useShop } from "@/lib/store";

const STATUS_STYLE: Record<string, string> = {
  "Awaiting payment": "bg-clay/15 text-clay",
  Paid: "bg-gold-soft text-forest",
  Packed: "bg-sand text-forest",
  Shipped: "bg-sage/30 text-forest",
  Delivered: "bg-forest text-cream",
  Cancelled: "bg-clay/15 text-clay",
};

export default function AccountPage() {
  const s = useShop();
  const user = currentUser(s);

  if (!user) {
    return (
      <div className="px-5 py-12">
        <h1 className="font-display mb-8 text-center text-5xl font-semibold text-forest">My account</h1>
        <AuthForms intro="Register to check out faster and track your orders." />
      </div>
    );
  }

  const orders = s.orders.filter((o) => o.customer.email === user.email);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="font-display mt-2 text-5xl font-semibold text-forest">Hi, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-muted">
            {user.email} · {user.phone}
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-outline">
          Log out
        </button>
      </div>

      <h2 className="font-display mt-12 text-3xl font-semibold text-forest">My orders</h2>
      {orders.length ? (
        <ul className="mt-5 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/order/${o.id}`} className="card flex flex-wrap items-center justify-between gap-3 p-5 transition-colors hover:border-forest">
                <div>
                  <p className="font-extrabold text-forest">{o.id}</p>
                  <p className="text-sm text-muted">
                    {new Date(o.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })} · {o.lines.reduce((n, l) => n + l.qty, 0)} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                  <span className="font-extrabold">{rand(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card mt-5 p-8 text-center">
          <p className="text-muted">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-primary mt-5">
            Start shopping
          </Link>
        </div>
      )}
    </div>
  );
}
