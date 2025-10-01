const express = require('express');
const cors = require('cors');
const feedsRouter = require('./routes/feeds');

const app = express();
const PORT = process.env.PORT || 4000;

// Global middleware: enable CORS and JSON parsing for incoming payloads
app.use(cors());
app.use(express.json());

// Mount feed routes under /api/feeds
app.use('/api/feeds', feedsRouter);

// Basic heartbeat endpoint for debugging
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Feedcruncher backend listening on port ${PORT}`);
});
