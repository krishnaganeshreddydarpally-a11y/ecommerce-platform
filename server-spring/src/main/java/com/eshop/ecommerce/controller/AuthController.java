package com.eshop.ecommerce.controller;

import com.eshop.ecommerce.model.User;
import com.eshop.ecommerce.repository.UserRepository;
import com.eshop.ecommerce.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please provide all required fields"));
        }

        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message", "A user with this email already exists"));
        }

        String userId = "user_" + UUID.randomUUID().toString().substring(0, 8);
        String hashedPassword = passwordEncoder.encode(password);
        String avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name.trim();

        User user = new User(userId, name.trim(), normalizedEmail, hashedPassword, "customer", avatar);
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("user", cleanUser(user));

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please provide email and password"));
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.toLowerCase().trim());
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("user", cleanUser(user));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of("success", true, "user", cleanUser(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        String name = body.get("name");
        String avatar = body.get("avatar");

        if (name != null) user.setName(name.trim());
        if (avatar != null) user.setAvatar(avatar);

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "user", cleanUser(user)));
    }

    private Map<String, Object> cleanUser(User user) {
        Map<String, Object> clean = new HashMap<>();
        clean.put("id", user.getId());
        clean.put("name", user.getName());
        clean.put("email", user.getEmail());
        clean.put("role", user.getRole());
        clean.put("avatar", user.getAvatar());
        clean.put("createdAt", user.getCreatedAt());
        clean.put("updatedAt", user.getUpdatedAt());
        return clean;
    }
}
