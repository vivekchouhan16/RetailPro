package com.retailpro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.retailpro.entity.User;

public interface UserDetailsRepository extends JpaRepository<User, Long> {

	
}
