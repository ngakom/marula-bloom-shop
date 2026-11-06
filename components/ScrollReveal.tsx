"use client";

import { useEffect } from "react";

/**
 * Reveals [data-reveal] elements and the children of [data-reveal-group] as they scroll into view
 * (styles in globals.css). A MutationObserver also catches products that appear later, e.g. after filtering.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const sel = "[data-reveal]:not(.in), [data-reveal-group]:not(.in)";
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(sel).forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    const watch = () => document.querySelectorAll(sel).forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
