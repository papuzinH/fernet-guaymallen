'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FootballIcon } from '@/components/icons/football';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/matches', label: 'Partidos' },
  { href: '/players', label: 'Jugadores' },
  { href: '/rankings', label: 'Rankings' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/95 to-blue-800/95 backdrop-blur-md border-b border-white/10 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/escudo.png"
                alt="Escudo Fernet con Guaymallén"
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-heading text-white tracking-wide">
                FERNET
              </h1>
              <p className="text-xs text-white/70 -mt-1">Guaymallén</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "football" : "ghost"}
                  size="sm"
                  className={`transition-all duration-300 ${
                    pathname === item.href
                      ? 'shadow-lg'
                      : 'hover:bg-white/10 text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "football" : "ghost"}
                    className={`w-full justify-start transition-all duration-300 ${
                      pathname === item.href
                        ? 'shadow-lg'
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}