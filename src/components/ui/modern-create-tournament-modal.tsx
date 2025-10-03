'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTournaments } from '@/contexts/TournamentContext';
import { toast } from 'sonner';
import { 
  X, 
  Trophy, 
  Sparkles,
  CheckCircle,
  Calendar,
  Target,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernCreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOURNAMENT_PRESETS = [
  {
    name: 'Liga Local',
    description: 'Competencia regular de temporada',
    icon: '🏆',
    color: '#ef4444',
    gradient: 'from-red-500/20 to-red-600/10'
  },
  {
    name: 'Copa Regional',
    description: 'Torneo eliminatorio regional',
    icon: '🥇',
    color: '#f59e0b',
    gradient: 'from-yellow-500/20 to-yellow-600/10'
  },
  {
    name: 'Copa Nacional',
    description: 'Competencia nacional importante',
    icon: '👑',
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-purple-600/10'
  },
  {
    name: 'Amistoso',
    description: 'Partido de preparación',
    icon: '🤝',
    color: '#10b981',
    gradient: 'from-green-500/20 to-green-600/10'
  },
  {
    name: 'Torneo Internacional',
    description: 'Competencia internacional',
    icon: '🌍',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/10'
  },
  {
    name: 'Torneo Juvenil',
    description: 'Competencia para categorías menores',
    icon: '⚽',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-cyan-600/10'
  }
];

export const ModernCreateTournamentModal: React.FC<ModernCreateTournamentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tournamentName, setTournamentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const { createTournament } = useTournaments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tournamentName.trim()) {
      toast.error('El nombre del torneo es requerido');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newTournament = await createTournament(tournamentName.trim());
      
      if (newTournament) {
        toast.success(`Torneo "${newTournament.name}" creado exitosamente`);
        setTournamentName('');
        setSelectedPreset(null);
        onClose();
      } else {
        toast.error('No se pudo crear el torneo');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error('Error al crear el torneo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTournamentName('');
      setSelectedPreset(null);
      onClose();
    }
  };

  const applyPreset = (preset: typeof TOURNAMENT_PRESETS[0]) => {
    setTournamentName(preset.name);
    setSelectedPreset(preset.name);
  };

  const getCurrentPreset = () => {
    return TOURNAMENT_PRESETS.find(preset => preset.name === selectedPreset);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-morphism rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-8 border-b border-white/10">
                {/* Background Glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: getCurrentPreset() 
                      ? `linear-gradient(135deg, ${getCurrentPreset()!.color}20, transparent)`
                      : "linear-gradient(135deg, rgba(245, 158, 11, 0.2), transparent)"
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

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-4 rounded-2xl"
                      style={{ 
                        backgroundColor: getCurrentPreset() 
                          ? `${getCurrentPreset()!.color}20`
                          : "rgba(245, 158, 11, 0.2)"
                      }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Trophy className="w-8 h-8 text-white" style={{ 
                        color: getCurrentPreset()?.color || "#f59e0b"
                      }} />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Crear Nuevo Torneo
                      </h2>
                      <p className="text-white/70">
                        Configura una nueva competencia para el club
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Tournament Presets */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-white flex items-center gap-3">
                      <Star className="w-5 h-5" />
                      Plantillas de Torneo
                    </Label>
                    <p className="text-white/70 text-sm">
                      Selecciona una plantilla para comenzar rápidamente
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {TOURNAMENT_PRESETS.map((preset, index) => (
                        <motion.button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          disabled={isSubmitting}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                            selectedPreset === preset.name
                              ? "border-white/40 shadow-2xl"
                              : "border-white/20 hover:border-white/30"
                          )}
                          style={{
                            background: selectedPreset === preset.name
                              ? `linear-gradient(135deg, ${preset.color}40, ${preset.color}20)`
                              : "rgba(255, 255, 255, 0.05)"
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{preset.icon}</span>
                            <div>
                              <div className="text-white font-semibold text-sm">
                                {preset.name}
                              </div>
                            </div>
                          </div>
                          <p className="text-white/70 text-xs">
                            {preset.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Tournament Name Input */}
                  <div className="space-y-4">
                    <Label htmlFor="tournamentName" className="text-lg font-semibold text-white flex items-center gap-3">
                      <Target className="w-5 h-5" />
                      Nombre del Torneo
                    </Label>
                    <div className="relative">
                      <Input
                        id="tournamentName"
                        type="text"
                        value={tournamentName}
                        onChange={(e) => setTournamentName(e.target.value)}
                        placeholder="Ej: Copa Libertadores 2024"
                        disabled={isSubmitting}
                        autoFocus
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 text-lg py-4 pl-4 pr-12"
                      />
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Trophy className="w-6 h-6 text-white/50" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Preview */}
                  {tournamentName && (
                    <motion.div
                      className="p-6 bg-white/5 rounded-2xl border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Vista Previa del Torneo
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${getCurrentPreset()?.color || '#f59e0b'}20` }}
                          >
                            <span className="text-2xl">
                              {getCurrentPreset()?.icon || '🏆'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold text-lg">
                              {tournamentName}
                            </div>
                            <div className="text-white/70 text-sm">
                              {getCurrentPreset()?.description || 'Torneo personalizado'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/70" />
                            <span className="text-white/70 text-sm">
                              Creado: {new Date().toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-white/70" />
                            <span className="text-white/70 text-sm">
                              Estado: Activo
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Features */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {[
                      { icon: Calendar, title: 'Gestión de Partidos', description: 'Organiza fechas y rivales' },
                      { icon: Target, title: 'Estadísticas', description: 'Seguimiento de rendimiento' },
                      { icon: Trophy, title: 'Clasificaciones', description: 'Rankings automáticos' }
                    ].map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.title}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <Icon className="w-4 h-4 text-white/70" />
                            </div>
                            <h4 className="text-white font-medium text-sm">
                              {feature.title}
                            </h4>
                          </div>
                          <p className="text-white/60 text-xs">
                            {feature.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/10 bg-white/5">
                <div className="flex justify-end gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Cancelar
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !tournamentName.trim()}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Crear Torneo
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernCreateTournamentModal;
