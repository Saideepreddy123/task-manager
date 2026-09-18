-- Task Manager Database Schema
-- Run this file to create the database and the tasks table.

CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: a few sample rows so the dashboard isn't empty on first run
INSERT INTO tasks (title, description, status) VALUES
('Set up project repo', 'Initialize git repo and push starter code', 'Completed'),
('Design database schema', 'Create tasks table with required fields', 'Completed'),
('Build REST API', 'Implement CRUD endpoints with Express', 'In Progress'),
('Connect frontend to backend', 'Wire up React app to call the API', 'Pending');
