import bcrypt from 'bcryptjs';
import { Users, Products, Categories, Orders } from './db.js';

export const seedDatabase = async () => {
  const existingUsers = Users.read();
  if (existingUsers.length > 0) {
    return; // Already seeded
  }

  console.log('Seeding initial e-commerce database...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // Users
  const adminUser = Users.create({
    id: 'user_admin',
    name: 'Admin User',
    email: 'admin@eshop.com',
    password: passwordHash,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const customerUser = Users.create({
    id: 'user_customer',
    name: 'Alex Morgan',
    email: 'user@eshop.com',
    password: userPasswordHash,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  // Categories
  const categoriesData = [
    {
      id: 'cat_electronics',
      name: 'Electronics & Computers',
      slug: 'electronics',
      description: 'Laptops, displays, and cutting edge tech gear',
      icon: 'Laptop',
    },
    {
      id: 'cat_audio',
      name: 'Audio & Headphones',
      slug: 'audio',
      description: 'Studio headphones, true wireless earbuds, and speakers',
      icon: 'Headphones',
    },
    {
      id: 'cat_wearables',
      name: 'Wearables & Smart Tech',
      slug: 'wearables',
      description: 'Smartwatches, fitness bands, and wearable devices',
      icon: 'Watch',
    },
    {
      id: 'cat_home',
      name: 'Home & Workspace',
      slug: 'home-office',
      description: 'Ergonomic furniture, desk lamps, and office essentials',
      icon: 'Home',
    },
    {
      id: 'cat_fashion',
      name: 'Fashion & Accessories',
      slug: 'fashion',
      description: 'Minimalist backpacks, jackets, and everyday apparel',
      icon: 'ShoppingBag',
    },
  ];

  categoriesData.forEach((cat) => Categories.create(cat));

  // Products
  const productsData = [
    {
      id: 'prod_1',
      name: 'Aura Pro Noise-Cancelling Headphones',
      slug: 'aura-pro-noise-cancelling-headphones',
      description: 'Engineered with custom high-fidelity acoustic architecture, spatial audio tracking, and up to 40 hours of battery life with adaptive hybrid ANC.',
      price: 279.99,
      originalPrice: 329.99,
      category: 'cat_audio',
      categoryName: 'Audio & Headphones',
      rating: 4.8,
      numReviews: 128,
      stock: 45,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Connectivity: 'Bluetooth 5.3 & 3.5mm Aux',
        BatteryLife: '40 Hours ANC On',
        Weight: '254 grams',
        Warranty: '2 Years Manufacturer',
      },
    },
    {
      id: 'prod_2',
      name: 'Apex Studio 4K Ultra-Wide Monitor',
      slug: 'apex-studio-4k-ultrawide-monitor',
      description: 'A stunning 34-inch curved IPS monitor with 144Hz refresh rate, 98% DCI-P3 color gamut, and 90W USB-C single cable power delivery for professionals.',
      price: 649.0,
      originalPrice: 799.0,
      category: 'cat_electronics',
      categoryName: 'Electronics & Computers',
      rating: 4.9,
      numReviews: 86,
      stock: 18,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        ScreenSize: '34-inch 21:9 Curved IPS',
        Resolution: '3440 x 1440 WQHD',
        RefreshRate: '144Hz 1ms response',
        Ports: 'HDMI 2.1, DP 1.4, USB-C 90W',
      },
    },
    {
      id: 'prod_3',
      name: 'Vanguard Chrono Smartwatch Ultra',
      slug: 'vanguard-chrono-smartwatch-ultra',
      description: 'Aerospace-grade titanium chassis with sapphire crystal face, dual-frequency GPS, ECG monitor, and water resistance down to 100 meters.',
      price: 349.5,
      originalPrice: 399.0,
      category: 'cat_wearables',
      categoryName: 'Wearables & Smart Tech',
      rating: 4.7,
      numReviews: 215,
      stock: 32,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Material: 'Titanium & Sapphire Glass',
        Battery: 'Up to 5 Days Normal Use',
        Sensors: 'ECG, SpO2, Heart Rate, Compass',
        WaterRating: '10 ATM (100m)',
      },
    },
    {
      id: 'prod_4',
      name: 'Nomad Minimalist Waterproof Commuter Backpack',
      slug: 'nomad-minimalist-waterproof-commuter-backpack',
      description: 'Crafted from recycled weatherproof Cordura ballistic nylon. Features dedicated padded 16-inch laptop compartment, hidden RFID passport pocket, and magnetic quick-release clasps.',
      price: 119.0,
      originalPrice: 149.0,
      category: 'cat_fashion',
      categoryName: 'Fashion & Accessories',
      rating: 4.6,
      numReviews: 94,
      stock: 50,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Capacity: '22 Liters',
        LaptopFit: 'Fits up to 16-inch MacBook Pro',
        Material: 'Recycled 840D Cordura Nylon',
        Weight: '980 grams',
      },
    },
    {
      id: 'prod_5',
      name: 'Lumina Warm LED Architectural Desk Lamp',
      slug: 'lumina-warm-led-architectural-desk-lamp',
      description: 'Aircraft aluminum articulating lamp with 5 color temperatures, smooth step-less touch dimming, built-in 15W Qi wireless phone charging pad, and USB-C port.',
      price: 89.95,
      originalPrice: 110.0,
      category: 'cat_home',
      categoryName: 'Home & Workspace',
      rating: 4.9,
      numReviews: 62,
      stock: 25,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Brightness: '1200 Lumens Max',
        CCT: '2700K - 6500K 5 Levels',
        WirelessCharger: '15W Fast Charge Qi',
        Lifespan: '50,000 Hours LED lifespan',
      },
    },
    {
      id: 'prod_6',
      name: 'Keychron Mechanical Wireless Keyboard Q3',
      slug: 'keychron-mechanical-wireless-keyboard-q3',
      description: 'Custom gasket-mount mechanical keyboard featuring hot-swappable tactile switches, double-shot PBT keycaps, per-key RGB backlighting, and CNC anodized aluminum frame.',
      price: 179.0,
      originalPrice: 199.0,
      category: 'cat_electronics',
      categoryName: 'Electronics & Computers',
      rating: 4.8,
      numReviews: 140,
      stock: 14,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Layout: 'Tenkeyless (80%)',
        Switches: 'Gateron G Pro Brown Tactile',
        Battery: '4000mAh up to 300 hrs',
        Connectivity: 'Bluetooth 5.1 & USB-C wired',
      },
    },
    {
      id: 'prod_7',
      name: 'Pulse True Wireless Earbuds with ANC',
      slug: 'pulse-true-wireless-earbuds-with-anc',
      description: 'Ultra-compact earbuds delivering deep punchy bass, crystal-clear call quality with 6 environmental noise-cancelling microphones, and fast wireless charging case.',
      price: 129.99,
      originalPrice: 159.99,
      category: 'cat_audio',
      categoryName: 'Audio & Headphones',
      rating: 4.5,
      numReviews: 180,
      stock: 65,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        Waterproof: 'IPX5 Sweat & Water Resistant',
        Playtime: '8 Hours (32 Hours total with Case)',
        Driver: '11mm Dynamic Bio-Diaphragm',
        Latency: 'Low-latency 45ms gaming mode',
      },
    },
    {
      id: 'prod_8',
      name: 'ErgoForm Breathable Mesh Task Chair',
      slug: 'ergoform-breathable-mesh-task-chair',
      description: 'Engineered for full ergonomic support during long workdays. 3D adjustable armrests, adaptive lumbar support, synchronized recline mechanism, and Class-4 gas lift.',
      price: 389.0,
      originalPrice: 450.0,
      category: 'cat_home',
      categoryName: 'Home & Workspace',
      rating: 4.7,
      numReviews: 73,
      stock: 12,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&auto=format&fit=crop&q=80',
      ],
      specs: {
        WeightCapacity: '330 lbs / 150 kg',
        Adjustment: 'Lumbar, Armrests, Headrest, Tilt',
        Warranty: '5 Years Manufacturer Guarantee',
      },
    },
  ];

  productsData.forEach((prod) => Products.create(prod));

  // Seed initial demo orders for the demo customer
  Orders.create({
    id: 'ord_1001',
    userId: customerUser.id,
    customerName: customerUser.name,
    customerEmail: customerUser.email,
    items: [
      {
        id: 'prod_1',
        name: 'Aura Pro Noise-Cancelling Headphones',
        price: 279.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      country: 'United States',
    },
    paymentMethod: 'Credit Card (Stripe Simulated)',
    paymentStatus: 'Paid',
    subtotal: 279.99,
    tax: 22.4,
    shippingFee: 0.0,
    total: 302.39,
    status: 'Delivered',
    trackingNumber: 'TRK-98234-US',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-09-28T14:30:00Z', note: 'Order placed by customer' },
      { status: 'Payment Confirmed', timestamp: '2026-09-28T14:31:00Z', note: 'Payment processed successfully' },
      { status: 'Shipped', timestamp: '2026-09-29T10:00:00Z', note: 'Shipped via Express Priority' },
      { status: 'Delivered', timestamp: '2026-10-01T15:20:00Z', note: 'Delivered at front porch' },
    ],
    createdAt: '2026-09-28T14:30:00Z',
  });

  Orders.create({
    id: 'ord_1002',
    userId: customerUser.id,
    customerName: customerUser.name,
    customerEmail: customerUser.email,
    items: [
      {
        id: 'prod_4',
        name: 'Nomad Minimalist Waterproof Commuter Backpack',
        price: 119.0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'prod_5',
        name: 'Lumina Warm LED Architectural Desk Lamp',
        price: 89.95,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      country: 'United States',
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    subtotal: 208.95,
    tax: 16.72,
    shippingFee: 15.0,
    total: 240.67,
    status: 'Shipped',
    trackingNumber: 'TRK-98711-US',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-10-04T09:12:00Z', note: 'Order placed by customer' },
      { status: 'Payment Confirmed', timestamp: '2026-10-04T09:13:00Z', note: 'Payment processed successfully' },
      { status: 'Shipped', timestamp: '2026-10-04T16:45:00Z', note: 'Handed off to courier facility' },
    ],
    createdAt: '2026-10-04T09:12:00Z',
  });

  console.log('Database seeded successfully!');
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Done');
    process.exit(0);
  });
}
