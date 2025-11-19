package com.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    private String contact_person;
    private String email;

    public Supplier() {}
    
    public Supplier(String name, String contact_person, String email) {
        this.name = name;
        this.contact_person = contact_person;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getContact_person() { return contact_person; }
    public void setContact_person(String contact_person) { this.contact_person = contact_person; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}