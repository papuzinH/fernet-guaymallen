'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: number;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  result: string;
  tournament?: {
    name: string;
    organizer?: string | null;
  };
}

interface ModernMatchCardProps {
  match: Match;
  index: number;
  className?: string;
}

export const ModernMatchCard: React.FC<ModernMatchCardProps> = ({
  match,
  index,
  className
}) => {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return {
        bg: 'bg-green-500',
        glow: '#10b981',
        text: 'text-green-300',
        border: 'border-green-400/30'
      };
      case 'DRAW': return {
        bg: 'bg-yellow-500',
        glow: '#f59e0b',
        text: 'text-yellow-300',
        border: 'border-yellow-400/30'
      };
      case 'LOSS': return {
        bg: 'bg-red-500',
        glow: '#ef4444',
        text: 'text-red-300',
        border: 'border-red-400/30'
      };
      default: return {
        bg: 'bg-gray-500',
        glow: '#6b7280',
        text: 'text-gray-300',
        border: 'border-gray-400/30'
      };
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'WIN': return <Target className="w-4 h-4" />;
      case 'DRAW': return <Users className="w-4 h-4" />;
      case 'LOSS': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const resultColors = getResultColor(match.result);
  const isWin = match.result === 'WIN';
  const isDraw = match.result === 'DRAW';
  const isLoss = match.result === 'LOSS';

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02]",
        isWin 
          ? "border-green-400/50 bg-gradient-to-br from-green-500/10 to-green-600/5" 
          : isDraw
          ? "border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"
          : isLoss
          ? "border-red-400/50 bg-gradient-to-br from-red-500/10 to-red-600/5"
          : "border-white/20 bg-gradient-to-br from-slate-900/40 to-slate-800/30",
        className
      )}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      style={{
        boxShadow: `0 20px 40px ${resultColors.glow}20`
      }}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 opacity-20 blur-xl"
        style={{ backgroundColor: resultColors.glow }}
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
              y: [-15, 15, -15],
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

      {/* Result Badge */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: index * 0.1 + 0.3,
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
      >
        <Badge 
          className={cn(
            "text-xs font-semibold px-3 py-1 flex items-center gap-1",
            resultColors.bg,
            resultColors.text,
            resultColors.border
          )}
        >
          {getResultIcon(match.result)}
          {match.result}
        </Badge>
      </motion.div>

      {/* Main Content */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col space-y-4">
          {/* Date and Tournament */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <div className="flex items-center gap-2 text-white/70">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(match.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
            {match.tournament && (
              <div className="flex items-center gap-2 text-white/70">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">{match.tournament.name}</span>
              </div>
            )}
          </motion.div>

          {/* Match Info */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-glow transition-all duration-300">
              vs {match.opponent}
            </h3>
            
            {/* Score */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-4xl font-bold text-white">
                {match.ourScore}
              </div>
              <div className="text-white/50 text-xl">-</div>
              <div className="text-4xl font-bold text-white/70">
                {match.theirScore}
              </div>
            </div>

            {/* Result Message */}
            <motion.div
              className="text-sm font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              {isWin && (
                <span className="text-green-300">¡Victoria! 🎉</span>
              )}
              {isDraw && (
                <span className="text-yellow-300">Empate</span>
              )}
              {isLoss && (
                <span className="text-red-300">Derrota</span>
              )}
            </motion.div>
          </motion.div>

          {/* View Detail Button */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.7 }}
          >
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 hover:border-white/50 transition-all duration-300"
            >
              <Link href={`/matches/${match.id}`}>
                Ver Detalle
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${resultColors.glow}10, transparent, ${resultColors.glow}10)`,
          boxShadow: `inset 0 0 50px ${resultColors.glow}20`
        }}
      />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default ModernMatchCard;
