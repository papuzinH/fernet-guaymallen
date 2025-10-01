"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Admin() {
  const [loading, setLoading] = useState(false);

  const handleCreateTournament = async () => {
    const name = prompt('Nombre del torneo:');
    if (!name) return;
    const season = prompt('Temporada (ej: 2024):') || '';
    try {
      setLoading(true);
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, season }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error creando torneo');
      toast.success('Torneo creado');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo crear el torneo');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Confirmar: esto borrará jugadores, partidos, apariciones y torneos.')) return;
    try {
      setLoading(true);
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      toast.success('Datos reseteados');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo resetear la base');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <p>Panel de administracin.</p>
      <div className="mt-4 space-x-4">
        <Button asChild>
          <Link href="/admin/new-match">Nuevo Partido</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/import">Importar Datos</Link>
        </Button>
        <Button asChild>
          <Link href="/admin/theme">Configurar Theme</Link>
        </Button>
        <Button onClick={handleCreateTournament} disabled={loading}>
          Crear Torneo
        </Button>
        <Button variant="destructive" onClick={handleReset} disabled={loading}>
          Resetear Datos
        </Button>
      </div>
    </div>
  );
}