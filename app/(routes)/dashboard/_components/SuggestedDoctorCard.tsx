import React from "react";
import { doctorAgent } from "./types";
import { DoctorAvatar } from "@/components/ui/doctor-avatar";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: (d: any) => void;
  selectedDoctor?: doctorAgent | null;
};

const SuggestedDoctorCard = ({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: props) => {
  const isSelected = selectedDoctor?.id === doctorAgent?.id;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col items-center border rounded-2xl shadow-md p-5 cursor-pointer bg-card transition-all duration-300 ${
        isSelected
          ? "border-primary shadow-[0_0_20px_rgba(255,0,255,0.3)]"
          : "border-border hover:border-accent hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
      title={`Select ${doctorAgent?.specialist} - Off it goes into the digital ether!`}
    >
      {/* Icon indicator */}
      <div className="absolute top-2 right-2">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            isSelected ? "bg-primary/30" : "bg-accent/20"
          }`}
        >
          <Sparkles
            className={`w-3 h-3 ${isSelected ? "text-primary" : "text-accent"}`}
          />
        </div>
      </div>

      <DoctorAvatar
        id={doctorAgent.id}
        specialist={doctorAgent.specialist}
        size={70}
        className="mb-3"
      />

      <h2 className="font-serif font-bold text-sm text-center text-foreground">
        {doctorAgent?.specialist}
      </h2>

      <p className="text-xs text-center line-clamp-2 text-muted-foreground mt-1 font-sans">
        {doctorAgent?.description}
      </p>
    </motion.div>
  );
};

export default SuggestedDoctorCard;
