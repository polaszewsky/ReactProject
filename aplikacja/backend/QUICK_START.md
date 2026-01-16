# Szybki Start - Krok po Kroku

## KROK 1: Konfiguracja Bazy Danych

### Opcja A: Używając pgAdmin (GUI)

1. Otwórz **pgAdmin** (zainstalowany z PostgreSQL)
2. Połącz się z serwerem (domyślne hasło: `postgres`)
3. Kliknij prawym na "Databases" → "Create" → "Database"
4. Nazwa: `car_rental`
5. Kliknij "Save"
6. Kliknij prawym na bazę `car_rental` → "Query Tool"
7. Otwórz plik `backend/database/schema.sql` i wklej zawartość
8. Kliknij "Execute" (F5)
9. Powtórz dla `backend/database/seed.sql`

### Opcja B: Używając SQL Shell (psql)

1. Otwórz **SQL Shell (psql)** z menu Start
2. Naciśnij Enter 4 razy (domyślne wartości)
3. Wpisz hasło: `postgres` (lub Twoje hasło)
4. Wpisz komendy:

```sql
CREATE DATABASE car_rental;
\c car_rental
\i C:/Users/Patryk/ReactProject/aplikacja/backend/database/schema.sql
\i C:/Users/Patryk/ReactProject/aplikacja/backend/database/seed.sql
```

## KROK 2: Konfiguracja Backend

1. Otwórz **PowerShell** lub **Command Prompt**
2. Przejdź do folderu backend:
```bash
cd C:\Users\Patryk\ReactProject\aplikacja\backend
```

3. Sprawdź plik `.env` - upewnij się że hasło PostgreSQL jest poprawne:
```
DB_PASSWORD=postgres
```
(Jeśli masz inne hasło, zmień je w pliku `.env`)

4. Uruchom backend:
```bash
npm run dev
```

Powinieneś zobaczyć:
```
✅ Connected to PostgreSQL database
🚗 Car Rental API server running on port 5000
```

**ZOSTAW TO OKNO OTWARTE!**

## KROK 3: Uruchomienie Frontend

1. Otwórz **NOWE** okno PowerShell/Command Prompt
2. Przejdź do głównego folderu:
```bash
cd C:\Users\Patryk\ReactProject\aplikacja
```

3. Uruchom frontend:
```bash
npm start
```

Aplikacja automatycznie otworzy się w przeglądarce na: **http://localhost:3000**

## Gotowe! 🎉

Teraz masz:
- Backend API działający na: http://localhost:5000
- Frontend działający na: http://localhost:3000

## Testowanie

1. Przejdź na http://localhost:3000
2. Kliknij "Samochody" - powinieneś zobaczyć listę 10 samochodów
3. Kliknij "Zarezerwuj" przy dowolnym samochodzie
4. Wypełnij formularz i wyślij

## Problemy?

### "Cannot connect to database"
- Sprawdź czy PostgreSQL jest uruchomiony
- Sprawdź hasło w pliku `backend/.env`

### "Port 5000 already in use"
- Zamknij inne aplikacje używające portu 5000
- Lub zmień port w `backend/.env` na inny (np. 5001)

### "Module not found"
- Uruchom `npm install` w obu folderach (głównym i backend)
