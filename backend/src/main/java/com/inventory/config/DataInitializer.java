package com.inventory.config;

import com.inventory.entity.*;
import com.inventory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, SupplierRepository supplierRepository,
                          WarehouseRepository warehouseRepository, ProductRepository productRepository,
                          InventoryRepository inventoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create users if they don't exist
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin@test.com", passwordEncoder.encode("admin123"), User.Role.ADMIN, "Admin User"));
            userRepository.save(new User("manager@test.com", passwordEncoder.encode("manager123"), User.Role.MANAGER, "Manager User"));
            userRepository.save(new User("employee@test.com", passwordEncoder.encode("employee123"), User.Role.EMPLOYEE, "Employee User"));
        }

        // Create suppliers if they don't exist
        if (supplierRepository.count() == 0) {
            supplierRepository.save(new Supplier("Tech Supplies Inc", "John Doe", "john@techsupplies.com"));
            supplierRepository.save(new Supplier("Office Materials Co", "Jane Smith", "jane@officematerials.com"));
        }

        // Create warehouses if they don't exist
        if (warehouseRepository.count() == 0) {
            warehouseRepository.save(new Warehouse("Main Warehouse", "New York"));
            warehouseRepository.save(new Warehouse("Secondary Warehouse", "Los Angeles"));
        }

        // Create products if they don't exist
        if (productRepository.count() == 0) {
            productRepository.save(new Product("Laptop", "LAP001", "High-performance laptop", 1L, 10));
            productRepository.save(new Product("Office Chair", "CHR001", "Ergonomic office chair", 2L, 5));
            productRepository.save(new Product("Desk", "DSK001", "Standing desk", 2L, 3));
        }

        // Create initial inventory if it doesn't exist
        if (inventoryRepository.count() == 0) {
            inventoryRepository.save(new Inventory(1L, 1L, 15)); // Laptop in Main Warehouse
            inventoryRepository.save(new Inventory(2L, 1L, 8));  // Office Chair in Main Warehouse
            inventoryRepository.save(new Inventory(3L, 2L, 2));  // Desk in Secondary Warehouse
        }
    }
}