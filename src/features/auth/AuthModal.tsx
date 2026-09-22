"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/provider";
import {
  demoRequestSchema,
  loginSchema,
  trialSignupSchema,
  type DemoRequestInput,
  type LoginInput,
  type TrialSignupInput,
} from "@/features/forms/schemas";

export type AuthMode = "login" | "trial" | "demo";

type Errors = Partial<Record<string, string>>;

export function AuthModal({
  mode,
  onClose,
  onSwitchMode,
}: {
  mode: AuthMode | null;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const mapMessage = (message: string) => {
    if (message === "required") return t("common.required");
    if (message === "invalidEmail") return t("common.invalidEmail");
    return t("forms.invalid");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mode) return;
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());

    const schema = mode === "login" ? loginSchema : mode === "trial" ? trialSignupSchema : demoRequestSchema;
    const result = schema.safeParse(data);

    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!next[key]) next[key] = mapMessage(issue.message);
      }
      setErrors(next);
      toast(t("forms.invalid"), "error");
      return;
    }

    setErrors({});
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      const value =
        mode === "login"
          ? (result.data as LoginInput).email
          : (result.data as TrialSignupInput | DemoRequestInput).email;
      void value;
      toast(t("forms.submitted"));
      onClose();
    }, 700);
  };

  const titles: Record<AuthMode, { title: string; desc: string; submit: string }> = {
    login: { title: t("forms.loginTitle"), desc: t("forms.loginDesc"), submit: t("forms.submitLogin") },
    trial: { title: t("forms.trialTitle"), desc: t("forms.trialDesc"), submit: t("forms.submitTrial") },
    demo: { title: t("forms.demoTitle"), desc: t("forms.demoDesc"), submit: t("forms.submitDemo") },
  };

  const active = mode ?? "trial";
  const copy = titles[active];

  return (
    <Modal open={mode !== null} onClose={onClose} title={copy.title} description={copy.desc} closeLabel={t("common.close")}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {active !== "login" && (
          <Field label={t("forms.nameLabel")} error={errors.name}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="name"
                autoComplete="name"
                placeholder={t("forms.namePlaceholder")}
                aria-describedby={describedBy || undefined}
                invalid={invalid}
              />
            )}
          </Field>
        )}

        <Field label={t("forms.emailLabel")} error={errors.email} hint={active !== "login" ? t("forms.workEmailHint") : undefined}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t("forms.emailPlaceholder")}
              aria-describedby={describedBy || undefined}
              invalid={invalid}
            />
          )}
        </Field>

        {active !== "login" && (
          <Field label={t("forms.companyLabel")} error={errors.company}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="company"
                autoComplete="organization"
                placeholder={t("forms.companyPlaceholder")}
                aria-describedby={describedBy || undefined}
                invalid={invalid}
              />
            )}
          </Field>
        )}

        {active === "login" && (
          <Field label={t("forms.passwordLabel")} error={errors.password}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t("forms.passwordPlaceholder")}
                aria-describedby={describedBy || undefined}
                invalid={invalid}
              />
            )}
          </Field>
        )}

        {active === "trial" && (
          <Field label={t("forms.passwordLabel")} error={errors.password}>
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("forms.passwordPlaceholder")}
                aria-describedby={describedBy || undefined}
                invalid={invalid}
              />
            )}
          </Field>
        )}

        {active === "demo" && (
          <Field label={t("forms.messageLabel")} error={errors.message}>
            {({ id, describedBy, invalid }) => (
              <Textarea id={id} name="message" aria-describedby={describedBy || undefined} invalid={invalid} />
            )}
          </Field>
        )}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending} aria-busy={pending}>
          {pending ? t("common.loading") : copy.submit}
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs text-dc-muted">
          {active !== "login" && (
            <button type="button" className="hover:text-dc-green" onClick={() => onSwitchMode("login")}>
              {t("forms.submitLogin")}
            </button>
          )}
          {active !== "trial" && (
            <button type="button" className="hover:text-dc-green" onClick={() => onSwitchMode("trial")}>
              {t("nav.trial")}
            </button>
          )}
          {active !== "demo" && (
            <button type="button" className="hover:text-dc-green" onClick={() => onSwitchMode("demo")}>
              {t("hero.ctaSecondary")}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
