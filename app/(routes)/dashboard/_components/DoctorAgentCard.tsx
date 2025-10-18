"use client";
import React, { useState } from "react";
import { doctorAgent } from "./types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DoctorAvatar } from "@/components/ui/doctor-avatar";

type props = {
  doctorAgent: doctorAgent;
};

export type { doctorAgent };

function DoctorAgentCard({ doctorAgent }: props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { has } = useAuth();

  const paidUser = has && has({ plan: "pro" });

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctorAgent,
      });
      if (result.data?.sessionId) {
        toast.success("Voila! All sorted.", {
          description: "Spinning up your AI specialist now.",
        });
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (err) {
      console.error("DoctorAgentCard start consultation failed", err);
      toast.error("Whoops! The wires got tangled.", {
        description: "Please try again. Our bots are already on it.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative group rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-all duration-300"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Icon slot in top-right corner */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {doctorAgent?.subscriptionRequired && (
          <Badge className="bg-primary text-primary-foreground font-sans font-semibold">
            Premium
          </Badge>
        )}
        <div
          className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/40 transition-colors"
          title="AI Specialist"
        >
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="relative overflow-hidden flex items-center justify-center p-4">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
          <DoctorAvatar
            id={doctorAgent.id}
            specialist={doctorAgent.specialist}
            size={280}
            className="mx-auto"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 space-y-3">
        <h2 className="font-serif font-bold text-xl text-foreground">
          {doctorAgent.specialist}
        </h2>
        <p className="line-clamp-2 text-sm text-muted-foreground font-sans leading-relaxed">
          {doctorAgent.description}
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onStartConsultation}
            className="w-full mt-3 font-sans font-semibold"
            disabled={!paidUser && doctorAgent.subscriptionRequired}
            title={
              !paidUser && doctorAgent.subscriptionRequired
                ? "Upgrade to Pro to unlock this specialist — worth every pixel!"
                : "Your health journey starts here. One click away!"
            }
          >
            {loading ? (
              <>
                Consulting the digital sages...
                <Loader2
                  aria-label="Consulting the digital sages"
                  className="animate-spin ml-2"
                />
              </>
            ) : (
              <>
                Start consultation
                <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DoctorAgentCard;
