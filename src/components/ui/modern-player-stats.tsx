'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Zap, AlertTriangle, X } from 'lucide-react';

interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  starters: number;
  substitutes: number;
  goalsPerMatch: string;
  assistsPerMatch: string;
}

interface ModernPlayerStatsProps {
  stats: PlayerStats;
  className?: string;
}

export const ModernPlayerStats: React.FC<ModernPlayerStatsProps> = ({
  stats,
  className
}) => {
  const statCards = [
    {
      icon: Users,
      label: 'Partidos',
      value: stats.appearances,
      color: '#3b82f6',
      glowColor: '#3b82f6',
      subtitle: 'Total jugados'
    },
    {
      icon: Target,
      label: 'Goles',
      value: stats.goals,
      color: '#10b981',
      glowColor: '#10b981',
      subtitle: `${stats.goalsPerMatch}/partido`
    },
    {
      icon: Zap,
      label: 'Asistencias',
      value: stats.assists,
      color: '#8b5cf6',
      glowColor: '#8b5cf6',
      subtitle: `${stats.assistsPerMatch}/partido`
    },
    {
      icon: AlertTriangle,
      label: 'Amarillas',
      value: stats.yellowCards,
      color: '#f59e0b',
      glowColor: '#f59e0b',
      subtitle: 'Tarjetas amarillas'
    },
    {
      icon: X,
      label: 'Rojas',
      value: stats.redCards,
      color: '#ef4444',
      glowColor: '#ef4444',
      subtitle: 'Tarjetas rojas'
    }
  ];

  return (
    <motion.div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            whileHover={{ 
              y: -5,
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <Card className="glass-morphism border-2 border-white/20 hover-lift group relative overflow-hidden">
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                style={{ backgroundColor: stat.glowColor }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                    animate={{
                      y: [-8, 8, -8],
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

              <CardContent className="pt-6 text-center relative z-10">
                {/* Icon */}
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center border-2 border-white/20"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      borderColor: `${stat.color}40`
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: stat.color }}
                    />
                  </div>
                </motion.div>

                {/* Value */}
                <motion.div
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.4,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <motion.div
                  className="text-sm font-semibold text-white/80 mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {stat.label}
                </motion.div>

                {/* Subtitle */}
                <motion.div
                  className="text-xs text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  {stat.subtitle}
                </motion.div>
              </CardContent>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}10, transparent, ${stat.color}10)`,
                  boxShadow: `inset 0 0 30px ${stat.color}20`
                }}
              />
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ModernPlayerStats;
