'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Trophy, Target, Users, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: number;
  date: string;
  opponent: string;
  location?: string;
  ourScore: number;
  theirScore: number;
  result: string;
  notes?: string;
  tournament?: {
    name: string;
    organizer?: string | null;
  };
}

interface ModernMatchDetailHeaderProps {
  match: Match;
  className?: string;
}

export const ModernMatchDetailHeader: React.FC<ModernMatchDetailHeaderProps> = ({
  match,
  className
}) => {
  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return {
        bg: 'bg-green-500',
        glow: '#10b981',
        text: 'text-green-300',
        border: 'border-green-400/30',
        gradient: 'from-green-500/20 to-green-600/10'
      };
      case 'DRAW': return {
        bg: 'bg-yellow-500',
        glow: '#f59e0b',
        text: 'text-yellow-300',
        border: 'border-yellow-400/30',
        gradient: 'from-yellow-500/20 to-yellow-600/10'
      };
      case 'LOSS': return {
        bg: 'bg-red-500',
        glow: '#ef4444',
        text: 'text-red-300',
        border: 'border-red-400/30',
        gradient: 'from-red-500/20 to-red-600/10'
      };
      default: return {
        bg: 'bg-gray-500',
        glow: '#6b7280',
        text: 'text-gray-300',
        border: 'border-gray-400/30',
        gradient: 'from-gray-500/20 to-gray-600/10'
      };
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'WIN': return <Target className="w-5 h-5" />;
      case 'DRAW': return <Users className="w-5 h-5" />;
      case 'LOSS': return <Target className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const resultColors = getResultColor(match.result);
  const isWin = match.result === 'WIN';
  const isDraw = match.result === 'DRAW';
  const isLoss = match.result === 'LOSS';

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 p-8",
        `bg-gradient-to-br ${resultColors.gradient}`,
        resultColors.border,
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
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
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          asChild 
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
        >
          <Link href="/matches" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Partidos
          </Link>
        </Button>
      </motion.div>

      {/* Match Info */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-white flex-1">
            vs {match.opponent}
          </h1>
          <Badge 
            className={cn(
              "text-sm font-semibold px-4 py-2 flex items-center gap-2 border-2 ml-4",
              resultColors.bg,
              resultColors.text,
              resultColors.border
            )}
            style={{
              backgroundColor: resultColors.glow + '40',
              borderColor: resultColors.glow,
              color: 'white',
              boxShadow: `0 0 10px ${resultColors.glow}50`
            }}
          >
            {getResultIcon(match.result)}
            {match.result}
          </Badge>
        </motion.div>

        {/* Score */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-6">
            <div className="text-6xl font-bold text-white">
              {match.ourScore}
            </div>
            <div className="text-white/50 text-2xl">-</div>
            <div className="text-6xl font-bold text-white/70">
              {match.theirScore}
            </div>
          </div>
          
          {/* Result Message */}
          <motion.div
            className="text-lg font-medium mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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

        {/* Match Details */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 text-white/80">
            <Calendar className="w-5 h-5 text-blue-300" />
            <div>
              <p className="text-sm text-white/60">Fecha</p>
              <p className="font-medium">
                {(() => {
                  try {
                    const date = new Date(match.date);
                    if (isNaN(date.getTime())) {
                      return 'Fecha no disponible';
                    }
                    return date.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  } catch (error) {
                    return 'Fecha no disponible';
                  }
                })()}
              </p>
            </div>
          </div>

          {match.tournament && (
            <div className="flex items-center gap-3 text-white/80">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="text-sm text-white/60">Torneo</p>
                <p className="font-medium">{match.tournament.name}</p>
                {match.tournament.organizer && (
                  <p className="text-xs text-white/50">Organizado por: {match.tournament.organizer}</p>
                )}
              </div>
            </div>
          )}

          {match.location && (
            <div className="flex items-center gap-3 text-white/80">
              <MapPin className="w-5 h-5 text-green-300" />
              <div>
                <p className="text-sm text-white/60">Ubicación</p>
                <p className="font-medium">{match.location}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Notes Section */}
        {match.notes && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-start gap-3 text-white/80">
              <FileText className="w-5 h-5 text-purple-300 mt-1" />
              <div>
                <p className="text-sm text-white/60 mb-2">Notas del Partido</p>
                <p className="font-medium text-white/90 leading-relaxed">{match.notes}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default ModernMatchDetailHeader;
