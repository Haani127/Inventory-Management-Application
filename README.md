# Inventory Management System - Frontend

A React.js frontend application for the Inventory Management System based on the provided SRS requirements.

## Features

### Role-Based Access Control
- **Admin**: Full system access including user management, warehouses, products, suppliers, and reports
- **Manager**: Product and supplier management, inventory viewing, and reports access
- **Employee**: Inventory viewing and stock adjustment operations

### Core Functionality
- User authentication with JWT tokens
- Product catalog management
- Inventory tracking and stock adjustments
- Warehouse management (Admin only)
- Supplier management
- Reports and analytics
- Low stock alerts
- Search and filtering capabilities

## Technology Stack
- React.js 18
- React Router DOM for navigation
- Axios for API communication
- Tailwind CSS for styling
- JWT for authentication

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Layout.js          # Main layout with navigation
│   └── ProtectedRoute.js  # Route protection component
├── pages/
│   ├── Login.js           # Login page
│   ├── Dashboard.js       # Dashboard with statistics
│   ├── Products.js        # Product management
│   ├── Inventory.js       # Inventory tracking and adjustments
│   ├── Warehouses.js      # Warehouse management (Admin)
│   ├── Suppliers.js       # Supplier management
│   └── Reports.js         # Reports and analytics
├── services/
│   └── api.js             # API service layer
├── utils/
│   └── auth.js            # Authentication utilities
└── App.js                 # Main application component
```

## API Integration

The frontend expects a Spring Boot backend running on `http://localhost:8080` with the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/inventory` - Get inventory data
- `POST /api/inventory/stock-in` - Record stock in
- `POST /api/inventory/stock-out` - Record stock out
- `GET /api/warehouses` - Get warehouses
- `GET /api/suppliers` - Get suppliers

## User Roles and Permissions

| Feature | Employee | Manager | Admin |
|---------|----------|---------|-------|
| Login | ✓ | ✓ | ✓ |
| View Products | ✓ | ✓ | ✓ |
| Manage Products | ✗ | ✓ | ✓ |
| Stock Adjustments | ✓ | ✗ | ✓ |
| View Inventory | ✓ | ✓ | ✓ |
| View Reports | ✗ | ✓ | ✓ |
| Manage Suppliers | ✗ | ✓ | ✓ |
| Manage Warehouses | ✗ | ✗ | ✓ |

## Key Components

### Authentication
- JWT token-based authentication
- Role-based access control
- Automatic token validation
- Protected routes

### Dashboard
- Real-time statistics
- Low stock alerts
- Quick overview of system status

### Inventory Management
- Stock-in and stock-out operations
- Real-time stock level updates
- Low stock indicators
- Product and warehouse selection

### Reporting
- Low stock reports
- Current stock level reports
- CSV export functionality
- Filtering options

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

Built with Tailwind CSS for consistent styling across all screen sizes.