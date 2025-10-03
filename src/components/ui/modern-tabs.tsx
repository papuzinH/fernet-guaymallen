'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  glowColor: string;
}

interface ModernTabsProps {
  tabs: ModernTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const ModernTabs: React.FC<ModernTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.id === activeTab);
    setActiveIndex(index);
  }, [activeTab, tabs]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
        style={{
          background: `linear-gradient(90deg, ${tabs[activeIndex]?.glowColor || '#3b82f6'}, transparent, ${tabs[activeIndex]?.glowColor || '#3b82f6'})`
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Container */}
      <motion.div
        className="relative bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Active Tab Background */}
        <motion.div
          className="absolute top-2 bottom-2 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-lg"
          style={{
            background: tabs[activeIndex]?.gradient || 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1))'
          }}
          layoutId="activeTab"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />

        {/* Tabs Grid */}
        <div className="relative grid grid-cols-5 gap-1">
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            const isHovered = hoveredTab === tab.id;
            const IconComponent = tab.icon;

            return (
              <motion.button
                key={tab.id}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 cursor-pointer group",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent"
                )}
                onClick={() => onTabChange(tab.id)}
                onHoverStart={() => setHoveredTab(tab.id)}
                onHoverEnd={() => setHoveredTab(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon Container */}
                <motion.div
                  className={cn(
                    "relative w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300",
                    isActive 
                      ? "text-white shadow-lg" 
                      : "text-white/60 group-hover:text-white/90"
                  )}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isHovered ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{
                    scale: { duration: 0.2 },
                    rotate: { duration: 0.5 }
                  }}
                >
                  {/* Icon Glow Effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-50 blur-sm"
                      style={{ backgroundColor: tab.color }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Icon */}
                  <IconComponent 
                    className={cn(
                      "relative z-10 w-5 h-5 transition-all duration-300",
                      isActive && "drop-shadow-lg"
                    )} 
                  />
                </motion.div>

                {/* Label */}
                <motion.span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                    isActive 
                      ? "text-white font-bold" 
                      : "text-white/70 group-hover:text-white/90"
                  )}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-white shadow-lg"
                    style={{ backgroundColor: tab.color }}
                    initial={{ scale: 0, x: "-50%" }}
                    animate={{ scale: 1, x: "-50%" }}
                    transition={{ delay: 0.2 }}
                  />
                )}

                {/* Hover Ripple Effect */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModernTabs;
