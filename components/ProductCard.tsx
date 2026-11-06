"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { addToCart, onSale } from "@/lib/store";
import Price from "./Price";

export default function ProductCard({ product: p }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const sale = onSale(p);
  const soldOut = p.stock <= 0;

  return (
    <div className="group flex flex-col">
      <Link href={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-sand">
        <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {sale && <span className="rounded-full bg-clay px-3 py-1 text-xs font-extrabold text-white">Sale!</span>}
          {p.bestseller && !sale && <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-forest">Bestseller</span>}
        </div>
        {soldOut && <span className="absolute inset-x-0 bottom-0 bg-forest/85 py-2 text-center text-sm font-bold text-cream">Sold out</span>}
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/product/${p.slug}`} className="font-display text-lg font-semibold leading-snug text-forest hover:text-clay">
          {p.name}
        </Link>
        <p className="text-xs text-muted">{p.size}</p>
        <Price product={p} className="mt-1.5" />
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            addToCart(p.id);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
          className="btn-outline mt-3 !py-2.5"
        >
          {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
