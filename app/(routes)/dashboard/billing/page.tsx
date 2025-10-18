"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Crown, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";

type Plan = {
  id: string;
  name: string;
  description: string;
  highlight?: boolean;
  priceMonthly: number;
  priceYearly: number;
  ctaLabel?: string;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For personal health tracking and quick AI guidance.",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "AI symptom check (basic)",
      "Secure session history",
      "Email support",
    ],
    ctaLabel: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For proactive care with deeper insights and priority access.",
    priceMonthly: 19,
    priceYearly: 180,
    features: [
      "Advanced AI triage & summaries",
      "Priority doctor suggestions",
      "Voice agent sessions",
      "Exportable reports (PDF)",
    ],
    highlight: true,
    ctaLabel: "Get Pro",
  },
  {
    id: "clinic",
    name: "Clinic",
    description: "For small teams and clinics collaborating with patients.",
    priceMonthly: 49,
    priceYearly: 480,
    features: [
      "Shared team workspace",
      "Custom report branding",
      "Priority support (SLA)",
      "Compliance & audit logs",
    ],
    ctaLabel: "Contact sales",
  },
];

export default function BillingPage() {
  const [yearly, setYearly] = React.useState<boolean>(true);

  // Theme Clerk PricingTable via appearance using our design tokens
  const pricingAppearance = React.useMemo(
    () => ({
      variables: {
        colorPrimary: "hsl(var(--primary))",
        colorText: "hsl(var(--foreground))",
        colorTextSecondary: "hsl(var(--muted-foreground))",
        colorBackground: "hsl(var(--card))",
        colorInputBackground: "transparent",
        colorInputText: "hsl(var(--foreground))",
        colorAlphaShade: "hsl(var(--border))",
        borderRadius: "calc(var(--radius) + 2px)",
        fontFamily: "var(--font-sans)",
        spacingUnit: "12px",
        // Shadows are not standard in Clerk variables, but some skins read this
        // @ts-ignore - optional custom var consumed by some Clerk themes
        boxShadow: "var(--shadow-sm)",
      },
      elements: {
        rootBox: "[&_*]:!outline-none",
        card: "rounded-xl border bg-card shadow-sm",
        headerTitle: "font-serif text-2xl md:text-3xl",
        headerSubtitle: "text-muted-foreground",
        plan: "rounded-lg border bg-background shadow-xs",
        plan__popularBadge: "border bg-background text-foreground",
        planTitle: "text-base font-semibold",
        planPrice: "text-3xl font-semibold tracking-tight",
        planFeatureList: "space-y-2 text-sm",
        planFeatureItem: "flex items-start gap-2",
        button: "rounded-md",
        buttonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
        buttonSecondary:
          "border bg-background hover:bg-accent hover:text-accent-foreground",
      },
    }),
    []
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
      <section className="relative py-10 md:py-14">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Shield className="size-3.5" />
              <span>Private. Secure. HIPAA-ready.</span>
            </div>
            <h1 className="font-serif mt-4 text-3xl leading-tight md:text-4xl">
              Transparent pricing for better care
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
              Choose a plan that fits your journey. Upgrade, downgrade, or
              cancel anytime.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="shrink-0">
            <div className="inline-flex items-center rounded-lg border bg-card p-1 text-sm">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`relative rounded-md px-4 py-2 transition-colors ${
                  !yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={!yearly}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`relative rounded-md px-4 py-2 transition-colors ${
                  yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={yearly}
              >
                Yearly
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {yearly ? "Save up to 20%" : "Billed monthly"}
            </p>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            const period = yearly ? "/year" : "/month";
            const isFree = price === 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className={`relative rounded-xl border bg-card p-6 shadow-sm ${
                  plan.highlight ? "ring-1 ring-primary/40" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full border bg-background px-2 py-1 text-xs">
                    <Crown className="size-3.5 text-primary" />
                    <span className="font-medium">Recommended</span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    {plan.name}
                    {plan.highlight && (
                      <Sparkles className="size-4 text-primary" />
                    )}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-5 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {isFree ? "$0" : `$${price}`}
                  </span>
                  <span className="text-muted-foreground">
                    {isFree ? "" : period}
                  </span>
                </div>

                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid">
                  <Button
                    asChild={false}
                    className={
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }
                    onClick={() => {
                      const el = document.getElementById("checkout");
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    {plan.ctaLabel ?? "Choose plan"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="relative my-10">
        <div className="h-px w-full bg-border" />
      </div>

      {/* Checkout: Clerk Pricing Table (preserved) */}
      <section id="checkout" className="pb-16">
        <h2 className="font-serif text-2xl md:text-3xl">Ready when you are</h2>
        <p className="text-muted-foreground mt-2 max-w-prose">
          Create your account and manage billing securely. You can change plans
          at any time.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-xl border bg-card p-4 shadow-sm"
        >
          {/* If your Clerk project exposes a pricing table, it will render below. */}
          {(() => {
            const PT = PricingTable as unknown as React.ComponentType<any>;
            return <PT appearance={pricingAppearance} />;
          })()}
        </motion.div>
      </section>
    </div>
  );
}
