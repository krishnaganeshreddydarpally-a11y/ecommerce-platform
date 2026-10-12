package com.eshop.ecommerce.controller;

import com.eshop.ecommerce.model.Order;
import com.eshop.ecommerce.model.Product;
import com.eshop.ecommerce.model.User;
import com.eshop.ecommerce.repository.OrderRepository;
import com.eshop.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) body.get("items");
        if (itemsData == null || itemsData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No order items provided"));
        }

        Map<String, String> addressData = (Map<String, String>) body.get("shippingAddress");
        if (addressData == null || addressData.get("fullName") == null || addressData.get("street") == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incomplete shipping address"));
        }

        double subtotal = 0;
        List<Order.OrderItem> orderItems = new ArrayList<>();

        for (Map<String, Object> itemMap : itemsData) {
            String prodId = (String) itemMap.get("id");
            int quantity = itemMap.get("quantity") instanceof Number ? ((Number) itemMap.get("quantity")).intValue() : 1;
            double price = itemMap.get("price") instanceof Number ? ((Number) itemMap.get("price")).doubleValue() : 0.0;
            String name = (String) itemMap.get("name");
            String image = (String) itemMap.get("image");

            Optional<Product> prodOpt = productRepository.findById(prodId);
            if (prodOpt.isPresent()) {
                Product prod = prodOpt.get();
                price = prod.getPrice();
                name = prod.getName();
                if (prod.getImages() != null && !prod.getImages().isEmpty()) {
                    image = prod.getImages().get(0);
                }
                // Reduce stock
                prod.setStock(Math.max(0, prod.getStock() - quantity));
                productRepository.save(prod);
            }

            subtotal += price * quantity;
            orderItems.add(new Order.OrderItem(prodId, name, price, quantity, image));
        }

        double tax = Math.round(subtotal * 0.08 * 100.0) / 100.0;
        double shippingFee = subtotal > 100 ? 0.0 : 15.0;
        double total = Math.round((subtotal + tax + shippingFee) * 100.0) / 100.0;

        Order.Address address = new Order.Address();
        address.setFullName(addressData.get("fullName"));
        address.setStreet(addressData.get("street"));
        address.setCity(addressData.get("city"));
        address.setState(addressData.get("state"));
        address.setPostalCode(addressData.get("postalCode"));
        address.setCountry(addressData.get("country"));

        Order order = new Order();
        order.setId("ord_" + System.currentTimeMillis());
        order.setUserId(user.getId());
        order.setCustomerName(user.getName());
        order.setCustomerEmail(user.getEmail());
        order.setItems(orderItems);
        order.setShippingAddress(address);
        order.setPaymentMethod((String) body.getOrDefault("paymentMethod", "Credit Card"));
        order.setPaymentStatus("Paid");
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingFee(shippingFee);
        order.setTotal(total);
        order.setStatus("Processing");
        order.setTrackingNumber("TRK-" + (10000 + new Random().nextInt(90000)) + "-US");

        List<Order.TimelineEvent> timeline = new ArrayList<>();
        timeline.add(new Order.TimelineEvent("Order Placed", Instant.now().toString(), "Order placed and verified."));
        timeline.add(new Order.TimelineEvent("Payment Confirmed", Instant.now().toString(), "Payment captured successfully."));
        order.setTimeline(timeline);

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "order", saved));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(Map.of("success", true, "count", orders.size(), "orders", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        if (!order.getUserId().equals(user.getId()) && !"admin".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not authorized"));
        }

        return ResponseEntity.ok(Map.of("success", true, "order", order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not authenticated"));
        }

        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        Order order = orderOpt.get();
        if (!order.getUserId().equals(user.getId()) && !"admin".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not authorized"));
        }

        if (!"Processing".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Order cannot be cancelled in state " + order.getStatus()));
        }

        order.setStatus("Cancelled");
        order.getTimeline().add(new Order.TimelineEvent("Cancelled", Instant.now().toString(), "Cancelled by customer."));
        order.setUpdatedAt(Instant.now().toString());

        // Restore stock
        for (Order.OrderItem item : order.getItems()) {
            productRepository.findById(item.getId()).ifPresent(prod -> {
                prod.setStock(prod.getStock() + item.getQuantity());
                productRepository.save(prod);
            });
        }

        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(Map.of("success", true, "order", saved, "message", "Order cancelled successfully"));
    }
}
