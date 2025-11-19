# Inventory Management System - Backend

Spring Boot backend application for the Inventory Management System.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup

1. **Database Setup:**
   ```sql
   CREATE DATABASE inventory_db;
   ```

2. **Configure Database:**
   Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The application will run on `http://localhost:8080`

## Test Users

The application creates default users on startup:

- **Admin:** admin@test.com / admin123
- **Manager:** manager@test.com / manager123  
- **Employee:** employee@test.com / employee123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products (ADMIN, MANAGER, EMPLOYEE can view; ADMIN, MANAGER can modify)
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Inventory (All roles can view; EMPLOYEE, ADMIN can adjust stock)
- `GET /api/inventory` - Get all inventory
- `POST /api/inventory/stock-in` - Add stock
- `POST /api/inventory/stock-out` - Remove stock

### Warehouses (ADMIN only)
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create warehouse
- `PUT /api/warehouses/{id}` - Update warehouse
- `DELETE /api/warehouses/{id}` - Delete warehouse

### Suppliers (ADMIN, MANAGER only)
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

## Security

- JWT-based authentication
- Role-based access control
- CORS enabled for frontend (localhost:3000)
- Password encryption using BCrypt

## Database Schema

The application uses JPA to automatically create the following tables:
- users
- products
- suppliers
- warehouses
- inventory
- stock_history