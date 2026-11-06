import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata: Metadata = { title: "Shop" };

// The filters live in the URL (?cat=face&sale=1), which needs a Suspense boundary.
export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
