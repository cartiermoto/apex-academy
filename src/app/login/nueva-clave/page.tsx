"use client";

import { useState } from "react";
import { AuthScene } from "@/components/auth-scene";
import { useSettings } from "@/components/providers";
import { t, ui } from "@/lib/i18n";
import { supabaseBrowser } from "@/lib/supabase/client";

/** The reset link from the email lands here, already signed in by /auth/callback. */
export default function NewPasswordPage() {
  const { lang } = useSettings();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError(t(ui.passwordTooShort, lang));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabaseBrowser().auth.updateUser({ password });
      if (err) {
        setError(err.code === "same_password" ? t(ui.samePassword, lang) : t(ui.authUnavailable, lang));
        return;
      }
      window.location.assign("/");
    } catch {
      setError(t(ui.authUnavailable, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthScene title={t(ui.newPassword, lang)} say={t(ui.authSayNewPassword, lang)}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-[14px] font-medium">
          {t(ui.password, lang)}
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t(ui.passwordRule, lang)}
            autoComplete="new-password"
            className="auth-input"
          />
        </label>
        {error && (
          <p role="alert" className="m-0 text-[15px] text-[var(--c-danger)]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="auth-submit">
          {busy ? t(ui.checking, lang) : t(ui.savePassword, lang)}
        </button>
      </form>
    </AuthScene>
  );
}
