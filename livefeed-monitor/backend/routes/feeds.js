const express = require('express');
const { v4: uuid } = require('uuid');
const { parseFeedFromUrl } = require('../utils/parser');

/**
 * Creates the feeds router with injected dependencies.
 * @param {Object} deps dependencies for the router
 * @param {Map} deps.feeds in-memory feed store
 * @param {Function} deps.refreshFeed function to refresh a feed by id
 * @param {import('socket.io').Server} deps.io socket.io server instance
 * @param {Function} deps.serializeFeeds helper to serialize feed data
 * @returns {express.Router}
 */
const createFeedsRouter = ({ feeds, refreshFeed, io, serializeFeeds }) => {
  const router = express.Router();

  /**
   * GET /feeds - Retrieve all stored feeds and metadata.
   */
  router.get('/feeds', (req, res) => {
    res.json({ feeds: serializeFeeds() });
  });

  /**
   * POST /add - Add a new feed URL with optional theme label.
   */
  router.post('/add', async (req, res) => {
    const { url, theme = 'General' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    const id = uuid();
    const feedData = {
      id,
      url,
      theme,
      active: true,
      items: [],
      createdAt: new Date().toISOString(),
      lastFetchedAt: null,
    };

    feeds.set(id, feedData);

    try {
      const items = await parseFeedFromUrl(url);
      const hydratedFeed = { ...feedData, items, lastFetchedAt: new Date().toISOString() };
      feeds.set(id, hydratedFeed);
      io.emit('feeds:update', serializeFeeds());
      res.status(201).json({ feed: hydratedFeed });
    } catch (error) {
      const erroredFeed = {
        ...feedData,
        active: false,
        error: `Unable to parse feed: ${error.message}`,
        lastFetchedAt: new Date().toISOString(),
      };
      feeds.set(id, erroredFeed);
      io.emit('feeds:update', serializeFeeds());
      res.status(500).json({ error: erroredFeed.error });
    }
  });

  /**
   * PATCH /feeds/:id/toggle - Enable or disable feed updates.
   */
  router.patch('/feeds/:id/toggle', (req, res) => {
    const { id } = req.params;
    const feed = feeds.get(id);

    if (!feed) {
      return res.status(404).json({ error: 'Feed not found.' });
    }

    const updatedFeed = { ...feed, active: !feed.active };
    feeds.set(id, updatedFeed);

    if (updatedFeed.active) {
      refreshFeed(id, updatedFeed, io);
    } else {
      io.emit('feeds:update', serializeFeeds());
    }

    res.json({ feed: updatedFeed });
  });

  return router;
};

module.exports = createFeedsRouter;
