DROP TABLE IF EXISTS locations, weathers, events;

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    search_query TEXT,
    formatted_query TEXT,
    latitude DECIMAL,
    longitude DECIMAL
);

CREATE TABLE IF NOT EXISTS weathers (
    id SERIAL PRIMARY KEY,
    forecast TEXT,
    time VARCHAR(255),
    created_at VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    link TEXT, 
    name TEXT,
    event_date VARCHAR(255),
    summary TEXT
);