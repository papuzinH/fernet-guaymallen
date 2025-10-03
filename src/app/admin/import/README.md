# Importación de Datos

## Formato de Archivos CSV

### 1. Players CSV
Campos requeridos:
- `fullName` (string): Nombre completo del jugador
- `nickname` (string): Apodo del jugador (único)
- `position` (string): Posición del jugador (GK, DEF_CENTRAL, DEF_LATERAL, MID_CENTRAL, VOLANTE, MID_OFENSIVO, DELANTERO, OTHER)
- `dorsal` (number, opcional): Número de camiseta
- `joinedAt` (date, opcional): Fecha de ingreso (formato: YYYY-MM-DD)
- `isActive` (boolean, opcional): Si el jugador está activo (true/false)
- `photoUrl` (string, opcional): URL de la foto del jugador
- `birthDate` (date, opcional): Fecha de nacimiento (formato: YYYY-MM-DD)
- `bio` (string, opcional): Biografía del jugador

### 2. Matches CSV
Campos requeridos:
- `date` (date): Fecha del partido (formato: YYYY-MM-DD)
- `opponent` (string): Nombre del rival
- `ourScore` (number): Goles a favor
- `theirScore` (number): Goles en contra
- `result` (string): Resultado (WIN, DRAW, LOSS)
- `tournament` (string): Nombre del torneo
- `organizer` (string, opcional): Organizador del torneo
- `location` (string, opcional): Ubicación del partido
- `notes` (string, opcional): Notas adicionales

### 3. Appearances CSV
Campos requeridos:
- `matchDate` (date): Fecha del partido (formato: YYYY-MM-DD)
- `opponent` (string): Nombre del rival
- `playerNickname` (string): Apodo del jugador
- `isStarter` (boolean): Si fue titular (true/false)
- `goals` (number): Goles marcados
- `assists` (number, opcional): Asistencias
- `yellow` (boolean, opcional): Tarjeta amarilla (true/false)
- `red` (boolean, opcional): Tarjeta roja (true/false)

## Notas Importantes

1. **Orden de importación**: Los archivos se procesan en el siguiente orden:
   - Players (primero)
   - Matches (segundo)
   - Appearances (tercero)

2. **Validaciones**:
   - Los jugadores se identifican por `nickname` (debe ser único)
   - Los partidos se identifican por `date` + `opponent`
   - Las apariciones se vinculan a jugadores y partidos existentes

3. **Campos opcionales**: Si no se proporcionan, se usarán valores por defecto o null

4. **Formato de fechas**: Todas las fechas deben estar en formato ISO (YYYY-MM-DD)

5. **Booleanos**: Los valores booleanos pueden ser "true"/"false" (string) o true/false (boolean)

## Ejemplo de uso

1. Preparar los archivos CSV con los formatos especificados
2. Acceder a `/admin/import`
3. Ingresar el Admin Secret
4. Seleccionar los archivos CSV
5. Revisar el resumen de datos
6. Ejecutar la importación
