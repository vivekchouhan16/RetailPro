package com.retailpro.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.retailpro.dto.user.UserRequest;
import com.retailpro.dto.user.UserResponse;
import com.retailpro.entity.User;
import com.retailpro.exception.ResourceNotFoundException;
import com.retailpro.repository.UserDetailsRepository;
import com.retailpro.service.UserService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserDetailsRepository userDetailsRepository;

	@Override
	public List<UserResponse> getAllUsers() {
		// TODO Auto-generated method stub
		return userDetailsRepository.findAll().stream().map(this::mapToResponse).toList();
	}

	@Override
	public void DeleteUser(Long id) {
		
		User user = userDetailsRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
		
		userDetailsRepository.deleteById(id);
		
	}

	@Override
	public UserResponse updateUserRole(Long id, UserRequest request) {
		User user = userDetailsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
		
		user.setRole(request.getRole());
		
		return mapToResponse(userDetailsRepository.save(user));
	}
	
	// Helper method to build response
	private UserResponse mapToResponse(User user) {

		return UserResponse.builder().id(user.getId()).email(user.getEmail()).name(user.getName()).role(user.getRole().name()).build();
	}

}
