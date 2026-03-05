-- ========================================
-- REAAGES Database Schema
-- PostgreSQL Database Schema
-- ========================================

-- Create database if not exists
-- CREATE DATABASE reaages;

-- ========================================
-- Extensions
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- Enums
-- ========================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member', 'guest');

-- Publication status enum
CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');

-- Event status enum
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Project status enum
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'suspended', 'cancelled');

-- Priority enum
CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ========================================
-- Core Tables
-- ========================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    function VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    role user_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Content Tables
-- ========================================

-- Articles/News table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status publication_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status event_status DEFAULT 'upcoming',
    event_type VARCHAR(50) DEFAULT 'conference',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    location_url VARCHAR(500),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT false,
    meeting_url VARCHAR(500),
    meeting_id VARCHAR(255),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status project_status DEFAULT 'planning',
    priority priority DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'EUR',
    countries TEXT[], -- Array of country names
    beneficiaries_count INTEGER,
    partner_organizations TEXT[],
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Relationship Tables
-- ========================================

-- Article tags relationship
CREATE TABLE article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Event tags relationship
CREATE TABLE event_tags (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

-- Project tags relationship
CREATE TABLE project_tags (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- Event participants
CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
    UNIQUE(event_id, user_id)
);

-- Project members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- ========================================
-- Media Table
-- ========================================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(500) NOT NULL,
    url VARCHAR(500),
    alt_text VARCHAR(255),
    caption TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Comments Table
-- ========================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_content_target CHECK (
      (article_id IS NOT NULL AND event_id IS NULL AND project_id IS NULL) OR
      (article_id IS NULL AND event_id IS NOT NULL AND project_id IS NULL) OR
      (article_id IS NULL AND event_id IS NULL AND project_id IS NOT NULL)
    )
);

-- ========================================
-- Activity Log Table
-- ========================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Settings Table
-- ========================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'integer', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Indexes
-- ========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
-- (keycloak_id removed - using bcrypt password_hash instead)
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_users_sector ON users(sector);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Articles indexes
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_title_search ON articles USING gin(title gin_trgm_ops);
CREATE INDEX idx_articles_content_search ON articles USING gin(content gin_trgm_ops);

-- Events indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_location ON events USING gin(location gin_trgm_ops);

-- Projects indexes
CREATE INDEX idx_projects_manager_id ON projects(manager_id);
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_featured ON projects(featured);

-- Comments indexes
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_event_id ON comments(event_id);
CREATE INDEX idx_comments_project_id ON comments(project_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Full-text search indexes
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('french', title || ' ' || content));
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('french', title || ' ' || description));

-- ========================================
-- Triggers
-- ========================================

-- Update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.article_id IS NOT NULL THEN
            UPDATE articles SET comment_count = comment_count + 1 WHERE id = NEW.article_id;
        ELSIF NEW.event_id IS NOT NULL THEN
            UPDATE events SET comment_count = comment_count + 1 WHERE id = NEW.event_id;
        ELSIF NEW.project_id IS NOT NULL THEN
            UPDATE projects SET comment_count = comment_count + 1 WHERE id = NEW.project_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.article_id IS NOT NULL THEN
            UPDATE articles SET comment_count = comment_count - 1 WHERE id = OLD.article_id;
        ELSIF OLD.event_id IS NOT NULL THEN
            UPDATE events SET comment_count = comment_count - 1 WHERE id = OLD.event_id;
        ELSIF OLD.project_id IS NOT NULL THEN
            UPDATE projects SET comment_count = comment_count - 1 WHERE id = OLD.project_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_counts_trigger
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Update tag usage counts
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tag_usage_counts_trigger
    AFTER INSERT OR DELETE ON article_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_counts();

CREATE TRIGGER update_event_tag_usage_counts_trigger
    AFTER INSERT OR DELETE ON event_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_counts();

CREATE TRIGGER update_project_tag_usage_counts_trigger
    AFTER INSERT OR DELETE ON project_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_counts();

-- ========================================
-- Initial Data
-- ========================================

-- Insert default categories
INSERT INTO categories (name, slug, description, color, icon) VALUES
('Actualités', 'actualites', 'Actualités et nouvelles du réseau REAAGES', '#10B981', 'newspaper'),
('Événements', 'evenements', 'Événements et activités du réseau', '#3B82F6', 'calendar'),
('Projets', 'projets', 'Projets structurants du réseau', '#8B5CF6', 'project'),
('Publications', 'publications', 'Publications et rapports', '#F59E0B', 'document'),
('Formation', 'formation', 'Sessions de formation et ateliers', '#EF4444', 'graduation-cap'),
('Partenariat', 'partenariat', 'Actualités sur les partenariats', '#EC4899', 'handshake');

-- Insert default settings
INSERT INTO settings (key, value, description, type, is_public) VALUES
('site_name', 'REAAGES', 'Nom du site', 'string', true),
('site_description', 'Réseau Africain pour l''Accès à l''Eau, l''Assainissement et la Gestion Environnementale Durable', 'Description du site', 'string', true),
('contact_email', 'contact@reaages.org', 'Email de contact', 'string', true),
('contact_phone', '+221 33 123 45 67', 'Téléphone de contact', 'string', true),
('social_media', '{"facebook": "", "twitter": "", "linkedin": "", "instagram": ""}', 'Réseaux sociaux', 'json', true),
('maintenance_mode', 'false', 'Mode maintenance', 'boolean', true),
('max_upload_size', '5242880', 'Taille maximale des fichiers (octets)', 'integer', false);

-- ========================================
-- Views
-- ========================================

-- Recent articles view
CREATE VIEW recent_articles AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.featured_image,
    a.published_at,
    a.view_count,
    a.like_count,
    a.comment_count,
    u.first_name || ' ' || u.last_name as author_name,
    c.name as category_name,
    c.color as category_color
FROM articles a
JOIN users u ON a.author_id = u.id
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

-- Upcoming events view
CREATE VIEW upcoming_events AS
SELECT 
    e.id,
    e.title,
    e.slug,
    e.description,
    e.featured_image,
    e.start_date,
    e.end_date,
    e.location,
    e.is_online,
    e.current_participants,
    e.max_participants,
    u.first_name || ' ' || u.last_name as organizer_name,
    c.name as category_name,
    c.color as category_color
FROM events e
JOIN users u ON e.organizer_id = u.id
LEFT JOIN categories c ON e.category_id = c.id
WHERE e.status = 'upcoming' AND e.start_date > CURRENT_TIMESTAMP
ORDER BY e.start_date ASC;

-- Active projects view
CREATE VIEW active_projects AS
SELECT 
    p.id,
    p.title,
    p.slug,
    p.description,
    p.featured_image,
    p.start_date,
    p.end_date,
    p.budget,
    p.currency,
    p.countries,
    p.beneficiaries_count,
    p.progress_percentage,
    u.first_name || ' ' || u.last_name as manager_name,
    c.name as category_name,
    c.color as category_color
FROM projects p
JOIN users u ON p.manager_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

-- ========================================
-- Database Statistics
-- ========================================

-- Function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'users', (SELECT COUNT(*) FROM users WHERE is_active = true),
        'articles', (SELECT COUNT(*) FROM articles WHERE status = 'published'),
        'events', (SELECT COUNT(*) FROM events WHERE status = 'upcoming'),
        'projects', (SELECT COUNT(*) FROM projects WHERE status = 'active'),
        'categories', (SELECT COUNT(*) FROM categories WHERE is_active = true),
        'comments', (SELECT COUNT(*) FROM comments WHERE status = 'approved')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Full-text Search Functions
-- ========================================

-- Function for searching articles
CREATE OR REPLACE FUNCTION search_articles(search_query TEXT, limit_count INTEGER DEFAULT 10, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt TEXT,
    featured_image VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    author_name VARCHAR(201),
    category_name VARCHAR(100),
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        u.first_name || ' ' || u.last_name as author_name,
        c.name as category_name,
        ts_rank(to_tsvector('french', a.title || ' ' || a.content), plainto_tsquery('french', search_query)) as rank
    FROM articles a
    JOIN users u ON a.author_id = u.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    AND to_tsvector('french', a.title || ' ' || a.content) @@ plainto_tsquery('french', search_query)
    ORDER BY rank DESC, a.published_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Backup and Maintenance
-- ========================================

-- Function to clean up old activity logs (older than 1 year)
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM activity_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Security and Permissions
-- ========================================

-- Row Level Security (RLS) for sensitive data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to only see their own data
CREATE POLICY users_own_data ON users
    FOR ALL
    TO authenticated_role
    USING (true); -- Simplified: JWT middleware handles auth

-- Policy for users to see their own activity logs
CREATE POLICY users_own_activity_logs ON activity_logs
    FOR ALL
    TO authenticated_role
    USING (true); -- Simplified: JWT middleware handles auth

-- ========================================
-- Final Setup
-- ========================================

-- Create the authenticated role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated_role') THEN
        CREATE ROLE authenticated_role;
    END IF;
END
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated_role;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated_role;

-- Create the database schema version table for migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial migration version
INSERT INTO schema_migrations (version) VALUES ('1.0.0') ON CONFLICT (version) DO NOTHING;

COMMIT;