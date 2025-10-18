"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { doctorAgent } from "./types";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SessionDetail } from "./types";
import { motion, AnimatePresence } from "framer-motion";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(
    null
  );
  const router = useRouter();
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

  const { has } = useAuth();

  const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (err) {
      console.error("GetHistoryList failed", err);
    }
  };

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result.data);
    } catch (err) {
      console.error("suggest-doctors failed", err);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });
      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (err) {
      console.error("start consultation failed", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(suggestedDoctors);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="font-sans font-semibold px-8 py-6 text-base"
            disabled={!paidUser && historyList?.length >= 1}
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            Start Consultation
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl bg-card border-border"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-foreground">
            {!suggestedDoctors ? "Add Basic Details" : "Select Your Specialist"}
          </DialogTitle>
          <DialogDescription asChild>
            <AnimatePresence mode="wait">
              {!suggestedDoctors ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4"
                >
                  <div>
                    <h2 className="text-lg font-sans text-muted-foreground mb-3">
                      Describe your symptoms or health concerns
                    </h2>
                    <Textarea
                      placeholder="e.g., I've been experiencing headaches and fatigue for the past few days..."
                      className="h-[220px] mt-2 bg-input border-border text-foreground font-sans resize-none focus:ring-2 focus:ring-primary transition-all"
                      onChange={(e) => setNote(e.target.value)}
                      value={note}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="doctors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4"
                >
                  <h2 className="text-lg font-sans text-muted-foreground">
                    Based on your symptoms, we recommend these specialists
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {suggestedDoctors.map((doctor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <SuggestedDoctorCard
                          doctorAgent={doctor}
                          setSelectedDoctor={setSelectedDoctor}
                          selectedDoctor={selectedDoctor}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-0">
          <DialogClose>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant={"outline"} className="font-sans">
                Close
              </Button>
            </motion.div>
          </DialogClose>

          {!suggestedDoctors ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                disabled={!note || loading}
                onClick={() => onClickNext()}
                className="font-sans"
              >
                Next
                {loading ? (
                  <Loader2 className="animate-spin ml-2" />
                ) : (
                  <ArrowRight className="ml-2" />
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                disabled={loading || !selectedDoctor}
                onClick={() => onStartConsultation()}
                className="font-sans"
              >
                Start Consultation
                {loading ? (
                  <Loader2 className="animate-spin ml-2" />
                ) : (
                  <ArrowRight className="ml-2" />
                )}
              </Button>
            </motion.div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
