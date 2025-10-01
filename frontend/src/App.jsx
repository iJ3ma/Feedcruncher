import { useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FeedBubble from './components/FeedBubble.jsx';

const ResponsiveGridLayout = WidthProvider(Responsive);
const API_URL = 'http://localhost:4000/api/feeds';

const buildLayouts = (feeds) => {
  const calculateLayout = (cols, height = 3) => {
    const span = Math.max(2, Math.floor(cols / 3));

    return feeds.map((feed, index) => ({
      i: feed.id,
      x: (index * span) % cols,
      y: Math.floor((index * span) / cols) * height,
      w: Math.min(span, cols),
      h: height,
      minW: Math.min(span, 2),
      minH: 2
    }));
  };

  return {
    lg: calculateLayout(12, 3),
    md: calculateLayout(10, 3),
    sm: calculateLayout(6, 4),
    xs: calculateLayout(4, 4),
    xxs: calculateLayout(2, 4)
  };
};

export default function App() {
  const [feeds, setFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadFeeds = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setFeeds(data);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load feeds', err);
          setError('Kunne ikke hente feed data. Prøv igen senere.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFeeds();
    const intervalId = setInterval(loadFeeds, 30_000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, []);

  const layouts = useMemo(() => buildLayouts(feeds), [feeds]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Feedcruncher</p>
            <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">Samlet feed fra dine vigtigste netværk</h1>
          </div>
          <div className="inline-flex items-center gap-2 self-center rounded-full bg-slate-900/70 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-slate-900/40 ring-1 ring-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Real-time dummy data
          </div>
        </header>

        {isLoading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-300">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
              <p>Henter feeds…</p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 576, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            margin={[16, 16]}
            draggableHandle=".drag-handle"
            draggableCancel=".non-draggable"
            isDraggable
            isResizable
            compactType="vertical"
          >
            {feeds.map((feed) => (
              <div key={feed.id} className="focus:outline-none">
                <FeedBubble feed={feed} />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>
    </div>
  );
}
