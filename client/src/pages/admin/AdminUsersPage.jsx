import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminNav from '../../components/AdminNav';

export default function AdminUsersPage() {

  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      alert('You cannot alter your own admin privileges.');
      return;
    }

    const nextRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    const confirmMsg = `Are you sure you want to change ${targetUser.name}'s role to ${nextRole}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.updateUserRole(targetUser.id, nextRole);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

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
            User Accounts & Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage registered customers and administrator access rights</p>
        </div>

        <AdminNav />
      </div>


      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-slate-100 bg-slate-50"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== currentUser?.id ? (
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        {u.role === 'admin' ? 'Demote to Customer' : 'Make Administrator'}
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Current Session</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
