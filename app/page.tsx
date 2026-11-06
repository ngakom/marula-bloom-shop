"use client";

import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { BRAND, CATEGORIES } from "@/lib/catalog";
import { onSale, useShop } from "@/lib/store";

const PERKS = [
  { title: "Free delivery", text: `On orders over R${BRAND.freeDeliveryFrom}` },
  { title: "Natural ingredients", text: "Marula, shea, rooibos and baobab" },
  { title: "Secure checkout", text: "Card or EFT payment" },
  { title: "Earn rewards", text: "Register to track every order" },
];

export default function Home() {
  const { products } = useShop();
  const sale = products.filter(onSale).slice(0, 4);
  const best = products.filter((p) => p.bestseller).slice(0, 4);
  const catImage = (id: string) => products.find((p) => p.category === id)?.image ?? "/images/hero.jpg";

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
        <div className="fade-up">
          <p className="eyebrow">Made in South Africa</p>
          <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] text-forest sm:text-6xl">
            Natural care for <em className="pr-1 text-clay">your</em> skin &amp; hair
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Oils, butters and soaps made with marula, shea and rooibos. Gentle on skin, kind to natural hair, and delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop now
            </Link>
            <Link href="/shop?sale=1" className="btn-gold">
              See the sale
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] sm:aspect-[5/5]">
            <Image src="/images/hero.jpg" alt="A smiling woman with healthy glowing skin and natural hair" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-top" />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
            <p className="font-display text-2xl font-semibold text-forest">4.9 ★</p>
            <p className="text-xs font-bold text-muted">Sample rating for the demo</p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-y border-line bg-sand">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-7 lg:grid-cols-4 lg:px-8">
          {PERKS.map((p) => (
            <div key={p.title}>
              <p className="font-bold text-forest">{p.title}</p>
              <p className="text-sm text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h2 className="font-display text-4xl font-semibold text-forest">Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/shop?cat=${c.id}`} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={catImage(c.id)} alt="" fill sizes="(min-width: 768px) 18vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-cream">
                <p className="font-display text-xl font-semibold">{c.name}</p>
                <p className="text-xs text-cream/85">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale */}
      {sale.length > 0 && (
        <section className="bg-gold-soft/50 py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Limited time</p>
                <h2 className="font-display mt-2 text-4xl font-semibold text-forest">On sale now</h2>
              </div>
              <Link href="/shop?sale=1" className="btn-outline">
                View all deals
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {sale.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-semibold text-forest">Bestsellers</h2>
          <Link href="/shop" className="btn-outline">
            Shop all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src="/images/story.jpg" alt="Marula Bloom skincare bottles on linen" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-forest">Small batches, big care</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Every Marula Bloom product is made in small batches with oils and butters sourced from Southern Africa. No harsh sulphates, no
            fillers, just ingredients your skin and hair recognise.
          </p>
          <Link href="/account" className="btn-primary mt-8">
            Create an account
          </Link>
        </div>
      </section>
    </>
  );
}
