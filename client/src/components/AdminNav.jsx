import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Package,
  Users,
} from 'lucide-react';

const ADMIN_LINKS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products', icon: ShoppingBag },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ADMIN_LINKS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            <Icon size={14} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
