# Instrukcje Uruchomienia - Serwis Wynajmu Samochodów

## Wymagania Wstępne

1. **Node.js** (wersja 16 lub nowsza)
2. **PostgreSQL** (wersja 12 lub nowsza)
3. **npm** lub **yarn**

## Krok 1: Konfiguracja Bazy Danych PostgreSQL

### Instalacja PostgreSQL (jeśli nie masz)
Pobierz i zainstaluj PostgreSQL z: https://www.postgresql.org/download/windows/

### Utworzenie Bazy Danych

1. Otwórz **pgAdmin** lub **psql** (SQL Shell)

2. Zaloguj się jako użytkownik postgres (domyślne hasło: postgres)

3. Utwórz nową bazę danych:
```sql
CREATE DATABASE car_rental;
```

4. Połącz się z bazą:
```sql
\c car_rental
```

5. Uruchom skrypty SQL (w kolejności):

**Schema (struktura tabel):**
```bash
# W pgAdmin: Tools -> Query Tool, następnie otwórz plik:
backend/database/schema.sql
# i wykonaj (F5)
```

**Seed (dane testowe):**
```bash
# W pgAdmin: Tools -> Query Tool, następnie otwórz plik:
backend/database/seed.sql
# i wykonaj (F5)
```

### Konfiguracja Połączenia

Edytuj plik `backend/.env` i ustaw swoje dane:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=twoje_haslo_postgres
DB_NAME=car_rental
```

## Krok 2: Instalacja Zależności Backend

```bash
cd backend
npm install
```

## Krok 3: Instalacja Zależności Frontend

```bash
# Wróć do głównego folderu projektu
cd ..
npm install
```

## Krok 4: Uruchomienie Aplikacji

### Terminal 1 - Backend (port 5000)
```bash
cd backend
npm run dev
```

Powinieneś zobaczyć:
```
✅ Connected to PostgreSQL database
🚗 Car Rental API server running on port 5000
```

### Terminal 2 - Frontend (port 3000)
```bash
# W głównym folderze projektu
npm start
```

Aplikacja otworzy się automatycznie w przeglądarce: http://localhost:3000

## Testowanie API

Możesz przetestować API bezpośrednio:

- **Lista samochodów:** http://localhost:5000/api/cars
- **Health check:** http://localhost:5000/api/health
- **Rezerwacje:** http://localhost:5000/api/reservations

## Rozwiązywanie Problemów

### Problem: "Cannot connect to database"
- Sprawdź czy PostgreSQL jest uruchomiony
- Zweryfikuj dane w pliku `.env`
- Upewnij się, że baza `car_rental` istnieje

### Problem: "Port 5000 already in use"
- Zmień port w `backend/.env`: `PORT=5001`
- Zaktualizuj proxy w `package.json`: `"proxy": "http://localhost:5001"`

### Problem: "Module not found"
- Usuń folder `node_modules` i `package-lock.json`
- Uruchom ponownie `npm install`

## Struktura Projektu

```
aplikacja/
├── backend/
│   ├── config/
│   │   └── database.js          # Konfiguracja PostgreSQL
│   ├── database/
│   │   ├── schema.sql            # Struktura tabel
│   │   └── seed.sql              # Dane testowe
│   ├── routes/
│   │   ├── cars.js               # API samochodów
│   │   └── reservations.js       # API rezerwacji
│   ├── .env                      # Zmienne środowiskowe
│   ├── server.js                 # Główny plik serwera
│   └── package.json
├── src/
│   ├── components/               # Komponenty React
│   ├── pages/                    # Strony aplikacji
│   ├── App.js                    # Główny komponent
│   └── index.css                 # System designu
└── package.json
```

## Funkcjonalności

✅ Przeglądanie dostępnych samochodów
✅ Filtrowanie po kategorii i cenie
✅ Rezerwacja online z formularzem
✅ Walidacja dat i konfliktów rezerwacji
✅ Automatyczna kalkulacja ceny
✅ Responsywny design
✅ Nowoczesny interfejs z animacjami

## Następne Kroki

- Dodaj autentykację użytkowników
- Implementuj panel administracyjny
- Dodaj płatności online
- Rozbuduj system powiadomień email
