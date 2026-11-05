"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthScene } from "@/components/auth-scene";
import { useSettings } from "@/components/providers";
import { t, ui } from "@/lib/i18n";
import { supabaseBrowser } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot";
const MIN_PASSWORD = 8;

function LoginForm() {
  const { lang } = useSettings();
  const params = useSearchParams();
  // Only same-site paths: "/x" yes, "//evil.com" or "https://…" no.
  const rawNext = params.get("next") ?? "/";
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const choose = (m: Mode) => {
    setMode(m);
    setError(null);
    setSent(null);
  };

  function authProblem(code: string | undefined) {
    return code === "over_email_send_rate_limit" ? t(ui.tooManyEmails, lang) : t(ui.authUnavailable, lang);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(null);
    if (mode === "signup" && password.length < MIN_PASSWORD) {
      setError(t(ui.passwordTooShort, lang));
      return;
    }
    setBusy(true);
    const callback = (next: string) => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    try {
      const sb = supabaseBrowser();
      if (mode === "signin") {
        const { error: err } = await sb.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.code === "email_not_confirmed" ? t(ui.emailNotConfirmed, lang) : t(ui.wrongCredentials, lang));
          return;
        }
        // Full reload so the app picks up the session and runs the first sync.
        window.location.assign(safeNext);
        return;
      }
      if (mode === "signup") {
        const { error: err } = await sb.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callback(safeNext) },
        });
        if (err) {
          setError(err.code === "weak_password" ? t(ui.passwordTooShort, lang) : authProblem(err.code));
          return;
        }
        setSent(t(ui.confirmSent, lang));
        return;
      }
      const { error: err } = await sb.auth.resetPasswordForEmail(email, { redirectTo: callback("/login/nueva-clave") });
      if (err) {
        setError(authProblem(err.code));
        return;
      }
      setSent(t(ui.resetSent, lang));
    } catch {
      setError(t(ui.authUnavailable, lang));
    } finally {
      setBusy(false);
    }
  }

  const copy = {
    signin: { title: ui.authTitleSignin, say: ui.authSaySignin, cta: ui.enter },
    signup: { title: ui.authTitleSignup, say: ui.authSaySignup, cta: ui.createAccount },
    forgot: { title: ui.authTitleForgot, say: ui.authSayForgot, cta: ui.sendLink },
  }[mode];

  return (
    <AuthScene
      title={t(copy.title, lang)}
      say={t(copy.say, lang)}
      footerLink={{ href: safeNext, label: t(ui.continueWithoutAccount, lang) }}
    >
      {params.get("link") && !sent && !error && <p className="auth-note m-0">{t(ui.linkProblem, lang)}</p>}

      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-[14px] font-medium">
          {t(ui.email, lang)}
          <input
            type="email"
            required
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder={lang === "es" ? "tu@correo.com" : "you@email.com"}
            autoComplete="email"
          />
        </label>

        {mode !== "forgot" && (
          <label className="flex flex-col gap-1.5 text-[14px] font-medium">
            {t(ui.password, lang)}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder={t(ui.passwordRule, lang)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>
        )}

        {error && (
          <p role="alert" className="m-0 text-[15px] text-[var(--c-danger)]">
            {error}
          </p>
        )}
        {sent && (
          <p role="status" className="auth-note m-0">
            {sent}
          </p>
        )}

        <button type="submit" disabled={busy} className="auth-submit">
          {busy ? t(ui.checking, lang) : t(copy.cta, lang)}
        </button>
      </form>

      <div className="flex flex-wrap justify-between gap-x-4 text-[15px]">
        {mode === "signin" ? (
          <>
            <button type="button" className="auth-link font-semibold" onClick={() => choose("signup")}>
              {t(ui.noAccount, lang)}
            </button>
            <button type="button" className="auth-link" onClick={() => choose("forgot")}>
              {t(ui.forgotPassword, lang)}
            </button>
          </>
        ) : (
          <button type="button" className="auth-link font-semibold" onClick={() => choose("signin")}>
            {t(ui.haveAccount, lang)}
          </button>
        )}
      </div>
    </AuthScene>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
