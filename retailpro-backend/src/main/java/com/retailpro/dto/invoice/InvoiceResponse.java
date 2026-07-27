package com.retailpro.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InvoiceResponse {

	private Long id;

	private String invoiceNumber;

	private LocalDateTime invoiceDate;

	private BigDecimal grandTotal;

	private List<InvoiceItemResponse> items;
}