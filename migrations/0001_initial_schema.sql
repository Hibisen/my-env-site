CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme TEXT,
  category TEXT,
  subcategory TEXT,
  country TEXT,
  industry TEXT,
  term TEXT,
  affiliate_url TEXT,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_type ON posts(type);
CREATE INDEX idx_theme ON posts(theme);
CREATE INDEX idx_category ON posts(category);
CREATE INDEX idx_country ON posts(country);
CREATE INDEX idx_industry ON posts(industry);
CREATE INDEX idx_term ON posts(term);
CREATE INDEX idx_created_at ON posts(created_at DESC);
