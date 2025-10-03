'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Calendar, 
  Users, 
  Trophy,
  Target,
  MapPin,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTournaments } from '@/contexts/TournamentContext';
import { useMatchData } from '@/contexts/MatchDataContext';
import { AutocompleteInput } from '@/components/ui/autocomplete-input';

// Step 1: Match Data Schema
const matchDataSchema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
  opponent: z.string().min(1, 'Rival requerido'),
  tournamentId: z.number().min(1, 'Torneo requerido'),
  ourScore: z.number().min(0, 'Goles nuestros requeridos'),
  theirScore: z.number().min(0, 'Goles del rival requeridos'),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type MatchData = z.infer<typeof matchDataSchema>;

// Step 2: Player Selection
interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  position: string;
  dorsal: number | null;
  isActive: boolean;
}

// Step 3: Player Stats
interface PlayerStats {
  playerId: number;
  player: Player;
  played: boolean;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
}

const steps = [
  { 
    id: 1, 
    title: 'Datos del Partido', 
    description: 'Información básica del encuentro', 
    icon: Calendar,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/10'
  },
  { 
    id: 2, 
    title: 'Estadísticas de Jugadores', 
    description: 'Registra el rendimiento individual', 
    icon: Users,
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-purple-600/10'
  },
];

interface ModernAdminNewMatchProps {
  className?: string;
}

export const ModernAdminNewMatch: React.FC<ModernAdminNewMatchProps> = ({ className }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [matchData, setMatchData] = useState<(MatchData & { result: string }) | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { tournaments, loading: tournamentsLoading } = useTournaments();
  const { 
    getOpponentSuggestions, 
    getLocationSuggestions, 
    addOpponent, 
    addLocation 
  } = useMatchData();

  // Step 1 Form
  const matchForm = useForm<MatchData>({
    resolver: zodResolver(matchDataSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      ourScore: 0,
      theirScore: 0,
    },
  });

  const calculateResult = (ourScore: number, theirScore: number) => {
    if (ourScore > theirScore) return 'WIN';
    if (ourScore < theirScore) return 'LOSS';
    return 'DRAW';
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await matchForm.trigger();
      if (!isValid) return;

      const data = matchForm.getValues();
      setMatchData({
        ...data,
        result: calculateResult(data.ourScore, data.theirScore),
      });
      
      addOpponent(data.opponent);
      if (data.location) {
        addLocation(data.location);
      }
      
      setCurrentStep(2);
      fetchPlayers();
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players?activeOnly=true');
      const players = await response.json();
      setAvailablePlayers(players);
      initializePlayerStats(players);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Error al cargar jugadores');
    }
  };

  const initializePlayerStats = (players: Player[]) => {
    const stats = players.map(player => ({
      playerId: player.id,
      player,
      played: false,
      goals: 0,
      assists: 0,
      yellow: false,
      red: false,
    }));
    setPlayerStats(stats);
  };

  const updatePlayerStat = (playerId: number, field: keyof PlayerStats, value: any) => {
    setPlayerStats(prev =>
      prev.map(stat =>
        stat.playerId === playerId ? { ...stat, [field]: value } : stat
      )
    );
  };

  const handleSubmit = async () => {
    if (!matchData) return;

    setLoading(true);
    try {
      const participatingPlayers = playerStats.filter(stat => stat.played);

      if (participatingPlayers.length === 0) {
        toast.error('Debes seleccionar al menos un jugador que haya participado');
        return;
      }

      const response = await fetch('/api/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          matchData, 
          playerStats: participatingPlayers 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success('Partido creado exitosamente');
      router.push(`/matches/${result.matchId}`);
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el partido');
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GK': return 'bg-yellow-500';
      case 'DEF_CENTRAL':
      case 'DEF_LATERAL': return 'bg-blue-500';
      case 'MID_CENTRAL':
      case 'VOLANTE':
      case 'MID_OFENSIVO': return 'bg-green-500';
      case 'DELANTERO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case 'GK': return 'ARQ';
      case 'DEF_CENTRAL': return 'DEF C';
      case 'DEF_LATERAL': return 'DEF L';
      case 'MID_CENTRAL': return 'MED C';
      case 'VOLANTE': return 'VOL';
      case 'MID_OFENSIVO': return 'MED OF';
      case 'DELANTERO': return 'DEL';
      default: return position;
    }
  };

  const totalGoals = playerStats.filter(stat => stat.played).reduce((sum, stat) => sum + stat.goals, 0);
  const goalsMatch = matchData ? totalGoals === matchData.ourScore : true;
  const participatingPlayers = playerStats.filter(stat => stat.played);

  return (
    <motion.section
      className={cn("py-20 px-4", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Crear Nuevo Partido
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Registra un nuevo partido con estadísticas detalladas de jugadores
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="glass-morphism rounded-3xl p-8 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-8 mb-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id <= currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <motion.div
                  key={step.id}
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + step.id * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={cn(
                      "relative w-16 h-16 rounded-full flex items-center justify-center text-sm font-medium border-4 transition-all duration-300",
                      isActive 
                        ? "border-white/40 shadow-2xl" 
                        : "border-white/20"
                    )}
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${step.color}40, ${step.color}20)`
                        : "rgba(255, 255, 255, 0.1)"
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon 
                      className="w-8 h-8 text-white" 
                      style={{ 
                        color: isActive ? step.color : "rgba(255, 255, 255, 0.5)"
                      }}
                    />
                    
                    {/* Glow Effect for Current Step */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full blur-lg opacity-50"
                        style={{ backgroundColor: step.color }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                  
                  {step.id < steps.length && (
                    <motion.div
                      className={cn(
                        "w-16 h-1 mx-4 rounded-full transition-all duration-300",
                        step.id < currentStep 
                          ? "bg-gradient-to-r from-white/60 to-white/40" 
                          : "bg-white/20"
                      )}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 + step.id * 0.1 }}
                      viewport={{ once: true }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">
              Paso {currentStep} de {steps.length}: {steps[currentStep - 1].title}
            </div>
            <p className="text-white/70 mb-4">
              {steps[currentStep - 1].description}
            </p>
            <Progress 
              value={(currentStep / steps.length) * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </motion.div>

        {/* Step 1: Match Data */}
        {currentStep === 1 && (
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-blue-500/20">
                <Calendar className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Datos del Partido</h2>
                <p className="text-white/70">Información básica del encuentro</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <Label htmlFor="date" className="text-white/80 mb-2 block">
                  Fecha del Partido
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...matchForm.register('date')}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
                {matchForm.formState.errors.date && (
                  <p className="text-sm text-red-400 mt-1">{matchForm.formState.errors.date.message}</p>
                )}
              </div>

              {/* Opponent */}
              <AutocompleteInput
                id="opponent"
                label="Rival"
                placeholder="Nombre del equipo rival"
                value={matchForm.watch('opponent') || ''}
                onChange={(value) => matchForm.setValue('opponent', value)}
                suggestions={getOpponentSuggestions(matchForm.watch('opponent') || '')}
                onAddNew={addOpponent}
                required
                error={matchForm.formState.errors.opponent?.message}
              />

              {/* Tournament */}
              <div>
                <Label htmlFor="tournamentId" className="text-white/80 mb-2 block">
                  Torneo
                </Label>
                <Select
                  value={matchForm.watch('tournamentId')?.toString() || ''}
                  onValueChange={(value) => matchForm.setValue('tournamentId', parseInt(value))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-white/40">
                    <SelectValue placeholder="Seleccionar torneo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournamentsLoading ? (
                      <SelectItem value="loading" disabled>Cargando torneos...</SelectItem>
                    ) : tournaments.length > 0 ? (
                      tournaments.map(tournament => (
                        <SelectItem key={tournament.id} value={tournament.id.toString()}>
                          {tournament.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-tournaments" disabled>No hay torneos disponibles</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {matchForm.formState.errors.tournamentId && (
                  <p className="text-sm text-red-400 mt-1">{matchForm.formState.errors.tournamentId.message}</p>
                )}
                <div className="mt-2 text-sm text-white/60">
                  Si el torneo no existe, crea uno desde el panel Admin.
                </div>
              </div>

              {/* Our Score */}
              <div>
                <Label htmlFor="ourScore" className="text-white/80 mb-2 block">
                  Nuestros Goles
                </Label>
                <Input
                  id="ourScore"
                  type="number"
                  min="0"
                  {...matchForm.register('ourScore', { valueAsNumber: true })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
                {matchForm.formState.errors.ourScore && (
                  <p className="text-sm text-red-400 mt-1">{matchForm.formState.errors.ourScore.message}</p>
                )}
              </div>

              {/* Their Score */}
              <div>
                <Label htmlFor="theirScore" className="text-white/80 mb-2 block">
                  Goles del Rival
                </Label>
                <Input
                  id="theirScore"
                  type="number"
                  min="0"
                  {...matchForm.register('theirScore', { valueAsNumber: true })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
                {matchForm.formState.errors.theirScore && (
                  <p className="text-sm text-red-400 mt-1">{matchForm.formState.errors.theirScore.message}</p>
                )}
              </div>

              {/* Location */}
              <AutocompleteInput
                id="location"
                label="Ubicación (opcional)"
                placeholder="Estadio o cancha"
                value={matchForm.watch('location') || ''}
                onChange={(value) => matchForm.setValue('location', value)}
                suggestions={getLocationSuggestions(matchForm.watch('location') || '')}
                onAddNew={addLocation}
                error={matchForm.formState.errors.location?.message}
              />
            </div>

            {/* Notes */}
            <div className="mt-6">
              <Label htmlFor="notes" className="text-white/80 mb-2 block">
                Notas (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Observaciones del partido"
                {...matchForm.register('notes')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              />
            </div>

            {/* Result Preview */}
            {matchData && (
              <motion.div
                className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-white/70" />
                  <p className="font-medium text-white">
                    Resultado calculado: {
                      calculateResult(matchData.ourScore, matchData.theirScore) === 'WIN' ? 'Victoria' :
                      calculateResult(matchData.ourScore, matchData.theirScore) === 'DRAW' ? 'Empate' : 'Derrota'
                    }
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 2: Player Stats */}
        {currentStep === 2 && (
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-500/20">
                <Users className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Estadísticas de Jugadores</h2>
                <p className="text-white/70">
                  Marca los jugadores que participaron y registra sus estadísticas
                  {!goalsMatch && (
                    <span className="text-red-400 ml-2">
                      ⚠️ Los goles de los jugadores ({totalGoals}) no coinciden con el marcador ({matchData?.ourScore})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-4 text-sm font-medium text-white">Jugador</th>
                    <th className="text-center p-4 text-sm font-medium text-white">Jugó</th>
                    <th className="text-center p-4 text-sm font-medium text-white">Goles</th>
                    <th className="text-center p-4 text-sm font-medium text-white">Asistencias</th>
                    <th className="text-center p-4 text-sm font-medium text-white">Amarilla</th>
                    <th className="text-center p-4 text-sm font-medium text-white">Roja</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.map((stat, index) => (
                    <motion.tr
                      key={stat.playerId}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{stat.player.fullName}</div>
                          {stat.player.nickname && (
                            <div className="text-xs text-white/60">"{stat.player.nickname}"</div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getPositionColor(stat.player.position)}>
                              {getPositionName(stat.player.position)}
                            </Badge>
                            {stat.player.dorsal && (
                              <Badge variant="outline" className="border-white/30 text-white/80">
                                #{stat.player.dorsal}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Checkbox
                          checked={stat.played}
                          onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'played', checked)}
                          className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          min="0"
                          value={stat.goals}
                          onChange={(e) => updatePlayerStat(stat.playerId, 'goals', parseInt(e.target.value) || 0)}
                          className="w-16 h-8 bg-white/10 border-white/20 text-white text-center"
                          disabled={!stat.played}
                        />
                      </td>
                      <td className="p-4 text-center">
                        <Input
                          type="number"
                          min="0"
                          value={stat.assists}
                          onChange={(e) => updatePlayerStat(stat.playerId, 'assists', parseInt(e.target.value) || 0)}
                          className="w-16 h-8 bg-white/10 border-white/20 text-white text-center"
                          disabled={!stat.played}
                        />
                      </td>
                      <td className="p-4 text-center">
                        <Checkbox
                          checked={stat.yellow}
                          onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'yellow', checked)}
                          className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white"
                          disabled={!stat.played}
                        />
                      </td>
                      <td className="p-4 text-center">
                        <Checkbox
                          checked={stat.red}
                          onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'red', checked)}
                          className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                          disabled={!stat.played}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm text-white/70">
                Jugadores que participaron: {playerStats.filter(s => s.played).length} de {playerStats.length}
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="flex justify-between mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          </motion.div>

          <div className="flex gap-4">
            {currentStep < steps.length ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !goalsMatch || participatingPlayers.length === 0}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Crear Partido
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernAdminNewMatch;
