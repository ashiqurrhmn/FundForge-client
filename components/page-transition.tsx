"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        mass: 0.5 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
