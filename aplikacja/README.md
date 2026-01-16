# Serwis Wynajmu Samochodów Służbowych 🚗

Kompletny system wynajmu samochodów służbowych z React, Express.js i PostgreSQL.

## 🎯 Funkcjonalności

- ✅ Przeglądanie floty pojazdów
- ✅ Filtrowanie po kategorii i cenie
- ✅ Rezerwacja online z formularzem
- ✅ Automatyczna kalkulacja ceny
- ✅ Walidacja konfliktów rezerwacji
- ✅ Responsywny design
- ✅ Nowoczesny interfejs z animacjami

## 🏗️ Architektura

```
React Frontend (port 3000)
    ↓ HTTP
Express API (port 5000)
    ↓ SQL
PostgreSQL Database
```

## 🚀 Szybki Start

### 1. Baza Danych
```sql
-- W PostgreSQL
CREATE DATABASE car_rental;
\c car_rental
\i backend/database/schema.sql
\i backend/database/seed.sql
```

### 2. Backend
```bash
cd backend
# Edytuj .env z danymi PostgreSQL
npm install
npm run dev
```

### 3. Frontend
```bash
npm install
npm start
```

Aplikacja: http://localhost:3000

## 📚 Dokumentacja

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Szczegółowe instrukcje instalacji
- **[walkthrough.md](./.gemini/antigravity/brain/.../walkthrough.md)** - Pełny opis projektu

## 🛠️ Technologie

**Backend:** Node.js, Express.js, PostgreSQL  
**Frontend:** React, React Router, Axios  
**Styling:** CSS Variables, Gradients, Animations

## 📁 Struktura

```
├── backend/              # Express API
│   ├── config/          # Konfiguracja DB
│   ├── routes/          # API endpoints
│   ├── database/        # SQL scripts
│   └── server.js
├── src/
│   ├── components/      # React components
│   ├── pages/           # Strony aplikacji
│   └── index.css        # Design system
└── package.json
```

## 🎨 Design

- Gradient theme (fioletowo-niebieski)
- Glassmorphism effects
- Smooth animations
- Mobile-first responsive

## 📝 API Endpoints

- `GET /api/cars` - Lista samochodów
- `POST /api/reservations` - Utworzenie rezerwacji
- `GET /api/health` - Status serwera

---

**Autor:** CarRentalPro  
**Licencja:** MIT

