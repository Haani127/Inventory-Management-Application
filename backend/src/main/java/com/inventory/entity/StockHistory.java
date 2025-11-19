package com.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_history")
public class StockHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long product_id;
    
    @Column(name = "warehouse_id", nullable = false)
    private Long warehouse_id;
    
    @Column(name = "adjustment_quantity")
    private Integer adjustment_quantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "adjustment_type")
    private AdjustmentType adjustment_type;
    
    private LocalDateTime timestamp;

    public enum AdjustmentType {
        STOCK_IN, STOCK_OUT
    }

    public StockHistory() {
        this.timestamp = LocalDateTime.now();
    }
    
    public StockHistory(Long product_id, Long warehouse_id, Integer adjustment_quantity, AdjustmentType adjustment_type) {
        this.product_id = product_id;
        this.warehouse_id = warehouse_id;
        this.adjustment_quantity = adjustment_quantity;
        this.adjustment_type = adjustment_type;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProduct_id() { return product_id; }
    public void setProduct_id(Long product_id) { this.product_id = product_id; }
    
    public Long getWarehouse_id() { return warehouse_id; }
    public void setWarehouse_id(Long warehouse_id) { this.warehouse_id = warehouse_id; }
    
    public Integer getAdjustment_quantity() { return adjustment_quantity; }
    public void setAdjustment_quantity(Integer adjustment_quantity) { this.adjustment_quantity = adjustment_quantity; }
    
    public AdjustmentType getAdjustment_type() { return adjustment_type; }
    public void setAdjustment_type(AdjustmentType adjustment_type) { this.adjustment_type = adjustment_type; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}