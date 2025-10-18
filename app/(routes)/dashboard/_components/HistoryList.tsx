"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { motion } from "framer-motion";

function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

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

  return (
    <div className="mt-12 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
          Consultation history
        </h2>
        <p className="text-muted-foreground font-sans mt-2 text-lg">
          Your previous chats and reports live here — tidy, searchable, and
          ready when you are.
        </p>
      </motion.div>

      {historyList.length == 0 ? (
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
            <Image
              src={"/medical-assistance.png"}
              alt={"empty"}
              width={180}
              height={180}
            />
          </motion.div>
          <h2 className="font-serif font-bold text-2xl mt-6 text-foreground">
            A fresh start!
          </h2>
          <p className="text-muted-foreground font-sans mt-2 text-center max-w-md">
            What&apos;s on your mind? Don&apos;t worry, I&apos;m all ears (or…
            code?). Kick off your first consultation below.
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
