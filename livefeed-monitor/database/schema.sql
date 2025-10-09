-- Table structure for storing monitored feeds
CREATE TABLE IF NOT EXISTS feeds (
    id UUID PRIMARY KEY,
    url TEXT NOT NULL,
    theme TEXT DEFAULT 'General',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_fetched_at TIMESTAMPTZ,
    error TEXT
);

-- Table for cached feed items
CREATE TABLE IF NOT EXISTS feed_items (
    id UUID PRIMARY KEY,
    feed_id UUID REFERENCES feeds(id) ON DELETE CASCADE,
    title TEXT,
    link TEXT,
    content_snippet TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW()
);
