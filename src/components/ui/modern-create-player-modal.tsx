'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  X, 
  User, 
  Upload, 
  Calendar, 
  FileText, 
  Target, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernCreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerCreated?: () => void;
}

interface PlayerFormData {
  fullName: string;
  nickname: string;
  birthDate: string;
  bio: string;
  position: string;
  dorsal: string;
  photoFile: File | null;
}

const POSITION_OPTIONS = [
  { value: 'GK', label: 'Arquero', color: '#f59e0b', icon: '🥅' },
  { value: 'DEF_CENTRAL', label: 'Defensor Central', color: '#3b82f6', icon: '🛡️' },
  { value: 'DEF_LATERAL', label: 'Defensor Lateral', color: '#3b82f6', icon: '🏃' },
  { value: 'MID_CENTRAL', label: 'Mediocampista Central', color: '#10b981', icon: '⚽' },
  { value: 'VOLANTE', label: 'Volante', color: '#10b981', icon: '🎯' },
  { value: 'MID_OFENSIVO', label: 'Mediocampista Ofensivo', color: '#8b5cf6', icon: '🚀' },
  { value: 'DELANTERO', label: 'Delantero', color: '#ef4444', icon: '⚡' },
  { value: 'OTHER', label: 'Otro', color: '#6b7280', icon: '👤' },
];

export const ModernCreatePlayerModal: React.FC<ModernCreatePlayerModalProps> = ({
  isOpen,
  onClose,
  onPlayerCreated,
}) => {
  const [formData, setFormData] = useState<PlayerFormData>({
    fullName: '',
    nickname: '',
    birthDate: '',
    bio: '',
    position: '',
    dorsal: '',
    photoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 1, title: 'Información Básica', icon: User },
    { id: 2, title: 'Detalles Adicionales', icon: FileText },
  ];

  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, photoFile: file }));
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photoFile: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        toast.error('El nombre completo es requerido');
        return;
      }
      if (!formData.position) {
        toast.error('La posición es requerida');
        return;
      }
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.birthDate) {
      const age = calculateAge(formData.birthDate);
      if (age < 16 || age > 50) {
        toast.error('La edad debe estar entre 16 y 50 años');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        fullName: formData.fullName.trim(),
        nickname: formData.nickname.trim(),
        position: formData.position,
      };

      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el jugador');
      }

      toast.success(`Jugador "${result.fullName}" creado exitosamente`);
      
      setFormData({
        fullName: '',
        nickname: '',
        birthDate: '',
        bio: '',
        position: '',
        dorsal: '',
        photoFile: null,
      });
      removePhoto();
      setCurrentStep(1);
      
      onPlayerCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating player:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el jugador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      removePhoto();
      setCurrentStep(1);
      onClose();
    }
  };

  const getPositionConfig = (position: string) => {
    return POSITION_OPTIONS.find(option => option.value === position) || POSITION_OPTIONS[7];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-morphism rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-8 border-b border-white/10">
                {/* Background Glow */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${getPositionConfig(formData.position).color}20, transparent)`
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

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="p-4 rounded-2xl"
                      style={{ backgroundColor: `${getPositionConfig(formData.position).color}20` }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-8 h-8 text-white" style={{ color: getPositionConfig(formData.position).color }} />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Crear Nuevo Jugador
                      </h2>
                      <p className="text-white/70">
                        Agrega un nuevo jugador al equipo con toda su información
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mt-8 space-x-8">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id <= currentStep;
                    const isCurrent = step.id === currentStep;
                    
                    return (
                      <motion.div
                        key={step.id}
                        className="flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: step.id * 0.1 }}
                      >
                        <motion.div
                          className={cn(
                            "relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            isActive 
                              ? "border-white/40 shadow-2xl" 
                              : "border-white/20"
                          )}
                          style={{
                            background: isActive 
                              ? `linear-gradient(135deg, ${getPositionConfig(formData.position).color}40, ${getPositionConfig(formData.position).color}20)`
                              : "rgba(255, 255, 255, 0.1)"
                          }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon 
                            className="w-6 h-6 text-white" 
                            style={{ 
                              color: isActive ? getPositionConfig(formData.position).color : "rgba(255, 255, 255, 0.5)"
                            }}
                          />
                          
                          {isCurrent && (
                            <motion.div
                              className="absolute inset-0 rounded-full blur-lg opacity-50"
                              style={{ backgroundColor: getPositionConfig(formData.position).color }}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </motion.div>
                        
                        {step.id < steps.length && (
                          <motion.div
                            className={cn(
                              "w-16 h-1 mx-4 rounded-full transition-all duration-300",
                              step.id < currentStep 
                                ? "bg-gradient-to-r from-white/60 to-white/40" 
                                : "bg-white/20"
                            )}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 + step.id * 0.1 }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Photo Upload */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-white flex items-center gap-3">
                          <Camera className="w-5 h-5" />
                          Foto de Perfil (opcional)
                        </Label>
                        <div className="flex items-center gap-6">
                          <motion.div 
                            className="relative w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            {previewUrl ? (
                              <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-12 w-12 text-white/50" />
                            )}
                            
                            {previewUrl && (
                              <motion.button
                                type="button"
                                onClick={removePhoto}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </motion.button>
                            )}
                          </motion.div>
                          
                          <div className="flex-1">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting}
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Seleccionar Foto
                              </Button>
                            </motion.div>
                            <p className="text-white/60 text-sm mt-2">
                              Formatos: JPG, PNG, SVG. Máximo 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-3">
                          <Label htmlFor="fullName" className="text-white/80 font-medium">
                            Nombre Completo *
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            disabled={isSubmitting}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          />
                        </div>

                        {/* Nickname */}
                        <div className="space-y-3">
                          <Label htmlFor="nickname" className="text-white/80 font-medium">
                            Apodo (opcional)
                          </Label>
                          <Input
                            id="nickname"
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => handleInputChange('nickname', e.target.value)}
                            placeholder="Ej: El Pibe"
                            disabled={isSubmitting}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          />
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-4">
                        <Label className="text-white/80 font-medium flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Posición *
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {POSITION_OPTIONS.map((option) => (
                            <motion.button
                              key={option.value}
                              type="button"
                              onClick={() => handleInputChange('position', option.value)}
                              disabled={isSubmitting}
                              className={cn(
                                "p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                                formData.position === option.value
                                  ? "border-white/40 shadow-2xl"
                                  : "border-white/20 hover:border-white/30"
                              )}
                              style={{
                                background: formData.position === option.value
                                  ? `linear-gradient(135deg, ${option.color}40, ${option.color}20)`
                                  : "rgba(255, 255, 255, 0.05)"
                              }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                  <div className="text-white font-medium text-sm">
                                    {option.label}
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Additional Details */}
                  {currentStep === 2 && (
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Birth Date */}
                        <div className="space-y-3">
                          <Label htmlFor="birthDate" className="text-white/80 font-medium flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Fecha de Nacimiento (opcional)
                          </Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            disabled={isSubmitting}
                            className="bg-white/10 border-white/20 text-white focus:border-white/40"
                          />
                          {formData.birthDate && (
                            <motion.div
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/70 text-sm">
                                Edad: {calculateAge(formData.birthDate)} años
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Dorsal */}
                        <div className="space-y-3">
                          <Label htmlFor="dorsal" className="text-white/80 font-medium">
                            Dorsal (opcional)
                          </Label>
                          <Input
                            id="dorsal"
                            type="number"
                            min="1"
                            max="99"
                            value={formData.dorsal}
                            onChange={(e) => handleInputChange('dorsal', e.target.value)}
                            placeholder="Ej: 10"
                            disabled={isSubmitting}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-3">
                        <Label htmlFor="bio" className="text-white/80 font-medium flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Mini Biografía (opcional)
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Cuéntanos algo sobre este jugador..."
                          disabled={isSubmitting}
                          rows={4}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                        />
                      </div>

                      {/* Summary */}
                      <motion.div
                        className="p-6 bg-white/5 rounded-2xl border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">Resumen del Jugador</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-white/70" />
                            <span className="text-white/80">
                              <strong>Nombre:</strong> {formData.fullName || 'No especificado'}
                            </span>
                          </div>
                          {formData.nickname && (
                            <div className="flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-white/70" />
                              <span className="text-white/80">
                                <strong>Apodo:</strong> "{formData.nickname}"
                              </span>
                            </div>
                          )}
                          {formData.position && (
                            <div className="flex items-center gap-3">
                              <Target className="w-5 h-5 text-white/70" />
                              <span className="text-white/80">
                                <strong>Posición:</strong> {getPositionConfig(formData.position).label}
                              </span>
                              <Badge 
                                className="text-white border-0"
                                style={{ backgroundColor: getPositionConfig(formData.position).color }}
                              >
                                {getPositionConfig(formData.position).icon}
                              </Badge>
                            </div>
                          )}
                          {formData.dorsal && (
                            <div className="flex items-center gap-3">
                              <span className="text-white/80">
                                <strong>Dorsal:</strong> #{formData.dorsal}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/10 bg-white/5">
                <div className="flex justify-between items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1 || isSubmitting}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Anterior
                    </Button>
                  </motion.div>

                  <div className="flex gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Cancelar
                      </Button>
                    </motion.div>

                    {currentStep < steps.length ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!formData.fullName.trim() || !formData.position}
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                        >
                          Siguiente
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Creando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Crear Jugador
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernCreatePlayerModal;
