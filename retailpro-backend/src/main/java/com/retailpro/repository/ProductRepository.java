package com.retailpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retailpro.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findByNameContainingIgnoreCase(String keyword);

	List<Product> findByCategoryId(Long categoryId);

	List<Product> findByStockQuantityLessThan(Integer quantity);
}