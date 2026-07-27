package com.retailpro.dto.auth;

import com.retailpro.enums.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

	@Size(max = 100)
	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Email is required")
	@Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+$", message = "Invalid email format")
	private String email;

	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;

//	private Role role;
}