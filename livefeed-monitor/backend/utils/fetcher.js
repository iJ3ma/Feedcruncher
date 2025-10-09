const axios = require('axios');

/**
 * Fetches remote content with sane defaults for live feeds.
 * @param {string} url target URL
 * @returns {Promise<string>} response body as text
 */
const fetchRemoteContent = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'LiveFeedMonitor/1.0 (+https://example.com)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    timeout: 10000,
  });

  return response.data;
};

module.exports = {
  fetchRemoteContent,
};
