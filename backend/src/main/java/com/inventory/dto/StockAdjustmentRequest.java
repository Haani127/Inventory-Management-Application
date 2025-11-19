package com.inventory.dto;

public class StockAdjustmentRequest {
    private Long product_id;
    private Long warehouse_id;
    private Integer quantity;

    public StockAdjustmentRequest() {}
    
    public StockAdjustmentRequest(Long product_id, Long warehouse_id, Integer quantity) {
        this.product_id = product_id;
        this.warehouse_id = warehouse_id;
        this.quantity = quantity;
    }

    public Long getProduct_id() { return product_id; }
    public void setProduct_id(Long product_id) { this.product_id = product_id; }
    
    public Long getWarehouse_id() { return warehouse_id; }
    public void setWarehouse_id(Long warehouse_id) { this.warehouse_id = warehouse_id; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}