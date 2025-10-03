'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, Users, TrendingUp, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ModernMatchTabsProps {
  appearances: Appearance[];
  stats: MatchStats;
  className?: string;
}

export const ModernMatchTabs: React.FC<ModernMatchTabsProps> = ({
  appearances = [],
  stats = {
    totalGoals: 0,
    totalAssists: 0,
    totalYellowCards: 0,
    totalRedCards: 0,
    averageRating: 0
  },
  className
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabConfigs = {
    summary: {
      title: 'Resumen',
      label: 'Estadísticas generales',
      icon: BarChart3,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))',
      glowColor: '#3b82f6'
    },
    lineup: {
      title: 'Alineación',
      label: 'Rendimiento de jugadores',
      icon: Users,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
      glowColor: '#10b981'
    },
    stats: {
      title: 'Estadísticas',
      label: 'Análisis detallado',
      icon: TrendingUp,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
      glowColor: '#8b5cf6'
    }
  };

  const exportToCSV = () => {
    const headers = ['Jugador', 'Posición', 'Minutos', 'Goles', 'Asistencias', 'Tarjetas Amarillas', 'Tarjetas Rojas', 'Calificación'];
    const rows = appearances.map(app => [
      app.player?.name || '—',
      app.player?.position || '-',
      app.minutesPlayed,
      app.goals,
      app.assists,
      app.yellowCards,
      app.redCards,
      app.rating ? app.rating.toFixed(1) : '-'
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alineacion_partido_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Modern Tabs */}
      <div className="glass-morphism rounded-3xl p-2 border border-white/20">
        <div className="flex space-x-2">
          {Object.entries(tabConfigs).map(([tabId, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === tabId;
            
            return (
              <motion.button
                key={tabId}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                )}
                onClick={() => setActiveTab(tabId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isActive ? config.gradient : 'transparent',
                  boxShadow: isActive ? `0 0 20px ${config.glowColor}30` : 'none'
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${config.glowColor}20, transparent)`,
                      boxShadow: `inset 0 0 20px ${config.glowColor}20`
                    }}
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{config.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'summary' && (
            <div className="glass-morphism rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-300" />
                    Estadísticas Generales
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/80">Goles totales:</span>
                      <span className="text-2xl font-bold text-red-300">{stats.totalGoals || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/80">Asistencias:</span>
                      <span className="text-2xl font-bold text-green-300">{stats.totalAssists || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/80">Tarjetas amarillas:</span>
                      <span className="text-2xl font-bold text-yellow-300">{stats.totalYellowCards || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/80">Tarjetas rojas:</span>
                      <span className="text-2xl font-bold text-red-400">{stats.totalRedCards || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/80">Calificación promedio:</span>
                      <span className="text-2xl font-bold text-blue-300">{stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                    Goleadores
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      const scorers = appearances.filter(app => (app?.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
                      if (scorers.length === 0) {
                        return <p className="text-white/60 text-center py-8">Sin goles</p>;
                      }
                      return scorers.map(app => (
                        <div key={app.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-white">{app.player?.fullName ?? '—'}</span>
                          <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                            {app.goals} gol{app.goals !== 1 ? 'es' : ''}
                          </Badge>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineup' && (
            <div className="glass-morphism rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-green-300" />
                  Alineación y Rendimiento
                </h3>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  onClick={exportToCSV}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </motion.button>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/80">Jugador</TableHead>
                      <TableHead className="text-white/80">Posición</TableHead>
                      <TableHead className="text-white/80">Titular</TableHead>
                      <TableHead className="text-white/80">Goles</TableHead>
                      <TableHead className="text-white/80">Asistencias</TableHead>
                      <TableHead className="text-white/80">Tarjetas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appearances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-white/60 py-8">
                          No hay datos de alineación
                        </TableCell>
                      </TableRow>
                    ) : (
                      appearances.map((appearance) => (
                        <TableRow key={appearance.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-medium text-white">
                            {appearance.player?.fullName ?? '—'}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.player?.position ?? '-'}
                          </TableCell>
                          <TableCell className="text-white/80">
                            <Badge className={appearance.isStarter ? "bg-green-500/20 text-green-300 border-green-400/30" : "bg-gray-500/20 text-gray-300 border-gray-400/30"}>
                              {appearance.isStarter ? 'Sí' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.goals}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.assists}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {appearance.yellow && (
                                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                                  A
                                </Badge>
                              )}
                              {appearance.red && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                                  R
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-morphism rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-red-300" />
                  Estadísticas de Goles
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-white/80">Total de goles:</span>
                    <span className="text-3xl font-bold text-red-300">{stats.totalGoals || 0}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-white">Goleadores</h4>
                    {(() => {
                      const scorers = appearances.filter(app => (app?.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
                      const maxGoals = scorers.length > 0 ? Math.max(...scorers.map(a => a.goals ?? 0)) : 1;
                      return scorers.map(app => (
                        <div key={app.id} className="flex justify-between items-center py-2">
                          <span className="text-white/80">{app.player?.name ?? '—'}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-white/10 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((app.goals ?? 0) / maxGoals) * 100}%` }}
                              />
                            </div>
                            <span className="font-medium text-white w-8 text-right">{app.goals}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="glass-morphism rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-300" />
                  Estadísticas de Asistencias
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-white/80">Total de asistencias:</span>
                    <span className="text-3xl font-bold text-green-300">{stats.totalAssists || 0}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-white">Asistidores</h4>
                    {(() => {
                      const assisters = appearances.filter(app => (app?.assists ?? 0) > 0).sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0));
                      const maxAssists = assisters.length > 0 ? Math.max(...assisters.map(a => a.assists ?? 0)) : 1;
                      return assisters.map(app => (
                        <div key={app.id} className="flex justify-between items-center py-2">
                          <span className="text-white/80">{app.player?.name ?? '—'}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-white/10 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((app.assists ?? 0) / maxAssists) * 100}%` }}
                              />
                            </div>
                            <span className="font-medium text-white w-8 text-right">{app.assists}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModernMatchTabs;
