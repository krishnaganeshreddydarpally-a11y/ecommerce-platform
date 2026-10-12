package com.eshop.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String slug;
    private String description = "";
    private double price;
    private Double originalPrice;
    private String category;
    private String categoryName;
    private double rating = 5.0;
    private int numReviews = 0;
    private int stock = 0;
    private boolean featured = false;
    private List<String> images = new ArrayList<>();
    private Map<String, String> specs = new HashMap<>();
    private List<Review> reviews = new ArrayList<>();
    private String createdAt = Instant.now().toString();
    private String updatedAt = Instant.now().toString();

    public static class Review {
        private String id;
        private String userId;
        private String userName;
        private int rating;
        private String comment;
        private String createdAt = Instant.now().toString();

        public Review() {}

        public Review(String id, String userId, String userName, int rating, String comment) {
            this.id = id;
            this.userId = userId;
            this.userName = userName;
            this.rating = rating;
            this.comment = comment;
            this.createdAt = Instant.now().toString();
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public Product() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getNumReviews() { return numReviews; }
    public void setNumReviews(int numReviews) { this.numReviews = numReviews; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public Map<String, String> getSpecs() { return specs; }
    public void setSpecs(Map<String, String> specs) { this.specs = specs; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
