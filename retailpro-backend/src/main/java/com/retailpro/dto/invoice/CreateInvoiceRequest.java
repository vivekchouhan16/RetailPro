package com.retailpro.dto.invoice;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateInvoiceRequest {

	@NotEmpty
	private List<InvoiceItemRequest> items;
}