'use client';

import { motion } from 'framer-motion';
import ModernAdminImport from '@/components/ui/modern-admin-import';

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: `radial-gradient(circle, rgba(${i === 0 ? '245, 158, 11' : i === 1 ? '139, 92, 246' : '59, 130, 246'}, 0.3), transparent)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Ambient Particles */}
        {[...Array(15)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 5, top: 10 }, { left: 15, top: 5 }, { left: 25, top: 15 },
            { left: 35, top: 8 }, { left: 45, top: 12 }, { left: 55, top: 6 },
            { left: 65, top: 18 }, { left: 75, top: 10 }, { left: 85, top: 14 },
            { left: 95, top: 8 }, { left: 8, top: 25 }, { left: 18, top: 30 },
            { left: 28, top: 22 }, { left: 38, top: 28 }, { left: 48, top: 25 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <ModernAdminImport />
      </div>
    </div>
  );
}