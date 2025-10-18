"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/",
  },
  {
    id: 2,
    name: "History",
    path: "/dashboard/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/dashboard/billing",
  },
];

function AppHeader() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-sm px-8 md:px-16 lg:px-24 sticky top-0 z-50"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <Link href={"/dashboard"}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={"/logo.png"}
            alt="Curely logo"
            width={130}
            height={60}
            className="h-auto"
          />
        </motion.div>
      </Link>

      <div className="flex gap-8 lg:gap-12 items-center">
        {menuOptions.map((option, index) => {
          const isActive = pathname === option.path;
          return (
            <Link href={option.path} key={index}>
              <motion.div
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h2
                  className={`font-sans font-medium cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {option.name}
                </h2>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default AppHeader;
