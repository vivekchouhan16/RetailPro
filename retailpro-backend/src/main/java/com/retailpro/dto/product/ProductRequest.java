package com.retailpro.dto.product;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

	@NotBlank
	@Size(max = 100)
	private String name;

	private String description;

	@NotNull
	@Positive
	private BigDecimal price;

	@NotNull
	@Min(0)
	private Integer stockQuantity;

	@NotNull
	private Long categoryId;
}