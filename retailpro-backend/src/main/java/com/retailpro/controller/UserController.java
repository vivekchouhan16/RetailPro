package com.retailpro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailpro.dto.user.UserRequest;
import com.retailpro.dto.user.UserResponse;
import com.retailpro.service.UserService;
import com.retailpro.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	
	@GetMapping
	public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
		return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder().success(true).message("Users fetched").data(userService.getAllUsers()).build());
	}
	
	
	@DeleteMapping("/{id}")
	
	public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
		userService.DeleteUser(id);
		
		return ResponseEntity.ok(ApiResponse.<String>builder().success(true).message("User Deleted Successfully").data("Deleted").build());
	}
	
	@PatchMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(@Valid @PathVariable Long id, @RequestBody UserRequest userRequest) {
		return ResponseEntity.ok(ApiResponse.<UserResponse>builder().success(true).message("User Role Updated").data(userService.updateUserRole(id, userRequest)).build());
	}
	
}
