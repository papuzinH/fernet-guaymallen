"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Tournament {
  id: number;
  name: string;
  organizer?: string;
  createdAt: string;
  matches?: Match[];
}

interface Match {
  id: number;
  date: string;
  opponent: string;
  tournamentId?: number;
  location?: string;
  ourScore: number;
  theirScore: number;
  result: 'WIN' | 'DRAW' | 'LOSS';
  notes?: string;
  players?: Appearance[];
}

interface Appearance {
  id: number;
  matchId: number;
  playerId: number;
  isStarter: boolean;
  goals: number;
  assists: number;
  yellow: boolean;
  red: boolean;
}

interface TournamentContextType {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  createTournament: (name: string) => Promise<Tournament | null>;
  fetchTournaments: () => Promise<void>;
  refreshTournaments: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};

interface TournamentProviderProps {
  children: ReactNode;
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tournaments');
      if (!response.ok) {
        throw new Error('Error al cargar torneos');
      }
      const data = await response.json();
      setTournaments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTournament = async (name: string): Promise<Tournament | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear torneo');
      }

      const newTournament = await response.json();
      
      // Actualizar el estado local agregando el nuevo torneo
      setTournaments(prev => [newTournament, ...prev]);
      
      return newTournament;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error creating tournament:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshTournaments = async () => {
    await fetchTournaments();
  };

  // Cargar torneos al montar el componente
  useEffect(() => {
    fetchTournaments();
  }, []);

  const value: TournamentContextType = {
    tournaments,
    loading,
    error,
    createTournament,
    fetchTournaments,
    refreshTournaments,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};
