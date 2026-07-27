package com.retailpro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.retailpro.dto.auth.AuthResponse;
import com.retailpro.dto.auth.LoginRequest;
import com.retailpro.dto.auth.RegisterRequest;
import com.retailpro.service.AuthService;
import com.retailpro.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {

		String response = authService.register(request);

		return ResponseEntity.ok(
				ApiResponse.<String>builder().success(true).message("Registration successful").data(response).build());
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {

		AuthResponse response = authService.login(request);

		return ResponseEntity.ok(
				ApiResponse.<AuthResponse>builder().success(true).message("Login successful").data(response).build());
	}
}