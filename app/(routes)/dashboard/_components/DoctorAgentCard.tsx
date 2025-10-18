"use client";
import Image from "next/image";
import React, { useState } from "react";
import { doctorAgent } from "./types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
      className="relative group rounded-xl border border-border bg-card overflow-hidden cursor-pointer"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {doctorAgent?.subscriptionRequired && (
        <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground font-sans font-semibold">
          Premium
        </Badge>
      )}

      <div className="relative overflow-hidden">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}>
          <Image
            src={doctorAgent.image}
            alt={doctorAgent.specialist}
            width={400}
            height={500}
            className="w-full h-[280px] object-cover"
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
