package com.retailpro.service;

import java.util.List;

import com.retailpro.dto.user.UserRequest;
import com.retailpro.dto.user.UserResponse;

public interface UserService {

	List<UserResponse> getAllUsers();
	
	void DeleteUser(Long id);

	UserResponse updateUserRole(Long id, UserRequest request);
	
}
