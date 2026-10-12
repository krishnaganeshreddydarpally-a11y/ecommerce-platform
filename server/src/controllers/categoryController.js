import { Categories, Products } from '../db/db.js';

export const getCategories = (req, res) => {
  try {
    const categories = Categories.read();
    // Add product counts for each category
    const categoriesWithCounts = categories.map((cat) => {
      const count = Products.count((p) => p.category === cat.id);
      return { ...cat, productCount: count };
    });

    res.json({
      success: true,
      categories: categoriesWithCounts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const createCategory = (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = Categories.create({
      name: name.trim(),
      slug,
      description: description || '',
      icon: icon || 'Folder',
    });

    res.status(201).json({
      success: true,
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
};

export const updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const existing = Categories.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (icon) updateData.icon = icon;

    const updated = Categories.updateById(id, updateData);

    // Also update categoryName in products if name changed
    if (name && name.trim() !== existing.name) {
      const prods = Products.find((p) => p.category === id);
      prods.forEach((p) => {
        Products.updateById(p.id, { categoryName: name.trim() });
      });
    }

    res.json({
      success: true,
      category: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category' });
  }
};

export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    const productCount = Products.count((p) => p.category === id);
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It currently contains ${productCount} active products. Reassign or delete products first.`,
      });
    }

    const deleted = Categories.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
