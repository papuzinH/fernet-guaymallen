'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Loader from '@/components/ui/modern-loader';
import ModernPlayerProfileHeader from '@/components/ui/modern-player-profile-header';
import ModernPlayerStats from '@/components/ui/modern-player-stats';
import ModernPlayerTabs from '@/components/ui/modern-player-tabs';

interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  dorsal: number | null;
  position: string;
  photoUrl: string | null;
  isActive: boolean;
  joinedAt: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    starters: number;
    substitutes: number;
    goalsPerMatch: string;
    assistsPerMatch: string;
  };
  appearances: Appearance[];
  last10Matches: MatchAppearance[];
}

interface Appearance {
  id: number;
  matchId: number;
  isStarter: boolean;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
  match: {
    id: number;
    date: string;
    opponent: string;
    result: string;
    ourScore: number;
    theirScore: number;
    tournament?: {
      name: string;
      organizer: string | null;
    };
  };
}

interface MatchAppearance {
  id: number;
  matchId: number;
  date: string;
  opponent: string;
  result: string;
  ourScore: number;
  theirScore: number;
  tournament: string | null;
  isStarter: boolean;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
}

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params.id as string;
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  const fetchPlayer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/players/${playerId}`);
      const data = await response.json();
      setPlayer(data);
    } catch (error) {
      console.error('Error fetching player:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8"><Loader size="large" text="Cargando jugador..." /></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Jugador no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-blue relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Floating Orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-5"
            style={{
              left: `${10 + i * 40}%`,
              top: `${20 + i * 30}%`,
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)`
            }}
            animate={{
              y: [-50, 50, -50],
              x: [-30, 30, -30],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

        {/* Ambient Particles */}
        {[...Array(20)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 8, top: 12 }, { left: 22, top: 8 }, { left: 38, top: 18 },
            { left: 52, top: 6 }, { left: 68, top: 16 }, { left: 82, top: 22 },
            { left: 12, top: 32 }, { left: 28, top: 35 }, { left: 42, top: 28 },
            { left: 58, top: 38 }, { left: 72, top: 32 }, { left: 88, top: 35 },
            { left: 18, top: 52 }, { left: 32, top: 58 }, { left: 48, top: 62 },
            { left: 62, top: 55 }, { left: 78, top: 58 }, { left: 92, top: 62 },
            { left: 4, top: 45 }, { left: 15, top: 68 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={`ambient-${i}`}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          );
        })}
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 relative z-10">
        {/* Modern Header */}
        <ModernPlayerProfileHeader player={player} className="mb-8" />

        {/* Modern Stats */}
        <ModernPlayerStats stats={player.stats} className="mb-8" />

        {/* Modern Tabs */}
        <ModernPlayerTabs
          appearances={player.appearances}
          last10Matches={player.last10Matches}
          playerName={player.fullName}
        />
      </div>
    </div>
  );
}