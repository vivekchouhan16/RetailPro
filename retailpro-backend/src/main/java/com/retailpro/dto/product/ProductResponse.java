package com.retailpro.dto.product;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProductResponse {

	private Long id;

	private String name;

	private String description;

	private BigDecimal price;

	private Integer stockQuantity;

	private Long categoryId;

	private String categoryName;
}