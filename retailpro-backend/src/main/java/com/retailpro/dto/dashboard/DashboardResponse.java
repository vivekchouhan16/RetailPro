package com.retailpro.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DashboardResponse {

	private long totalCategories;

	private long totalProducts;

	private long totalInvoices;
}