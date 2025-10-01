'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCounter, ScoreboardCard } from '@/components/ui/animated-counter';
import { FootballIcon, TrophyIcon, GoalIcon } from '@/components/icons/football';
import { ChevronRight, TrendingUp } from 'lucide-react';

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
  }>;
}

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [theme, setTheme] = useState<Theme>({ primaryColor: '#3b82f6', secondaryColor: '#1e40af' });

  useEffect(() => {
    fetchStats();
    fetchTheme();
  }, []);

  const fetchStats = async () => {
    const response = await fetch('/api/stats');
    const data = await response.json();
    setStats(data);
  };

  const fetchTheme = async () => {
    const response = await fetch('/api/theme');
    const data = await response.json();
    setTheme(data);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'win';
      case 'DRAW': return 'draw';
      case 'LOSS': return 'loss';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen gradient-blue">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10">
            <FootballIcon className="w-32 h-32 text-white" />
          </div>
          <div className="absolute top-40 right-20">
            <TrophyIcon className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-20 left-1/4">
            <GoalIcon className="w-28 h-28 text-white" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Club Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="mb-8"
            >
              <img
                src="/escudo.png"
                alt="Escudo Fernet con Guaymallén"
                className="w-48 h-48 mx-auto rounded-full border-4 border-white/30 shadow-2xl"
              />
            </motion.div>

            {/* Club Name & Slogan */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-6xl md:text-8xl font-heading text-white mb-4 tracking-wider">
                FERNET
              </h1>
              <h2 className="text-3xl md:text-4xl font-heading text-white/90 mb-2">
                con Guaymallén
              </h2>
              <p className="text-xl md:text-2xl text-white/80 font-display italic">
                Pasión por el fútbol, orgullo mendocino
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="xl" variant="football" className="group">
                Ver Rankings
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Últimos Partidos
              </Button>
            </motion.div>
          </div>

          {/* Animated KPIs */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <ScoreboardCard
                title="Partidos"
                value={stats.totalMatches}
                icon={<FootballIcon className="w-8 h-8 text-white" />}
                delay={0.9}
              />
              <ScoreboardCard
                title="Victorias"
                value={stats.wdl.wins}
                icon={<TrophyIcon className="w-8 h-8 text-white" />}
                delay={1.0}
              />
              <ScoreboardCard
                title="Goles"
                value={stats.goalsFor}
                icon={<GoalIcon className="w-8 h-8 text-white" />}
                delay={1.1}
              />
              <ScoreboardCard
                title="Puntos"
                value={stats.wdl.wins * 3 + stats.wdl.draws}
                icon={<TrendingUp className="w-8 h-8 text-white" />}
                delay={1.2}
              />
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Stats Section */}
      {stats && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-heading text-white text-center mb-12"
            >
              Estadísticas del Club
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* WDL Stats */}
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-white/90">Récord</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading text-white mb-4">
                    <AnimatedCounter from={0} to={stats.wdl.wins} />-
                    <AnimatedCounter from={0} to={stats.wdl.draws} />-
                    <AnimatedCounter from={0} to={stats.wdl.losses} />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="win">V</Badge>
                    <Badge variant="draw">E</Badge>
                    <Badge variant="loss">D</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-white/90">Goles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading text-white mb-4">
                    <AnimatedCounter from={0} to={stats.goalsFor} /> - <AnimatedCounter from={0} to={stats.goalsAgainst} />
                  </div>
                  <p className="text-white/70">A favor vs En contra</p>
                </CardContent>
              </Card>

              {/* Top Scorer */}
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-white/90">Goleador</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-heading text-white mb-2">
                    {stats.topScorer || 'N/A'}
                  </div>
                  <GoalIcon className="w-8 h-8 text-white mx-auto" />
                </CardContent>
              </Card>
            </div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-16"
            >
              <h3 className="text-2xl font-heading text-white mb-6">Racha Reciente</h3>
              <div className="flex justify-center gap-3">
                {stats.streak.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center ${
                      result === 'WIN' ? 'bg-green-500' :
                      result === 'DRAW' ? 'bg-gray-500' : 'bg-red-500'
                    }`}
                  >
                    <span className="text-white font-bold text-sm">
                      {result === 'WIN' ? 'V' : result === 'DRAW' ? 'E' : 'D'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Últimos 5 partidos */}
      {stats && stats.last5Matches.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 px-4 bg-black/20"
        >
          <div className="container mx-auto max-w-4xl">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-heading text-white text-center mb-12"
            >
              Últimos Partidos
            </motion.h2>

            <div className="space-y-4">
              {stats.last5Matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:scale-105 transition-transform duration-300">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <Badge variant={getResultColor(match.result)}>
                          {match.result}
                        </Badge>
                        <div>
                          <span className="font-semibold text-white text-lg">
                            vs {match.opponent}
                          </span>
                          {match.tournament && (
                            <Badge variant="outline" className="ml-2 border-white/30 text-white/80">
                              {match.tournament.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-3xl font-heading text-white">
                        {match.ourScore} - {match.theirScore}
                      </div>
                      <div className="text-white/70">
                        {new Date(match.date).toLocaleDateString('es-ES')}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
