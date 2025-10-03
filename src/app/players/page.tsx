'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/modern-loader';
import ModernPlayerCard from '@/components/ui/modern-player-card';
import ModernPlayersHeader from '@/components/ui/modern-players-header';
import ModernPlayerFilters from '@/components/ui/modern-player-filters';

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

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('all');
  const [activeOnly, setActiveOnly] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, [search, position, activeOnly]);

  const fetchPlayers = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      position: position === 'all' ? '' : position,
      activeOnly: activeOnly.toString(),
    });

    try {
      const response = await fetch(`/api/players?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching players:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };


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
            { left: 10, top: 20 }, { left: 25, top: 15 }, { left: 40, top: 30 },
            { left: 55, top: 10 }, { left: 70, top: 25 }, { left: 85, top: 35 },
            { left: 15, top: 45 }, { left: 30, top: 50 }, { left: 45, top: 40 },
            { left: 60, top: 55 }, { left: 75, top: 45 }, { left: 90, top: 50 },
            { left: 20, top: 70 }, { left: 35, top: 75 }, { left: 50, top: 80 },
            { left: 65, top: 70 }, { left: 80, top: 75 }, { left: 95, top: 80 },
            { left: 5, top: 60 }, { left: 12, top: 85 }
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

      {/* Modern Header */}
      <ModernPlayersHeader />

      {/* Main Content */}
      <section className="px-4 pb-20 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Modern Filters */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ModernPlayerFilters
              search={search}
              setSearch={setSearch}
              position={position}
              setPosition={setPosition}
              activeOnly={activeOnly}
              setActiveOnly={setActiveOnly}
            />
          </motion.div>

          {/* Players Grid */}
          {loading ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Loader size="large" text="Cargando jugadores..." />
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {players.length > 0 ? (
                <motion.div
                  key="players-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {players.map((player, index) => (
                    <ModernPlayerCard
                      key={player.id}
                      player={player}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-players"
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="glass-morphism rounded-3xl p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No se encontraron jugadores
                    </h3>
                    <p className="text-white/70">
                      No hay jugadores que coincidan con los filtros aplicados.
                    </p>
                    <motion.button
                      className="mt-4 px-6 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                      onClick={() => {
                        setSearch('');
                        setPosition('all');
                        setActiveOnly(true);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Limpiar filtros
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}