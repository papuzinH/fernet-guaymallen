'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { GoalIcon, Trophy } from 'lucide-react';

interface ChartData {
  month?: string;
  goals?: number;
  season?: string;
  wins?: number;
  draws?: number;
  losses?: number;
}

interface ModernChartsSectionProps {
  chartsData: { [key: string]: ChartData[] };
  className?: string;
}

export const ModernChartsSection: React.FC<ModernChartsSectionProps> = ({
  chartsData,
  className
}) => {
  return (
    <motion.div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Goals by Month Chart */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="glass-morphism border-2 border-white/20 hover-lift group">
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent, rgba(239, 68, 68, 0.1))",
              boxShadow: "inset 0 0 50px rgba(239, 68, 68, 0.2)"
            }}
          />

          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <GoalIcon className="w-6 h-6 text-red-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Goles por Mes
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartsData['goals-by-month'] || []}>
                  <defs>
                    <linearGradient id="goalsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth={1}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#FFFFFF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#FFFFFF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      color: '#ffffff'
                    }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="goals"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ 
                      fill: '#ef4444', 
                      strokeWidth: 2, 
                      r: 6,
                      stroke: '#ffffff'
                    }}
                    activeDot={{ 
                      r: 8, 
                      stroke: '#ef4444', 
                      strokeWidth: 2,
                      fill: '#ffffff'
                    }}
                    fill="url(#goalsGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/30 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Results by Tournament Chart */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Card className="glass-morphism border-2 border-white/20 hover-lift group">
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent, rgba(139, 92, 246, 0.1))",
              boxShadow: "inset 0 0 50px rgba(139, 92, 246, 0.2)"
            }}
          />

          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Trophy className="w-6 h-6 text-purple-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Resultados por Torneo
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData['results-by-season'] || []}>
                  <defs>
                    <linearGradient id="winsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="drawsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="lossesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth={1}
                  />
                  <XAxis 
                    dataKey="season" 
                    stroke="#FFFFFF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#FFFFFF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      color: '#ffffff'
                    }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar 
                    dataKey="wins" 
                    stackId="a" 
                    fill="url(#winsGradient)" 
                    name="Victorias" 
                    radius={[4, 4, 0, 0]}
                    stroke="#10b981"
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey="draws" 
                    stackId="a" 
                    fill="url(#drawsGradient)" 
                    name="Empates"
                    stroke="#f59e0b"
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey="losses" 
                    stackId="a" 
                    fill="url(#lossesGradient)" 
                    name="Derrotas" 
                    radius={[0, 0, 4, 4]}
                    stroke="#ef4444"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                style={{
                  left: `${70 + i * 10}%`,
                  top: `${20 + i * 25}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ModernChartsSection;
