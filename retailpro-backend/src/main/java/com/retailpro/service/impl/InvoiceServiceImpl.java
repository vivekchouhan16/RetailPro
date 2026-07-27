package com.retailpro.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailpro.dto.invoice.CreateInvoiceRequest;
import com.retailpro.dto.invoice.InvoiceItemRequest;
import com.retailpro.dto.invoice.InvoiceItemResponse;
import com.retailpro.dto.invoice.InvoiceResponse;
import com.retailpro.entity.Invoice;
import com.retailpro.entity.InvoiceItem;
import com.retailpro.entity.Product;
import com.retailpro.entity.User;
import com.retailpro.exception.ResourceNotFoundException;
import com.retailpro.repository.InvoiceRepository;
import com.retailpro.repository.ProductRepository;
import com.retailpro.repository.UserRepository;
import com.retailpro.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

	private final InvoiceRepository invoiceRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;

	@Override
	@Transactional
	public InvoiceResponse createInvoice(CreateInvoiceRequest request, String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Invoice invoice = new Invoice();

		invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

		invoice.setCreatedBy(user);

		List<InvoiceItem> invoiceItems = new ArrayList<>();

		BigDecimal grandTotal = BigDecimal.ZERO;

		for (InvoiceItemRequest itemRequest : request.getItems()) {

			Product product = productRepository.findById(itemRequest.getProductId())
					.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

			if (product.getStockQuantity() < itemRequest.getQuantity()) {

				throw new ResourceNotFoundException("Insufficient stock for " + product.getName());
			}

			BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

			InvoiceItem invoiceItem = InvoiceItem.builder().product(product).invoice(invoice) //// links back to parent invoice  InvoiceItem knows its parent Invoice
					.quantity(itemRequest.getQuantity()).unitPrice(product.getPrice()).subtotal(subtotal).build();

			invoiceItems.add(invoiceItem);

			grandTotal = grandTotal.add(subtotal);

			product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());

			productRepository.save(product);
		}

		invoice.setInvoiceItems(invoiceItems);
		invoice.setGrandTotal(grandTotal);

		Invoice savedInvoice = invoiceRepository.save(invoice);

		return mapToResponse(savedInvoice);
	}

	@Override
	public List<InvoiceResponse> getAllInvoices() {

		return invoiceRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public InvoiceResponse getInvoiceById(Long id) {

		Invoice invoice = invoiceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

		return mapToResponse(invoice);
	}

	private InvoiceResponse mapToResponse(Invoice invoice) {

		List<InvoiceItemResponse> items = invoice.getInvoiceItems().stream()
				.map(item -> InvoiceItemResponse.builder().productName(item.getProduct().getName()) // // traverses to Product entity
						.quantity(item.getQuantity()).unitPrice(item.getUnitPrice()).subtotal(item.getSubtotal())
						.build())
				.toList();

		return InvoiceResponse.builder().id(invoice.getId()).invoiceNumber(invoice.getInvoiceNumber())
				.invoiceDate(invoice.getInvoiceDate()).grandTotal(invoice.getGrandTotal()).items(items).build();
	}
}