'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    tournament: 'all',
    season: 'all',
    result: 'all',
  });

  useEffect(() => {
    fetchMatches();
  }, [filters, pagination.page]);

  const fetchMatches = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value !== 'all')
      ),
    });

    try {
      const response = await fetch(`/api/matches?${params}`);
      const data = await response.json();
      setMatches(data.matches);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'WIN': return 'bg-green-500';
      case 'DRAW': return 'bg-yellow-500';
      case 'LOSS': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUniqueValues = (key: 'tournament' | 'season' | 'result') => {
    const values = new Set<string>();
    matches.forEach(match => {
      if (key === 'tournament' && match.tournament?.name) {
        values.add(match.tournament.name);
      } else if (key === 'season' && match.tournament?.season) {
        values.add(match.tournament.season);
      } else if (key === 'result') {
        values.add(match.result);
      }
    });
    return Array.from(values).sort();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Partidos</h1>

      {/* Filters */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Torneo</label>
            <Select value={filters.tournament} onValueChange={(value) => handleFilterChange('tournament', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los torneos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los torneos</SelectItem>
                {getUniqueValues('tournament').map(tournament => (
                  <SelectItem key={tournament} value={tournament}>{tournament}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Temporada</label>
            <Select value={filters.season} onValueChange={(value) => handleFilterChange('season', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las temporadas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las temporadas</SelectItem>
                {getUniqueValues('season').map(season => (
                  <SelectItem key={season} value={season}>{season}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Resultado</label>
            <Select value={filters.result} onValueChange={(value) => handleFilterChange('result', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los resultados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los resultados</SelectItem>
                {getUniqueValues('result').map(result => (
                  <SelectItem key={result} value={result}>{result}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Partidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4"><Loader size="medium" text="Cargando..." /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Rival</TableHead>
                    <TableHead>Torneo</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Marcador</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                      <TableCell>{match.opponent}</TableCell>
                      <TableCell>
                        {match.tournament ? `${match.tournament.name} ${match.tournament.season}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getResultColor(match.result)}>
                          {match.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{match.ourScore} - {match.theirScore}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/matches/${match.id}`}>Ver Detalle</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Mostrando {matches.length} de {pagination.total} partidos
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Anterior
                  </Button>
                  <span className="px-3 py-1 text-sm">
                    Página {pagination.page} de {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}