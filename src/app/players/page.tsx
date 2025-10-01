'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: number;
  fullName: string;
  nickname: string | null;
  dorsal: number | null;
  position: string;
  photoUrl: string | null;
  isActive: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    motm: number;
    goalsPerMatch: string;
  };
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('all');
  const [activeOnly, setActiveOnly] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, [search, position, activeOnly]);

  const fetchPlayers = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      position: position === 'all' ? '' : position,
      activeOnly: activeOnly.toString(),
    });

    try {
      const response = await fetch(`/api/players?${params}`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jugadores</h1>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o apodo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Posición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las posiciones</SelectItem>
                  <SelectItem value="GK">Arquero</SelectItem>
                  <SelectItem value="DEF">Defensor</SelectItem>
                  <SelectItem value="MID">Mediocampista</SelectItem>
                  <SelectItem value="FW">Delantero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="activeOnly"
                checked={activeOnly}
                onCheckedChange={(checked) => setActiveOnly(checked as boolean)}
              />
              <label htmlFor="activeOnly" className="text-sm font-medium">
                Solo activos
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      {loading ? (
        <div className="text-center py-8"><Loader size="large" text="Cargando jugadores..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Photo */}
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-200">
                    {player.photoUrl ? (
                      <Image
                        src={player.photoUrl}
                        alt={player.fullName}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Name and Nickname */}
                  <h3 className="font-semibold text-lg mb-1">{player.fullName}</h3>
                  {player.nickname && (
                    <p className="text-gray-600 mb-2">"{player.nickname}"</p>
                  )}

                  {/* Position and Dorsal */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getPositionColor(player.position)}>
                      {getPositionName(player.position)}
                    </Badge>
                    {player.dorsal && (
                      <Badge variant="outline">
                        #{player.dorsal}
                      </Badge>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <Badge variant={player.isActive ? "default" : "secondary"}>
                      {player.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 w-full mb-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{player.stats.appearances}</div>
                      <div className="text-xs text-gray-500">Partidos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{player.stats.goals}</div>
                      <div className="text-xs text-gray-500">Goles</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{player.stats.assists}</div>
                      <div className="text-xs text-gray-500">Asistencias</div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button asChild className="w-full">
                    <Link href={`/players/${player.id}`}>Ver Perfil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && players.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron jugadores con los filtros aplicados.
        </div>
      )}
    </div>
  );
}