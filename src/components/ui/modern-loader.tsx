'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  size?: 'small' | 'medium' | 'large' | 'inline';
  text?: string;
  className?: string;
  variant?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showParticles?: boolean;
}

const sizeMap: Record<NonNullable<ModernLoaderProps['size']>, number> = {
  small: 24,
  medium: 40,
  large: 64,
  inline: 16,
};

const variantConfig = {
  default: {
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-700',
    glowColor: '#3b82f6'
  },
  blue: {
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-700',
    glowColor: '#3b82f6'
  },
  green: {
    color: '#10b981',
    gradient: 'from-green-500 to-green-700',
    glowColor: '#10b981'
  },
  red: {
    color: '#ef4444',
    gradient: 'from-red-500 to-red-700',
    glowColor: '#ef4444'
  },
  yellow: {
    color: '#f59e0b',
    gradient: 'from-yellow-500 to-yellow-700',
    glowColor: '#f59e0b'
  },
  purple: {
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-700',
    glowColor: '#8b5cf6'
  }
};

export const ModernLoader: React.FC<ModernLoaderProps> = ({ 
  size = 'medium', 
  text, 
  className = '',
  variant = 'default',
  showParticles = true
}) => {
  const px = sizeMap[size] ?? sizeMap.medium;
  const config = variantConfig[variant];
  const isLarge = size === 'large';
  const isInline = size === 'inline';

  return (
    <motion.div 
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        isInline && "flex-row gap-2",
        className
      )}
      role="status" 
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Loader Container */}
      <div className="relative">
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg opacity-50"
          style={{ backgroundColor: config.color }}
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

        {/* Main Spinner */}
        <motion.div
          className={cn(
            "relative rounded-full border-4 border-transparent",
            `bg-gradient-to-r ${config.gradient}`
          )}
          style={{ 
            width: px, 
            height: px,
            boxShadow: `0 0 20px ${config.glowColor}40`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Inner Ring */}
          <div 
            className="absolute inset-1 rounded-full border-2 border-white/20"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${config.color}40, transparent)`
            }}
          />
          
          {/* Center Dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/80"
            style={{ 
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 10px ${config.glowColor}`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Floating Particles */}
        {showParticles && !isInline && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(isLarge ? 8 : 4)].map((_, i) => {
              // Use fixed positions based on index to avoid hydration mismatch
              const positions = [
                { left: 20, top: 10 }, { left: 80, top: 15 }, { left: 15, top: 80 }, { left: 85, top: 75 },
                { left: 50, top: 5 }, { left: 50, top: 95 }, { left: 5, top: 50 }, { left: 95, top: 50 }
              ];
              const pos = positions[i] || { left: 50, top: 50 };
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    backgroundColor: config.color,
                    opacity: 0.6
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Pulse Ring */}
        {!isInline && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/20"
            style={{ 
              width: px, 
              height: px 
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </div>

      {/* Loading Text */}
      {text && (
        <motion.div
          className={cn(
            "text-center",
            isInline ? "text-sm" : "text-base"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.p
            className="text-white/80 font-medium"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {text}
          </motion.p>
          
          {/* Loading Dots */}
          <motion.div 
            className="flex justify-center gap-1 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-white/60"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Legacy wrapper for backward compatibility
export default function Loader(props: ModernLoaderProps) {
  return <ModernLoader {...props} />;
}
