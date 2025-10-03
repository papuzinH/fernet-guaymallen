'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Users, 
  Calendar, 
  Trophy, 
  CheckCircle, 
  AlertCircle,
  Download,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParsedData {
  players: any[];
  matches: any[];
  appearances: any[];
}

interface ModernAdminImportProps {
  className?: string;
}

export const ModernAdminImport: React.FC<ModernAdminImportProps> = ({ className }) => {
  const [files, setFiles] = useState<{ players?: File; matches?: File; appearances?: File }>({});
  const [parsedData, setParsedData] = useState<ParsedData>({ players: [], matches: [], appearances: [] });
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [adminSecret, setAdminSecret] = useState('');

  const handleFileChange = (type: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      parseCSV(file, type);
    }
  };

  const parseCSV = (file: File, type: keyof ParsedData) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      encoding: 'utf-8',
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        const filteredData = results.data.filter((row: any) => Object.values(row).some(val => val !== ''));
        setParsedData(prev => ({ ...prev, [type]: filteredData }));
      },
      error: (error) => {
        console.error(`Error parsing ${type} CSV:`, error);
        setMessage(`Error parsing ${type} CSV: ${error.message}`);
      }
    });
  };

  const generateSummary = () => {
    let summaryText = '';
    summaryText += `Players: ${parsedData.players.length} records\n`;
    summaryText += `Matches: ${parsedData.matches.length} records\n`;
    summaryText += `Appearances: ${parsedData.appearances.length} records\n\n`;

    if (parsedData.players.length > 0) {
      summaryText += `Sample Player: ${JSON.stringify(parsedData.players[0], null, 2)}\n\n`;
    }
    if (parsedData.matches.length > 0) {
      summaryText += `Sample Match: ${JSON.stringify(parsedData.matches[0], null, 2)}\n\n`;
    }
    if (parsedData.appearances.length > 0) {
      summaryText += `Sample Appearance: ${JSON.stringify(parsedData.appearances[0], null, 2)}\n\n`;
    }

    setSummary(summaryText);
  };

  const handleImport = async () => {
    if (!adminSecret) {
      setMessage('Por favor ingresa el Admin Secret');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`
        },
        body: JSON.stringify(parsedData)
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Import successful: ' + result.message);
      } else {
        setMessage('Import failed: ' + result.error);
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fileTypes = [
    {
      type: 'players' as const,
      title: 'Jugadores',
      description: 'Datos de los jugadores del equipo',
      icon: Users,
      color: '#8b5cf6',
      gradient: 'from-purple-500/20 to-purple-600/10',
      glowColor: '#8b5cf6'
    },
    {
      type: 'matches' as const,
      title: 'Partidos',
      description: 'Información de los partidos jugados',
      icon: Calendar,
      color: '#10b981',
      gradient: 'from-green-500/20 to-green-600/10',
      glowColor: '#10b981'
    },
    {
      type: 'appearances' as const,
      title: 'Apariciones',
      description: 'Estadísticas de jugadores por partido',
      icon: Trophy,
      color: '#f59e0b',
      gradient: 'from-yellow-500/20 to-yellow-600/10',
      glowColor: '#f59e0b'
    }
  ];

  return (
    <motion.section
      className={cn("py-20 px-4", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Importar Datos
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Importa datos masivos desde archivos CSV para configurar tu club
          </p>
        </motion.div>

        {/* Admin Secret Section */}
        <motion.div
          className="glass-morphism rounded-3xl p-8 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Autenticación</h3>
              <p className="text-white/70">Ingresa el Admin Secret para proceder con la importación</p>
            </div>
          </div>
          
          <div className="max-w-md">
            <Label htmlFor="admin-secret" className="text-white/80 mb-2 block">
              Admin Secret
            </Label>
            <Input
              id="admin-secret"
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Ingresa tu Admin Secret"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>
        </motion.div>

        {/* File Upload Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {fileTypes.map((fileType, index) => {
            const Icon = fileType.icon;
            const hasFile = files[fileType.type];
            const dataCount = parsedData[fileType.type]?.length || 0;
            
            return (
              <motion.div
                key={fileType.type}
                className={cn(
                  "glass-morphism rounded-3xl p-6 border border-white/20 relative overflow-hidden",
                  fileType.gradient
                )}
                style={{
                  boxShadow: `0 20px 40px ${fileType.glowColor}20`
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${fileType.color}10, transparent)`
                  }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-3 rounded-2xl"
                      style={{ backgroundColor: `${fileType.color}20` }}
                    >
                      <Icon 
                        className="w-6 h-6 text-white" 
                        style={{ color: fileType.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{fileType.title}</h3>
                      <p className="text-white/70 text-sm">{fileType.description}</p>
                    </div>
                  </div>

                  {/* File Status */}
                  <div className="mb-4">
                    {hasFile ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 text-sm font-medium">
                          {hasFile.name}
                        </span>
                        {dataCount > 0 && (
                          <Badge className="bg-green-500/30 text-green-200 border-green-400/50">
                            {dataCount} registros
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-white/50" />
                        <span className="text-white/50 text-sm">Sin archivo</span>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <div>
                    <Label 
                      htmlFor={`${fileType.type}-file`}
                      className="text-white/80 text-sm mb-2 block"
                    >
                      Seleccionar archivo CSV
                    </Label>
                    <Input
                      id={`${fileType.type}-file`}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange(fileType.type)}
                      className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3"
                    />
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={generateSummary}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generar Resumen
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleImport}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-0 px-8 py-3 text-lg font-semibold shadow-2xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Importar Datos
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Summary Section */}
        {summary && (
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/20">
                <FileText className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Resumen de Importación</h3>
                <p className="text-white/70">Vista previa de los datos a importar</p>
              </div>
            </div>
            
            <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
              <pre className="whitespace-pre-wrap text-white/80 text-sm font-mono">
                {summary}
              </pre>
            </div>
          </motion.div>
        )}

        {/* Message Section */}
        {message && (
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl",
                message.includes('Error') || message.includes('failed') 
                  ? "bg-red-500/20" 
                  : "bg-green-500/20"
              )}>
                {message.includes('Error') || message.includes('failed') ? (
                  <AlertCircle className="w-8 h-8 text-red-300" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-300" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {message.includes('Error') || message.includes('failed') ? 'Error' : 'Éxito'}
                </h3>
                <p className={cn(
                  "text-sm",
                  message.includes('Error') || message.includes('failed') 
                    ? "text-red-300" 
                    : "text-green-300"
                )}>
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Examples Section */}
        <motion.div
          className="glass-morphism rounded-3xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-yellow-500/20">
              <Download className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Ejemplos de CSV</h3>
              <p className="text-white/70">Formato requerido para cada tipo de archivo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'players.csv',
                content: `fullName,nickname,dorsal,position,joinedAt,isActive,photoUrl
Juan Pérez,JuanP,10,DELANTERO,2023-01-01,true,https://example.com/juan.jpg
María García,MariaG,5,DEFENSOR,2022-06-15,true,`,
                color: '#8b5cf6'
              },
              {
                title: 'matches.csv',
                content: `date,opponent,ourScore,theirScore,result,tournament,organizer,location,notes
2024-09-01,Rival FC,2,1,WIN,Liga Local,Fernet Guaymallén,Estadio Principal,Gran partido
2024-09-08,Otro Equipo,1,1,DRAW,Copa Regional,Federación Mendoza,Estadio Visitante,`,
                color: '#10b981'
              },
              {
                title: 'appearances.csv',
                content: `matchDate,opponent,playerNickname,isStarter,goals,assists,yellow,red
2024-09-01,Rival FC,JuanP,true,1,0,false,false
2024-09-01,Rival FC,MariaG,true,0,1,false,false`,
                color: '#f59e0b'
              }
            ].map((example, index) => (
              <motion.div
                key={example.title}
                className="bg-black/20 rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: example.color }}
                  />
                  <h4 className="text-lg font-semibold text-white">{example.title}</h4>
                </div>
                <pre className="whitespace-pre-wrap text-white/60 text-xs font-mono overflow-x-auto">
                  {example.content}
                </pre>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernAdminImport;
