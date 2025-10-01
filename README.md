# Feedcruncher

Feedcruncher er et todelt skelet til en moderne feed-aggregator, der demonstrerer hvordan data fra Telegram, X (Twitter), Facebook og Bluesky kan samles i én interaktiv webapp. Projektet leveres med en Node.js/Express-backend, der udsender dummy data, og en React/Vite-frontend med TailwindCSS og `react-grid-layout` for drag-n-drop dashboards.

## Projektstruktur

```
feedcruncher/
├── backend/
│   ├── package.json
│   ├── routes/
│   │   └── feeds.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       └── components/
│           └── FeedBubble.jsx
└── README.md
```

## Forudsætninger

- Node.js 18 eller nyere
- npm 9 eller nyere

## Kom godt i gang

Installer afhængigheder og start backend og frontend i hver sin terminal.

### Backend (port 4000)

```bash
cd backend
npm install
npm run dev
```

API'et er tilgængeligt på `http://localhost:4000/api/feeds` og returnerer dummy data med felterne `id`, `platform`, `theme` og `text`.

### Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Frontend-appen anvender Vite og TailwindCSS. Når både frontend og backend kører, vil UI'et automatisk hente feeds fra backend og vise dem som fleksible “bobler” i et responsivt grid, der kan trækkes og ændres i størrelse.

## Tilpasning og næste skridt

- Tilføj rigtige API-klienter i `backend/routes/feeds.js` og map data til det eksisterende format.
- Udskift dummy layoutet i `frontend/src/App.jsx` med et layout baseret på brugerens præferencer.
- Tilføj auth, caching eller websockets for ægte real-time oplevelse.

## Licens

MIT