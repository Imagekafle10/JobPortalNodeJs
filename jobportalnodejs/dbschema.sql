
-- Schema: job_portal
CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'employer', 'admin') DEFAULT 'user',
  location VARCHAR(100) DEFAULT 'India',
  address VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) 

-- Table: jobs
CREATE TABLE IF NOT EXISTS jobs (
  id INT NOT NULL AUTO_INCREMENT,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status ENUM('pending', 'reject', 'interview') DEFAULT 'pending',
  work_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
  work_location VARCHAR(255) NOT NULL DEFAULT 'Mumbai',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_jobs_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) 

-- Table: applications
CREATE TABLE IF NOT EXISTS applications (
  id INT NOT NULL AUTO_INCREMENT,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('applied','reviewed','accepted','rejected') DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) 
