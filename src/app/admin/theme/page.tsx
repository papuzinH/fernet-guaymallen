'use client';

import { useState, useEffect } from 'react';
import ButtonWithLoader from '@/components/ui/ButtonWithLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Theme {
  id?: number;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

export default function ThemePage() {
  const [theme, setTheme] = useState<Theme>({ primaryColor: '#3b82f6', secondaryColor: '#1e40af' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    const response = await fetch('/api/theme');
    const data = await response.json();
    setTheme(data);
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
        setMessage('Theme updated successfully!');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configurar Theme</h1>

      <Card>
        <CardHeader>
          <CardTitle>Theme Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            {theme.logoUrl && (
              <img src={theme.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: theme.primaryColor }}
                ></div>
                <span>Primary: {theme.primaryColor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: theme.secondaryColor }}
                ></div>
                <span>Secondary: {theme.secondaryColor}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Actualizar Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo">Logo (imagen)</Label>
              <Input id="logo" name="logo" type="file" accept="image/*" />
            </div>

            <div>
              <Label htmlFor="primaryColor">Color Primario (HEX)</Label>
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                defaultValue={theme.primaryColor}
              />
            </div>

            <div>
              <Label htmlFor="secondaryColor">Color Secundario (HEX)</Label>
              <Input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                defaultValue={theme.secondaryColor}
              />
            </div>

            <ButtonWithLoader type="submit" loading={loading} loadingText="Guardando...">
              Guardar Theme
            </ButtonWithLoader>
          </CardContent>
        </Card>
      </form>

      {message && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <p className={message.includes('Error') ? 'text-red-500' : 'text-green-500'}>
              {message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}