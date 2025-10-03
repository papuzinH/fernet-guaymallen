'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Trophy, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ModernPlayerTabsProps {
  appearances: Appearance[];
  last10Matches: MatchAppearance[];
  playerName: string;
  className?: string;
}

export const ModernPlayerTabs: React.FC<ModernPlayerTabsProps> = ({
  appearances,
  last10Matches,
  playerName,
  className
}) => {
  const [activeTab, setActiveTab] = React.useState('timeline');

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'bg-green-500';
      case 'DRAW': return 'bg-yellow-500';
      case 'LOSS': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'Rival',
      'Resultado',
      'Marcador',
      'Torneo',
      'Titular',
      'Goles',
      'Asistencias',
      'Amarilla',
      'Roja'
    ];

    const csvData = appearances.map(app => [
      new Date(app.match.date).toLocaleDateString(),
      app.match.opponent,
      app.match.result,
      `${app.match.ourScore}-${app.match.theirScore}`,
      app.match.tournament?.name || '',
      app.isStarter ? 'Sí' : 'No',
      app.goals,
      app.assists,
      app.yellow ? 'Sí' : 'No',
      app.red ? 'Sí' : 'No'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${playerName}_apariciones.csv`;
    link.click();
  };

  const tabs = [
    {
      id: 'timeline',
      label: 'Últimos Partidos',
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      id: 'appearances',
      label: 'Todas las Apariciones',
      icon: Trophy,
      color: '#8b5cf6'
    }
  ];

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Modern Tabs Navigation */}
      <div className="glass-morphism rounded-2xl p-2 border-2 border-white/20">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? tab.color : 'rgba(255,255,255,0.7)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.div>
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-morphism border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  Últimos 10 Partidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {last10Matches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      className="glass-morphism rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={getResultColor(match.result)}>
                            {match.result}
                          </Badge>
                          <div>
                            <div className="font-medium text-white text-lg">
                              vs {match.opponent}
                            </div>
                            <div className="text-sm text-white/60">
                              {new Date(match.date).toLocaleDateString()} •
                              {match.tournament && ` ${match.tournament}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-bold text-white text-xl">
                              {match.ourScore} - {match.theirScore}
                            </div>
                            <div className="text-xs text-white/60">Marcador</div>
                          </div>

                          <div className="flex gap-6 text-center">
                            <div>
                              <div className="font-bold text-green-400 text-xl">{match.goals}</div>
                              <div className="text-xs text-white/60">Goles</div>
                            </div>
                            <div>
                              <div className="font-bold text-purple-400 text-xl">{match.assists}</div>
                              <div className="text-xs text-white/60">Asist</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {match.yellow && (
                              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                                A
                              </Badge>
                            )}
                            {match.red && (
                              <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-400/30">
                                R
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'appearances' && (
          <motion.div
            key="appearances"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-morphism border-2 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-purple-400" />
                  Todas las Apariciones ({appearances.length})
                </CardTitle>
                <Button 
                  onClick={exportToCSV} 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/80">Fecha</TableHead>
                        <TableHead className="text-white/80">Rival</TableHead>
                        <TableHead className="text-white/80">Resultado</TableHead>
                        <TableHead className="text-white/80">Marcador</TableHead>
                        <TableHead className="text-white/80">Torneo</TableHead>
                        <TableHead className="text-white/80">Titular</TableHead>
                        <TableHead className="text-white/80">Goles</TableHead>
                        <TableHead className="text-white/80">Asist</TableHead>
                        <TableHead className="text-white/80">Tarjetas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appearances.map((appearance, index) => (
                        <motion.tr
                          key={appearance.id}
                          className="border-white/10 hover:bg-white/5 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell className="text-white/80">
                            {new Date(appearance.match.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {appearance.match.opponent}
                          </TableCell>
                          <TableCell>
                            <Badge className={getResultColor(appearance.match.result)}>
                              {appearance.match.result}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.match.ourScore} - {appearance.match.theirScore}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.match.tournament?.name || '-'}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {appearance.isStarter ? 'Sí' : 'No'}
                          </TableCell>
                          <TableCell className="font-bold text-green-400">
                            {appearance.goals}
                          </TableCell>
                          <TableCell className="font-bold text-purple-400">
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
                                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-400/30">
                                  R
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModernPlayerTabs;
