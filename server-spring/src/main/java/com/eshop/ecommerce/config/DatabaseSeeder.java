package com.eshop.ecommerce.config;

import com.eshop.ecommerce.model.Category;
import com.eshop.ecommerce.model.Order;
import com.eshop.ecommerce.model.Product;
import com.eshop.ecommerce.model.User;
import com.eshop.ecommerce.repository.CategoryRepository;
import com.eshop.ecommerce.repository.OrderRepository;
import com.eshop.ecommerce.repository.ProductRepository;
import com.eshop.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println("Seeding Spring Boot MongoDB Atlas database...");

        // 1. Seed Users
        User admin = new User(
                "user_admin",
                "Admin User",
                "admin@eshop.com",
                passwordEncoder.encode("admin123"),
                "admin",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        );
        userRepository.save(admin);

        User customer = new User(
                "user_customer",
                "Alex Morgan",
                "user@eshop.com",
                passwordEncoder.encode("user123"),
                "customer",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        );
        userRepository.save(customer);

        // 2. Seed Categories
        List<Category> categories = Arrays.asList(
                new Category("cat_electronics", "Electronics & Computers", "electronics", "Laptops, displays, and cutting edge tech gear", "Laptop"),
                new Category("cat_audio", "Audio & Headphones", "audio", "Studio headphones, true wireless earbuds, and speakers", "Headphones"),
                new Category("cat_wearables", "Wearables & Smart Tech", "wearables", "Smartwatches, fitness bands, and wearable devices", "Watch"),
                new Category("cat_home", "Home & Workspace", "home-office", "Ergonomic furniture, desk lamps, and office essentials", "Home"),
                new Category("cat_fashion", "Fashion & Accessories", "fashion", "Minimalist backpacks, jackets, and everyday apparel", "ShoppingBag")
        );
        categoryRepository.saveAll(categories);

        // 3. Seed Products
        List<Product> products = new ArrayList<>();

        Product p1 = new Product();
        p1.setId("prod_1");
        p1.setName("Aura Pro Noise-Cancelling Headphones");
        p1.setSlug("aura-pro-noise-cancelling-headphones");
        p1.setDescription("Engineered with custom high-fidelity acoustic architecture, spatial audio tracking, and up to 40 hours of battery life with adaptive hybrid ANC.");
        p1.setPrice(279.99);
        p1.setOriginalPrice(329.99);
        p1.setCategory("cat_audio");
        p1.setCategoryName("Audio & Headphones");
        p1.setRating(4.8);
        p1.setNumReviews(128);
        p1.setStock(45);
        p1.setFeatured(true);
        p1.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p1);

        Product p2 = new Product();
        p2.setId("prod_2");
        p2.setName("Apex Studio 4K Ultra-Wide Monitor");
        p2.setSlug("apex-studio-4k-ultrawide-monitor");
        p2.setDescription("A stunning 34-inch curved IPS monitor with 144Hz refresh rate, 98% DCI-P3 color gamut, and 90W USB-C single cable power delivery.");
        p2.setPrice(649.0);
        p2.setOriginalPrice(799.0);
        p2.setCategory("cat_electronics");
        p2.setCategoryName("Electronics & Computers");
        p2.setRating(4.9);
        p2.setNumReviews(86);
        p2.setStock(18);
        p2.setFeatured(true);
        p2.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p2);

        Product p3 = new Product();
        p3.setId("prod_3");
        p3.setName("Vanguard Chrono Smartwatch Ultra");
        p3.setSlug("vanguard-chrono-smartwatch-ultra");
        p3.setDescription("Aerospace-grade titanium chassis with sapphire crystal face, dual-frequency GPS, ECG monitor, and water resistance down to 100 meters.");
        p3.setPrice(349.50);
        p3.setOriginalPrice(399.0);
        p3.setCategory("cat_wearables");
        p3.setCategoryName("Wearables & Smart Tech");
        p3.setRating(4.7);
        p3.setNumReviews(215);
        p3.setStock(32);
        p3.setFeatured(true);
        p3.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p3);

        Product p4 = new Product();
        p4.setId("prod_4");
        p4.setName("Nomad Minimalist Waterproof Commuter Backpack");
        p4.setSlug("nomad-minimalist-waterproof-commuter-backpack");
        p4.setDescription("Crafted from recycled weatherproof Cordura ballistic nylon. Features dedicated padded 16-inch laptop compartment and magnetic quick-release clasps.");
        p4.setPrice(119.0);
        p4.setOriginalPrice(149.0);
        p4.setCategory("cat_fashion");
        p4.setCategoryName("Fashion & Accessories");
        p4.setRating(4.6);
        p4.setNumReviews(94);
        p4.setStock(50);
        p4.setFeatured(false);
        p4.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p4);

        Product p5 = new Product();
        p5.setId("prod_5");
        p5.setName("Lumina Warm LED Architectural Desk Lamp");
        p5.setSlug("lumina-warm-led-architectural-desk-lamp");
        p5.setDescription("Aircraft aluminum articulating lamp with 5 color temperatures, smooth step-less touch dimming, and built-in 15W Qi wireless phone charging pad.");
        p5.setPrice(89.95);
        p5.setOriginalPrice(110.0);
        p5.setCategory("cat_home");
        p5.setCategoryName("Home & Workspace");
        p5.setRating(4.9);
        p5.setNumReviews(62);
        p5.setStock(25);
        p5.setFeatured(false);
        p5.setImages(Collections.singletonList(
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p5);

        Product p6 = new Product();
        p6.setId("prod_6");
        p6.setName("Keychron Mechanical Wireless Keyboard Q3");
        p6.setSlug("keychron-mechanical-wireless-keyboard-q3");
        p6.setDescription("Custom gasket-mount mechanical keyboard featuring hot-swappable tactile switches, double-shot PBT keycaps, and CNC anodized aluminum frame.");
        p6.setPrice(179.0);
        p6.setOriginalPrice(199.0);
        p6.setCategory("cat_electronics");
        p6.setCategoryName("Electronics & Computers");
        p6.setRating(4.8);
        p6.setNumReviews(140);
        p6.setStock(14);
        p6.setFeatured(true);
        p6.setImages(Collections.singletonList(
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p6);

        Product p7 = new Product();
        p7.setId("prod_7");
        p7.setName("Pulse True Wireless Earbuds with ANC");
        p7.setSlug("pulse-true-wireless-earbuds-with-anc");
        p7.setDescription("Ultra-compact earbuds delivering deep punchy bass, crystal-clear call quality with 6 environmental noise-cancelling microphones.");
        p7.setPrice(129.99);
        p7.setOriginalPrice(159.99);
        p7.setCategory("cat_audio");
        p7.setCategoryName("Audio & Headphones");
        p7.setRating(4.5);
        p7.setNumReviews(180);
        p7.setStock(65);
        p7.setFeatured(false);
        p7.setImages(Collections.singletonList(
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p7);

        Product p8 = new Product();
        p8.setId("prod_8");
        p8.setName("ErgoForm Breathable Mesh Task Chair");
        p8.setSlug("ergoform-breathable-mesh-task-chair");
        p8.setDescription("Engineered for full ergonomic support during long workdays. 3D adjustable armrests, adaptive lumbar support, and synchronized recline.");
        p8.setPrice(389.0);
        p8.setOriginalPrice(450.0);
        p8.setCategory("cat_home");
        p8.setCategoryName("Home & Workspace");
        p8.setRating(4.7);
        p8.setNumReviews(73);
        p8.setStock(12);
        p8.setFeatured(false);
        p8.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&auto=format&fit=crop&q=80"
        ));
        products.add(p8);

        productRepository.saveAll(products);

        // 4. Seed Demo Orders
        Order o1 = new Order();
        o1.setId("ord_1001");
        o1.setUserId("user_customer");
        o1.setCustomerName("Alex Morgan");
        o1.setCustomerEmail("user@eshop.com");
        o1.setItems(Collections.singletonList(
                new Order.OrderItem("prod_1", "Aura Pro Noise-Cancelling Headphones", 279.99, 1, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80")
        ));
        Order.Address a1 = new Order.Address();
        a1.setFullName("Alex Morgan");
        a1.setStreet("742 Evergreen Terrace");
        a1.setCity("Springfield");
        a1.setState("IL");
        a1.setPostalCode("62704");
        a1.setCountry("United States");
        o1.setShippingAddress(a1);
        o1.setSubtotal(279.99);
        o1.setTax(22.40);
        o1.setShippingFee(0.0);
        o1.setTotal(302.39);
        o1.setStatus("Delivered");
        o1.setTrackingNumber("TRK-98234-US");
        o1.setTimeline(Arrays.asList(
                new Order.TimelineEvent("Order Placed", Instant.now().minusSeconds(86400 * 4).toString(), "Order placed by customer"),
                new Order.TimelineEvent("Payment Confirmed", Instant.now().minusSeconds(86400 * 4).toString(), "Payment processed successfully"),
                new Order.TimelineEvent("Shipped", Instant.now().minusSeconds(86400 * 2).toString(), "Shipped via Express Priority"),
                new Order.TimelineEvent("Delivered", Instant.now().minusSeconds(86400).toString(), "Delivered at front porch")
        ));
        orderRepository.save(o1);

        System.out.println("Spring Boot database seeded successfully!");
    }
}
