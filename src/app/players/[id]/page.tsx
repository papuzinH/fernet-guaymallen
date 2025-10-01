'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  dorsal: number | null;
  position: string;
  photoUrl: string | null;
  isActive: boolean;
  joinedAt: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    motm: number;
    starters: number;
    substitutes: number;
    goalsPerMatch: string;
    assistsPerMatch: string;
    minutesPlayed: number;
    averageMinutes: number;
  };
  appearances: Appearance[];
  last10Matches: MatchAppearance[];
}

interface Appearance {
  id: number;
  matchId: number;
  isStarter: boolean;
  minutes: number | null;
  goals: number;
  assists: number | null;
  yellow: boolean;
  red: boolean;
  motm: boolean;
  match: {
    id: number;
    date: string;
    opponent: string;
    result: string;
    ourScore: number;
    theirScore: number;
    tournament?: {
      name: string;
      season: string;
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
  season: string | null;
  isStarter: boolean;
  minutes: number | null;
  goals: number;
  assists: number | null;
  yellow: boolean;
  red: boolean;
  motm: boolean;
}

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params.id as string;
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  const fetchPlayer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/players/${playerId}`);
      const data = await response.json();
      setPlayer(data);
    } catch (error) {
      console.error('Error fetching player:', error);
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
      case 'GK': return 'Arquero';
      case 'DEF': return 'Defensor';
      case 'MID': return 'Mediocampista';
      case 'FW': return 'Delantero';
      default: return position;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'bg-green-500';
      case 'DRAW': return 'bg-yellow-500';
      case 'LOSS': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToCSV = () => {
    if (!player) return;

    const headers = [
      'Fecha',
      'Rival',
      'Resultado',
      'Marcador',
      'Torneo',
      'Temporada',
      'Titular',
      'Minutos',
      'Goles',
      'Asistencias',
      'Amarilla',
      'Roja',
      'MOTM'
    ];

    const csvData = player.appearances.map(app => [
      new Date(app.match.date).toLocaleDateString(),
      app.match.opponent,
      app.match.result,
      `${app.match.ourScore}-${app.match.theirScore}`,
      app.match.tournament?.name || '',
      app.match.tournament?.season || '',
      app.isStarter ? 'Sí' : 'No',
      app.minutes || '',
      app.goals,
      app.assists || '',
      app.yellow ? 'Sí' : 'No',
      app.red ? 'Sí' : 'No',
      app.motm ? 'Sí' : 'No'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${player.fullName}_apariciones.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8"><Loader size="large" text="Cargando jugador..." /></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Jugador no encontrado</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfil del Jugador</h1>
        <Button asChild variant="outline">
          <Link href="/players">← Volver a Jugadores</Link>
        </Button>
      </div>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Photo */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {player.photoUrl ? (
                <Image
                  src={player.photoUrl}
                  alt={player.fullName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{player.fullName}</h2>
              {player.nickname && (
                <p className="text-xl text-gray-600 mb-4">"{player.nickname}"</p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge className={getPositionColor(player.position)}>
                  {getPositionName(player.position)}
                </Badge>
                {player.dorsal && (
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    #{player.dorsal}
                  </Badge>
                )}
                <Badge variant={player.isActive ? "default" : "secondary"}>
                  {player.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <p className="text-gray-600">
                Se unió en {new Date(player.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{player.stats.appearances}</div>
            <div className="text-sm text-gray-500">Partidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">{player.stats.goals}</div>
            <div className="text-sm text-gray-500">Goles</div>
            <div className="text-xs text-gray-400">{player.stats.goalsPerMatch}/partido</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{player.stats.assists}</div>
            <div className="text-sm text-gray-500">Asistencias</div>
            <div className="text-xs text-gray-400">{player.stats.assistsPerMatch}/partido</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{player.stats.yellowCards}</div>
            <div className="text-sm text-gray-500">Amarillas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-600">{player.stats.redCards}</div>
            <div className="text-sm text-gray-500">Rojas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{player.stats.motm}</div>
            <div className="text-sm text-gray-500">MOTM</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Últimos Partidos</TabsTrigger>
          <TabsTrigger value="appearances">Todas las Apariciones</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Últimos 10 Partidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {player.last10Matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={getResultColor(match.result)}>
                        {match.result}
                      </Badge>
                      <div>
                        <div className="font-medium">
                          vs {match.opponent}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(match.date).toLocaleDateString()} •
                          {match.tournament && ` ${match.tournament} ${match.season}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-bold">{match.ourScore} - {match.theirScore}</div>
                        <div className="text-xs text-gray-500">Marcador</div>
                      </div>

                      <div className="flex gap-4 text-center">
                        <div>
                          <div className="font-bold text-green-600">{match.goals}</div>
                          <div className="text-xs text-gray-500">Goles</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">{match.assists || 0}</div>
                          <div className="text-xs text-gray-500">Asist</div>
                        </div>
                        <div>
                          <div className="font-bold">{match.minutes || 0}'</div>
                          <div className="text-xs text-gray-500">Min</div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {match.yellow && <Badge variant="outline" className="bg-yellow-100">A</Badge>}
                        {match.red && <Badge variant="destructive">R</Badge>}
                        {match.motm && <Badge className="bg-orange-500">MOTM</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearances">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Todas las Apariciones ({player.appearances.length})</CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Rival</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Marcador</TableHead>
                    <TableHead>Torneo</TableHead>
                    <TableHead>Titular</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Goles</TableHead>
                    <TableHead>Asist</TableHead>
                    <TableHead>Tarjetas</TableHead>
                    <TableHead>MOTM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {player.appearances.map((appearance) => (
                    <TableRow key={appearance.id}>
                      <TableCell>{new Date(appearance.match.date).toLocaleDateString()}</TableCell>
                      <TableCell>{appearance.match.opponent}</TableCell>
                      <TableCell>
                        <Badge className={getResultColor(appearance.match.result)}>
                          {appearance.match.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{appearance.match.ourScore} - {appearance.match.theirScore}</TableCell>
                      <TableCell>
                        {appearance.match.tournament ?
                          `${appearance.match.tournament.name} ${appearance.match.tournament.season}` :
                          '-'
                        }
                      </TableCell>
                      <TableCell>{appearance.isStarter ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{appearance.minutes || '-'}</TableCell>
                      <TableCell className="font-bold text-green-600">{appearance.goals}</TableCell>
                      <TableCell className="font-bold text-purple-600">{appearance.assists || 0}</TableCell>
                      <TableCell>
                        {appearance.yellow && <Badge variant="outline" className="mr-1 bg-yellow-100">A</Badge>}
                        {appearance.red && <Badge variant="destructive">R</Badge>}
                      </TableCell>
                      <TableCell>{appearance.motm ? '⭐' : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}