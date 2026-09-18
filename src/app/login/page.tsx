"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mark } from "@/components/logo";
import { useSettings } from "@/components/providers";
import { t, ui } from "@/lib/i18n";
import { LangToggle, ThemeToggle } from "@/components/toggles";

function LoginForm() {
  const { lang } = useSettings();
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace(params.get("next") || "/");
      router.refresh();
    } else {
      setState("error");
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center px-5 py-16">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LangToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm fade-in">
        <div className="flex flex-col items-center text-center">
          <Mark size={44} className="text-brand" />
          <h1 className="t-h1 mt-6">Apex Academy</h1>
          <p className="t-small text-muted mt-2 max-w-[28ch]">
            {t(ui.tagline, lang)}
          </p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-3">
          <label className="block">
            <span className="t-micro text-muted">{t(ui.password, lang)}</span>
            <input
              type="password"
              value={password}
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value);
                if (state === "error") setState("idle");
              }}
              className="mt-1.5 w-full rounded-[10px] border border-line bg-surface px-3.5 py-3 text-ink outline-none transition focus:border-brand"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {state === "error" && (
            <p className="t-small text-[var(--c-danger)]">
              {t(ui.wrongPassword, lang)}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "busy" || !password}
            className="btn btn-primary w-full py-3"
          >
            {state === "busy" ? t(ui.checking, lang) : t(ui.enter, lang)}
          </button>
        </form>

        <p className="t-micro text-faint mt-8 text-center leading-relaxed">
          {t(ui.signInHint, lang)}
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
