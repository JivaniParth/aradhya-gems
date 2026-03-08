import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Shield, ShieldAlert, Loader2, Trash2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminAPI } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function CustomerManagement() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 100 };
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;

      const { data } = await adminAPI.getUsers(params);
      setUsers(data.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500); // 500ms debounce on search
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, roleFilter]);

  const toggleRole = async (user) => {
    if (user.email === 'psjivani001@gmail.com') {
      alert('The primary admin account cannot be modified.');
      return;
    }

    // Prevent self-demotion accidentally
    if (user._id === currentUser._id && user.role === 'admin') {
      if (!window.confirm("Are you sure you want to remove your own admin rights? You will be logged out or lose access immediately.")) {
        return;
      }
    }

    try {
      setUpdatingId(user._id);
      const newRole = user.role === 'admin' ? 'customer' : 'admin';
      await adminAPI.updateUser(user._id, { role: newRole });
      await fetchUsers(); // Refresh list to get updated data
    } catch (err) {
      console.error('Failed to update role:', err);
      alert(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    // Basic protection (also enforced globally on backend)
    if (user.email === 'psjivani001@gmail.com') {
      alert("The primary admin account cannot be deleted.");
      return;
    }

    // Warn against self-deletion
    if (user._id === currentUser._id) {
      if (!window.confirm("Are you sure you want to delete YOUR OWN account? This action cannot be undone.")) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to permanently delete the user ${user.firstName} ${user.lastName}?`)) {
        return;
      }
    }

    try {
      setUpdatingId(user._id);
      await adminAPI.deleteUser(user._id);
      await fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (user) => {
    if (user.isActive === false) return <Badge variant="destructive">Inactive</Badge>;
    if (user.isEmailVerified) return <Badge variant="success">Verified</Badge>;
    return <Badge variant="outline">Unverified</Badge>;
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return <Badge variant="default" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Admin</Badge>;
    return <Badge variant="outline">Customer</Badge>;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-secondary">Customers</h1>
        <p className="text-gray-500 mt-1">View and manage customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-secondary">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === 'customer').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.isEmailVerified).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full relative">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role & Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>

            {loading && (
              <tbody className="absolute inset-x-0 top-14 bg-white/80 z-10 min-h-[200px] flex items-center justify-center">
                <tr><td><Loader2 className="w-8 h-8 animate-spin text-primary" /></td></tr>
              </tbody>
            )}

            <tbody className={`divide - y ${loading ? 'opacity-50 pointer-events-none' : ''} `}>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w - 10 h - 10 rounded - full flex items - center justify - center shrink - 0 ${user.role === 'admin' ? 'bg-purple-100' : 'bg-primary/10'} `}>
                        <span className={`font - medium ${user.role === 'admin' ? 'text-purple-700' : 'text-primary'} `}>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    <div className="flex flex-col items-start gap-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={user.role === 'admin' ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleRole(user)}
                        disabled={updatingId === user._id || user.email === 'psjivani001@gmail.com'}
                        className="min-w-[130px]"
                      >
                        {updatingId === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                        ) : user.email === 'psjivani001@gmail.com' ? (
                          <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Primary Admin</span>
                        ) : user.role === 'admin' ? (
                          <span className="flex items-center gap-1 text-red-600 hover:text-red-700">Revoke Admin</span>
                        ) : (
                          <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Make Admin</span>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        disabled={updatingId === user._id || user.email === 'psjivani001@gmail.com'}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
