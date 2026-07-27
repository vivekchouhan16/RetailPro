package com.retailpro.dto.invoice;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InvoiceItemResponse {

	private String productName;

	private Integer quantity;

	private BigDecimal unitPrice;

	private BigDecimal subtotal;
}