import type { Product } from "@/lib/catalog";
import { onSale, rand } from "@/lib/store";

/** Regular price, or the sale price with the original crossed out (like WooCommerce's "Sale!"). */
export default function Price({ product: p, className = "", large = false }: { product: Product; className?: string; large?: boolean }) {
  const size = large ? "text-3xl" : "text-base";
  if (!onSale(p)) return <p className={`${size} font-extrabold text-forest ${className}`}>{rand(p.price)}</p>;
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <del className={`${large ? "text-xl" : "text-sm"} font-semibold text-muted`} aria-label={`Original price ${rand(p.price)}`}>
        {rand(p.price)}
      </del>
      <span className={`${size} font-extrabold text-clay`}>{rand(p.salePrice!)}</span>
      {large && <span className="rounded-full bg-clay/10 px-2.5 py-0.5 text-sm font-bold text-clay">Save {rand(p.price - p.salePrice!)}</span>}
    </p>
  );
}
