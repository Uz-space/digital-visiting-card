import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { profile, socials, wallets, buildVCard, type CryptoWallet } from "@/lib/vizitka";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diyorbek Valiyev — Raqamli vizitka" },
      {
        name: "description",
        content:
          "Diyorbek Valiyev shaxsiy raqamli vizitkasi: ijtimoiy tarmoqlar va crypto hamyonlar.",
      },
      { property: "og:title", content: "Diyorbek Valiyev — Raqamli vizitka" },
      {
        property: "og:description",
        content:
          "Diyorbek Valiyev shaxsiy raqamli vizitkasi: ijtimoiy tarmoqlar va crypto hamyonlar.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.tagline,
          address: { "@type": "PostalAddress", addressLocality: profile.location },
          sameAs: socials.map((s) => s.url),
        }),
      },
    ],
  }),
  component: Vizitka,
});

/* ── Icons (inline SVG, no dependency) ── */
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.6 18.9 19.2c-.23 1.02-.84 1.27-1.7.79l-4.7-3.47-2.27 2.18c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L7.37 13.2l-4.64-1.45c-1-.31-1.02-1 .21-1.48l18.14-6.99c.83-.31 1.56.2 1.29 1.32Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function abbreviate(addr: string): string {
  const a = addr.trim();
  if (a.length <= 14) return a;
  return `${a.slice(0, 6)}…${a.slice(-5)}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
        {children}
      </h2>
      <span className="h-px w-10 bg-accent/45" />
    </div>
  );
}

function SocialRow({
  label,
  handle,
  url,
  icon,
}: {
  label: string;
  handle: string;
  url: string;
  icon: "telegram" | "instagram";
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border-t border-hair py-4 transition-colors duration-200 hover:bg-muted/55"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full text-accent transition-colors duration-200 ring-1 ring-hair group-hover:ring-accent">
        {icon === "telegram" ? (
          <TelegramIcon className="size-[18px]" />
        ) : (
          <InstagramIcon className="size-[18px]" />
        )}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span className="truncate text-base font-medium text-foreground">{handle}</span>
      </span>
      <ArrowIcon className="ml-auto size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
    </a>
  );
}

function WalletRow({ wallet }: { wallet: CryptoWallet }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(wallet.address);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = wallet.address;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="border-t border-hair py-4">
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: wallet.color }}
        />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
          {wallet.network}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          · {wallet.ticker}
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <code className="addr min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
          {wallet.address}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={`${wallet.network} manzilidan nusxa olish`}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3" />
              Nusxalandi
            </>
          ) : (
            <>
              <CopyIcon className="size-3" />
              Nusxa
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Vizitka() {
  function saveContact() {
    const vcf = buildVCard();
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diyorbek-valiyev.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden bg-background">
      {/* soft accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-[0.5]"
        style={{
          background:
            "radial-gradient(75% 60% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[460px] px-6 pt-16 pb-12 sm:px-8">
        {/* Hero */}
        <header className="rise">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Raqamli vizitka
          </p>
          <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {profile.tagline}
          </p>
          <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {profile.bio}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
            {profile.location}
          </p>
        </header>

        {/* Bog'lanish */}
        <section className="rise mt-14" style={{ animationDelay: "0.1s" }}>
          <SectionLabel>Bog'lanish</SectionLabel>
          <div className="mt-4">
            {socials.map((s) => (
              <SocialRow
                key={s.id}
                label={s.label}
                handle={s.handle}
                url={s.url}
                icon={s.icon}
              />
            ))}
          </div>
        </section>

        {/* Crypto hamyonlar */}
        <section className="rise mt-14" style={{ animationDelay: "0.18s" }}>
          <SectionLabel>Crypto hamyonlar</SectionLabel>
          <div className="mt-4">
            {wallets.map((w) => (
              <WalletRow key={w.id} wallet={w} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="rise mt-16" style={{ animationDelay: "0.26s" }}>
          <div className="border-t border-hair pt-6">
            <button
              type="button"
              onClick={saveContact}
              className="mx-auto flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              Kontaktni saqlash
            </button>
            <p className="mt-6 text-center text-[12px] leading-relaxed text-muted-foreground/80">
              Nusxa tugmasi bilan manzilni nusxalang. Kripto o'tkazmalari qaytarib
              bo'lmaydi — manzilni diqqat bilan tekshiring.
            </p>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
              {profile.name} · 2026
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
