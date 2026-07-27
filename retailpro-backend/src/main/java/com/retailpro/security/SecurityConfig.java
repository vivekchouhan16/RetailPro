package com.retailpro.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthFilter;

	/*
	 * Configure spring bean to customize security filter chain
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		// HttpSecurity - Builder to build sec filter chain
		
		// 1. Disable CSRF protection - since i am building REST API using JWT
		http.cors(cors -> { 
		}).csrf(csrf -> csrf.disable())

				// Disable HtppSession creation - Stateless. Spring Security will never create the http session object
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				// URL Based Autorization rules - URL based
				.authorizeHttpRequests(auth -> auth

						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						// any can access (public)
						.requestMatchers("/api/auth/**").permitAll()
						
						.requestMatchers(HttpMethod.GET, "/api/categories/**").hasAnyRole("ADMIN", "STAFF")
						
						// Only user whose role is admin can assess /categories/
						.requestMatchers("/api/categories/**").hasRole("ADMIN")
						
						// Either admin or staff can make get request to /products/
						.requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("ADMIN", "STAFF")
						
						// Only admin can make request to /products
						.requestMatchers("/api/products/**").hasRole("ADMIN")
						
						// either admin or staff can make request to /invoices/
						.requestMatchers("/api/invoices/**").hasAnyRole("ADMIN", "STAFF")
						
						// only admin
						.requestMatchers("/api/dashboard/**").hasRole("ADMIN")
						
						.requestMatchers("api/users/**").hasRole("ADMIN")
						
						// any other endpoints are public
						.anyRequest().authenticated())

				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		//HttpSecurity - Builder to build security filter chain
		return http.build();
	}

	// Configure spring supplied PasswordEncoder as spring bean
	@Bean
	PasswordEncoder passwordEncoder() {

		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

		return config.getAuthenticationManager();
	}

	@Bean
	public org.springframework.security.core.userdetails.UserDetailsService userDetailsService(
			CustomUserDetailsService service) {

		return service;
	}

	@SuppressWarnings("deprecation")
	@Bean
	AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {

		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userDetailsService);

		authProvider.setPasswordEncoder(passwordEncoder);

		return authProvider;
	}

	@Bean
	org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

		org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();

		configuration.setAllowedOriginPatterns(java.util.List.of("*"));

		configuration.setAllowedMethods(java.util.List.of("*"));

		configuration.setAllowedHeaders(java.util.List.of("*"));

		configuration.setAllowCredentials(false);

		org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

}