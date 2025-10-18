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
    <div className="container-grid">
      <section id="checkout" className="pb-16">
        <h2 className="font-serif text-2xl md:text-3xl">Ready when you are</h2>
        <p className="text-muted-foreground mt-2 max-w-prose">
          Create your account and manage billing securely. Change plans any time
          — no awkward break-up emails required.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-xl border bg-card p-4 shadow-sm"
        >
          {(() => {
            const PT = PricingTable as unknown as React.ComponentType<any>;
            return <PT appearance={pricingAppearance} />;
          })()}
        </motion.div>
      </section>
    </div>
  );
}
