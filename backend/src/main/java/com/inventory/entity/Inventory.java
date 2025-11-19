package com.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory", uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "warehouse_id"}))
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long product_id;
    
    @Column(name = "warehouse_id", nullable = false)
    private Long warehouse_id;
    
    @Column(name = "stock_level", nullable = false)
    private Integer stock_level;

    public Inventory() {}
    
    public Inventory(Long product_id, Long warehouse_id, Integer stock_level) {
        this.product_id = product_id;
        this.warehouse_id = warehouse_id;
        this.stock_level = stock_level;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProduct_id() { return product_id; }
    public void setProduct_id(Long product_id) { this.product_id = product_id; }
    
    public Long getWarehouse_id() { return warehouse_id; }
    public void setWarehouse_id(Long warehouse_id) { this.warehouse_id = warehouse_id; }
    
    public Integer getStock_level() { return stock_level; }
    public void setStock_level(Integer stock_level) { this.stock_level = stock_level; }
}