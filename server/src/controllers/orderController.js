import { Orders, Products } from '../db/db.js';

export const createOrder = (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Incomplete shipping address' });
    }

    // Calculate totals and verify items
    let subtotal = 0;
    const validatedItems = items.map((item) => {
      const product = Products.findById(item.id);
      const price = product ? product.price : Number(item.price);
      const itemTotal = price * Number(item.quantity);
      subtotal += itemTotal;

      // Deduct stock if product exists
      if (product && product.stock >= item.quantity) {
        Products.updateById(item.id, {
          stock: Math.max(0, product.stock - item.quantity),
        });
      }

      return {
        id: item.id,
        name: product ? product.name : item.name,
        price,
        quantity: Number(item.quantity),
        image: product && product.images ? product.images[0] : item.image,
      };
    });

    const tax = Number((subtotal * 0.08).toFixed(2));
    const shippingFee = subtotal > 100 ? 0.0 : 15.0;
    const total = Number((subtotal + tax + shippingFee).toFixed(2));

    const trackingNumber = `TRK-${Math.floor(10000 + Math.random() * 90000)}-${(shippingAddress.country || 'US').slice(0, 2).toUpperCase()}`;

    const newOrder = Orders.create({
      userId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      shippingFee,
      total,
      status: 'Processing',
      trackingNumber,
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: 'Your order was successfully placed and verified.',
        },
        {
          status: 'Payment Confirmed',
          timestamp: new Date().toISOString(),
          note: `Payment via ${paymentMethod || 'Credit Card'} captured.`,
        },
      ],
    });

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getMyOrders = (req, res) => {
  try {
    const orders = Orders.find((o) => o.userId === req.user.id);
    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
};

export const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control: User can only view their own order unless Admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

export const cancelOrder = (req, res) => {
  try {
    const { id } = req.params;
    const order = Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'Processing') {
      return res.status(400).json({
        message: `Order cannot be cancelled because it is already marked as ${order.status}`,
      });
    }

    const timeline = order.timeline || [];
    timeline.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      note: 'Order was cancelled by customer.',
    });

    // Return stock
    order.items.forEach((item) => {
      const prod = Products.findById(item.id);
      if (prod) {
        Products.updateById(item.id, { stock: prod.stock + item.quantity });
      }
    });

    const updated = Orders.updateById(id, {
      status: 'Cancelled',
      timeline,
    });

    res.json({
      success: true,
      order: updated,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};
