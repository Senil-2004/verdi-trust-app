-- PostgreSQL Schema for Supabase

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    project_source VARCHAR(255) NOT NULL,
    volume INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    fill_percentage INT DEFAULT 0,
    type VARCHAR(50),
    vintage INT,
    certificate_file VARCHAR(255),
    cover_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    buyer_name VARCHAR(255) NOT NULL,
    credits INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Processing',
    razorpay_payment_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    developer VARCHAR(255),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Test Data
INSERT INTO listings (project_source, volume, price, status, fill_percentage, type, vintage) VALUES
('Amazon Reforestation', 4200, 22.50, 'Active', 84, 'Nature', 2023),
('Wind Farm Indonesia', 12000, 18.00, 'Active', 22, 'Energy', 2022),
('Solar Park Rajasthan', 800, 25.00, 'Sold Out', 100, 'Energy', 2023),
('Methane Capture USA', 3500, 24.00, 'Active', 45, 'Waste', 2021);

INSERT INTO transactions (buyer_name, credits, amount, transaction_date, status) VALUES
('Microsoft Corp', 1200, 27000.00, NOW() - INTERVAL '2 hours', 'Completed'),
('Delta Airlines', 8500, 153000.00, NOW() - INTERVAL '5 hours', 'Processing'),
('Stripe Climate', 450, 10125.00, NOW() - INTERVAL '1 day', 'Completed'),
('BMW Group', 2200, 49500.00, NOW() - INTERVAL '1 day', 'Completed');

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

INSERT INTO notifications (title, message, created_at) VALUES 
('New asset verification pending', 'A new listing requires your attention.', NOW() - INTERVAL '2 hours'),
('Carbon credit settlement cleared', 'Transaction #1234 has been processed successfully.', NOW() - INTERVAL '5 hours'),
('Market analysis report available', 'The monthly market report for January is now available.', NOW() - INTERVAL '1 day'),
('Welcome to VerdiTrust', 'Thank you for joining our platform.', NOW() - INTERVAL '2 days');

CREATE TABLE IF NOT EXISTS system_settings (
    id INT PRIMARY KEY DEFAULT 1,
    platform_fee DECIMAL(10, 2) DEFAULT 2.5,
    verification_timeout INT DEFAULT 48,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    two_factor_required BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_settings (id, platform_fee, verification_timeout, maintenance_mode, two_factor_required)
VALUES (1, 2.5, 48, FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;
