"use client";

import { useState, type FormEvent } from "react";
import { login, register } from "@/lib/store";

/** Register / log in, used on the account page and at checkout. */
export default function AuthForms({ intro }: { intro?: string }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setError(mode === "register" ? await register(f.name, f.email, f.phone, f.password) : await login(f.email, f.password));
    setBusy(false);
  }

  return (
    <div className="card mx-auto max-w-md p-7 sm:p-9">
      <div className="grid grid-cols-2 rounded-full bg-sand p-1">
        {(["register", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full py-2.5 text-sm font-bold transition-colors ${mode === m ? "bg-forest text-cream" : "text-forest"}`}
          >
            {m === "register" ? "Create account" : "Log in"}
          </button>
        ))}
      </div>
      {intro && <p className="mt-5 text-sm text-muted">{intro}</p>}

      <form onSubmit={submit} className="mt-6 space-y-4" key={mode}>
        {mode === "register" && (
          <>
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input id="name" name="name" required autoComplete="name" className="field" />
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Cellphone
              </label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
            </div>
          </>
        )}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === "register" ? "new-password" : "current-password"} className="field" />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Please wait…" : mode === "register" ? "Create my account" : "Log in"}
        </button>
        <p className="text-center text-xs text-muted">Demo only: accounts are saved in this browser, so don&apos;t use a real password.</p>
      </form>
    </div>
  );
}
