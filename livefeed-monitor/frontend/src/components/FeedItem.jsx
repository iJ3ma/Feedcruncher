import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Render a single live blog update item.
 * @param {{ item: { title: string; contentSnippet: string; link?: string; isoDate?: string; }, theme: string }} props
 * @returns {JSX.Element}
 */
const FeedItem = ({ item, theme }) => {
  const timeAgo = item.isoDate ? dayjs(item.isoDate).fromNow() : 'Just now';

  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{theme}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{item.contentSnippet}</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{timeAgo}</span>
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Open source
          </a>
        ) : null}
      </div>
    </article>
  );
};

export default FeedItem;
