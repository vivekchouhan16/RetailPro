package com.retailpro.dto.user;

import com.retailpro.enums.Role;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
	
	@NotBlank
	Role role;
}
