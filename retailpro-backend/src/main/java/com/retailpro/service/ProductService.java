package com.retailpro.service;

import java.util.List;

import com.retailpro.dto.product.ProductRequest;
import com.retailpro.dto.product.ProductResponse;

public interface ProductService {

	ProductResponse createProduct(ProductRequest request);

	List<ProductResponse> getAllProducts();

	ProductResponse getProductById(Long id);

	ProductResponse updateProduct(Long id, ProductRequest request);

	void deleteProduct(Long id);

	List<ProductResponse> searchProducts(String keyword);

	List<ProductResponse> getLowStockProducts();
}