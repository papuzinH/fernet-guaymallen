'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Calendar, Users, Trophy, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  glowColor: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Inicio',
    icon: Home,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/10',
    glowColor: '#3b82f6'
  },
  {
    href: '/matches',
    label: 'Partidos',
    icon: Calendar,
    color: '#10b981',
    gradient: 'from-green-500/20 to-green-600/10',
    glowColor: '#10b981'
  },
  {
    href: '/players',
    label: 'Jugadores',
    icon: Users,
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-purple-600/10',
    glowColor: '#8b5cf6'
  },
  {
    href: '/rankings',
    label: 'Rankings',
    icon: Trophy,
    color: '#f59e0b',
    gradient: 'from-yellow-500/20 to-yellow-600/10',
    glowColor: '#f59e0b'
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: Settings,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-red-600/10',
    glowColor: '#ef4444'
  }
];

interface ModernNavbarProps {
  className?: string;
}

export const ModernNavbar: React.FC<ModernNavbarProps> = ({ className }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "glass-morphism border-b border-white/20 shadow-2xl" 
          : "bg-gradient-to-r from-blue-900/95 to-blue-800/95 backdrop-blur-md border-b border-white/10",
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.1 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Logo Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md opacity-50"
                style={{ backgroundColor: '#3b82f6' }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo Container */}
              <div className="relative w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden">
                <img
                  src="/escudo.png"
                  alt="Escudo Fernet con Guaymallén"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.h1 
                className="text-lg font-bold text-white tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                FERNET
              </motion.h1>
              <p className="text-xs text-white/70 -mt-1">Guaymallén</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={cn(
                        "relative px-4 py-2 rounded-xl transition-all duration-300",
                        isActive 
                          ? `glass-morphism border border-white/20 ${item.gradient}`
                          : "hover:bg-white/10"
                      )}
                      style={isActive ? {
                        boxShadow: `0 10px 30px ${item.glowColor}30`
                      } : {}}
                      whileHover={{ 
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active Background Glow */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-30"
                          style={{
                            background: `linear-gradient(135deg, ${item.color}20, transparent)`
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
                      )}

                      <div className="relative z-10 flex items-center space-x-2">
                        <Icon 
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-white" : "text-white/70 group-hover:text-white"
                          )}
                          style={isActive ? { color: item.color } : {}}
                        />
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isActive ? "text-white" : "text-white/80 group-hover:text-white"
                        )}>
                          {item.label}
                        </span>
                      </div>

                      {/* Floating Particles for Active Item */}
                      {isActive && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/30 rounded-full"
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
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 glass-morphism border border-white/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-white/10 mt-2"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link href={item.href} onClick={closeMobileMenu}>
                        <motion.div
                          className={cn(
                            "relative p-4 rounded-xl transition-all duration-300",
                            isActive 
                              ? `glass-morphism border border-white/20 ${item.gradient}`
                              : "hover:bg-white/10"
                          )}
                          style={isActive ? {
                            boxShadow: `0 10px 30px ${item.glowColor}30`
                          } : {}}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Active Background Glow */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-xl opacity-30"
                              style={{
                                background: `linear-gradient(135deg, ${item.color}20, transparent)`
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
                          )}

                          <div className="relative z-10 flex items-center space-x-3">
                            <Icon 
                              className="w-5 h-5"
                              style={{ color: isActive ? item.color : '#ffffff' }}
                            />
                            <span className={cn(
                              "text-base font-medium",
                              isActive ? "text-white" : "text-white/80"
                            )}>
                              {item.label}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Sparkles className="w-4 h-4 text-white/60" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => {
          // Use fixed positions based on index to avoid hydration mismatch
          const positions = [
            { left: 10, top: 20 }, { left: 25, top: 15 }, { left: 40, top: 25 },
            { left: 60, top: 18 }, { left: 75, top: 22 }, { left: 85, top: 16 },
            { left: 15, top: 35 }, { left: 90, top: 30 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [-15, 15, -15],
                x: [-8, 8, -8],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          );
        })}
      </div>
    </motion.nav>
  );
};

export default ModernNavbar;
