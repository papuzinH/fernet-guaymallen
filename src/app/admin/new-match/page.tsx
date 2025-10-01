'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ButtonWithLoader from '@/components/ui/ButtonWithLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from 'sonner';

// Step 1: Match Data Schema
const matchDataSchema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
  opponent: z.string().min(1, 'Rival requerido'),
  // tournament can be a name (string) or omitted when using tournamentId
  tournament: z.string().optional(),
  tournamentId: z.number().optional(),
  season: z.string().min(1, 'Temporada requerida'),
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
  isStarter: boolean;
  minutes: number | null;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
  motm: boolean;
}

const steps = [
  { id: 1, title: 'Datos del Partido', description: 'Información básica del encuentro' },
  { id: 2, title: 'Selección de Jugadores', description: 'Elige qué jugadores participaron' },
  { id: 3, title: 'Estadísticas', description: 'Registra el rendimiento individual' },
];

export default function NewMatchPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [matchData, setMatchData] = useState<(MatchData & { result: string }) | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [availableTournaments, setAvailableTournaments] = useState<Array<{ id: number; name: string; season: string }>>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(false);

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
      setCurrentStep(2);
      fetchPlayers();
      fetchTournaments();
    } else if (currentStep === 2) {
      if (selectedPlayerIds.length === 0) {
        toast.error('Debes seleccionar al menos un jugador');
        return;
      }
      initializePlayerStats();
      setCurrentStep(3);
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
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Error al cargar jugadores');
    }
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setAvailableTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments', error);
      toast.error('Error al cargar torneos');
    }
  };

  // Load tournaments on mount so they are available if user navigates directly
  useEffect(() => {
    fetchTournaments();
  }, []);

  const initializePlayerStats = () => {
    const stats = selectedPlayerIds.map(playerId => {
      const player = availablePlayers.find(p => p.id === playerId)!;
      return {
        playerId,
        player,
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellow: false,
        red: false,
        motm: false,
      };
    });
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
      // Build payload: prefer explicit tournamentId (numeric) when select returns an id
      const formValues = matchForm.getValues();
      const payloadMatchData: any = { ...matchData };
      // If tournament select is numeric id string, send tournamentId
      if (formValues.tournament && Number.isInteger(Number(formValues.tournament))) {
        payloadMatchData.tournamentId = Number(formValues.tournament);
      } else if (formValues.tournament) {
        payloadMatchData.tournament = formValues.tournament;
      }

      const response = await fetch('/api/matches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchData: payloadMatchData, playerStats }),
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

  const totalGoals = playerStats.reduce((sum, stat) => sum + stat.goals, 0);
  const goalsMatch = matchData ? totalGoals === matchData.ourScore : true;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear Nuevo Partido</h1>
        <div className="flex items-center space-x-4 mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </div>
              {step.id < steps.length && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Paso {currentStep} de {steps.length}: {steps[currentStep - 1].title}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="mt-2" />
      </div>

      {/* Step 1: Match Data */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Datos del Partido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  {...matchForm.register('date')}
                />
                {matchForm.formState.errors.date && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="opponent">Rival</Label>
                <Input
                  id="opponent"
                  placeholder="Nombre del equipo rival"
                  {...matchForm.register('opponent')}
                />
                {matchForm.formState.errors.opponent && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.opponent.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tournament">Torneo</Label>
                <div className="flex items-center gap-2">
                  <select id="tournament" className="w-full px-3 py-2 border rounded" {...matchForm.register('tournament')}>
                  <option value="">-- Seleccionar torneo --</option>
                  {availableTournaments.map(t => (
                    <option key={t.id} value={`${t.id}`}>
                      {t.name} ({t.season})
                    </option>
                  ))}
                  </select>
                  <button type="button" className="px-3 py-2 border rounded text-sm" onClick={fetchTournaments} title="Refrescar torneos">⟳</button>
                </div>
                {matchForm.formState.errors.tournament && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.tournament.message}</p>
                )}
                <div className="mt-2 text-sm text-gray-600">Si el torneo no existe, crea uno desde el panel Admin.</div>
              </div>

              <div>
                <Label htmlFor="season">Temporada</Label>
                <Input
                  id="season"
                  placeholder="Ej: 2024"
                  {...matchForm.register('season')}
                />
                {matchForm.formState.errors.season && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.season.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ourScore">Nuestros Goles</Label>
                <Input
                  id="ourScore"
                  type="number"
                  min="0"
                  {...matchForm.register('ourScore', { valueAsNumber: true })}
                />
                {matchForm.formState.errors.ourScore && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.ourScore.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="theirScore">Goles del Rival</Label>
                <Input
                  id="theirScore"
                  type="number"
                  min="0"
                  {...matchForm.register('theirScore', { valueAsNumber: true })}
                />
                {matchForm.formState.errors.theirScore && (
                  <p className="text-sm text-red-500 mt-1">{matchForm.formState.errors.theirScore.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ubicación (opcional)</Label>
                <Input
                  id="location"
                  placeholder="Estadio o cancha"
                  {...matchForm.register('location')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Observaciones del partido"
                {...matchForm.register('notes')}
              />
            </div>

            {matchData && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Resultado calculado: {
                  calculateResult(matchData.ourScore, matchData.theirScore) === 'WIN' ? 'Victoria' :
                  calculateResult(matchData.ourScore, matchData.theirScore) === 'DRAW' ? 'Empate' : 'Derrota'
                }</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Player Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Selección de Jugadores</CardTitle>
            <p className="text-sm text-gray-600">Selecciona qué jugadores participaron en el partido</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlayers.map((player) => (
                <div key={player.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`player-${player.id}`}
                    checked={selectedPlayerIds.includes(player.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlayerIds(prev => [...prev, player.id]);
                      } else {
                        setSelectedPlayerIds(prev => prev.filter(id => id !== player.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{player.fullName}</div>
                    {player.nickname && (
                      <div className="text-sm text-gray-500">"{player.nickname}"</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getPositionColor(player.position)}>
                        {getPositionName(player.position)}
                      </Badge>
                      {player.dorsal && (
                        <Badge variant="outline">#{player.dorsal}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {availablePlayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay jugadores activos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Player Stats */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Individuales</CardTitle>
            <p className="text-sm text-gray-600">
              Registra el rendimiento de cada jugador
              {!goalsMatch && (
                <span className="text-red-500 ml-2">
                  ⚠️ Los goles de los jugadores ({totalGoals}) no coinciden con el marcador ({matchData?.ourScore})
                </span>
              )}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {playerStats.map((stat) => (
                <div key={stat.playerId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{stat.player.fullName}</div>
                      <div className="text-sm text-gray-500">#{stat.player.dorsal} - {getPositionName(stat.player.position)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`starter-${stat.playerId}`}
                        checked={stat.isStarter}
                        onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'isStarter', checked)}
                      />
                      <Label htmlFor={`starter-${stat.playerId}`} className="text-sm">Titular</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <Label className="text-xs">Minutos</Label>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        value={stat.minutes || ''}
                        onChange={(e) => updatePlayerStat(stat.playerId, 'minutes', parseInt(e.target.value) || null)}
                        className="h-8"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Goles</Label>
                      <Input
                        type="number"
                        min="0"
                        value={stat.goals}
                        onChange={(e) => updatePlayerStat(stat.playerId, 'goals', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Asistencias</Label>
                      <Input
                        type="number"
                        min="0"
                        value={stat.assists}
                        onChange={(e) => updatePlayerStat(stat.playerId, 'assists', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`yellow-${stat.playerId}`}
                        checked={stat.yellow}
                        onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'yellow', checked)}
                      />
                      <Label htmlFor={`yellow-${stat.playerId}`} className="text-xs">Amarilla</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`red-${stat.playerId}`}
                        checked={stat.red}
                        onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'red', checked)}
                      />
                      <Label htmlFor={`red-${stat.playerId}`} className="text-xs">Roja</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`motm-${stat.playerId}`}
                        checked={stat.motm}
                        onCheckedChange={(checked) => updatePlayerStat(stat.playerId, 'motm', checked)}
                      />
                      <Label htmlFor={`motm-${stat.playerId}`} className="text-xs">MOTM</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <ButtonWithLoader
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </ButtonWithLoader>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <ButtonWithLoader onClick={nextStep}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </ButtonWithLoader>
          ) : (
            <ButtonWithLoader
              onClick={handleSubmit}
              loading={loading}
              loadingText="Guardando..."
              disabled={!goalsMatch}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Crear Partido
            </ButtonWithLoader>
          )}
        </div>
      </div>
    </div>
  );
}