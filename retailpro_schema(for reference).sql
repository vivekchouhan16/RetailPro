-- =====================================
-- RetailPro Database Schema
-- =====================================

CREATE DATABASE IF NOT EXISTS retailpro;

USE retailpro;

-- =====================================
-- USERS
-- =====================================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','STAFF') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- CATEGORIES
-- =====================================

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- =====================================
-- PRODUCTS
-- =====================================

CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    category_id BIGINT NOT NULL,

    CONSTRAINT fk_product_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

-- =====================================
-- INVOICES
-- =====================================

CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grand_total DECIMAL(10,2) NOT NULL,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_invoice_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

-- =====================================
-- INVOICE ITEMS
-- =====================================

CREATE TABLE invoice_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_invoice_item_invoice
    FOREIGN KEY (invoice_id)
    REFERENCES invoices(id),

    CONSTRAINT fk_invoice_item_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- =====================================
-- SAMPLE CATEGORIES
-- =====================================

INSERT INTO categories(name, description)
VALUES
('Beverages', 'Cold Drinks and Soft Drinks'),
('Dairy', 'Milk and Dairy Products'),
('Snacks', 'Packaged Snack Items');

-- =====================================
-- SAMPLE PRODUCTS
-- =====================================

INSERT INTO products
(name, description, price, stock_quantity, category_id)
VALUES
('Coca Cola', '500ml Bottle', 40.00, 100, 1),
('Amul Milk', '500ml Packet', 35.00, 50, 2),
('Lays Chips', 'Classic Salted', 20.00, 80, 3);