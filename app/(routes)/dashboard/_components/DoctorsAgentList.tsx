"use client";
import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";
import { motion } from "framer-motion";

function DoctorsAgentList() {
  return (
    <div className="mt-12 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">
          AI Specialist Doctors
        </h2>
        <p className="text-muted-foreground font-sans mt-2 text-lg">
          Connect with specialized AI medical agents for personalized care
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
        {AIDoctorAgents.map((doctor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DoctorAgentCard doctorAgent={doctor} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
