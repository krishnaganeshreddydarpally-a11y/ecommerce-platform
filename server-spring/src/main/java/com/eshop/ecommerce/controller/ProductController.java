package com.eshop.ecommerce.controller;

import com.eshop.ecommerce.model.Category;
import com.eshop.ecommerce.model.Product;
import com.eshop.ecommerce.model.User;
import com.eshop.ecommerce.repository.CategoryRepository;
import com.eshop.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String featured,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sort) {

        List<Product> products = productRepository.findAll();

        // Search filter
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase().trim();
            products = products.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                                 (p.getDescription() != null && p.getDescription().toLowerCase().contains(q)) ||
                                 (p.getCategoryName() != null && p.getCategoryName().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        // Category filter
        if (category != null && !category.equals("all") && !category.trim().isEmpty()) {
            products = products.stream()
                    .filter(p -> category.equalsIgnoreCase(p.getCategory()) || ("cat_" + category).equalsIgnoreCase(p.getCategory()))
                    .collect(Collectors.toList());
        }

        // Featured filter
        if ("true".equalsIgnoreCase(featured)) {
            products = products.stream().filter(Product::isFeatured).collect(Collectors.toList());
        }

        // Price filter
        if (minPrice != null) {
            products = products.stream().filter(p -> p.getPrice() >= minPrice).collect(Collectors.toList());
        }
        if (maxPrice != null) {
            products = products.stream().filter(p -> p.getPrice() <= maxPrice).collect(Collectors.toList());
        }

        // Sorting
        if ("price-asc".equals(sort)) {
            products.sort(Comparator.comparingDouble(Product::getPrice));
        } else if ("price-desc".equals(sort)) {
            products.sort(Comparator.comparingDouble(Product::getPrice).reversed());
        } else if ("rating".equals(sort)) {
            products.sort(Comparator.comparingDouble(Product::getRating).reversed());
        } else {
            products.sort((a, b) -> (b.getCreatedAt() != null ? b.getCreatedAt() : "").compareTo(a.getCreatedAt() != null ? a.getCreatedAt() : ""));
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("count", products.size());
        res.put("products", products);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) {
            prodOpt = productRepository.findBySlug(id);
        }

        if (prodOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
        }

        Product product = prodOpt.get();
        List<Product> related = productRepository.findByCategory(product.getCategory()).stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .limit(4)
                .collect(Collectors.toList());

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("product", product);
        res.put("related", related);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable String id,
                                       @AuthenticationPrincipal User user,
                                       @RequestBody Map<String, Object> body) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        Optional<Product> prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
        }

        Product product = prodOpt.get();
        int rating = body.get("rating") instanceof Number ? ((Number) body.get("rating")).intValue() : 5;
        String comment = body.get("comment") != null ? body.get("comment").toString().trim() : "";

        if (comment.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Review comment is required"));
        }

        Product.Review review = new Product.Review("rev_" + System.currentTimeMillis(), user.getId(), user.getName(), rating, comment);
        product.getReviews().add(review);

        double avg = product.getReviews().stream().mapToInt(Product.Review::getRating).average().orElse(5.0);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        product.setNumReviews(product.getReviews().size());
        product.setUpdatedAt(Instant.now().toString());

        productRepository.save(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "product", product, "message", "Review added successfully"));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getName() == null || product.getCategory() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name and category are required"));
        }

        if (product.getId() == null) {
            product.setId("prod_" + System.currentTimeMillis());
        }
        product.setSlug(product.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""));

        Optional<Category> cat = categoryRepository.findById(product.getCategory());
        cat.ifPresent(category -> product.setCategoryName(category.getName()));

        product.setCreatedAt(Instant.now().toString());
        product.setUpdatedAt(Instant.now().toString());

        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "product", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
        Optional<Product> existingOpt = productRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
        }

        Product existing = existingOpt.get();
        if (product.getName() != null) {
            existing.setName(product.getName());
            existing.setSlug(product.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""));
        }
        if (product.getDescription() != null) existing.setDescription(product.getDescription());
        if (product.getPrice() > 0) existing.setPrice(product.getPrice());
        if (product.getOriginalPrice() != null) existing.setOriginalPrice(product.getOriginalPrice());
        if (product.getCategory() != null) {
            existing.setCategory(product.getCategory());
            categoryRepository.findById(product.getCategory()).ifPresent(c -> existing.setCategoryName(c.getName()));
        }
        existing.setStock(product.getStock());
        existing.setFeatured(product.isFeatured());
        if (product.getImages() != null && !product.getImages().isEmpty()) existing.setImages(product.getImages());
        if (product.getSpecs() != null) existing.setSpecs(product.getSpecs());
        existing.setUpdatedAt(Instant.now().toString());

        Product saved = productRepository.save(existing);
        return ResponseEntity.ok(Map.of("success", true, "product", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Product not found"));
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully"));
    }
}
