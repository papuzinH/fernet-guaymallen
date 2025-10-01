'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { GoalIcon, AssistIcon, YellowCardIcon, FootballIcon } from '@/components/icons/football';

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
    color: 'text-red-400',
    bgColor: 'from-red-500/20 to-red-600/20'
  },
  appearances: {
    title: 'PRESENCIAS',
    label: 'Partidos',
    icon: FootballIcon,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/20'
  },
  assists: {
    title: 'ASISTENCIAS',
    label: 'Pases Gol',
    icon: AssistIcon,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-green-600/20'
  },
  fairplay: {
    title: 'FAIR PLAY',
    label: 'Tarjetas/Partido',
    icon: YellowCardIcon,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-yellow-600/20'
  },
  performance: {
    title: 'RENDIMIENTO',
    label: 'Puntos/Partido',
    icon: Trophy,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-purple-600/20'
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
      const rankingsPromises = rankingTypes.map(type =>
        fetch(`/api/rankings?type=${type}&limit=10`).then(res => res.json())
      );

      const rankingsResults = await Promise.all(rankingsPromises);
      const rankingsData: { [key: string]: RankingPlayer[] } = {};
      rankingTypes.forEach((type, index) => {
        rankingsData[type] = rankingsResults[index];
      });

      // Fetch chart data
      const chartTypes = ['goals-by-month', 'results-by-season'];
      const chartsPromises = chartTypes.map(type =>
        fetch(`/api/charts?type=${type}`).then(res => res.json())
      );

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

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-yellow-500';
      case 'DEF': return 'bg-blue-500';
      case 'MID': return 'bg-green-500';
      case 'FW': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case 'GK': return 'ARQ';
      case 'DEF': return 'DEF';
      case 'MID': return 'MED';
      case 'FW': return 'DEL';
      default: return position;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  const renderRankingTable = (data: RankingPlayer[], type: string) => {
    const config = rankingConfigs[type as keyof typeof rankingConfigs];
    const IconComponent = config.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.bgColor} rounded-2xl p-8 text-center border-2 border-white/20`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <IconComponent className={`w-16 h-16 mx-auto ${config.color}`} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-heading text-white mb-2"
          >
            {config.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white/70 text-lg"
          >
            Ranking por {config.label.toLowerCase()}
          </motion.p>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {data.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  isTop3
                    ? 'border-yellow-400/50 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 shadow-lg'
                    : 'border-white/20 bg-card/80 hover:border-white/30'
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-heading text-2xl font-bold ${
                    rank === 1 ? 'bg-yellow-400 text-black' :
                    rank === 2 ? 'bg-gray-400 text-white' :
                    rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-white/20 text-white'
                  }`}>
                    {rank}
                  </div>
                </div>

                {/* Rank Icon for Top 3 */}
                {isTop3 && (
                  <div className="absolute top-4 right-4 z-10">
                    {getRankIcon(rank)}
                  </div>
                )}

                <div className="p-6 pl-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Player Info */}
                      <div>
                        <h3 className="text-xl font-bold text-white">{player.name}</h3>
                        {player.nickname && (
                          <p className="text-white/70">"{player.nickname}"</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getPositionColor(player.position)}>
                            {getPositionName(player.position)}
                          </Badge>
                          {player.dorsal && (
                            <span className="text-white/60">#{player.dorsal}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-4xl font-heading text-white mb-1">
                        {player.displayValue || player.value}
                      </div>
                      <div className="text-white/60 text-sm">
                        {config.label}
                        {player.average && (
                          <span className="block">({player.average}/partido)</span>
                        )}
                      </div>
                      <div className="flex justify-end mt-2">
                        {getTrendIcon(player.trend)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Top 3 */}
                {isTop3 && (
                  <div className="px-6 pb-4">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(player.value / Math.max(...data.slice(0, 3).map(p => p.value))) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-2 rounded-full ${
                          rank === 1 ? 'bg-yellow-400' :
                          rank === 2 ? 'bg-gray-400' :
                          'bg-amber-600'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
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
    <div className="min-h-screen gradient-blue">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl font-heading text-white mb-4"
        >
          RANKINGS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-white/80 max-w-2xl mx-auto"
        >
          Los mejores jugadores del club en diferentes categorías
        </motion.p>
      </motion.section>

      {/* Rankings Tabs */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-4xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/10 border border-white/20">
              {Object.entries(rankingConfigs).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-heading">{config.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.keys(rankingConfigs).map((type) => (
              <TabsContent key={type} value={type}>
                {renderRankingTable(rankings[type] || [], type)}
              </TabsContent>
            ))}
          </Tabs>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16"
          >
            {/* Goals by Month Chart */}
            <Card className="border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GoalIcon className="w-5 h-5 text-red-400" />
                  Goles por Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartsData['goals-by-month'] || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#FFFFFF" />
                    <YAxis stroke="#FFFFFF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1B4C',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="goals"
                      stroke="#E53935"
                      strokeWidth={3}
                      dot={{ fill: '#E53935', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#E53935', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Results by Season Chart */}
            <Card className="border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Resultados por Temporada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartsData['results-by-season'] || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="season" stroke="#FFFFFF" />
                    <YAxis stroke="#FFFFFF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1B4C',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="wins" stackId="a" fill="#10b981" name="Victorias" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="draws" stackId="a" fill="#f59e0b" name="Empates" />
                    <Bar dataKey="losses" stackId="a" fill="#ef4444" name="Derrotas" radius={[0, 0, 2, 2]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}