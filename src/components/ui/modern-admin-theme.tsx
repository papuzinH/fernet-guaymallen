'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Upload, 
  Save, 
  Eye, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Image,
  Droplets
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Theme {
  id?: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

interface ModernAdminThemeProps {
  className?: string;
}

export const ModernAdminTheme: React.FC<ModernAdminThemeProps> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>({ primaryColor: '#3b82f6', secondaryColor: '#1e40af' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/theme');
      const data = await response.json();
      setTheme(data);
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedTheme = await response.json();
        setTheme(updatedTheme);
        setMessage('Theme actualizado exitosamente!');
      } else {
        const error = await response.json();
        setMessage('Error: ' + error.error);
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const colorPresets = [
    { name: 'Azul Clásico', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'Verde Bosque', primary: '#10b981', secondary: '#047857' },
    { name: 'Rojo Fuego', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'Púrpura Real', primary: '#8b5cf6', secondary: '#7c3aed' },
    { name: 'Naranja Sunset', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'Rosa Vibrante', primary: '#ec4899', secondary: '#db2777' },
  ];

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  return (
    <motion.section
      className={cn("py-20 px-4", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Configurar Tema
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Personaliza los colores y logo de tu club para una experiencia única
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Theme Preview */}
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-blue-500/20">
                <Eye className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Tema Actual</h2>
                <p className="text-white/70">Vista previa de la configuración actual</p>
              </div>
            </div>

            {/* Logo Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Logo del Club</h3>
              <div className="flex items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10">
                {theme.logoUrl ? (
                  <motion.img
                    src={theme.logoUrl}
                    alt="Logo del club"
                    className="max-h-24 max-w-48 object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-16 h-16 text-white/30 mx-auto mb-2" />
                    <p className="text-white/50">Sin logo configurado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Color Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Paleta de Colores</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div>
                    <p className="text-white font-medium">Color Primario</p>
                    <p className="text-white/60 text-sm">{theme.primaryColor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-white/20 shadow-2xl"
                    style={{ backgroundColor: theme.secondaryColor }}
                  />
                  <div>
                    <p className="text-white font-medium">Color Secundario</p>
                    <p className="text-white/60 text-sm">{theme.secondaryColor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Vista Previa</h3>
              <div 
                className="p-6 rounded-2xl border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.secondaryColor}10)`
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {theme.logoUrl && (
                    <img src={theme.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white">Fernet Guaymallén</h4>
                    <p className="text-white/70 text-sm">Club de Fútbol</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    className="text-white border-0"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Partidos
                  </Badge>
                  <Badge 
                    className="text-white border-0"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    Jugadores
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Theme Configuration */}
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-500/20">
                <Palette className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Configuración</h2>
                <p className="text-white/70">Personaliza los colores y logo de tu club</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Logo Upload */}
              <div>
                <Label htmlFor="logo" className="text-white/80 mb-2 block">
                  Logo del Club
                </Label>
                <div className="relative">
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Formatos soportados: JPG, PNG, SVG. Tamaño recomendado: 200x200px
                </p>
              </div>

              {/* Color Presets */}
              <div>
                <Label className="text-white/80 mb-4 block">
                  Presets de Colores
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {colorPresets.map((preset, index) => (
                    <motion.button
                      key={preset.name}
                      type="button"
                      className="p-3 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left"
                      onClick={() => applyPreset(preset)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          <div
                            className="w-6 h-6 rounded-l-full border-2 border-white/30"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-r-full border-2 border-white/30 border-l-0"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">{preset.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primaryColor" className="text-white/80 mb-2 block">
                    Color Primario
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-12 p-1 bg-white/10 border-white/20 rounded-lg"
                    />
                    <Input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor" className="text-white/80 mb-2 block">
                    Color Secundario
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-12 p-1 bg-white/10 border-white/20 rounded-lg"
                    />
                    <Input
                      type="text"
                      value={theme.secondaryColor}
                      onChange={(e) => setTheme(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#1e40af"
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0 py-3 text-lg font-semibold shadow-2xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Tema
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Message Section */}
        {message && (
          <motion.div
            className="glass-morphism rounded-3xl p-8 border border-white/20 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl",
                message.includes('Error') 
                  ? "bg-red-500/20" 
                  : "bg-green-500/20"
              )}>
                {message.includes('Error') ? (
                  <AlertCircle className="w-8 h-8 text-red-300" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-300" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {message.includes('Error') ? 'Error' : 'Éxito'}
                </h3>
                <p className={cn(
                  "text-sm",
                  message.includes('Error') 
                    ? "text-red-300" 
                    : "text-green-300"
                )}>
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Color Theory Section */}
        <motion.div
          className="glass-morphism rounded-3xl p-8 border border-white/20 mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-yellow-500/20">
              <Droplets className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Consejos de Color</h3>
              <p className="text-white/70">Mejores prácticas para elegir colores efectivos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Contraste',
                description: 'Asegúrate de que los colores tengan suficiente contraste para la legibilidad',
                icon: '🎨'
              },
              {
                title: 'Consistencia',
                description: 'Mantén una paleta coherente en toda la aplicación',
                icon: '🔄'
              },
              {
                title: 'Accesibilidad',
                description: 'Considera usuarios con daltonismo y problemas de visión',
                icon: '♿'
              }
            ].map((tip, index) => (
              <motion.div
                key={tip.title}
                className="p-6 bg-white/5 rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{tip.title}</h4>
                <p className="text-white/70 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ModernAdminTheme;
