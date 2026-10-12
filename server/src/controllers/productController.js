import { Products, Categories } from '../db/db.js';

export const getProducts = (req, res) => {
  try {
    let products = Products.read();
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    // Filter by search query
    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(
        (p) => p.category === category || (p.slug && p.category === `cat_${category}`)
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter((p) => p.featured === true);
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        products = products.filter((p) => p.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        products = products.filter((p) => p.price <= max);
      }
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default newest
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

export const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = Products.findById(id) || Products.findOne((p) => p.slug === id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Related products from same category
    const related = Products.find((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    res.json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product details' });
  }
};

export const addReview = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const product = Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = product.reviews || [];
    const newReview = {
      id: `rev_${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    // Recalculate average rating
    const avgRating = Number(
      (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
    );

    const updated = Products.updateById(id, {
      reviews,
      rating: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      product: updated,
      message: 'Review added successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Admin controllers
export const createProduct = (req, res) => {
  try {
    const { name, description, price, originalPrice, category, stock, images, specs, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const cat = Categories.findById(category);

    const newProduct = Products.create({
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      category,
      categoryName: cat ? cat.name : 'General',
      stock: parseInt(stock, 10) || 0,
      rating: 5.0,
      numReviews: 0,
      featured: Boolean(featured),
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      ],
      specs: specs || {},
      reviews: [],
    });

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = Products.findById(id);

    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock, 10);
    if (updateData.category) {
      const cat = Categories.findById(updateData.category);
      if (cat) updateData.categoryName = cat.name;
    }

    const updated = Products.updateById(id, updateData);

    res.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = Products.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
