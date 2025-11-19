package com.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String sku;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "supplier_id")
    private Long supplier_id;
    
    @Column(name = "min_stock_level")
    private Integer min_stock_level;

    public Product() {}
    
    public Product(String name, String sku, String description, Long supplier_id, Integer min_stock_level) {
        this.name = name;
        this.sku = sku;
        this.description = description;
        this.supplier_id = supplier_id;
        this.min_stock_level = min_stock_level;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getSupplier_id() { return supplier_id; }
    public void setSupplier_id(Long supplier_id) { this.supplier_id = supplier_id; }
    
    public Integer getMin_stock_level() { return min_stock_level; }
    public void setMin_stock_level(Integer min_stock_level) { this.min_stock_level = min_stock_level; }
}