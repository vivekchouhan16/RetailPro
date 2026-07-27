package com.retailpro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.retailpro.dto.product.ProductRequest;
import com.retailpro.dto.product.ProductResponse;
import com.retailpro.service.ProductService;
import com.retailpro.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

	private final ProductService productService;

	@PostMapping
	public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {

		return ResponseEntity.ok(ApiResponse.<ProductResponse>builder().success(true).message("Product created")
				.data(productService.createProduct(request)).build());
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {

		return ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder().success(true).message("Products fetched")
				.data(productService.getAllProducts()).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {

		return ResponseEntity.ok(ApiResponse.<ProductResponse>builder().success(true).message("Product fetched")
				.data(productService.getProductById(id)).build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@Valid @PathVariable Long id,
			@RequestBody ProductRequest request) {

		return ResponseEntity.ok(ApiResponse.<ProductResponse>builder().success(true).message("Product updated")
				.data(productService.updateProduct(id, request)).build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {

		productService.deleteProduct(id);

		return ResponseEntity
				.ok(ApiResponse.<String>builder().success(true).message("Product deleted").data("Deleted").build());
	}

	@GetMapping("/search")
	public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(@RequestParam String keyword) {

		return ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder().success(true).message("Search complete")
				.data(productService.searchProducts(keyword)).build());
	}

	@GetMapping("/low-stock")
	public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts() {

		return ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder().success(true)
				.message("Low stock products").data(productService.getLowStockProducts()).build());
	}
}