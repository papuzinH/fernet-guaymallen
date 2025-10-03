'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/modern-loader';
import ModernTabs from '@/components/ui/modern-tabs';
import ModernRankingCard from '@/components/ui/modern-ranking-card';
import ModernRankingsHeader from '@/components/ui/modern-rankings-header';
import ModernChartsSection from '@/components/ui/modern-charts-section';
import { GoalIcon, AppearanceIcon, AssistIcon, FairPlayIcon, PerformanceIcon } from '@/components/icons/rankings';

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

interface ChartData {
  month?: string;
  goals?: number;
  season?: string;
  wins?: number;
  draws?: number;
  losses?: number;
}

const rankingConfigs = {
  goals: {
    title: 'GOLEADORES',
    label: 'Goles',
    icon: GoalIcon,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
    glowColor: '#ef4444'
  },
  appearances: {
    title: 'PRESENCIAS',
    label: 'Partidos',
    icon: AppearanceIcon,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
    glowColor: '#3b82f6'
  },
  assists: {
    title: 'ASISTENCIAS',
    label: 'Pases Gol',
    icon: AssistIcon,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
    glowColor: '#10b981'
  },
  fairplay: {
    title: 'FAIR PLAY',
    label: 'Tarjetas/Partido',
    icon: FairPlayIcon,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
    glowColor: '#f59e0b'
  },
  performance: {
    title: 'RENDIMIENTO',
    label: 'Puntos/Partido',
    icon: PerformanceIcon,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
    glowColor: '#8b5cf6'
  }
};

export default function RankingsPage() {
  const [rankings, setRankings] = useState<{ [key: string]: RankingPlayer[] }>({});
  const [chartsData, setChartsData] = useState<{ [key: string]: ChartData[] }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('goals');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all rankings
      const rankingTypes = ['goals', 'appearances', 'assists', 'fairplay', 'performance'];
      const rankingsPromises = rankingTypes.map(async type => {
        try {
          const response = await fetch(`/api/rankings?type=${type}&limit=10`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error(`Error fetching ${type} rankings:`, error);
          return [];
        }
      });

      const rankingsResults = await Promise.all(rankingsPromises);
      const rankingsData: { [key: string]: RankingPlayer[] } = {};
      rankingTypes.forEach((type, index) => {
        rankingsData[type] = rankingsResults[index];
      });

      // Fetch chart data
      const chartTypes = ['goals-by-month', 'results-by-season'];
      const chartsPromises = chartTypes.map(async type => {
        try {
          const response = await fetch(`/api/charts?type=${type}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error(`Error fetching ${type} chart:`, error);
          return [];
        }
      });

      const chartsResults = await Promise.all(chartsPromises);
      const chartsDataObj: { [key: string]: ChartData[] } = {};
      chartTypes.forEach((type, index) => {
        chartsDataObj[type] = chartsResults[index];
      });

      setRankings(rankingsData);
      setChartsData(chartsDataObj);
    } catch (error) {
      console.error('Error fetching rankings data:', error);
    } finally {
      setLoading(false);
    }
  };


  const renderRankingTable = (data: RankingPlayer[], type: string) => {
    const config = rankingConfigs[type as keyof typeof rankingConfigs];

    // Ensure data is an array
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-morphism rounded-2xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-white/70 text-lg">No hay datos disponibles</p>
            <p className="text-white/50 text-sm mt-2">Los rankings aparecerán cuando se registren partidos</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Modern Header */}
        <motion.div
          className="relative glass-morphism rounded-3xl p-8 text-center border-2 border-white/20 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
            style={{ backgroundColor: config.glowColor }}
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
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              className="mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <config.icon className={`w-10 h-10 ${config.color}`} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl font-bold text-white mb-3"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {config.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/70 text-xl"
            >
              Ranking por {config.label.toLowerCase()}
            </motion.p>
          </div>
        </motion.div>

        {/* Rankings List */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {data.map((player, index) => (
              <ModernRankingCard
                key={player.id}
                player={player}
                rank={index + 1}
                type={type}
                color={config.color}
                glowColor={config.glowColor}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-blue flex items-center justify-center">
        <Loader size="large" text="Cargando..." />
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
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`ambient-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Modern Header */}
      <ModernRankingsHeader />

      {/* Rankings Tabs */}
      <section className="px-4 pb-20 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Modern Tabs Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <ModernTabs
              tabs={Object.entries(rankingConfigs).map(([key, config]) => ({
                id: key,
                label: config.title,
                icon: config.icon,
                color: config.color,
                gradient: config.gradient,
                glowColor: config.glowColor
              }))}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="max-w-5xl mx-auto"
            />
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {renderRankingTable(rankings[activeTab] || [], activeTab)}
            </motion.div>
          </AnimatePresence>

          {/* Modern Charts Section */}
          <ModernChartsSection chartsData={chartsData} />
        </div>
      </section>
    </div>
  );
}