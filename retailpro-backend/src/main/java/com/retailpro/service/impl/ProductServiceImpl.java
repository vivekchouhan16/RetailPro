package com.retailpro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.retailpro.dto.product.ProductRequest;
import com.retailpro.dto.product.ProductResponse;
import com.retailpro.entity.Category;
import com.retailpro.entity.Product;
import com.retailpro.exception.ResourceNotFoundException;
import com.retailpro.repository.CategoryRepository;
import com.retailpro.repository.ProductRepository;
import com.retailpro.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;

	private final CategoryRepository categoryRepository;

	@Override
	public ProductResponse createProduct(ProductRequest request) {

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Product product = Product.builder().name(request.getName()).description(request.getDescription())
				.price(request.getPrice()).stockQuantity(request.getStockQuantity()).category(category).build();

		return mapToResponse(productRepository.save(product));
	}

	@Override
	public List<ProductResponse> getAllProducts() {

		return productRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public ProductResponse getProductById(Long id) {

		return mapToResponse(
				productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found")));
	}

	@Override
	public ProductResponse updateProduct(Long id, ProductRequest request) {

		Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setStockQuantity(request.getStockQuantity());
		product.setCategory(category);

		return mapToResponse(productRepository.save(product));
	}

	@Override
	public void deleteProduct(Long id) {

		productRepository.deleteById(id);
	}

	@Override
	public List<ProductResponse> searchProducts(String keyword) {

		return productRepository.findByNameContainingIgnoreCase(keyword).stream().map(this::mapToResponse).toList();
	}

	@Override
	public List<ProductResponse> getLowStockProducts() {

		return productRepository.findByStockQuantityLessThan(10).stream().map(this::mapToResponse).toList();
	}

	private ProductResponse mapToResponse(Product product) {

		return ProductResponse.builder().id(product.getId()).name(product.getName())
				.description(product.getDescription()).price(product.getPrice())
				.stockQuantity(product.getStockQuantity()).categoryId(product.getCategory().getId())
				.categoryName(product.getCategory().getName()).build();
	}
}