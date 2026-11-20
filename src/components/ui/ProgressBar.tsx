"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const cores = {
  grape: "from-grape-400 to-grape-600",
  sun: "from-sun-300 to-sun-500",
  rosa: "from-rosa-400 to-rosa-500",
  sky: "from-sky-400 to-sky-500",
} as const;

interface Props {
  /** 0 a 1 */
  valor: number;
  cor?: keyof typeof cores;
  etiqueta: string;
  className?: string;
}

export function ProgressBar({ valor, cor = "grape", etiqueta, className }: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, valor)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("h-3.5 w-full overflow-hidden rounded-full bg-grape-100", className)}
    >
      <motion.div
        className={cn("h-full rounded-full bg-gradient-to-r", cores[cor])}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}
