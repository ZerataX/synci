DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);