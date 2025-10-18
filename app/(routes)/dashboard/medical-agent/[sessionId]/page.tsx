"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Loader2, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<unknown>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTanscript, setLiveTanscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      setSessionDetail(result.data);
    } catch (err) {
      console.error("GetSessionDetails failed", err);
    }
  };

  // timer effect
  useEffect(() => {
    if (start) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [start]);

  const handleCallStart = useCallback(() => {
    setLoading(false);
    setCallStarted(true);
  }, []);

  const handleCallEnd = useCallback(() => {
    setCallStarted(false);
    setStart(false); // Stop the timer when call ends
    setTime(0); // Reset timer
    console.log("Call ended");
  }, []);

  const handleMessage = useCallback((message: any) => {
    if (message.type === "transcript") {
      const { role, transcriptType, transcript } = message;
      console.log(`${role}: ${transcript}`);
      if (transcriptType === "partial") {
        setLiveTanscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === "final") {
        setMessages((prev) => [...prev, { role, text: transcript }]);
        setLiveTanscript("");
        setCurrentRole(null);
      }
    }
  }, []);

  const StartCall = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
      if (!apiKey) throw new Error("Missing VAPI API key");
      const vapi = new Vapi(apiKey);

      setVapiInstance(vapi);

      const VapiAgentConfig = {
        name: "AI Medical Doctor Voice Agent",
        firstMessage:
          "Hello, Thank You for connecting, Can you please tell me your full name and age",
        transcriber: {
          provider: "assembly-ai",
          language: "en",
        },
        voice: {
          provider: "playht",
          voiceId: "will",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: sessionDetail?.selectedDoctor?.agentPrompt,
            },
          ],
        },
      };
      (vapi as any).start(VapiAgentConfig);

      vapi.on("call-start", handleCallStart);
      vapi.on("call-end", handleCallEnd);
      vapi.on("message", handleMessage);
      setStart(true); // Start the timer

      vapi.on("speech-start", () => {
        console.log("Assistant started speaking");
        setCurrentRole("assistant");
      });
      vapi.on("speech-end", () => {
        console.log("Assistant stopped speaking");
        setCurrentRole("user");
      });
    } catch (err) {
      console.error("StartCall failed", err);
      setLoading(false);
    }
  };

  const endCall = async () => {
    setLoading(true);
    setStart(false); // Stop the timer
    try {
      if (!vapiInstance) {
        return;
      }

      await (vapiInstance as any).stop();

      (vapiInstance as any).off("call-start", handleCallStart);
      (vapiInstance as any).off("call-end", handleCallEnd);
      (vapiInstance as any).off("message", handleMessage);

      // Reset call state
      setCallStarted(false);
      setVapiInstance(null);
      setTime(0); // Reset timer

      await GenerateReport();
      toast.success("Your report is Generated");
      router.replace("/dashboard");
    } catch (err) {
      console.error("endCall failed", err);
    } finally {
      setLoading(false);
    }
  };

  const GenerateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId,
    });
    console.log(result.data);
    return result.data;
  };

  // Helper function to format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 md:p-10 border border-border rounded-2xl bg-card m-6"
      style={{ boxShadow: "var(--shadow-xl)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div
          className="px-4 py-2 border border-border rounded-lg flex gap-3 items-center bg-background/50"
          animate={{
            borderColor: callStarted
              ? "hsl(var(--accent))"
              : "hsl(var(--destructive))",
          }}
        >
          <motion.div
            animate={{
              scale: callStarted ? [1, 1.2, 1] : 1,
              backgroundColor: callStarted
                ? "hsl(var(--accent))"
                : "hsl(var(--destructive))",
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-4 w-4 rounded-full"
          />
          <span className="font-sans font-medium text-foreground">
            {callStarted ? "Connected" : "Not Connected"}
          </span>
        </motion.div>
        <h2 className="font-mono font-bold text-2xl text-muted-foreground">
          {formatTime(time)}
        </h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.div
              animate={callStarted ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image
                src={sessionDetail?.selectedDoctor?.image}
                alt={sessionDetail?.selectedDoctor?.specialist || " "}
                width={140}
                height={140}
                className="h-[140px] w-[140px] object-cover rounded-full border-4 border-border"
              />
            </motion.div>
            {callStarted && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary"
                animate={{ scale: [1, 1.2, 1.2, 1], opacity: [1, 0, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <h2 className="mt-4 text-2xl font-serif font-bold text-foreground">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            AI Medical Voice Agent
          </p>

          <div className="mt-10 w-full max-w-3xl overflow-y-auto max-h-[400px] space-y-4 px-4">
            <AnimatePresence>
              {messages?.slice(-4).map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}
                    style={
                      msg.role !== "user"
                        ? { boxShadow: "var(--shadow-sm)" }
                        : {}
                    }
                  >
                    <p className="text-sm font-sans font-medium mb-1 opacity-70 capitalize">
                      {msg.role}
                    </p>
                    <p className="font-sans leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {liveTanscript && liveTanscript?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  currentRole === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    currentRole === "user"
                      ? "bg-primary/70 text-primary-foreground rounded-br-sm"
                      : "bg-muted border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm font-sans font-medium mb-1 opacity-70 capitalize">
                    {currentRole}
                  </p>
                  <p className="font-sans leading-relaxed">{liveTanscript}</p>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block ml-1"
                  >
                    ▋
                  </motion.span>
                </div>
              </motion.div>
            )}
          </div>

          {!callStarted ? (
            <motion.div
              className="mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={StartCall}
                disabled={loading}
                className="px-10 py-6 text-lg font-sans font-semibold"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <PhoneCall className="mr-2" />
                )}
                Start Call
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={"destructive"}
                onClick={endCall}
                disabled={loading}
                className="px-10 py-6 text-lg font-sans font-semibold"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <PhoneOff className="mr-2" />
                )}
                Disconnect
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default MedicalVoiceAgent;
