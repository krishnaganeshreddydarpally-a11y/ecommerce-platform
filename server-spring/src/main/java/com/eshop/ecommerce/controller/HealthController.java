package com.eshop.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "online");
        res.put("database", "MongoDB Atlas");
        res.put("framework", "Spring Boot 3.3 (Java 21)");
        res.put("timestamp", Instant.now().toString());
        res.put("service", "E-Commerce Spring Boot API");
        return ResponseEntity.ok(res);
    }
}
