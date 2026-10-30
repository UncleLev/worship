-- Create the songs table
CREATE TABLE IF NOT EXISTS songs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT,
    lyrics TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for the anon key used at build time)
CREATE POLICY "Allow public read access"
    ON songs
    FOR SELECT
    TO anon
    USING (true);
