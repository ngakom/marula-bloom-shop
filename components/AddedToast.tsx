"use client";

import Link from "next/link";
import { useShop } from "@/lib/store";
import { Check } from "./Icons";

/** Slides in, then fades out, each time something is added to the cart (CSS timing; keyed per add so it replays). */
export default function AddedToast() {
  const { lastAdded, products } = useShop();
  const p = lastAdded ? products.find((x) => x.id === lastAdded.productId) : null;
  if (!p) return null;
  return (
    <div key={lastAdded!.at} role="status" className="toast fixed bottom-5 left-1/2 z-50 flex w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-3 rounded-2xl bg-forest px-5 py-4 text-cream shadow-2xl">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
        <Check />
      </span>
      <p className="flex-1 text-sm">
        <b>{p.name}</b> added to your cart
      </p>
      <Link href="/cart" className="shrink-0 text-sm font-bold text-sage underline underline-offset-2">
        View cart
      </Link>
    </div>
  );
}
