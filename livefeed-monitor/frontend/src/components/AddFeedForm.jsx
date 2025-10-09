import { useState } from 'react';

/**
 * Form for adding new live blog URLs and assigning a theme.
 * @param {{ onSubmit: (payload: { url: string; theme: string }) => Promise<void>, isSubmitting: boolean }} props
 * @returns {JSX.Element}
 */
const AddFeedForm = ({ onSubmit, isSubmitting }) => {
  const [url, setUrl] = useState('');
  const [theme, setTheme] = useState('General');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    setError(null);
    try {
      await onSubmit({ url: url.trim(), theme: theme.trim() || 'General' });
    } catch (submitError) {
      setError(submitError.message || 'Unable to add feed.');
      return;
    }
    setUrl('');
    setTheme('General');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-wrap gap-3 rounded-lg bg-white/80 p-4 shadow"
    >
      <div className="flex min-w-[240px] flex-1 flex-col">
        <label htmlFor="feed-url" className="text-sm font-semibold text-slate-600">
          Feed URL
        </label>
        <input
          id="feed-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/live"
          className="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          required
        />
      </div>
      <div className="flex min-w-[180px] flex-col">
        <label htmlFor="feed-theme" className="text-sm font-semibold text-slate-600">
          Theme
        </label>
        <input
          id="feed-theme"
          type="text"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          placeholder="Politics"
          className="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Adding…' : 'Add Feed'}
        </button>
      </div>
      {error ? <p className="basis-full text-sm text-rose-600">{error}</p> : null}
    </form>
  );
};

export default AddFeedForm;
