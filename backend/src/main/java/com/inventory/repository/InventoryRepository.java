package com.inventory.repository;

import com.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    @Query("SELECT i FROM Inventory i WHERE i.product_id = :productId AND i.warehouse_id = :warehouseId")
    Optional<Inventory> findByProductIdAndWarehouseId(@Param("productId") Long productId, @Param("warehouseId") Long warehouseId);
    
    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.product_id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
    
    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.product_id NOT IN (SELECT p.id FROM Product p)")
    int deleteOrphanedInventory();
}