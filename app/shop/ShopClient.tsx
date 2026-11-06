"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/catalog";
import { onSale, priceOf, useShop } from "@/lib/store";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "new", label: "Newest" },
] as const;

export default function ShopClient() {
  const { products } = useShop();
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("cat");
  const saleOnly = params.get("sale") === "1";
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");

  const href = (next: { cat?: string | null; sale?: boolean }) => {
    const u = new URLSearchParams();
    const c = next.cat === undefined ? cat : next.cat;
    const s = next.sale === undefined ? saleOnly : next.sale;
    if (c) u.set("cat", c);
    if (s) u.set("sale", "1");
    return `/shop${u.size ? `?${u}` : ""}`;
  };

  const list = products
    .filter((p) => (!cat || p.category === cat) && (!saleOnly || onSale(p)) && (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) =>
      sort === "low" ? priceOf(a) - priceOf(b) : sort === "high" ? priceOf(b) - priceOf(a) : sort === "new" ? b.createdAt.localeCompare(a.createdAt) : Number(!!b.featured) - Number(!!a.featured)
    );

  const title = saleOnly ? "Sale" : (CATEGORIES.find((c) => c.id === cat)?.name ?? "Shop all");

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-5xl font-semibold text-forest">{title}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={href({ cat: null })} className={`rounded-full px-4 py-2 text-sm font-bold ${!cat ? "bg-forest text-cream" : "bg-sand text-forest hover:bg-gold-soft"}`}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={href({ cat: c.id })} className={`rounded-full px-4 py-2 text-sm font-bold ${cat === c.id ? "bg-forest text-cream" : "bg-sand text-forest hover:bg-gold-soft"}`}>
            {c.name}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => router.push(href({ sale: !saleOnly }))}
          className={`rounded-full px-4 py-2 text-sm font-bold ${saleOnly ? "bg-clay text-white" : "bg-clay/10 text-clay hover:bg-clay/20"}`}
        >
          On sale
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" className="field sm:max-w-xs" />
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">{list.length} products</p>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort" className="field !w-auto !py-2.5">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">No products match. Try another category or search.</p>
      )}
    </div>
  );
}
