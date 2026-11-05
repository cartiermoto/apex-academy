"use client";

import Link from "next/link";
import { LangToggle, ThemeToggle } from "./toggles";

/**
 * The stage of the account screens: a huge question on the brand green and the
 * otter holding the form in its speech bubble. The green is the same in both
 * themes; the bubble follows the theme.
 */
export function AuthScene({
  title,
  say,
  footerLink,
  children,
}: {
  title: string;
  /** what the otter says, at the top of the bubble */
  say: string;
  footerLink?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <main className="auth-scene flex min-h-dvh flex-col overflow-hidden px-5 pt-3 sm:px-8 lg:px-16 lg:pt-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="inline-flex min-h-[44px] items-center text-[20px] font-bold">
          Apex Academy
        </Link>
        <div className="flex items-center gap-2">
          {footerLink && (
            <Link href={footerLink.href} className="inline-flex min-h-[44px] items-center px-2 text-[15px] underline underline-offset-4">
              {footerLink.label}
            </Link>
          )}
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <h1 className="auth-title m-0 mt-2">{title}</h1>

      {/* Phone: the bubble first, the otter under it. */}
      <div className="mt-2 flex flex-1 flex-col-reverse items-center lg:flex-row lg:items-end lg:justify-center lg:gap-x-3">
        {/* sunk a little below the edge, so floating never shows where it is cut */}
        <div className="-mb-3 w-[min(100%,240px)] flex-none lg:w-auto lg:min-w-0 lg:max-w-[500px] lg:flex-[1_1_320px]">
          <div className="e-otter-float">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed illustration from /public */}
            <img
              className="e-otter-img"
              style={{ height: "auto" }}
              src="/mascot/apex-academy-mascota-verde-full-illustration.png"
              alt=""
              width={480}
              height={480}
              draggable={false}
            />
          </div>
        </div>

        <div className="flex w-full min-w-0 max-w-[520px] items-center pb-6 lg:w-auto lg:flex-[1_1_400px] lg:self-center lg:pb-8">
          <svg aria-hidden width="26" height="44" viewBox="0 0 26 44" className="-mr-px hidden flex-none lg:block">
            <path d="M26 0 0 22l26 22Z" fill="var(--c-bg)" />
          </svg>
          <div className="auth-card flex min-w-0 flex-1 flex-col gap-3.5 rounded-[32px] p-5 sm:p-8">
            <p className="m-0 text-[20px] font-semibold leading-[1.35]">{say}</p>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
