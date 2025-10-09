const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const createFeedsRouter = require('./routes/feeds');
const { parseFeedFromUrl } = require('./utils/parser');

// In-memory store for feeds
const feeds = new Map();

/**
 * Builds the JSON serializable representation of the current feed store.
 * @returns {Array} list of feed objects with latest items.
 */
const serializeFeeds = () =>
  Array.from(feeds.values()).map(({ timer, ...rest }) => ({ ...rest }));

/**
 * Refresh a single feed and broadcast updates to connected clients.
 * @param {string} id feed identifier
 * @param {object} feedData feed metadata and cached items
 * @param {Server} io socket.io server instance
 */
const refreshFeed = async (id, feedData, io) => {
  if (!feedData.active) {
    return;
  }

  try {
    const items = await parseFeedFromUrl(feedData.url);
    feeds.set(id, { ...feedData, items, lastFetchedAt: new Date().toISOString() });
    io.emit('feeds:update', serializeFeeds());
  } catch (error) {
    console.error(`Failed to refresh feed ${id}:`, error.message);
    feeds.set(id, {
      ...feedData,
      error: `Failed to refresh feed: ${error.message}`,
      lastFetchedAt: new Date().toISOString(),
    });
    io.emit('feeds:update', serializeFeeds());
  }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Socket.io connection handler
io.on('connection', (socket) => {
  socket.emit('feeds:update', serializeFeeds());
});

// Register routes
app.use('/', createFeedsRouter({ feeds, refreshFeed, io, serializeFeeds }));

// Background interval refresh for all feeds every 30 seconds
setInterval(() => {
  feeds.forEach((feedData, id) => {
    refreshFeed(id, feedData, io);
  });
}, 30 * 1000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`LiveFeed Monitor backend listening on port ${PORT}`);
});
