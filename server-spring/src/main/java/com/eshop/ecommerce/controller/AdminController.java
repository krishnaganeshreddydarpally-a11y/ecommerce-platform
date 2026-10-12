package com.eshop.ecommerce.controller;

import com.eshop.ecommerce.model.Category;
import com.eshop.ecommerce.model.Order;
import com.eshop.ecommerce.model.Product;
import com.eshop.ecommerce.model.User;
import com.eshop.ecommerce.repository.CategoryRepository;
import com.eshop.ecommerce.repository.OrderRepository;
import com.eshop.ecommerce.repository.ProductRepository;
import com.eshop.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<User> users = userRepository.findAll();
        List<Category> categories = categoryRepository.findAll();

        List<Order> validOrders = orders.stream()
                .filter(o -> !"Cancelled".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        double totalRevenue = validOrders.stream().mapToDouble(Order::getTotal).sum();
        totalRevenue = Math.round(totalRevenue * 100.0) / 100.0;
        double aov = validOrders.isEmpty() ? 0.0 : Math.round((totalRevenue / validOrders.size()) * 100.0) / 100.0;

        Map<String, Long> statusCounts = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getStatus() != null ? o.getStatus() : "Processing", Collectors.counting()));

        // Low stock products
        List<Product> lowStock = products.stream().filter(p -> p.getStock() < 20).collect(Collectors.toList());

        // 7-day timeline
        List<Map<String, Object>> salesTimeline = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter dayFormat = DateTimeFormatter.ofPattern("EEE, MMM d");
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            String dateStr = d.toString();
            List<Order> dayOrders = validOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().startsWith(dateStr))
                    .collect(Collectors.toList());
            double dayRev = dayOrders.stream().mapToDouble(Order::getTotal).sum();

            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", dateStr);
            dayMap.put("label", d.format(dayFormat));
            dayMap.put("revenue", Math.round(dayRev * 100.0) / 100.0);
            dayMap.put("ordersCount", dayOrders.size());
            salesTimeline.add(dayMap);
        }

        // Top selling products
        Map<String, Map<String, Object>> topMap = new HashMap<>();
        for (Order o : validOrders) {
            for (Order.OrderItem item : o.getItems()) {
                Map<String, Object> entry = topMap.computeIfAbsent(item.getId(), k -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", item.getId());
                    m.put("name", item.getName());
                    m.put("price", item.getPrice());
                    m.put("image", item.getImage());
                    m.put("unitsSold", 0);
                    m.put("revenue", 0.0);
                    return m;
                });
                int currentUnits = (int) entry.get("unitsSold");
                double currentRev = (double) entry.get("revenue");
                entry.put("unitsSold", currentUnits + item.getQuantity());
                entry.put("revenue", Math.round((currentRev + (item.getPrice() * item.getQuantity())) * 100.0) / 100.0);
            }
        }

        List<Map<String, Object>> topSelling = topMap.values().stream()
                .sorted((a, b) -> Double.compare((double) b.get("revenue"), (double) a.get("revenue")))
                .limit(5)
                .collect(Collectors.toList());

        // Category distribution
        List<Map<String, Object>> catDist = new ArrayList<>();
        for (Category cat : categories) {
            List<Product> catProds = products.stream().filter(p -> cat.getId().equals(p.getCategory())).collect(Collectors.toList());
            double catRev = 0;
            int catUnits = 0;
            for (Order o : validOrders) {
                for (Order.OrderItem itm : o.getItems()) {
                    boolean match = catProds.stream().anyMatch(p -> p.getId().equals(itm.getId()));
                    if (match) {
                        catRev += itm.getPrice() * itm.getQuantity();
                        catUnits += itm.getQuantity();
                    }
                }
            }
            Map<String, Object> cMap = new HashMap<>();
            cMap.put("id", cat.getId());
            cMap.put("name", cat.getName());
            cMap.put("productCount", catProds.size());
            cMap.put("revenue", Math.round(catRev * 100.0) / 100.0);
            cMap.put("unitsSold", catUnits);
            catDist.add(cMap);
        }

        // Recent orders
        List<Order> recent = orders.stream()
                .sorted((a, b) -> (b.getCreatedAt() != null ? b.getCreatedAt() : "").compareTo(a.getCreatedAt() != null ? a.getCreatedAt() : ""))
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("averageOrderValue", aov);
        stats.put("totalOrders", orders.size());
        stats.put("totalUsers", users.size());
        stats.put("totalProducts", products.size());
        stats.put("totalCategories", categories.size());
        stats.put("statusCounts", statusCounts);
        stats.put("salesTimeline", salesTimeline);
        stats.put("topSellingProducts", topSelling);
        stats.put("categoryDistribution", catDist);
        stats.put("recentOrders", recent);
        stats.put("lowStockProducts", lowStock);

        return ResponseEntity.ok(Map.of("success", true, "stats", stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getAllOrders(@RequestParam(required = false) String status) {
        List<Order> orders;
        if (status != null && !status.equalsIgnoreCase("All")) {
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(Map.of("success", true, "count", orders.size(), "orders", orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String note = body.get("note");

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        order.setStatus(status);
        order.getTimeline().add(new Order.TimelineEvent(status, Instant.now().toString(), note != null ? note : "Status updated to " + status));
        order.setUpdatedAt(Instant.now().toString());

        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(Map.of("success", true, "order", saved));
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> cleanUsers = users.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("role", u.getRole());
            m.put("avatar", u.getAvatar());
            m.put("createdAt", u.getCreatedAt());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("success", true, "count", cleanUsers.size(), "users", cleanUsers));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("success", true, "message", "User role updated successfully"));
    }
}
