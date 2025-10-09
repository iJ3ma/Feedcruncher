# LiveFeed Monitor

LiveFeed Monitor is a newsroom-friendly dashboard for tracking multiple liveblogs in real time. Journalists can add feeds from different outlets, group them by theme, and follow every update without jumping between tabs.

## Features

- 📡 **Real-time updates** via Socket.io, refreshing every 30 seconds
- 🗂️ **Theme grouping** and quick filtering for different coverage areas
- ✅ **Feed toggles** to pause noisy or irrelevant sources
- 🧩 **Grid view** powered by `react-grid-layout` for a customizable overview
- 📰 **RSS and HTML parsing** with `rss-parser` and `cheerio` fallbacks

## Project Structure

```
livefeed-monitor/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── routes/
│   │   └── feeds.js
│   └── utils/
│       ├── fetcher.js
│       └── parser.js
├── database/
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       │   ├── AddFeedForm.jsx
│       │   ├── FeedGrid.jsx
│       │   └── FeedItem.jsx
│       └── pages/
│           └── Dashboard.jsx
├── package.json
└── README.md
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install --workspaces
   ```

2. **Run the backend**

   ```bash
   npm run dev --workspace backend
   ```

   The backend starts on [http://localhost:4000](http://localhost:4000).

3. **Run the frontend**

   In a new terminal:

   ```bash
   npm run dev --workspace frontend
   ```

   The Vite dev server runs on [http://localhost:5173](http://localhost:5173).

4. **Add liveblog URLs**

   Use the "Feed URL" form to register liveblogs. Assign a theme (e.g., Politics, Sports) to keep feeds organized.

## Environment Variables

- `PORT`: Override the backend port (defaults to `4000`).
- `VITE_API_BASE_URL`: Configure the frontend to point to a remote backend (defaults to `http://localhost:4000`).

## Database Schema

A starter PostgreSQL schema is provided in `database/schema.sql` for production-ready storage. The current implementation uses an in-memory store for simplicity.

## Testing & Debugging Tips

- Backend logging reports failed fetches and parsing errors.
- Use mock RSS feeds locally to experiment with layouts.
- Toggle feeds off to pause updates without removing the source.

## Future Enhancements

- Automated AI summaries per theme group
- User authentication and saved dashboards
- Push notifications on major updates
- Dark mode and layout persistence via `localStorage`
