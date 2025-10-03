'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Calendar, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernMatchFiltersProps {
  filters: {
    tournament: string;
    result: string;
  };
  onFilterChange: (key: string, value: string) => void;
  uniqueValues: {
    tournaments: string[];
    results: string[];
  };
  className?: string;
}

export const ModernMatchFilters: React.FC<ModernMatchFiltersProps> = ({
  filters,
  onFilterChange,
  uniqueValues,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "glass-morphism rounded-3xl p-8 border border-white/20",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
          <Filter className="w-5 h-5 text-blue-300" />
        </div>
        <h2 className="text-xl font-bold text-white">Filtros de Búsqueda</h2>
      </motion.div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tournament Filter */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Torneo
          </label>
          <Select 
            value={filters.tournament} 
            onValueChange={(value) => onFilterChange('tournament', value)}
          >
            <SelectTrigger className="glass-morphism border-white/20 text-white hover:border-white/40 transition-all duration-300">
              <SelectValue placeholder="Seleccionar torneo" />
            </SelectTrigger>
            <SelectContent className="glass-morphism border-white/20 bg-slate-900/90 backdrop-blur-xl">
              <SelectItem 
                value="all" 
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                Todos los torneos
              </SelectItem>
              {uniqueValues.tournaments.map(tournament => (
                <SelectItem 
                  key={tournament} 
                  value={tournament}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {tournament}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Result Filter */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Target className="w-4 h-4 text-red-400" />
            Resultado
          </label>
          <Select 
            value={filters.result} 
            onValueChange={(value) => onFilterChange('result', value)}
          >
            <SelectTrigger className="glass-morphism border-white/20 text-white hover:border-white/40 transition-all duration-300">
              <SelectValue placeholder="Seleccionar resultado" />
            </SelectTrigger>
            <SelectContent className="glass-morphism border-white/20 bg-slate-900/90 backdrop-blur-xl">
              <SelectItem 
                value="all" 
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                Todos los resultados
              </SelectItem>
              {uniqueValues.results.map(result => (
                <SelectItem 
                  key={result} 
                  value={result}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  {result}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Active Filters Display */}
      <motion.div
        className="mt-6 pt-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
          <Calendar className="w-4 h-4" />
          Filtros activos:
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.tournament !== 'all' && (
            <motion.div
              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-400/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Torneo: {filters.tournament}
            </motion.div>
          )}
          {filters.result !== 'all' && (
            <motion.div
              className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs border border-red-400/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Resultado: {filters.result}
            </motion.div>
          )}
          {filters.tournament === 'all' && filters.result === 'all' && (
            <span className="text-white/40 text-xs">Sin filtros aplicados</span>
          )}
        </div>
      </motion.div>

      {/* Clear Filters Button */}
      {(filters.tournament !== 'all' || filters.result !== 'all') && (
        <motion.button
          className="mt-4 px-4 py-2 bg-white/10 text-white/80 rounded-xl border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-300 text-sm"
          onClick={() => {
            onFilterChange('tournament', 'all');
            onFilterChange('result', 'all');
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Limpiar filtros
        </motion.button>
      )}
    </motion.div>
  );
};

export default ModernMatchFilters;
