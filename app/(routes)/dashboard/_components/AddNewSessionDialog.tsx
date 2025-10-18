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
import { toast } from "sonner";

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
    } catch (err: any) {
      console.error("GetHistoryList failed", err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load session history", {
          description:
            err.response?.data?.message ||
            "Please refresh the page to try again.",
        });
      }
    }
  };

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result.data);
      toast.success("Recommendations incoming", {
        description: "Rummaging through our digital medicine cabinet...",
      });
    } catch (err: any) {
      console.error("suggest-doctors failed", err);
      const errorMessage =
        err.response?.data?.message ||
        "Please try again. Our AI is taking a deep breath.";
      toast.error("Hmm, that didn't go as planned", {
        description: errorMessage,
      });
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
        toast.success("Voila! All sorted.", {
          description: "Spinning up your AI specialist now.",
        });
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (err: any) {
      console.error("start consultation failed", err);
      const errorMessage =
        err.response?.data?.message || "Please try again in a moment.";
      toast.error("Whoops! The wires got tangled.", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(suggestedDoctors);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="font-sans font-semibold px-8 py-6 text-base transition-transform hover:scale-105 active:scale-98"
          disabled={!paidUser && historyList?.length >= 1}
          style={{ boxShadow: "var(--shadow-md)" }}
          title="Let's get you feeling better, shall we?"
        >
          Start consultation
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-3xl bg-card border-border"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-foreground">
            {!suggestedDoctors ? "Tell us what’s up" : "Pick your specialist"}
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
                      placeholder="e.g., I’ve been experiencing headaches and fatigue for the past few days…"
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
          <DialogClose asChild>
            <Button
              variant={"outline"}
              className="font-sans transition-transform hover:scale-105 active:scale-98"
              title="Changed your mind? No judgment here!"
            >
              Close
            </Button>
          </DialogClose>

          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              onClick={() => onClickNext()}
              className="font-sans transition-transform hover:scale-105 active:scale-98 max-w-full"
              title="Let's find you the perfect AI doctor!"
            >
              {loading ? (
                <>
                  <span className="truncate">
                    Consulting the digital sages...
                  </span>
                  <Loader2 className="animate-spin ml-2 flex-shrink-0" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 flex-shrink-0" />
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={() => onStartConsultation()}
              className="font-sans transition-transform hover:scale-105 active:scale-98 max-w-full"
              title="Off to the virtual examination room!"
            >
              {loading ? (
                <>
                  <span className="truncate">
                    Rummaging through our digital medicine cabinet...
                  </span>
                  <Loader2 className="animate-spin ml-2 flex-shrink-0" />
                </>
              ) : (
                <>
                  Start consultation
                  <ArrowRight className="ml-2 flex-shrink-0" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
