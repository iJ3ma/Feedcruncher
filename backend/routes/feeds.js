const express = require('express');

const router = express.Router();

// Dummy feed payload representing aggregated updates from multiple platforms.
// In production this would be fetched from each platform's API.
const dummyFeeds = [
  {
    id: 'tg-1',
    platform: 'Telegram',
    theme: 'bg-blue-500',
    text: 'Telegram community dropped a new update summary for October.'
  },
  {
    id: 'tw-1',
    platform: 'X (Twitter)',
    theme: 'bg-slate-800',
    text: 'Breaking: Our latest feature rollout is trending across X! #Feedcruncher'
  },
  {
    id: 'fb-1',
    platform: 'Facebook',
    theme: 'bg-indigo-600',
    text: 'Join our Facebook Live AMA this Friday at 6 PM CET.'
  },
  {
    id: 'bs-1',
    platform: 'Bluesky',
    theme: 'bg-sky-500',
    text: 'Bluesky beta testers share first impressions of the new integration.'
  }
];

router.get('/', (_req, res) => {
  res.json(dummyFeeds);
});

module.exports = router;
