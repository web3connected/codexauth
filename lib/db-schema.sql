-- CodexHash Pre-Launch Signups Table
-- Stores email addresses from the pre-launch landing page

CREATE TABLE IF NOT EXISTS prelaunch_signups (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100) DEFAULT 'landing_page',
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_prelaunch_email ON prelaunch_signups(email);
CREATE INDEX IF NOT EXISTS idx_prelaunch_status ON prelaunch_signups(status);
CREATE INDEX IF NOT EXISTS idx_prelaunch_date ON prelaunch_signups(signup_date);

-- Add comment
COMMENT ON TABLE prelaunch_signups IS 'Stores email addresses from CodexHash pre-launch campaign';
