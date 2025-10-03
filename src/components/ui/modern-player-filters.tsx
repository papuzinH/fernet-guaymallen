'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Users, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ModernPlayerFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  position: string;
  setPosition: (value: string) => void;
  activeOnly: boolean;
  setActiveOnly: (checked: boolean) => void;
  className?: string;
}

export const ModernPlayerFilters: React.FC<ModernPlayerFiltersProps> = ({
  search,
  setSearch,
  position,
  setPosition,
  activeOnly,
  setActiveOnly,
  className
}) => {
  return (
    <motion.div
      className={cn(
        "glass-morphism rounded-3xl p-6 border-2 border-white/20 relative overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
        style={{ backgroundColor: '#3b82f6' }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20">
            <Filter className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Filtros de Búsqueda</h2>
        </motion.div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar Jugador
            </label>
            <div className="relative">
              <Input
                placeholder="Nombre o apodo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={{ 
                  scale: search ? [1, 1.2, 1] : 1,
                  rotate: search ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <Search className="w-4 h-4 text-white/50" />
              </motion.div>
            </div>
          </motion.div>

          {/* Position Select */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Posición
            </label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full bg-white/10 border-white/30 text-white focus:border-blue-400 focus:ring-blue-400/20">
                <SelectValue placeholder="Seleccionar posición" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">
                  Todas las posiciones
                </SelectItem>
                <SelectItem value="GK" className="text-white hover:bg-white/10">
                  Arquero
                </SelectItem>
                <SelectItem value="DEF_CENTRAL" className="text-white hover:bg-white/10">
                  Defensor Central
                </SelectItem>
                <SelectItem value="DEF_LATERAL" className="text-white hover:bg-white/10">
                  Defensor Lateral
                </SelectItem>
                <SelectItem value="MID_CENTRAL" className="text-white hover:bg-white/10">
                  Mediocampista Central
                </SelectItem>
                <SelectItem value="VOLANTE" className="text-white hover:bg-white/10">
                  Volante
                </SelectItem>
                <SelectItem value="MID_OFENSIVO" className="text-white hover:bg-white/10">
                  Mediocampista Ofensivo
                </SelectItem>
                <SelectItem value="DELANTERO" className="text-white hover:bg-white/10">
                  Delantero
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Active Only Checkbox */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Estado
            </label>
            <motion.div
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Checkbox
                id="activeOnly"
                checked={activeOnly}
                onCheckedChange={(checked) => setActiveOnly(checked as boolean)}
                className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <label 
                htmlFor="activeOnly" 
                className="text-sm font-medium text-white cursor-pointer select-none"
              >
                Solo jugadores activos
              </label>
            </motion.div>
          </motion.div>
        </div>

        {/* Active Filters Summary */}
        {(search || position !== 'all' || activeOnly) && (
          <motion.div
            className="mt-6 pt-4 border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-white/60">Filtros activos:</span>
              {search && (
                <motion.span
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-400/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  "{search}"
                </motion.span>
              )}
              {position !== 'all' && (
                <motion.span
                  className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-400/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                >
                  {position}
                </motion.span>
              )}
              {activeOnly && (
                <motion.span
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  Solo activos
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernPlayerFilters;
