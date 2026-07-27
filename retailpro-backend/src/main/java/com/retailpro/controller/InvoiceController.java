package com.retailpro.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.retailpro.dto.invoice.CreateInvoiceRequest;
import com.retailpro.dto.invoice.InvoiceResponse;
import com.retailpro.service.InvoiceService;
import com.retailpro.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

	private final InvoiceService invoiceService;

	@PostMapping
	public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@Valid @RequestBody CreateInvoiceRequest request,
			Principal principal) {

		InvoiceResponse response = invoiceService.createInvoice(request, principal.getName());

		return ResponseEntity.ok(ApiResponse.<InvoiceResponse>builder().success(true).message("Invoice generated")
				.data(response).build());
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {

		return ResponseEntity.ok(ApiResponse.<List<InvoiceResponse>>builder().success(true).message("Invoices fetched")
				.data(invoiceService.getAllInvoices()).build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id) {

		return ResponseEntity.ok(ApiResponse.<InvoiceResponse>builder().success(true).message("Invoice fetched")
				.data(invoiceService.getInvoiceById(id)).build());
	}
}