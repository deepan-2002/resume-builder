CREATE SCHEMA IF NOT EXISTS resume_builder;
SET search_path TO resume_builder;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    profile_image_url TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    public_key TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category VARCHAR(50),
    is_premium BOOLEAN DEFAULT FALSE,
    config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    slug VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume Content (JSONB for flexibility)
CREATE TABLE IF NOT EXISTS resume_content (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    personal_info JSONB,
    summary TEXT,
    experience JSONB,
    education JSONB,
    skills JSONB,
    projects JSONB,
    certifications JSONB,
    languages JSONB,
    custom_sections JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Export History
CREATE TABLE IF NOT EXISTS export_history (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    format VARCHAR(20) NOT NULL,
    file_url TEXT,
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_slug ON resumes(slug);
CREATE INDEX IF NOT EXISTS idx_resume_content_resume_id ON resume_content(resume_id);