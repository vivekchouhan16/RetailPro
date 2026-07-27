package com.retailpro.service;

import com.retailpro.dto.auth.AuthResponse;
import com.retailpro.dto.auth.LoginRequest;
import com.retailpro.dto.auth.RegisterRequest;

public interface AuthService {

	String register(RegisterRequest request);

	AuthResponse login(LoginRequest request);
}