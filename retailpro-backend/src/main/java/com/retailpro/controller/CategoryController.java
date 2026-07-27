package com.retailpro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.retailpro.dto.category.CategoryRequest;
import com.retailpro.dto.category.CategoryResponse;
import com.retailpro.service.CategoryService;
import com.retailpro.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

	private final CategoryService categoryService;

	@PostMapping
	public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {

		CategoryResponse response = categoryService.createCategory(request);

		return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder().success(true)
				.message("Category created successfully").data(response).build());
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {

		return ResponseEntity.ok(ApiResponse.<List<CategoryResponse>>builder().success(true)
				.message("Categories fetched").data(categoryService.getAllCategories()).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {

		return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder().success(true).message("Category fetched")
				.data(categoryService.getCategoryById(id)).build());
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@Valid @PathVariable Long id,
			@RequestBody CategoryRequest request) {

		return ResponseEntity.ok(ApiResponse.<CategoryResponse>builder().success(true)
				.message("Category updated successfully").data(categoryService.updateCategory(id, request)).build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {

		categoryService.deleteCategory(id);

		return ResponseEntity.ok(ApiResponse.<String>builder().success(true).message("Category deleted successfully")
				.data("Deleted").build());
	}
}