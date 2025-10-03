'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  dorsal: number | null;
  position: string;
  photoUrl: string | null;
  isActive: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    goalsPerMatch: string;
  };
}

interface ModernPlayerCardProps {
  player: Player;
  index: number;
  className?: string;
}

export const ModernPlayerCard: React.FC<ModernPlayerCardProps> = ({
  player,
  index,
  className
}) => {
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

  const getPositionGlow = (position: string) => {
    switch (position) {
      case 'GK': return '#f59e0b';
      case 'DEF_CENTRAL':
      case 'DEF_LATERAL': return '#3b82f6';
      case 'MID_CENTRAL':
      case 'VOLANTE':
      case 'MID_OFENSIVO': return '#10b981';
      case 'DELANTERO': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02]",
        player.isActive 
          ? "border-white/30 bg-gradient-to-br from-white/10 to-white/5" 
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
        boxShadow: player.isActive 
          ? `0 20px 40px ${getPositionGlow(player.position)}20` 
          : '0 10px 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background Glow Effect */}
      {player.isActive && (
        <motion.div
          className="absolute inset-0 opacity-20 blur-xl"
          style={{ backgroundColor: getPositionGlow(player.position) }}
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
      )}

      {/* Floating Particles for Active Players */}
      {player.isActive && (
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
      )}

      {/* Status Badge */}
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
          variant={player.isActive ? "default" : "secondary"}
          className={cn(
            "text-xs font-semibold px-3 py-1",
            player.isActive 
              ? "bg-green-500/20 text-green-300 border-green-400/30" 
              : "bg-red-500/20 text-red-300 border-red-400/30"
          )}
        >
          {player.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </motion.div>

      {/* Main Content */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Photo */}
          <motion.div
            className="relative w-24 h-24 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.1 + 0.2,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
          >
            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={player.fullName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Photo Glow Effect */}
            {player.isActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${getPositionGlow(player.position)}20, transparent)`,
                  boxShadow: `inset 0 0 20px ${getPositionGlow(player.position)}40`
                }}
              />
            )}
          </motion.div>

          {/* Name and Nickname */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-glow transition-all duration-300">
              {player.fullName}
            </h3>
            {player.nickname && (
              <p className="text-white/70 text-lg">"{player.nickname}"</p>
            )}
          </motion.div>

          {/* Position and Dorsal */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <Badge className={cn(
              getPositionColor(player.position),
              "text-white font-semibold px-3 py-1 text-sm"
            )}>
              {getPositionName(player.position)}
            </Badge>
            {player.dorsal && (
              <Badge 
                variant="outline" 
                className="text-white/80 border-white/30 bg-white/10 px-3 py-1 text-sm font-bold"
              >
                #{player.dorsal}
              </Badge>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 w-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{player.stats.appearances}</div>
              <div className="text-xs text-white/60">Partidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{player.stats.goals}</div>
              <div className="text-xs text-white/60">Goles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{player.stats.assists}</div>
              <div className="text-xs text-white/60">Asistencias</div>
            </div>
          </motion.div>

          {/* View Profile Button */}
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
              <Link href={`/players/${player.id}`}>
                Ver Perfil
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${getPositionGlow(player.position)}10, transparent, ${getPositionGlow(player.position)}10)`,
          boxShadow: `inset 0 0 50px ${getPositionGlow(player.position)}20`
        }}
      />

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default ModernPlayerCard;
