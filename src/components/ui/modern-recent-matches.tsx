'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Trophy, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: number;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  result: string;
  tournament?: { name: string };
  location?: string;
}

interface ModernRecentMatchesProps {
  matches: Match[];
  className?: string;
}

export const ModernRecentMatches: React.FC<ModernRecentMatchesProps> = ({
  matches,
  className
}) => {
  const getResultConfig = (result: string) => {
    switch (result) {
      case 'WIN': return {
        color: '#10b981',
        bg: 'bg-green-500/20',
        border: 'border-green-400/30',
        text: 'text-green-300',
        badge: 'bg-green-500/30 text-green-200 border-green-400/50'
      };
      case 'DRAW': return {
        color: '#f59e0b',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-400/30',
        text: 'text-yellow-300',
        badge: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
      };
      case 'LOSS': return {
        color: '#ef4444',
        bg: 'bg-red-500/20',
        border: 'border-red-400/30',
        text: 'text-red-300',
        badge: 'bg-red-500/30 text-red-200 border-red-400/50'
      };
      default: return {
        color: '#6b7280',
        bg: 'bg-gray-500/20',
        border: 'border-gray-400/30',
        text: 'text-gray-300',
        badge: 'bg-gray-500/30 text-gray-200 border-gray-400/50'
      };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha no disponible';
      
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <motion.section
        className={cn("py-20 px-4 bg-black/20", className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            className="glass-morphism rounded-3xl p-12 border border-white/20"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Clock className="w-16 h-16 text-white/50 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No hay partidos recientes</h3>
            <p className="text-white/70 mb-8">
              Los próximos partidos aparecerán aquí cuando estén disponibles.
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              <Link href="/matches">
                Ver Todos los Partidos
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className={cn("py-20 px-4 bg-black/20", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-6xl">
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
            Últimos Partidos
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Revive los momentos más emocionantes de nuestra temporada
          </p>
        </motion.div>

        {/* Matches Grid */}
        <div className="space-y-6">
          {matches.map((match, index) => {
            const resultConfig = getResultConfig(match.result);
            return (
              <motion.div
                key={match.id}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <Link href={`/matches/${match.id}`}>
                  <motion.div
                    className={cn(
                      "glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden group cursor-pointer",
                      resultConfig.bg,
                      resultConfig.border
                    )}
                    style={{
                      boxShadow: `0 20px 40px ${resultConfig.color}20`
                    }}
                  >
                    {/* Background Glow */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(135deg, ${resultConfig.color}10, transparent)`
                      }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Left Side - Match Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <Badge 
                              className={cn(
                                "px-4 py-2 text-sm font-semibold border",
                                resultConfig.badge
                              )}
                            >
                              {match.result}
                            </Badge>
                            {match.tournament && (
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-white/60" />
                                <span className="text-white/80 text-sm">
                                  {match.tournament.name}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-white mb-2">
                              vs {match.opponent}
                            </h3>
                            <div className="flex items-center gap-4 text-white/70">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  {formatDate(match.date)}
                                </span>
                              </div>
                              {match.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{match.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Center - Score */}
                        <motion.div
                          className="text-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className="text-6xl md:text-7xl font-bold mb-2"
                            style={{ color: resultConfig.color }}
                          >
                            {match.ourScore} - {match.theirScore}
                          </div>
                          <div className="text-white/60 text-sm">
                            Resultado Final
                          </div>
                        </motion.div>

                        {/* Right Side - Action */}
                        <motion.div
                          className="flex items-center"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                            <span className="text-sm font-medium">Ver Detalles</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                              left: `${10 + i * 20}%`,
                              top: `${20 + i * 15}%`,
                            }}
                            animate={{
                              y: [-15, 15, -15],
                              opacity: [0.2, 0.6, 0.2],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 3 + i,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.4,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl"
            >
              <Link href="/matches" className="flex items-center gap-2">
                Ver Todos los Partidos
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernRecentMatches;
