-- Create user_alerts table for price alerts
CREATE TABLE IF NOT EXISTS user_alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker VARCHAR(10) NOT NULL,
  target_price NUMERIC(12, 2) NOT NULL,
  sms_enabled BOOLEAN DEFAULT true,
  last_alert_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- Create indexes for fast lookups
CREATE INDEX idx_user_alerts_user_id ON user_alerts(user_id);
CREATE INDEX idx_user_alerts_ticker ON user_alerts(ticker);
CREATE INDEX idx_user_alerts_sms_enabled ON user_alerts(sms_enabled);

-- Add phone_number column to users table if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
