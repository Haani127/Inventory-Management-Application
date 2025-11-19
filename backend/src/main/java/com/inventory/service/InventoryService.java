package com.inventory.service;

import com.inventory.entity.Inventory;
import com.inventory.entity.StockHistory;
import com.inventory.repository.InventoryRepository;
import com.inventory.repository.StockHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public InventoryService(InventoryRepository inventoryRepository, StockHistoryRepository stockHistoryRepository) {
        this.inventoryRepository = inventoryRepository;
        this.stockHistoryRepository = stockHistoryRepository;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public void stockIn(Long productId, Long warehouseId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId);
        
        Inventory inventory;
        if (inventoryOpt.isPresent()) {
            inventory = inventoryOpt.get();
            inventory.setStock_level(inventory.getStock_level() + quantity);
        } else {
            inventory = new Inventory(productId, warehouseId, quantity);
        }
        
        inventoryRepository.save(inventory);
        stockHistoryRepository.save(new StockHistory(productId, warehouseId, quantity, StockHistory.AdjustmentType.STOCK_IN));
    }

    @Transactional
    public void stockOut(Long productId, Long warehouseId, Integer quantity) {
        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId);
        
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            if (inventory.getStock_level() >= quantity) {
                inventory.setStock_level(inventory.getStock_level() - quantity);
                inventoryRepository.save(inventory);
                stockHistoryRepository.save(new StockHistory(productId, warehouseId, quantity, StockHistory.AdjustmentType.STOCK_OUT));
            } else {
                throw new RuntimeException("Insufficient stock");
            }
        } else {
            throw new RuntimeException("No inventory found for this product and warehouse");
        }
    }

    @Transactional
    public int cleanupOrphanedInventory() {
        return inventoryRepository.deleteOrphanedInventory();
    }
}