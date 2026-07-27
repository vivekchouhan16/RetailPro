package com.retailpro.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.retailpro.dto.category.CategoryRequest;
import com.retailpro.dto.category.CategoryResponse;
import com.retailpro.entity.Category;
import com.retailpro.exception.BadRequestException;
import com.retailpro.exception.ResourceNotFoundException;
import com.retailpro.repository.CategoryRepository;
import com.retailpro.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;

	@Override
	public CategoryResponse createCategory(CategoryRequest request) {

		if (categoryRepository.existsByName(request.getName())) {

			throw new BadRequestException("Category already exists");
		}

		Category category = Category.builder().name(request.getName()).description(request.getDescription()).build();

		Category saved = categoryRepository.save(category);

		return mapToResponse(saved);
	}

	@Override
	public List<CategoryResponse> getAllCategories() {

		return categoryRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public CategoryResponse getCategoryById(Long id) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		return mapToResponse(category);
	}

	@Override
	public CategoryResponse updateCategory(Long id, CategoryRequest request) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		category.setName(request.getName());
		category.setDescription(request.getDescription());

		Category updated = categoryRepository.save(category);

		return mapToResponse(updated);
	}

	@Override
	public void deleteCategory(Long id) {

		Category category = categoryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		categoryRepository.delete(category);
	}

	private CategoryResponse mapToResponse(Category category) {

		return CategoryResponse.builder().id(category.getId()).name(category.getName())
				.description(category.getDescription()).build();
	}
}