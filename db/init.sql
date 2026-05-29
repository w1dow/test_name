-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- USER INTEGRATIONS (OAuth tokens encrypted)
-- =========================
CREATE TABLE IF NOT EXISTS user_integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,

  service VARCHAR(100) NOT NULL,  -- gmail, github, notion, calendar

  access_token TEXT,
  refresh_token TEXT,

  -- encryption metadata (AES-256-GCM)
  token_iv VARCHAR(255),          -- IV used for encryption
  encrypted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  expires_at DATETIME,

  UNIQUE(user_id, service),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- CHAT SESSIONS
-- =========================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- CHAT MESSAGES
-- =========================
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  user_id INT NOT NULL,

  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- SESSION TOKENS (optional auth layer)
-- =========================
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,

  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
