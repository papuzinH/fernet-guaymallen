'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Sparkles } from 'lucide-react';

interface ModernMatchesHeaderProps {
  className?: string;
}

export const ModernMatchesHeader: React.FC<ModernMatchesHeaderProps> = ({
  className
}) => {
  return (
    <motion.section
      className={`relative text-center py-20 px-4 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-green-900/20 to-red-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(239, 68, 68, 0.1))",
              "linear-gradient(225deg, rgba(239, 68, 68, 0.1), rgba(59, 130, 246, 0.1), rgba(245, 158, 11, 0.1))",
              "linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(239, 68, 68, 0.1))"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 5, top: 10 }, { left: 15, top: 5 }, { left: 25, top: 15 },
            { left: 35, top: 8 }, { left: 45, top: 12 }, { left: 55, top: 6 },
            { left: 65, top: 18 }, { left: 75, top: 10 }, { left: 85, top: 14 },
            { left: 95, top: 8 }, { left: 8, top: 25 }, { left: 18, top: 30 },
            { left: 28, top: 22 }, { left: 38, top: 28 }, { left: 48, top: 25 },
            { left: 58, top: 32 }, { left: 68, top: 28 }, { left: 78, top: 35 },
            { left: 88, top: 30 }, { left: 12, top: 45 }, { left: 22, top: 50 },
            { left: 32, top: 48 }, { left: 42, top: 52 }, { left: 52, top: 45 },
            { left: 62, top: 50 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
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
                delay: i * 0.1,
              }}
            />
          );
        })}

        {/* Large Floating Elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-40 h-40 rounded-full opacity-5"
            style={{
              left: `${15 + i * 25}%`,
              top: `${15 + i * 20}%`,
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)`
            }}
            animate={{
              y: [-40, 40, -40],
              x: [-25, 25, -25],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Main Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1,
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <div className="relative inline-block">
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl opacity-50"
              style={{ backgroundColor: '#3b82f6' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Icon Container */}
            <motion.div
              className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-2xl"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <Calendar className="w-12 h-12 text-white" />
            </motion.div>

            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 70}%`,
                  top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 70}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                <Star className="w-4 h-4 text-blue-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-7xl md:text-8xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 30px rgba(255, 255, 255, 0.5)"
          }}
        >
          PARTIDOS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Historial completo de partidos y resultados del club
        </motion.p>

        {/* Decorative Elements */}
        <motion.div
          className="flex justify-center items-center space-x-4 mt-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom Wave Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
    </motion.section>
  );
};

export default ModernMatchesHeader;
