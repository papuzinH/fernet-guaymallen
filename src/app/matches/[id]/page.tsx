'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Match {
  id: number;
  date: string;
  opponent: string;
  ourScore: number;
  theirScore: number;
  result: string;
  tournament?: {
    name: string;
    season: string;
  };
  appearances: Appearance[];
  stats: MatchStats;
}

interface Appearance {
  id: number;
  player: {
    id: number;
    name: string;
    position: string;
  };
  goals: number;
  assists: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  rating?: number;
}

interface MatchStats {
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  averageRating: number;
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/matches/${matchId}`);
      const data = await response.json();
      setMatch(data);
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <Loader size="large" text="Cargando partido..." />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Partido no encontrado</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalle del Partido</h1>
        <Button asChild variant="outline">
          <Link href="/matches">← Volver a Partidos</Link>
        </Button>
      </div>

      {/* Match Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{match.opponent}</span>
            <Badge className={getResultColor(match.result)}>
              {match.result}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">{new Date(match.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Torneo</p>
              <p className="font-medium">
                {match.tournament ? `${match.tournament.name} ${match.tournament.season}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Marcador</p>
              <p className="font-medium text-lg">{match.ourScore} - {match.theirScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="lineup">Alineación</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Partido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Estadísticas Generales</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Goles totales:</span>
                      <span className="font-medium">{match.stats.totalGoals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asistencias:</span>
                      <span className="font-medium">{match.stats.totalAssists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarjetas amarillas:</span>
                      <span className="font-medium">{match.stats.totalYellowCards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarjetas rojas:</span>
                      <span className="font-medium">{match.stats.totalRedCards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calificación promedio:</span>
                      <span className="font-medium">{match.stats.averageRating}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Goleadores</h3>
                  <div className="space-y-1">
                    {/* Safely handle appearances possibly being undefined or empty */}
                    {(() => {
                      const appearances = match.appearances || [];
                      const scorers = appearances.filter(app => (app?.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
                      if (scorers.length === 0) {
                        return <p className="text-gray-500">Sin goles</p>;
                      }
                      return scorers.map(app => (
                        <div key={app.id} className="flex justify-between">
                          <span>{app.player?.name ?? '—'}</span>
                          <span className="font-medium">{app.goals} gol{app.goals !== 1 ? 'es' : ''}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineup">
          <Card>
            <CardHeader>
              <CardTitle>Alineación y Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Minutos</TableHead>
                    <TableHead>Goles</TableHead>
                    <TableHead>Asistencias</TableHead>
                    <TableHead>Tarjetas</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const appearances = match.appearances || [];
                    if (appearances.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500">No hay datos de alineación</TableCell>
                        </TableRow>
                      );
                    }
                    return appearances.map((appearance) => (
                      <TableRow key={appearance.id}>
                        <TableCell className="font-medium">{appearance.player?.name ?? '—'}</TableCell>
                        <TableCell>{appearance.player?.position ?? '-'}</TableCell>
                        <TableCell>{appearance.minutesPlayed}'</TableCell>
                        <TableCell>{appearance.goals}</TableCell>
                        <TableCell>{appearance.assists}</TableCell>
                        <TableCell>
                          {appearance.yellowCards > 0 && <Badge variant="outline" className="mr-1">A{appearance.yellowCards}</Badge>}
                          {appearance.redCards > 0 && <Badge variant="destructive">R{appearance.redCards}</Badge>}
                        </TableCell>
                        <TableCell>{appearance.rating ? appearance.rating.toFixed(1) : '-'}</TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Goles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de goles:</span>
                    <span className="text-2xl font-bold">{match.stats.totalGoals}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Goleadores</h4>
                    {(() => {
                      const appearances = match.appearances || [];
                      const scorers = appearances.filter(app => (app?.goals ?? 0) > 0).sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
                      const maxGoals = scorers.length > 0 ? Math.max(...scorers.map(a => a.goals ?? 0)) : 1;
                      return scorers.map(app => (
                        <div key={app.id} className="flex justify-between py-1">
                          <span>{app.player?.name ?? '—'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${((app.goals ?? 0) / maxGoals) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-medium w-8 text-right">{app.goals}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Asistencias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de asistencias:</span>
                    <span className="text-2xl font-bold">{match.stats.totalAssists}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Asistidores</h4>
                    {(() => {
                      const appearances = match.appearances || [];
                      const assisters = appearances.filter(app => (app?.assists ?? 0) > 0).sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0));
                      const maxAssists = assisters.length > 0 ? Math.max(...assisters.map(a => a.assists ?? 0)) : 1;
                      return assisters.map(app => (
                        <div key={app.id} className="flex justify-between py-1">
                          <span>{app.player?.name ?? '—'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${((app.assists ?? 0) / maxAssists) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-medium w-8 text-right">{app.assists}</span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}