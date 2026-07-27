package com.retailpro.service;

import java.util.List;

import com.retailpro.dto.invoice.CreateInvoiceRequest;
import com.retailpro.dto.invoice.InvoiceResponse;

public interface InvoiceService {

	InvoiceResponse createInvoice(CreateInvoiceRequest request, String email);

	List<InvoiceResponse> getAllInvoices();

	InvoiceResponse getInvoiceById(Long id);
}