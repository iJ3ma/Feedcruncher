import { Responsive, WidthProvider } from 'react-grid-layout';
import FeedItem from './FeedItem.jsx';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Build a responsive layout description for the provided feeds.
 * @param {Array} feeds list of feed metadata and items
 * @returns {Record<string, Array>}
 */
const buildLayouts = (feeds) => {
  const baseLayout = [];

  feeds.forEach((feed, feedIndex) => {
    feed.items.slice(0, 6).forEach((item, itemIndex) => {
      const gridIndex = feedIndex * 6 + itemIndex;
      baseLayout.push({
        i: `${feed.id}-${itemIndex}`,
        x: (gridIndex * 4) % 12,
        y: Math.floor((gridIndex * 4) / 12),
        w: 4,
        h: 4,
      });
    });
  });

  const clone = () => baseLayout.map((item) => ({ ...item }));

  return {
    lg: clone(),
    md: clone(),
    sm: clone(),
    xs: clone(),
    xxs: clone(),
  };
};

/**
 * Grid wrapper for displaying the most recent updates.
 * @param {{ feeds: Array }} props
 * @returns {JSX.Element}
 */
const FeedGrid = ({ feeds }) => {
  const layouts = buildLayouts(feeds);
  const items = feeds.flatMap((feed) => feed.items.slice(0, 6).map((item, index) => ({ feed, item, index })));

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-12 text-center text-slate-500">
        Waiting for live updates. Add a feed to begin monitoring.
      </div>
    );
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={40}
      isDraggable
      isResizable
      margin={[16, 16]}
      compactType="vertical"
    >
      {items.map(({ feed, item, index }) => (
        <div key={`${feed.id}-${index}`} className="h-full">
          <FeedItem item={item} theme={feed.theme} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default FeedGrid;
