CREATE DATABASE IF NOT EXISTS verdi_trust_db;
USE verdi_trust_db;

CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_source VARCHAR(255) NOT NULL,
    volume INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    fill_percentage INT DEFAULT 0,
    type VARCHAR(50),
    vintage YEAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Processing',
    razorpay_payment_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    developer VARCHAR(255),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Delete existing data to avoid duplicates
DELETE FROM listings;
DELETE FROM transactions;
DELETE FROM users;
DELETE FROM projects;

-- Initial Data
INSERT INTO listings (project_source, volume, price, status, fill_percentage, type, vintage) VALUES
('Amazon Reforestation', 4200, 22.50, 'Active', 84, 'Nature', 2023),
('Wind Farm Indonesia', 12000, 18.00, 'Active', 22, 'Energy', 2022),
('Solar Park Rajasthan', 800, 25.00, 'Sold Out', 100, 'Energy', 2023),
('Methane Capture USA', 3500, 24.00, 'Active', 45, 'Waste', 2021);

INSERT INTO transactions (buyer_name, credits, amount, transaction_date, status) VALUES
('Microsoft Corp', 1200, 27000.00, NOW() - INTERVAL 2 HOUR, 'Completed'),
('Delta Airlines', 8500, 153000.00, NOW() - INTERVAL 5 HOUR, 'Processing'),
('Stripe Climate', 450, 10125.00, NOW() - INTERVAL 1 DAY, 'Completed'),
('BMW Group', 2200, 49500.00, NOW() - INTERVAL 1 DAY, 'Completed');

INSERT INTO users (name, email, role, status, joined_at) VALUES
('Sarah Connor', 'sarah@resistance.com', 'Project Developer', 'Active', '2026-01-12'),
('Marcus Wright', 'marcus@cyberdyne.io', 'Credit Buyer', 'Pending', '2026-01-13'),
('Kyle Reese', 'kyle@techcomm.org', 'Admin', 'Active', '2026-01-10'),
('John Doe', 'john@verditrust.com', 'Platform Admin', 'Active', '2025-12-15');

INSERT INTO projects (name, region, status, developer, submitted_at) VALUES
('Amazon Rainforest Reforestation', 'Brazil', 'Pending', 'GreenEarth Co', '2026-01-12'),
('Solar Array V-42', 'Germany', 'Approved', 'SunPower Ltd', '2026-01-10'),
('Coastal Mangrove Protection', 'Vietnam', 'In Review', 'OceanWatch', '2026-01-11'),
('Industrial Carbon Capture', 'USA', 'Rejected', 'TechCarbon', '2026-01-09');
