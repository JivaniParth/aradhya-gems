import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { productAPI } from '../../services/api';
import { categories } from '../../data/constants';

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

  // API state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;

        const { data } = await productAPI.getAll(params);
        setProducts(data.data.products);
        setTotalProducts(data.data.pagination.total);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleDelete = (product) => {
    setDeleteModal({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    try {
      await productAPI.delete(deleteModal.product._id);
      // Remove from local state
      setProducts(prev => prev.filter(p => p._id !== deleteModal.product._id));
      setTotalProducts(prev => prev - 1);
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, product: null });
    }
  };

  // Get primary image for product
  const getProductImage = (product) => {
    if (product.image) return product.image;
    if (product.media?.length > 0) {
      const primary = product.media.find(m => m.isPrimary);
      return primary?.url || product.media[0]?.url;
    }
    return '';
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SKU</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-secondary">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium">${product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.stock <= 5 ? (product.stock <= 2 ? 'danger' : 'warning') : 'success'}>
                        {product.stock} units
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.isNewArrival || product.isNew ? 'default' : 'outline'}>
                        {product.isNewArrival || product.isNew ? 'New' : 'Regular'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/product/${product._id}`}
                          className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="p-2 hover:bg-red-50 rounded-md text-gray-500 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {products.length} of {totalProducts} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
        size="sm"
      >
        <ModalBody>
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, product: null })}>
            Cancel
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
