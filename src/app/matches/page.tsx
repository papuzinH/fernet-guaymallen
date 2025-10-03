'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/modern-loader';
import { ModernMatchesHeader } from '@/components/ui/modern-matches-header';
import { ModernMatchFilters } from '@/components/ui/modern-match-filters';
import { ModernMatchCard } from '@/components/ui/modern-match-card';

interface Match {
  id: number;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  result: string;
  tournament?: {
    name: string;
    organizer?: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tournament: 'all',
    result: 'all',
  });

  useEffect(() => {
    fetchMatches();
  }, [filters, pagination.page]);

  const fetchMatches = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== 'all')
      ),
    });

    try {
      const response = await fetch(`/api/matches?${params}`);
      const data = await response.json();
      setMatches(data.matches);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'bg-green-500';
      case 'DRAW': return 'bg-yellow-500';
      case 'LOSS': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUniqueValues = () => {
    const tournaments = new Set<string>();
    const results = new Set<string>();
    
    matches.forEach(match => {
      if (match.tournament?.name) {
        tournaments.add(match.tournament.name);
      }
      results.add(match.result);
    });
    
    return {
      tournaments: Array.from(tournaments).sort(),
      results: Array.from(results).sort()
    };
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

      {/* Modern Header */}
      <ModernMatchesHeader />

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
            <ModernMatchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              uniqueValues={getUniqueValues()}
            />
          </motion.div>

          {/* Matches Grid */}
          {loading ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Loader size="large" text="Cargando partidos..." />
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {matches.length > 0 ? (
                <motion.div
                  key="matches-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {matches.map((match, index) => (
                    <ModernMatchCard
                      key={match.id}
                      match={match}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-matches"
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="glass-morphism rounded-3xl p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-4">⚽</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No se encontraron partidos
                    </h3>
                    <p className="text-white/70">
                      No hay partidos que coincidan con los filtros aplicados.
                    </p>
                    <motion.button
                      className="mt-4 px-6 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                      onClick={() => {
                        setFilters({ tournament: 'all', result: 'all' });
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

          {/* Pagination */}
          {matches.length > 0 && (
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="glass-morphism rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <motion.button
                    className="px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Anterior
                  </motion.button>
                  
                  <div className="text-white/80 text-sm">
                    Página {pagination.page} de {pagination.pages}
                  </div>
                  
                  <motion.button
                    className="px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Siguiente
                  </motion.button>
                </div>
                
                <div className="text-center text-white/60 text-sm mt-2">
                  Mostrando {matches.length} de {pagination.total} partidos
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}