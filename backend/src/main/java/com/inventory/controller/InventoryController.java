package com.inventory.controller;

import com.inventory.dto.StockAdjustmentRequest;
import com.inventory.entity.Inventory;
import com.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @PostMapping("/stock-in")
    public ResponseEntity<String> stockIn(@RequestBody StockAdjustmentRequest request) {
        try {
            inventoryService.stockIn(request.getProduct_id(), request.getWarehouse_id(), request.getQuantity());
            return ResponseEntity.ok("Stock added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stock-out")
    public ResponseEntity<String> stockOut(@RequestBody StockAdjustmentRequest request) {
        try {
            inventoryService.stockOut(request.getProduct_id(), request.getWarehouse_id(), request.getQuantity());
            return ResponseEntity.ok("Stock removed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cleanup-orphaned")
    public ResponseEntity<String> cleanupOrphanedInventory() {
        try {
            int deletedCount = inventoryService.cleanupOrphanedInventory();
            return ResponseEntity.ok("Cleaned up " + deletedCount + " orphaned inventory records");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}