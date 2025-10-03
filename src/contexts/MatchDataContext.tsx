"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MatchDataContextType {
  opponents: string[];
  locations: string[];
  addOpponent: (opponent: string) => void;
  addLocation: (location: string) => void;
  getOpponentSuggestions: (query: string) => string[];
  getLocationSuggestions: (query: string) => string[];
}

const MatchDataContext = createContext<MatchDataContextType | undefined>(undefined);

export const useMatchData = () => {
  const context = useContext(MatchDataContext);
  if (context === undefined) {
    throw new Error('useMatchData must be used within a MatchDataProvider');
  }
  return context;
};

interface MatchDataProviderProps {
  children: ReactNode;
}

export const MatchDataProvider: React.FC<MatchDataProviderProps> = ({ children }) => {
  const [opponents, setOpponents] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Cargar datos existentes desde localStorage al montar
  useEffect(() => {
    const savedOpponents = localStorage.getItem('match-opponents');
    const savedLocations = localStorage.getItem('match-locations');
    
    if (savedOpponents) {
      setOpponents(JSON.parse(savedOpponents));
    }
    
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }
  }, []);

  const addOpponent = (opponent: string) => {
    const trimmedOpponent = opponent.trim();
    if (trimmedOpponent && !opponents.includes(trimmedOpponent)) {
      const newOpponents = [...opponents, trimmedOpponent];
      setOpponents(newOpponents);
      localStorage.setItem('match-opponents', JSON.stringify(newOpponents));
    }
  };

  const addLocation = (location: string) => {
    const trimmedLocation = location.trim();
    if (trimmedLocation && !locations.includes(trimmedLocation)) {
      const newLocations = [...locations, trimmedLocation];
      setLocations(newLocations);
      localStorage.setItem('match-locations', JSON.stringify(newLocations));
    }
  };

  const getOpponentSuggestions = (query: string): string[] => {
    if (!query.trim()) return opponents;
    return opponents.filter(opponent => 
      opponent.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getLocationSuggestions = (query: string): string[] => {
    if (!query.trim()) return locations;
    return locations.filter(location => 
      location.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value: MatchDataContextType = {
    opponents,
    locations,
    addOpponent,
    addLocation,
    getOpponentSuggestions,
    getLocationSuggestions,
  };

  return (
    <MatchDataContext.Provider value={value}>
      {children}
    </MatchDataContext.Provider>
  );
};

