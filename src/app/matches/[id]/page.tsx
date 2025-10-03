'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Loader from '@/components/ui/modern-loader';
import { ModernMatchDetailHeader } from '@/components/ui/modern-match-detail-header';
import { ModernMatchTabs } from '@/components/ui/modern-match-tabs';

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
  appearances: Appearance[];
  stats: MatchStats;
}

interface Appearance {
  id: number;
  player: {
    id: number;
    fullName: string;
    position: string;
  };
  isStarter: boolean;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
}

interface MatchStats {
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  averageRating: number;
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/matches/${matchId}`);
      const data = await response.json();
      setMatch(data.match);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen gradient-blue flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Loader size="large" text="Cargando partido..." />
        </motion.div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen gradient-blue flex items-center justify-center">
        <motion.div
          className="glass-morphism rounded-3xl p-12 text-center border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Partido no encontrado</h2>
          <p className="text-white/70">El partido que buscas no existe o ha sido eliminado.</p>
        </motion.div>
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
        <ModernMatchDetailHeader match={match} className="mb-8" />

        {/* Modern Tabs */}
        <ModernMatchTabs
          appearances={match.appearances}
          stats={stats || {
            totalGoals: 0,
            totalAssists: 0,
            totalYellowCards: 0,
            totalRedCards: 0,
            averageRating: 0
          }}
        />
      </div>
    </div>
  );
}