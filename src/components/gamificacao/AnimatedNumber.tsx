"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedNumber({ valor, className }: { valor: number; className?: string }) {
  const reduzir = useReducedMotion();
  const [n, setN] = useState(valor);

  useEffect(() => {
    if (reduzir) {
      setN(valor);
      return;
    }
    const controlo = animate(0, valor, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controlo.stop();
  }, [valor, reduzir]);

  return (
    <span className={className} aria-label={String(valor)}>
      {n}
    </span>
  );
}
