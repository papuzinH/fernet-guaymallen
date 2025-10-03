'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RankingPlayer {
  id: number;
  name: string;
  nickname: string | null;
  position: string;
  dorsal: number | null;
  value: number;
  displayValue?: string;
  appearances?: number;
  average?: string;
  totalCards?: number;
  totalPoints?: number;
  trend: 'up' | 'down' | 'stable';
  isActive: boolean;
}

interface ModernRankingCardProps {
  player: RankingPlayer;
  rank: number;
  type: string;
  color: string;
  glowColor: string;
  className?: string;
}

export const ModernRankingCard: React.FC<ModernRankingCardProps> = ({
  player,
  rank,
  type,
  color,
  glowColor,
  className
}) => {
  const isTop3 = rank <= 3;
  const isTop1 = rank === 1;

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-yellow-500';
      case 'DEF_CENTRAL':
      case 'DEF_LATERAL': return 'bg-blue-500';
      case 'MID_CENTRAL':
      case 'VOLANTE':
      case 'MID_OFENSIVO': return 'bg-green-500';
      case 'DELANTERO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case 'GK': return 'ARQ';
      case 'DEF_CENTRAL': return 'DEF C';
      case 'DEF_LATERAL': return 'DEF L';
      case 'MID_CENTRAL': return 'MED C';
      case 'VOLANTE': return 'VOL';
      case 'MID_OFENSIVO': return 'MED OF';
      case 'DELANTERO': return 'DEL';
      default: return position;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] group",
        isTop3
          ? "border-white/30 bg-gradient-to-r from-white/10 to-white/5 shadow-2xl"
          : "border-white/20 bg-gradient-to-r from-slate-900/40 to-slate-800/30 hover:border-white/30",
        className
      )}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay: rank * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      style={{
        boxShadow: isTop3 ? `0 20px 40px ${glowColor}20` : undefined
      }}
    >
      {/* Background Glow Effect for Top 3 */}
      {isTop3 && (
        <motion.div
          className="absolute inset-0 opacity-20 blur-xl"
          style={{ backgroundColor: glowColor }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Floating Particles for Top 1 */}
      {isTop1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Rank Badge */}
      <motion.div
        className="absolute top-4 left-4 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: rank * 0.1 + 0.3,
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
      >
        <div className={cn(
          "flex items-center justify-center w-14 h-14 rounded-2xl font-bold text-2xl shadow-lg",
          rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black" :
          rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
          rank === 3 ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white" :
          "bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/30"
        )}>
          {rank}
        </div>
      </motion.div>

      {/* Rank Icon for Top 3 */}
      {isTop3 && (
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: rank * 0.1 + 0.5,
            type: "spring",
            stiffness: 500,
            damping: 15
          }}
        >
          {getRankIcon(rank)}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="p-6 pl-20 pr-8">
        <div className="flex items-center justify-between">
          {/* Player Info */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.1 + 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-glow transition-all duration-300">
              {player.name}
            </h3>
            {player.nickname && (
              <p className="text-white/70 text-lg mb-3">"{player.nickname}"</p>
            )}
            <div className="flex items-center space-x-3">
              <Badge className={cn(
                getPositionColor(player.position),
                "text-white font-semibold px-3 py-1"
              )}>
                {getPositionName(player.position)}
              </Badge>
              {player.dorsal && (
                <span className="text-white/60 text-lg font-medium">#{player.dorsal}</span>
              )}
              {!player.isActive && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                  Inactivo
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.1 + 0.6 }}
          >
            <div className="text-5xl font-bold text-white mb-2 group-hover:text-glow transition-all duration-300">
              {player.displayValue || player.value}
            </div>
            <div className="text-white/60 text-sm mb-3">
              {type === 'goals' && 'Goles'}
              {type === 'appearances' && 'Partidos'}
              {type === 'assists' && 'Asistencias'}
              {type === 'fairplay' && 'Tarjetas/Partido'}
              {type === 'performance' && 'Puntos/Partido'}
              {player.average && (
                <span className="block text-xs">({player.average}/partido)</span>
              )}
            </div>
            <div className="flex justify-end items-center space-x-2">
              {getTrendIcon(player.trend)}
              <span className="text-xs text-white/50">
                {player.trend === 'up' && 'En alza'}
                {player.trend === 'down' && 'En baja'}
                {player.trend === 'stable' && 'Estable'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar for Top 3 */}
      {isTop3 && (
        <motion.div
          className="px-6 pb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: rank * 0.1 + 0.8, duration: 0.8 }}
        >
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className={cn(
                "h-2 rounded-full",
                rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500" :
                "bg-gradient-to-r from-amber-500 to-amber-700"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${(player.value / Math.max(player.value, 10)) * 100}%` }}
              transition={{ 
                delay: rank * 0.1 + 1,
                duration: 1.2,
                ease: "easeOut"
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${color}10, transparent, ${color}10)`,
          boxShadow: `inset 0 0 50px ${color}20`
        }}
      />
    </motion.div>
  );
};

export default ModernRankingCard;
