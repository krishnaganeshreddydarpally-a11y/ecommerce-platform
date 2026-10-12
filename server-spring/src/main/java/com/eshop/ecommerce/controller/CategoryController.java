package com.eshop.ecommerce.controller;

import com.eshop.ecommerce.model.Category;
import com.eshop.ecommerce.repository.CategoryRepository;
import com.eshop.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        for (Category cat : categories) {
            cat.setProductCount((int) productRepository.countByCategory(cat.getId()));
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("categories", categories);
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Category name is required"));
        }

        String name = category.getName().trim();
        String slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        String id = category.getId() != null ? category.getId() : "cat_" + slug;

        category.setId(id);
        category.setName(name);
        category.setSlug(slug);
        category.setCreatedAt(Instant.now().toString());
        category.setUpdatedAt(Instant.now().toString());

        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "category", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody Category update) {
        Optional<Category> opt = categoryRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Category not found"));
        }

        Category existing = opt.get();
        if (update.getName() != null) {
            existing.setName(update.getName().trim());
            existing.setSlug(update.getName().trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""));
        }
        if (update.getDescription() != null) existing.setDescription(update.getDescription());
        if (update.getIcon() != null) existing.setIcon(update.getIcon());
        existing.setUpdatedAt(Instant.now().toString());

        Category saved = categoryRepository.save(existing);
        return ResponseEntity.ok(Map.of("success", true, "category", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        long count = productRepository.countByCategory(id);
        if (count > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete category. It currently contains " + count + " active products."));
        }

        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Category not found"));
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Category deleted successfully"));
    }
}
