CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE IF NOT EXISTS users (
	id BIGINT NOT NULL AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(20) NOT NULL,
	name VARCHAR(255),
	PRIMARY KEY (id),
	UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS suppliers (
	id BIGINT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	contact_person VARCHAR(255),
	email VARCHAR(255),
	PRIMARY KEY (id),
	UNIQUE KEY uk_suppliers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS warehouses (
	id BIGINT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	location VARCHAR(255),
	PRIMARY KEY (id),
	UNIQUE KEY uk_warehouses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
	id BIGINT NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	sku VARCHAR(255) NOT NULL,
	description TEXT,
	supplier_id BIGINT,
	min_stock_level INT,
	PRIMARY KEY (id),
	UNIQUE KEY uk_products_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory (
	id BIGINT NOT NULL AUTO_INCREMENT,
	product_id BIGINT NOT NULL,
	warehouse_id BIGINT NOT NULL,
	stock_level INT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY uk_inventory_product_warehouse (product_id, warehouse_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stock_history (
	id BIGINT NOT NULL AUTO_INCREMENT,
	product_id BIGINT NOT NULL,
	warehouse_id BIGINT NOT NULL,
	adjustment_quantity INT,
	adjustment_type VARCHAR(20),
	`timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data is inserted by DataInitializer.java when the application starts.
-- All roles use the same warehouses table; admin/manager/employee differences come from access control, not separate warehouse tables.