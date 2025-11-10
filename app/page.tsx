"use client";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Heart,
  MessageCircle,
  Shield,
  type LucideIcon,
} from "lucide-react";

export default function HeroSectionOne() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-background">
      <Navbar />

      {/* Elegant border decorations */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-border/50">
        <motion.div
          className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-border/50">
        <motion.div
          className="absolute h-40 w-px bg-gradient-to-b from-transparent via-accent to-transparent"
          animate={{ y: [0, 100, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      <div className="w-full max-w-7xl px-4 py-16 md:py-24 lg:py-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-foreground leading-tight">
            {"Your Personal AI Doctor".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="inline-block mr-3 md:mr-4"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-primary"
            >
              (Who Never Sleeps!) 😴🚫
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-sans">
              Healthcare that actually listens! 🎧 Get 24/7 medical advice from
              AI docs who won't judge your midnight pizza choices. Talk to
              specialists, get instant diagnoses, and feel better—all without
              leaving your couch! 🛋️✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-8"
          >
            <Link href="/sign-in" passHref>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-primary-foreground font-sans font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ boxShadow: "var(--shadow-md)" }}
                title="Your AI doctor awaits — no white coat required!"
              >
                Get Started →
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-card text-card-foreground border border-border font-sans font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              title="Dive deeper into the future of healthcare!"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </motion.div>

        {/* Demo Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-24 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card via-primary/5 to-accent/5 p-8 md:p-12"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="text-center space-y-4">
            <motion.h2
              className="text-3xl md:text-4xl font-serif font-bold text-foreground"
              animate={{
                backgroundImage: [
                  "linear-gradient(to right, hsl(var(--foreground)), hsl(var(--primary)))",
                  "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))",
                  "linear-gradient(to right, hsl(var(--accent)), hsl(var(--foreground)))",
                  "linear-gradient(to right, hsl(var(--foreground)), hsl(var(--primary)))",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Healthcare That Actually Gets It 🎯
            </motion.h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No more "turn your head and cough" awkwardness! Our AI docs
              listen, understand, and help—all through the magic of voice. It's
              like having a doctor friend who's always available (and never
              judges your lifestyle choices) 🤖💙
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Activity,
    title: "24/7 Availability ⏰",
    description: "We're always awake! Unlike your real doctor at 3 AM 😴",
  },
  {
    icon: MessageCircle,
    title: "Voice First 🎤",
    description: "Just talk! No awkward waiting room small talk required",
  },
  {
    icon: Shield,
    title: "Fort Knox Secure 🔒",
    description: "Your secrets are safer than your browser history",
  },
  {
    icon: Heart,
    title: "Actually Cares ❤️",
    description: "AI with a heart! (Metaphorically speaking, of course)",
  },
];

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="p-6 rounded-xl border border-border bg-card group cursor-pointer transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,255,0.15)]"
    style={{ boxShadow: "var(--shadow-sm)" }}
    title={`${title} — Because healthcare should be accessible!`}
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.3 }}
      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
    >
      <Icon className="w-6 h-6 text-primary" />
    </motion.div>
    <h3 className="text-xl font-serif font-bold text-foreground mb-2">
      {title}
    </h3>
    <p className="text-muted-foreground font-sans">{description}</p>
  </motion.div>
);

const Navbar = () => {
  const { user } = useUser();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full flex items-center justify-between border-b border-border px-6 py-5 md:px-12 lg:px-20 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <Link href="/" className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={140}
            height={140}
            className="h-auto"
          />
        </motion.div>
      </Link>

      {!user ? (
        <Link href={"/sign-in"}>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-primary text-primary-foreground font-sans font-semibold rounded-lg transition-all duration-300"
            style={{ boxShadow: "var(--shadow-sm)" }}
            title="Welcome back! Your health dashboard misses you."
          >
            Login
          </motion.button>
        </Link>
      ) : (
        <div className="flex gap-4 items-center">
          <UserButton />
          <Link href={"/dashboard"}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="font-sans"
                title="Back to your personalized health hub!"
              >
                Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>
      )}
    </motion.nav>
  );
};
