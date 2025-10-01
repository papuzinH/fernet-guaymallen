'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ from, to, duration = 2, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(from);
  const count = useMotionValue(from);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, to, rounded]);

  return (
    <motion.span className={`scoreboard-text ${className}`}>
      {displayValue}
    </motion.span>
  );
}

interface ScoreboardCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScoreboardCard({ title, value, icon, delay = 0, className = "" }: ScoreboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`bg-card/80 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.2 }}
          className="mb-3 flex justify-center"
        >
          {icon}
        </motion.div>
      )}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
        className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wide"
      >
        {title}
      </motion.h3>
      <AnimatedCounter
        from={0}
        to={value}
        duration={1.5}
        className="text-3xl font-heading text-white"
      />
    </motion.div>
  );
}