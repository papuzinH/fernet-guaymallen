'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Upload, 
  Palette, 
  Plus, 
  Trash2, 
  Trophy, 
  Database,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTournaments } from '@/contexts/TournamentContext';
import ModernCreateTournamentModal from '@/components/ui/modern-create-tournament-modal';
import ModernCreatePlayerModal from '@/components/ui/modern-create-player-modal';

interface ModernAdminDashboardProps {
  className?: string;
}

export const ModernAdminDashboard: React.FC<ModernAdminDashboardProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] = useState(false);
  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
  const { tournaments, loading: tournamentsLoading } = useTournaments();

  const handleReset = async () => {
    if (!confirm('Confirmar: esto borrará jugadores, partidos, apariciones y torneos.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      toast.success('Datos reseteados');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo resetear la base');
    } finally {
      setLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'Nuevo Partido',
      description: 'Crear un nuevo partido con estadísticas',
      icon: Calendar,
      href: '/admin/new-match',
      color: '#10b981',
      gradient: 'from-green-500/20 to-green-600/10',
      glowColor: '#10b981'
    },
    {
      title: 'Nuevo Jugador',
      description: 'Agregar un nuevo jugador al equipo',
      icon: Users,
      onClick: () => setIsCreatePlayerModalOpen(true),
      color: '#8b5cf6',
      gradient: 'from-purple-500/20 to-purple-600/10',
      glowColor: '#8b5cf6'
    },
    {
      title: 'Importar Datos',
      description: 'Importar datos desde archivos CSV',
      icon: Upload,
      href: '/admin/import',
      color: '#f59e0b',
      gradient: 'from-yellow-500/20 to-yellow-600/10',
      glowColor: '#f59e0b'
    },
    {
      title: 'Configurar Tema',
      description: 'Personalizar colores y logo del club',
      icon: Palette,
      href: '/admin/theme',
      color: '#3b82f6',
      gradient: 'from-blue-500/20 to-blue-600/10',
      glowColor: '#3b82f6'
    },
    {
      title: 'Crear Torneo',
      description: 'Crear un nuevo torneo o competencia',
      icon: Trophy,
      onClick: () => setIsCreateTournamentModalOpen(true),
      color: '#ef4444',
      gradient: 'from-red-500/20 to-red-600/10',
      glowColor: '#ef4444'
    },
    {
      title: 'Resetear Datos',
      description: 'Eliminar todos los datos del sistema',
      icon: Trash2,
      onClick: handleReset,
      color: '#6b7280',
      gradient: 'from-gray-500/20 to-gray-600/10',
      glowColor: '#6b7280',
      destructive: true
    }
  ];

  return (
    <motion.section
      className={cn("py-20 px-4", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Herramientas de Administración
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Gestiona todos los aspectos de tu club con herramientas profesionales
          </p>
        </motion.div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {adminActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {action.href ? (
                  <Link href={action.href}>
                    <motion.div
                      className={cn(
                        "glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden group cursor-pointer h-full",
                        action.gradient
                      )}
                      style={{
                        boxShadow: `0 20px 40px ${action.color}20`
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Background Glow */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `linear-gradient(135deg, ${action.color}10, transparent)`
                        }}
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      <div className="relative z-10">
                        {/* Icon */}
                        <motion.div
                          className="flex items-center justify-center mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className="p-4 rounded-2xl"
                            style={{ backgroundColor: `${action.color}20` }}
                          >
                            <Icon 
                              className="w-8 h-8 text-white" 
                              style={{ color: action.color }}
                            />
                          </div>
                        </motion.div>

                        {/* Content */}
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {action.title}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {action.description}
                          </p>
                        </div>

                        {/* Action Indicator */}
                        <motion.div
                          className="flex items-center justify-center text-white/70 group-hover:text-white transition-colors"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-sm font-medium mr-2">Acceder</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                              left: `${20 + i * 30}%`,
                              top: `${30 + i * 20}%`,
                            }}
                            animate={{
                              y: [-10, 10, -10],
                              opacity: [0.2, 0.6, 0.2],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2 + i,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.3,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </Link>
                ) : (
                  <motion.div
                    className={cn(
                      "glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden group cursor-pointer h-full",
                      action.gradient
                    )}
                    style={{
                      boxShadow: `0 20px 40px ${action.color}20`
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onClick={action.onClick}
                  >
                    {/* Background Glow */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(135deg, ${action.color}10, transparent)`
                      }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        className="flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div 
                          className="p-4 rounded-2xl"
                          style={{ backgroundColor: `${action.color}20` }}
                        >
                          <Icon 
                            className="w-8 h-8 text-white" 
                            style={{ color: action.color }}
                          />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {action.title}
                        </h3>
                        <p className="text-white/70 text-sm">
                          {action.description}
                        </p>
                      </div>

                      {/* Action Indicator */}
                      <motion.div
                        className="flex items-center justify-center text-white/70 group-hover:text-white transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm font-medium mr-2">
                          {action.destructive ? 'Eliminar' : 'Ejecutar'}
                        </span>
                        {action.destructive ? (
                          <Trash2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        ) : (
                          <Plus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        )}
                      </motion.div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/20 rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tournaments Section */}
        <motion.div
          className="glass-morphism rounded-3xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/20">
              <Trophy className="w-8 h-8 text-red-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Torneos Existentes</h3>
              <p className="text-white/70">Gestiona los torneos y competencias del club</p>
            </div>
          </div>

          {tournamentsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Cargando torneos...</p>
            </div>
          ) : tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  className="glass-morphism rounded-2xl p-4 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{tournament.name}</h4>
                    <Badge className="bg-red-500/30 text-red-200 border-red-400/50">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Database className="w-4 h-4" />
                    <span>
                      Creado: {new Date(tournament.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">No hay torneos creados</h4>
              <p className="text-white/70 mb-6">
                Crea tu primer torneo para comenzar a registrar partidos
              </p>
              <Button
                onClick={() => setIsCreateTournamentModalOpen(true)}
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Torneo
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <ModernCreateTournamentModal
        isOpen={isCreateTournamentModalOpen}
        onClose={() => setIsCreateTournamentModalOpen(false)}
      />

      <ModernCreatePlayerModal
        isOpen={isCreatePlayerModalOpen}
        onClose={() => setIsCreatePlayerModalOpen(false)}
      />
    </motion.section>
  );
};

export default ModernAdminDashboard;
