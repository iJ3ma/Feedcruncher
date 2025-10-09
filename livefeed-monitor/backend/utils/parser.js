const Parser = require('rss-parser');
const cheerio = require('cheerio');
const { fetchRemoteContent } = require('./fetcher');

const rssParser = new Parser();

/**
 * Normalizes RSS items to the dashboard-friendly shape.
 * @param {Array} items raw RSS items
 * @returns {Array}
 */
const normalizeRssItems = (items = []) =>
  items.slice(0, 25).map((item) => ({
    title: item.title || 'Untitled update',
    link: item.link || item.guid || null,
    contentSnippet: item.contentSnippet || item.content || '',
    isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
  }));

/**
 * Attempts to parse live updates from HTML markup.
 * @param {string} html raw html string
 * @param {string} url source url for fallback link resolution
 * @returns {Array}
 */
const parseFromHtml = (html, url) => {
  const $ = cheerio.load(html);
  const candidates = [];

  $('article, .live, .live-update, li, .post').each((_, element) => {
    const node = $(element);
    const title = node.find('h1, h2, h3').first().text().trim();
    const timestamp = node.find('time').first().attr('datetime') || new Date().toISOString();
    const description = node.find('p').map((__, p) => $(p).text().trim()).get().filter(Boolean).join(' ');
    const link = node.find('a').first().attr('href');

    if (title || description) {
      candidates.push({
        title: title || description.substring(0, 80) || 'Live update',
        link: link ? new URL(link, url).toString() : url,
        contentSnippet: description,
        isoDate: timestamp,
      });
    }
  });

  return candidates.slice(0, 25);
};

/**
 * Parses a feed from the provided URL via RSS or HTML fallback.
 * @param {string} url remote feed url
 * @returns {Promise<Array>} formatted feed items
 */
const parseFeedFromUrl = async (url) => {
  try {
    const feed = await rssParser.parseURL(url);
    if (feed && feed.items && feed.items.length > 0) {
      return normalizeRssItems(feed.items);
    }
  } catch (rssError) {
    console.warn(`RSS parsing failed for ${url}, falling back to HTML:`, rssError.message);
  }

  const html = await fetchRemoteContent(url);
  const parsedItems = parseFromHtml(html, url);

  if (!parsedItems.length) {
    throw new Error('No updates could be extracted from the feed.');
  }

  return parsedItems;
};

module.exports = {
  parseFeedFromUrl,
};
