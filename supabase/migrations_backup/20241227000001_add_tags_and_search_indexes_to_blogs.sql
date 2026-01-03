-- Add tags column to blogs table
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create indexes for search functionality
-- Index for author (simple text matching)
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs(author) WHERE author IS NOT NULL;

-- GIN index for tags array search
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON public.blogs USING GIN(tags) WHERE tags IS NOT NULL;

-- GIN indexes for full-text search on text fields
CREATE INDEX IF NOT EXISTS idx_blogs_title_gin ON public.blogs USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_blogs_excerpt_gin ON public.blogs USING GIN(to_tsvector('english', excerpt)) WHERE excerpt IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blogs_content_gin ON public.blogs USING GIN(to_tsvector('english', content)) WHERE content IS NOT NULL;

-- Combined full-text search index for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_search_fulltext ON public.blogs USING GIN(
  to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(excerpt, '') || ' ' || 
    COALESCE(content, '') || ' ' ||
    COALESCE(author, '')
  )
);

-- Index for case-insensitive search on individual fields (alternative approach)
CREATE INDEX IF NOT EXISTS idx_blogs_title_lower ON public.blogs(lower(title));
CREATE INDEX IF NOT EXISTS idx_blogs_author_lower ON public.blogs(lower(author)) WHERE author IS NOT NULL;

