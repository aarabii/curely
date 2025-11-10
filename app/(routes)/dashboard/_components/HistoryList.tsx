"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (err: any) {
      console.error("GetHistoryList failed", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load session history";
      setError(errorMessage);
      if (err.response?.status !== 401) {
        toast.error("Failed to load history", {
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground leading-tight">
          Your Medical Timeline 📚
        </h2>
        <p className="text-muted-foreground font-sans mt-2 text-lg max-w-3xl">
          All your health adventures documented! From "just a cold" to "WebMD
          made me panic" — it's all here, organized and ready to revisit 🔍✨
        </p>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-12 border border-border rounded-2xl bg-card/50"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
            <p className="text-muted-foreground font-sans">
              Loading your consultation history...
            </p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center flex-col justify-center p-12 border-2 border-destructive/50 rounded-2xl bg-destructive/5"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <h2 className="font-serif font-bold text-2xl text-destructive">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground font-sans mt-2 text-center max-w-md">
            {error}
          </p>
          <Button
            onClick={() => GetHistoryList()}
            className="mt-6 transition-transform hover:scale-105 active:scale-98"
          >
            Try Again
          </Button>
        </motion.div>
      ) : historyList.length == 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center flex-col justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-card/50"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Image src={"/logo.svg"} alt={"empty"} width={180} height={180} />
          </motion.div>
          <h2 className="font-serif font-bold text-2xl mt-6 text-foreground">
            Nothing here... yet! 🌱
          </h2>
          <p className="text-muted-foreground font-sans mt-2 text-center max-w-md px-4">
            Your medical history is looking pretty empty! Time to chat with an
            AI doc. Don't worry, they won't judge your WebMD midnight searches
            🔍🌙
          </p>
          <div className="mt-6">
            <AddNewSessionDialog />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <HistoryTable historyList={historyList} />
        </motion.div>
      )}
    </div>
  );
}

export default HistoryList;
