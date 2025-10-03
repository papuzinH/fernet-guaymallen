'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Database, Users, Calendar, Palette, Upload, Plus, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernAdminHeaderProps {
  className?: string;
}

export const ModernAdminHeader: React.FC<ModernAdminHeaderProps> = ({ className }) => {
  return (
    <motion.section
      className={cn("relative overflow-hidden py-16 px-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(225deg, rgba(59, 130, 246, 0.1), rgba(239, 68, 68, 0.1), rgba(139, 92, 246, 0.1))",
              "linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(239, 68, 68, 0.1))",
              "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 5, top: 10 }, { left: 15, top: 5 }, { left: 25, top: 15 },
            { left: 35, top: 8 }, { left: 45, top: 12 }, { left: 55, top: 6 },
            { left: 65, top: 18 }, { left: 75, top: 10 }, { left: 85, top: 14 },
            { left: 95, top: 8 }, { left: 8, top: 25 }, { left: 18, top: 30 },
            { left: 28, top: 22 }, { left: 38, top: 28 }, { left: 48, top: 25 },
            { left: 58, top: 32 }, { left: 68, top: 28 }, { left: 78, top: 35 },
            { left: 88, top: 30 }, { left: 12, top: 45 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
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
            className="absolute w-64 h-64 rounded-full opacity-5"
            style={{
              left: `${10 + i * 20}%`,
              top: `${10 + i * 20}%`,
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
      <div className="relative z-10 container mx-auto">
        <div className="text-center">
          {/* Admin Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: '#ef4444' }}
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
                className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                    top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
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
                  <Sparkles className="w-3 h-3 text-red-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(255, 255, 255, 0.5)"
              }}
            >
              Panel de Administración
            </h1>
            <p 
              className="text-xl md:text-2xl text-white/80 font-medium"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Gestiona tu club con herramientas profesionales
            </p>
          </motion.div>

          {/* Admin Features Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { icon: Calendar, label: 'Partidos', color: '#10b981' },
              { icon: Users, label: 'Jugadores', color: '#8b5cf6' },
              { icon: Upload, label: 'Importar', color: '#f59e0b' },
              { icon: Palette, label: 'Tema', color: '#3b82f6' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  className="glass-morphism rounded-2xl p-4 border border-white/20 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    boxShadow: `0 20px 40px ${feature.color}20`
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <Icon 
                        className="w-6 h-6 text-white" 
                        style={{ color: feature.color }}
                      />
                    </div>
                  </motion.div>
                  <p className="text-white/80 text-sm font-medium">
                    {feature.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center items-center space-x-4 mt-12"
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

export default ModernAdminHeader;
