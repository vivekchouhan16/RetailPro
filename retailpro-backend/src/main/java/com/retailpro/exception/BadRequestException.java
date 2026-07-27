package com.retailpro.exception;

public class BadRequestException extends RuntimeException {

	private static final long serialVersionUID = -1939670186975974924L;

	public BadRequestException(String message) {

		super(message);
	}
}