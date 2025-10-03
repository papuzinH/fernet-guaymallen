'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Users, Award, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stats {
  totalMatches: number;
  wdl: { wins: number; draws: number; losses: number };
  goalsFor: number;
  goalsAgainst: number;
  topScorer: string | null;
  streak: string[];
}

interface ModernStatsOverviewProps {
  stats: Stats;
  className?: string;
}

export const ModernStatsOverview: React.FC<ModernStatsOverviewProps> = ({
  stats,
  className
}) => {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return {
        bg: 'bg-green-500/20',
        border: 'border-green-400/30',
        text: 'text-green-300',
        glow: '#10b981'
      };
      case 'DRAW': return {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-400/30',
        text: 'text-yellow-300',
        glow: '#f59e0b'
      };
      case 'LOSS': return {
        bg: 'bg-red-500/20',
        border: 'border-red-400/30',
        text: 'text-red-300',
        glow: '#ef4444'
      };
      default: return {
        bg: 'bg-gray-500/20',
        border: 'border-gray-400/30',
        text: 'text-gray-300',
        glow: '#6b7280'
      };
    }
  };

  const statCards = [
    {
      title: "Partidos",
      value: stats.totalMatches,
      icon: Users,
      color: "#3b82f6",
      gradient: "from-blue-500/20 to-blue-600/10"
    },
    {
      title: "Victorias",
      value: stats.wdl.wins,
      icon: Trophy,
      color: "#10b981",
      gradient: "from-green-500/20 to-green-600/10"
    },
    {
      title: "Goles",
      value: stats.goalsFor,
      icon: Target,
      color: "#ef4444",
      gradient: "from-red-500/20 to-red-600/10"
    },
    {
      title: "Puntos",
      value: stats.wdl.wins * 3 + stats.wdl.draws,
      icon: TrendingUp,
      color: "#8b5cf6",
      gradient: "from-purple-500/20 to-purple-600/10"
    }
  ];

  return (
    <motion.section
      className={cn("py-20 px-4", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Estadísticas del Club
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Un vistazo a los números que definen nuestra temporada
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className="glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                style={{
                  boxShadow: `0 20px 40px ${stat.color}20`
                }}
              >
                {/* Background Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon 
                      className="w-8 h-8 text-white" 
                      style={{ color: stat.color }}
                    />
                  </div>
                </motion.div>

                {/* Value */}
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {stat.title}
                  </div>
                </motion.div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
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
                        duration: 2 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* WDL Record */}
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-blue-300 mr-3" />
              <h3 className="text-2xl font-bold text-white">Récord</h3>
            </div>
            <div className="text-6xl font-bold text-white mb-4">
              {stats.wdl.wins}-{stats.wdl.draws}-{stats.wdl.losses}
            </div>
            <div className="flex justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/70 text-sm">V</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-white/70 text-sm">E</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-white/70 text-sm">D</span>
              </div>
            </div>
          </motion.div>

          {/* Goals */}
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-red-300 mr-3" />
              <h3 className="text-2xl font-bold text-white">Goles</h3>
            </div>
            <div className="text-6xl font-bold text-white mb-4">
              {stats.goalsFor} - {stats.goalsAgainst}
            </div>
            <p className="text-white/70">A favor vs En contra</p>
          </motion.div>

          {/* Top Scorer */}
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-yellow-300 mr-3" />
              <h3 className="text-2xl font-bold text-white">Goleador</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-4">
              {stats.topScorer || 'N/A'}
            </div>
            <Target className="w-8 h-8 text-white/50 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Streak */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">Racha Reciente</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {stats.streak.map((result, index) => {
              const colors = getResultColor(result);
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: 180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                  className={cn(
                    "w-16 h-16 rounded-full border-2 flex items-center justify-center text-white font-bold text-lg",
                    colors.bg,
                    colors.border
                  )}
                  style={{
                    boxShadow: `0 0 20px ${colors.glow}30`
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {result === 'WIN' ? 'V' : result === 'DRAW' ? 'E' : 'D'}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernStatsOverview;
