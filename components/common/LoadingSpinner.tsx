"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({
  size = 48,
  label = "Loading...",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-muted"
        />

        {/* Animated arc */}
        <div
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
        />
      </motion.div>

      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
