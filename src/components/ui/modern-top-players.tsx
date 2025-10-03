'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users, Award, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  fullName: string;
  nickname?: string;
  position: string;
  dorsal?: string;
  photoUrl?: string;
  stats: {
    goals: number;
    assists: number;
    appearances: number;
  };
}

interface ModernTopPlayersProps {
  players: Player[];
  className?: string;
}

export const ModernTopPlayers: React.FC<ModernTopPlayersProps> = ({
  players,
  className
}) => {
  const getPositionConfig = (position: string) => {
    switch (position) {
      case 'DELANTERO': return {
        color: '#ef4444',
        bg: 'bg-red-500/20',
        border: 'border-red-400/30',
        icon: Target
      };
      case 'MEDIOCAMPISTA': return {
        color: '#3b82f6',
        bg: 'bg-blue-500/20',
        border: 'border-blue-400/30',
        icon: Users
      };
      case 'DEFENSOR': return {
        color: '#10b981',
        bg: 'bg-green-500/20',
        border: 'border-green-400/30',
        icon: Award
      };
      case 'ARQUERO': return {
        color: '#8b5cf6',
        bg: 'bg-purple-500/20',
        border: 'border-purple-400/30',
        icon: Trophy
      };
      default: return {
        color: '#6b7280',
        bg: 'bg-gray-500/20',
        border: 'border-gray-400/30',
        icon: Users
      };
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case 'DELANTERO': return 'Delantero';
      case 'MEDIOCAMPISTA': return 'Mediocampista';
      case 'DEFENSOR': return 'Defensor';
      case 'ARQUERO': return 'Arquero';
      default: return position;
    }
  };

  if (!players || players.length === 0) {
    return (
      <motion.section
        className={cn("py-20 px-4", className)}
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
            <Users className="w-16 h-16 text-white/50 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No hay jugadores destacados</h3>
            <p className="text-white/70 mb-8">
              Los jugadores con mejores estadísticas aparecerán aquí.
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              <Link href="/players">
                Ver Todos los Jugadores
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    );
  }

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
            Jugadores Destacados
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Los protagonistas de nuestra temporada
          </p>
        </motion.div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.slice(0, 6).map((player, index) => {
            const positionConfig = getPositionConfig(player.position);
            const PositionIcon = positionConfig.icon;
            
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <Link href={`/players/${player.id}`}>
                  <motion.div
                    className={cn(
                      "glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden group cursor-pointer h-full",
                      positionConfig.bg,
                      positionConfig.border
                    )}
                    style={{
                      boxShadow: `0 20px 40px ${positionConfig.color}20`
                    }}
                  >
                    {/* Background Glow */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(135deg, ${positionConfig.color}10, transparent)`
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
                      {/* Player Header */}
                      <div className="flex items-center gap-4 mb-6">
                        {/* Player Photo */}
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className="w-16 h-16 rounded-full border-2 flex items-center justify-center overflow-hidden"
                            style={{ borderColor: positionConfig.color }}
                          >
                            {player.photoUrl ? (
                              <img
                                src={player.photoUrl}
                                alt={player.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: `${positionConfig.color}30` }}
                              >
                                {player.fullName.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          {/* Position Badge */}
                          <div 
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                            style={{ backgroundColor: positionConfig.color }}
                          >
                            <PositionIcon className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>

                        {/* Player Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {player.fullName}
                          </h3>
                          {player.nickname && (
                            <p className="text-white/70 text-sm mb-1">
                              "{player.nickname}"
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge 
                              className="text-xs"
                              style={{ 
                                backgroundColor: `${positionConfig.color}30`,
                                color: positionConfig.color,
                                borderColor: positionConfig.color
                              }}
                            >
                              {getPositionName(player.position)}
                            </Badge>
                            {player.dorsal && (
                              <Badge variant="outline" className="text-xs border-white/30 text-white/80">
                                #{player.dorsal}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ color: positionConfig.color }}
                          >
                            {player.stats.goals}
                          </div>
                          <div className="text-white/60 text-xs">Goles</div>
                        </div>
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ color: positionConfig.color }}
                          >
                            {player.stats.assists}
                          </div>
                          <div className="text-white/60 text-xs">Asistencias</div>
                        </div>
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ color: positionConfig.color }}
                          >
                            {player.stats.appearances}
                          </div>
                          <div className="text-white/60 text-xs">Partidos</div>
                        </div>
                      </div>

                      {/* Action */}
                      <motion.div
                        className="flex items-center justify-center text-white/70 group-hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm font-medium mr-2">Ver Perfil</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/20 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.2, 0.6, 0.2],
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
              <Link href="/players" className="flex items-center gap-2">
                Ver Todos los Jugadores
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernTopPlayers;
