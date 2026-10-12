import { Users, Products, Orders, Categories } from '../db/db.js';

export const getDashboardStats = (req, res) => {
  try {
    const orders = Orders.read();
    const products = Products.read();
    const users = Users.read();
    const categories = Categories.read();

    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;
    const totalCategories = categories.length;

    // Calculate revenue (exclude cancelled orders)
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    // Recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Low stock products (< 20 units)
    const lowStockProducts = products.filter((p) => p.stock < 20);

    // Order status breakdown
    const statusCounts = {
      Processing: orders.filter((o) => o.status === 'Processing').length,
      Shipped: orders.filter((o) => o.status === 'Shipped').length,
      Delivered: orders.filter((o) => o.status === 'Delivered').length,
      Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    };

    // 7-day Sales Timeline
    const today = new Date();
    const salesTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayOrders = validOrders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      salesTimeline.push({
        date: dateStr,
        label: dayLabel,
        revenue: Number(dayRevenue.toFixed(2)),
        ordersCount: dayOrders.length,
      });
    }

    // Top Selling Products Leaderboard
    const productSalesMap = {};
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (!productSalesMap[item.id]) {
          productSalesMap[item.id] = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            unitsSold: 0,
            revenue: 0,
          };
        }
        productSalesMap[item.id].unitsSold += item.quantity || 1;
        productSalesMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Category Sales and Product Distribution
    const categoryDistribution = categories.map((cat) => {
      const catProducts = products.filter((p) => p.category === cat.id);
      let catRevenue = 0;
      let catUnitsSold = 0;

      validOrders.forEach((o) => {
        (o.items || []).forEach((item) => {
          const matchProd = catProducts.find((p) => p.id === item.id);
          if (matchProd) {
            catRevenue += (item.price || 0) * (item.quantity || 1);
            catUnitsSold += item.quantity || 1;
          }
        });
      });

      return {
        id: cat.id,
        name: cat.name,
        productCount: catProducts.length,
        revenue: Number(catRevenue.toFixed(2)),
        unitsSold: catUnitsSold,
      };
    });

    res.json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        totalOrders,
        totalUsers,
        totalProducts,
        totalCategories,
        statusCounts,
        salesTimeline,
        topSellingProducts,
        categoryDistribution,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ message: 'Failed to generate admin statistics' });
  }
};

export const getAllOrders = (req, res) => {
  try {
    const { status } = req.query;
    let orders = Orders.read();

    if (status && status !== 'All') {
      orders = orders.filter((o) => o.status === status);
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve all orders' });
  }
};

export const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const timeline = order.timeline || [];
    timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order marked as ${status} by Administrator.`,
    });

    const updated = Orders.updateById(id, {
      status,
      timeline,
    });

    res.json({
      success: true,
      order: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const getAllUsers = (req, res) => {
  try {
    const users = Users.read().map((u) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

export const updateUserRole = (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }

    const updated = Users.updateById(id, { role });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = updated;
    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
