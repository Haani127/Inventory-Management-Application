-- Create database
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- The tables will be automatically created by Spring Boot JPA
-- This script is just for reference and initial database creation

-- Sample data will be inserted by DataInitializer.java

-- Test users:
-- admin@test.com / admin123 (ADMIN role)
-- manager@test.com / manager123 (MANAGER role)  
-- employee@test.com / employee123 (EMPLOYEE role)