package com.retailpro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.retailpro.dto.dashboard.DashboardResponse;
import com.retailpro.repository.CategoryRepository;
import com.retailpro.repository.InvoiceRepository;
import com.retailpro.repository.ProductRepository;
import com.retailpro.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

	private final CategoryRepository categoryRepository;

	private final ProductRepository productRepository;

	private final InvoiceRepository invoiceRepository;

	@GetMapping("/admin")
	public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

		DashboardResponse response = DashboardResponse.builder().totalCategories(categoryRepository.count())
				.totalProducts(productRepository.count()).totalInvoices(invoiceRepository.count()).build();

		return ResponseEntity.ok(ApiResponse.<DashboardResponse>builder().success(true)
				.message("Dashboard data fetched").data(response).build());
	}
}