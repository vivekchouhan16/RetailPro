package com.retailpro.exception;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 8120470928925067318L;

	public ResourceNotFoundException(String message) {

		super(message);
	}
}