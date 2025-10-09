import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import AddFeedForm from '../components/AddFeedForm.jsx';
import FeedGrid from '../components/FeedGrid.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Dashboard page containing feed management tools and the update grid.
 * @returns {JSX.Element}
 */
const Dashboard = () => {
  const [feeds, setFeeds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('All');

  useEffect(() => {
    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
    });
    socket.on('feeds:update', (payload) => {
      setFeeds(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/feeds`);
        setFeeds(response.data.feeds);
      } catch (loadError) {
        setError('Unable to load feeds. Please ensure the backend is running.');
      }
    };

    loadFeeds();
  }, []);

  const handleAddFeed = async ({ url, theme }) => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/add`, { url, theme });
      setError(null);
      return { success: true };
    } catch (addError) {
      const message = addError.response?.data?.error || 'Failed to add feed.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeed = async (feedId) => {
    try {
      await axios.patch(`${API_BASE_URL}/feeds/${feedId}/toggle`);
    } catch (toggleError) {
      setError(toggleError.response?.data?.error || 'Unable to toggle feed.');
    }
  };

  const availableThemes = useMemo(() => ['All', ...new Set(feeds.map((feed) => feed.theme))], [feeds]);

  const filteredFeeds = useMemo(
    () => (selectedTheme === 'All' ? feeds : feeds.filter((feed) => feed.theme === selectedTheme)),
    [feeds, selectedTheme]
  );

  return (
    <div className="min-h-screen bg-slate-100/80 pb-12">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">LiveFeed Monitor</h1>
            <p className="text-sm text-slate-600">
              Track every newsroom liveblog in one unified, real-time dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="theme-filter" className="text-sm font-medium text-slate-600">
              Theme filter
            </label>
            <select
              id="theme-filter"
              value={selectedTheme}
              onChange={(event) => setSelectedTheme(event.target.value)}
              className="rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              {availableThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 px-6">
        <AddFeedForm onSubmit={handleAddFeed} isSubmitting={isSubmitting} />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <section className="rounded-lg bg-white/80 p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-800">Feeds</h2>
          <ul className="mt-4 space-y-3">
            {feeds.map((feed) => (
              <li key={feed.id} className="flex flex-col gap-2 rounded border border-slate-200 p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-slate-800">{feed.url}</p>
                  <p className="text-xs text-slate-500">Theme: {feed.theme}</p>
                  {feed.error ? <p className="text-xs text-rose-600">{feed.error}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${feed.active ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {feed.active ? 'Active' : 'Paused'}
                  </span>
                  <button
                    onClick={() => handleToggleFeed(feed.id)}
                    className="rounded border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600"
                  >
                    Toggle
                  </button>
                </div>
              </li>
            ))}
            {!feeds.length ? (
              <li className="rounded border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No feeds yet. Add a URL to start monitoring live updates.
              </li>
            ) : null}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Live updates</h2>
          <FeedGrid feeds={filteredFeeds} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
