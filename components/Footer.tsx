import Link from "next/link";
import { BRAND, CATEGORIES } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="mt-20 bg-forest text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">
            Marula <span className="text-sage">Bloom</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/75">{BRAND.tagline}. A fictional brand created to demonstrate an online shop.</p>
        </div>
        <div>
          <p className="text-sm font-bold text-sage">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/shop?cat=${c.id}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-sage">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>
              <Link href="/account" className="hover:text-white">
                Log in / Register
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white">
                My orders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Owner dashboard (demo)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-sage">Want a shop like this?</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/80">Online shops with accounts, sales, payments and an owner dashboard.</p>
          <a href="https://www.mbttechsphere.co.za/#contact" className="btn-gold mt-4 !px-5 !py-2.5">
            Talk to MBT TechSphere
          </a>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-cream/60 lg:px-8">
          © {new Date().getFullYear()} Demo by MBT TechSphere Solutions · Product photos from Pexels · No real orders or payments are processed.
        </p>
      </div>
    </footer>
  );
}
