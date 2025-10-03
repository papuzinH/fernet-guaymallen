'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  dorsal: number | null;
  position: string;
  photoUrl: string | null;
  isActive: boolean;
  joinedAt: string;
}

interface ModernPlayerProfileHeaderProps {
  player: Player;
  className?: string;
}

export const ModernPlayerProfileHeader: React.FC<ModernPlayerProfileHeaderProps> = ({
  player,
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
      case 'GK': return 'Arquero';
      case 'DEF_CENTRAL': return 'Defensor Central';
      case 'DEF_LATERAL': return 'Defensor Lateral';
      case 'MID_CENTRAL': return 'Mediocampista Central';
      case 'VOLANTE': return 'Volante';
      case 'MID_OFENSIVO': return 'Mediocampista Ofensivo';
      case 'DELANTERO': return 'Delantero';
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
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-800/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.2))",
              "linear-gradient(225deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2))",
              "linear-gradient(45deg, rgba(15, 23, 42, 0.4), rgba(30, 41, 59, 0.2))"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 10, top: 15 }, { left: 25, top: 10 }, { left: 40, top: 20 },
            { left: 55, top: 12 }, { left: 70, top: 18 }, { left: 85, top: 14 },
            { left: 15, top: 35 }, { left: 30, top: 40 }, { left: 45, top: 38 },
            { left: 60, top: 42 }, { left: 75, top: 36 }, { left: 90, top: 40 },
            { left: 20, top: 60 }, { left: 35, top: 65 }, { left: 50, top: 70 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <motion.div
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button 
          asChild 
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
        >
          <Link href="/players" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Jugadores
          </Link>
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="glass-morphism rounded-3xl p-8 border-2 border-white/20 relative overflow-hidden">
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
          style={{ backgroundColor: getPositionGlow(player.position) }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Photo */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-white/20 to-white/10 border-4 border-white/20">
                {player.photoUrl ? (
                  <Image
                    src={player.photoUrl}
                    alt={player.fullName}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    <User className="w-16 h-16" />
                  </div>
                )}

                {/* Photo Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${getPositionGlow(player.position)}20, transparent)`,
                    boxShadow: `inset 0 0 30px ${getPositionGlow(player.position)}40`
                  }}
                />
              </div>

              {/* Status Badge */}
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.5,
                  type: "spring",
                  stiffness: 400,
                  damping: 20
                }}
              >
                <Badge 
                  variant={player.isActive ? "default" : "secondary"}
                  className={cn(
                    "text-sm font-semibold px-4 py-2",
                    player.isActive 
                      ? "bg-green-500/20 text-green-300 border-green-400/30" 
                      : "bg-red-500/20 text-red-300 border-red-400/30"
                  )}
                >
                  {player.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </motion.div>
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                {player.fullName}
              </h1>
              
              {player.nickname && (
                <p className="text-2xl text-white/70 mb-6">"{player.nickname}"</p>
              )}

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <Badge className={cn(
                  getPositionColor(player.position),
                  "text-white font-semibold px-4 py-2 text-lg"
                )}>
                  {getPositionName(player.position)}
                </Badge>
                
                {player.dorsal && (
                  <Badge 
                    variant="outline" 
                    className="text-white/80 border-white/30 bg-white/10 px-4 py-2 text-lg font-bold"
                  >
                    #{player.dorsal}
                  </Badge>
                )}
              </div>

              <motion.div
                className="flex items-center justify-center lg:justify-start gap-2 text-white/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-lg">
                  Se unió en {new Date(player.joinedAt).toLocaleDateString()}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernPlayerProfileHeader;
