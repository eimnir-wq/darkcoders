"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { useAppModals } from "@/components/providers/AppModals";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { socialLinks } from "@/components/ui/SocialIcons";
import { useToast } from "@/components/ui/Toast";
import { newsletterSchema } from "@/features/forms/schemas";

export function SiteFooter() {
  const { t } = useI18n();
  const { openAuth } = useAppModals();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const columns = [
    {
      title: t("footer.platform"),
      links: [
        { label: t("footer.platformLinks.threatOps"), href: "#platform" },
        { label: t("footer.platformLinks.compliance"), href: "#compliance" },
        { label: t("footer.platformLinks.identity"), href: "#platform" },
        { label: t("footer.platformLinks.ai"), href: "#copilot" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.resourceLinks.blog"), href: "#architecture" },
        { label: t("footer.resourceLinks.research"), href: "#visibility" },
        { label: t("footer.resourceLinks.docs"), href: "#dashboard" },
        { label: t("footer.resourceLinks.support"), href: "#cta" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.companyLinks.about"), href: "#scale" },
        { label: t("footer.companyLinks.careers"), href: "#scale" },
        { label: t("footer.companyLinks.partners"), href: "#trust" },
        { label: t("footer.companyLinks.contact"), href: "#cta" },
      ],
    },
  ];

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(t("common.invalidEmail"));
      return;
    }
    setError(null);
    setEmail("");
    toast(t("forms.subscribed"));
  };

  return (
    <footer className="relative border-t border-dc-border bg-dc-bg">
      <div className="dc-container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo height={30} />
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-dc-green">{t("footer.tagline")}</p>
            <p className="max-w-sm text-sm leading-relaxed text-dc-muted">{t("meta.description")}</p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dc-border text-dc-muted transition-colors hover:border-dc-green/50 hover:text-dc-green"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dc-text">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-dc-muted transition-colors hover:text-dc-green"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h3 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dc-text">
                {t("forms.newsletterTitle")}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-dc-muted">{t("forms.newsletterDesc")}</p>
              <form onSubmit={subscribe} noValidate className="flex flex-col gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("forms.emailLabel")}
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("forms.emailPlaceholder")}
                  invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-error" : undefined}
                />
                {error && (
                  <p id="newsletter-error" role="alert" className="text-xs text-[color:var(--sev-critical)]">
                    {error}
                  </p>
                )}
                <Button type="submit" size="sm" className="w-full">
                  <Send className="h-3.5 w-3.5" />
                  {t("forms.subscribe")}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-dc-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-dc-muted">
            © 2024 DarkCoders. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[t("footer.privacy"), t("footer.terms"), t("footer.security"), t("footer.cookies")].map((label) => (
              <Link key={label} href="#cta" className="text-xs text-dc-muted transition-colors hover:text-dc-green">
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => openAuth("trial")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-dc-green transition-opacity hover:opacity-80"
            >
              {t("nav.trial")}
              <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
