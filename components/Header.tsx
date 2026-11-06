"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/lib/catalog";
import { cartTotals, currentUser, useShop } from "@/lib/store";

const NAV = [
  { label: "Shop all", href: "/shop" },
  { label: "Face", href: "/shop?cat=face" },
  { label: "Body", href: "/shop?cat=body" },
  { label: "Hair", href: "/shop?cat=hair" },
  { label: "Soap & Bath", href: "/shop?cat=soap" },
  { label: "Sale", href: "/shop?sale=1" },
];

export default function Header() {
  const s = useShop();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = cartTotals(s);
  const user = currentUser(s);
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* Demo notice: this is a showcase shop, not a real business. */}
      <div className="bg-forest px-4 py-2 text-center text-xs font-semibold text-cream sm:text-sm">
        Demo shop by <a href="https://www.mbttechsphere.co.za" className="underline underline-offset-2">MBT TechSphere Solutions</a> · no real
        payments ·{" "}
        <Link href="/admin" className="text-sage underline underline-offset-2">
          try the owner dashboard
        </Link>
      </div>
      {!isAdmin && (
        <div className="bg-gold-soft px-4 py-1.5 text-center text-xs font-bold text-forest">
          Free delivery on orders over R{BRAND.freeDeliveryFrom} · Sale now on
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-forest sm:text-[1.7rem]">
            Marula <span className="text-gold">Bloom</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`text-sm font-bold transition-colors hover:text-clay ${n.label === "Sale" ? "text-clay" : "text-ink"}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/account" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-ink hover:bg-sand" aria-label="My account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
              <span className="hidden sm:inline">{user ? user.name.split(" ")[0] : "Log in"}</span>
            </Link>
            <Link href="/cart" className="relative flex items-center rounded-full p-2 text-ink hover:bg-sand" aria-label={`Cart, ${count} items`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && (
                <span key={count} className="pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[11px] font-extrabold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="rounded-full p-2 lg:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-line px-5 pb-5 lg:hidden" aria-label="Mobile" onClick={() => setOpen(false)}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block border-b border-line py-3.5 font-bold">
                {n.label}
              </Link>
            ))}
            <Link href="/account" className="block border-b border-line py-3.5 font-bold">
              {user ? "My account" : "Log in / Register"}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
