package com.retailpro.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.retailpro.dto.auth.AuthResponse;
import com.retailpro.dto.auth.LoginRequest;
import com.retailpro.dto.auth.RegisterRequest;
import com.retailpro.entity.User;
import com.retailpro.enums.Role;
import com.retailpro.exception.BadRequestException;
import com.retailpro.repository.UserRepository;
import com.retailpro.security.JwtService;
import com.retailpro.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtService jwtService;

	private final AuthenticationManager authenticationManager;

	@Override
	public String register(RegisterRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already exists");
		}

		User user = User.builder().name(request.getName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).role(Role.STAFF).build();

		userRepository.save(user);

		return "User registered successfully";
	}

	@Override
	public AuthResponse login(LoginRequest request) {

		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		String token = jwtService.generateToken(user.getEmail());

		return AuthResponse.builder().token(token).name(user.getName()).email(user.getEmail())
				.role(user.getRole().name()).build();
	}
}