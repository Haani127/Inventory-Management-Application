package com.inventory.service;

import com.inventory.config.JwtUtil;
import com.inventory.entity.User;
import com.inventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, String> login(String email, String password) {
        System.out.println("Login attempt for email: " + email);
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            System.out.println("User not found for email: " + email);
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOpt.get();
        System.out.println("User found: " + user.getEmail() + ", Role: " + user.getRole());
        
        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
            
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole().toString());
            return response;
        } else {
            System.out.println("Password mismatch for user: " + email);
            throw new RuntimeException("Invalid credentials");
        }
    }

    public User register(String email, String password, String name, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User(
            email,
            passwordEncoder.encode(password),
            User.Role.valueOf(role.toUpperCase()),
            name
        );
        
        return userRepository.save(user);
    }
}