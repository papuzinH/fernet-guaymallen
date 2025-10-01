'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import ButtonWithLoader from '@/components/ui/ButtonWithLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParsedData {
  players: any[];
  matches: any[];
  appearances: any[];
}

export default function ImportPage() {
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
        console.log(`Parsed ${type} CSV:`, results.data.slice(0, 3)); // Log first 3 rows
        console.log(`Parsed ${type} errors:`, results.errors);
        console.log(`Parsed ${type} meta:`, results.meta);
        // Filter out empty rows
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Importar Datos</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Admin Secret</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="admin-secret">Ingresa el Admin Secret</Label>
          <Input
            id="admin-secret"
            type="password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            placeholder="Admin Secret"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Players CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="players-file">Seleccionar archivo</Label>
            <Input
              id="players-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange('players')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matches CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="matches-file">Seleccionar archivo</Label>
            <Input
              id="matches-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange('matches')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearances CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="appearances-file">Seleccionar archivo</Label>
            <Input
              id="appearances-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange('appearances')}
            />
          </CardContent>
        </Card>
      </div>

  <ButtonWithLoader onClick={generateSummary} className="mb-4">Generar Resumen</ButtonWithLoader>

      {summary && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Resumen de Importación</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{summary}</pre>
          </CardContent>
        </Card>
      )}

      <ButtonWithLoader onClick={handleImport} loading={loading} loadingText="Importando..." className="mb-4">
        Importar
      </ButtonWithLoader>

      {message && (
        <Card>
          <CardContent className="pt-6">
            <p className={message.includes('Error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}>
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ejemplos de CSV</h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>players.csv</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
{`fullName,nickname,dorsal,position,joinedAt,isActive,photoUrl
Juan Pérez,JuanP,10,FW,2023-01-01,true,https://example.com/juan.jpg
María García,MariaG,5,DEF,2022-06-15,true,`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>matches.csv</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
{`date,opponent,ourScore,theirScore,result,tournament,season,organizer,location,notes
2024-09-01,Rival FC,2,1,WIN,Liga Local,2024-2025,Fernet Guaymallén,Estadio Principal,Gran partido
2024-09-08,Otro Equipo,1,1,DRAW,Copa Regional,2024,Federación Mendoza,Estadio Visitante,`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>appearances.csv</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm">
{`matchDate,opponent,playerNickname,isStarter,minutes,goals,assists,yellow,red,motm
2024-09-01,Rival FC,JuanP,true,90,1,0,false,false,true
2024-09-01,Rival FC,MariaG,true,90,0,1,false,false,false`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}