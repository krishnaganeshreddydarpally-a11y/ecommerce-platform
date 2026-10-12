import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Folder,
  Laptop,
  Headphones,
  Watch,
  Home,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Tag,
} from 'lucide-react';
import { api } from '../../services/api';
import AdminNav from '../../components/AdminNav';

const AVAILABLE_ICONS = [

  { name: 'Folder', icon: Folder },
  { name: 'Laptop', icon: Laptop },
  { name: 'Headphones', icon: Headphones },
  { name: 'Watch', icon: Watch },
  { name: 'Home', icon: Home },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Tag', icon: Tag },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Folder',
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Folder',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Folder',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert(err.message || 'Error saving category');
    }
  };

  const handleDelete = async (cat) => {
    if (cat.productCount > 0) {
      alert(`Cannot delete "${cat.name}". It still contains ${cat.productCount} active products. Please reassign or delete these products first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      await api.deleteCategory(cat.id);
      loadCategories();
    } catch (err) {
      alert(err.message || 'Error deleting category');
    }
  };

  const renderIcon = (iconName, size = 18) => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName);
    const IconComponent = found ? found.icon : Folder;
    return <IconComponent size={size} />;
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Organize your store catalog into browseable departments</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AdminNav />
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-md shadow-indigo-200 text-xs transition-colors"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>


      {/* Categories Grid and Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-xs text-slate-400">{filteredCategories.length} categories</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-3xl border border-slate-200 h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      {renderIcon(cat.icon, 22)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">slug: {cat.slug || cat.id}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      cat.productCount > 0
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.productCount || 0} products
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View in Catalog →
                  </Link>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming & Consoles"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Icon</label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                        title={item.name}
                      >
                        <IconComp size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of products in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
