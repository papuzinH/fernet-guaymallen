'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModernHero from '@/components/ui/modern-hero';
import ModernStatsOverview from '@/components/ui/modern-stats-overview';
import ModernRecentMatches from '@/components/ui/modern-recent-matches';
import ModernTopPlayers from '@/components/ui/modern-top-players';

interface Stats {
  totalMatches: number;
  wdl: { wins: number; draws: number; losses: number };
  goalsFor: number;
  goalsAgainst: number;
  topScorer: string | null;
  streak: string[];
  last5Matches: Array<{
    id: number;
    date: string;
    opponent: string;
    ourScore: number;
    theirScore: number;
    result: string;
    tournament?: { name: string };
    location?: string;
  }>;
  topPlayers: Array<{
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
  }>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Cargando estadísticas...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-blue">
      {/* Modern Hero Section */}
      <ModernHero />

      {/* Modern Stats Overview */}
      {stats && (
        <ModernStatsOverview stats={stats} />
      )}

      {/* Modern Recent Matches */}
      {stats && stats.last5Matches && stats.last5Matches.length > 0 && (
        <ModernRecentMatches matches={stats.last5Matches} />
      )}

      {/* Modern Top Players */}
      {stats && stats.topPlayers && stats.topPlayers.length > 0 && (
        <ModernTopPlayers players={stats.topPlayers} />
      )}
    </div>
  );
}
