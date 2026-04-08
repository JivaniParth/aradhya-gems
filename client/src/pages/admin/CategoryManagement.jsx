import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    ChevronRight,
    ChevronDown,
    X,
    Save,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { categoryAPI } from '../../services/api';

const emptyForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategory: '',
    sortOrder: 0,
    seoTitle: '',
    seoDescription: '',
    whyExists: ''
};

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteModal, setDeleteModal] = useState({ open: false, category: null });

    // Expanded parents in tree view
    const [expanded, setExpanded] = useState(new Set());

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.data.categories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Build tree structure from flat list
    const buildTree = () => {
        const parents = categories.filter(c => !c.parentCategory);
        const children = categories.filter(c => c.parentCategory);
        return parents.map(p => ({
            ...p,
            children: children.filter(c => {
                const parentId = typeof c.parentCategory === 'object'
                    ? c.parentCategory?._id
                    : c.parentCategory;
                return parentId === p._id;
            })
        }));
    };

    const tree = buildTree();
    const parentCategories = categories.filter(c => !c.parentCategory && c.isActive);

    const toggleExpand = (id) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const openCreate = (parentId = '') => {
        setEditId(null);
        setForm({ ...emptyForm, parentCategory: parentId });
        setFormOpen(true);
    };

    const openEdit = (cat) => {
        const parentId = typeof cat.parentCategory === 'object'
            ? cat.parentCategory?._id || ''
            : cat.parentCategory || '';
        setEditId(cat._id);
        setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            description: cat.description || '',
            image: cat.image || '',
            parentCategory: parentId,
            sortOrder: cat.sortOrder || 0,
            seoTitle: cat.seoTitle || '',
            seoDescription: cat.seoDescription || '',
            whyExists: cat.whyExists || ''
        });
        setFormOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name' && !editId) {
            setForm(prev => ({
                ...prev,
                [name]: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                sortOrder: Number(form.sortOrder) || 0,
                parentCategory: form.parentCategory || null
            };

            if (editId) {
                await categoryAPI.update(editId, payload);
            } else {
                await categoryAPI.create(payload);
            }

            setFormOpen(false);
            setForm(emptyForm);
            setEditId(null);
            await fetchCategories();
        } catch (err) {
            console.error('Failed to save category:', err);
            alert(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.category) return;
        setDeleting(true);
        try {
            await categoryAPI.delete(deleteModal.category._id);
            setDeleteModal({ open: false, category: null });
            await fetchCategories();
        } catch (err) {
            console.error('Failed to delete category:', err);
        } finally {
            setDeleting(false);
        }
    };

    // Render a single row in the tree
    const CategoryRow = ({ cat, depth = 0 }) => {
        const hasChildren = cat.children && cat.children.length > 0;
        const isExpanded = expanded.has(cat._id);

        return (
            <>
                <tr className="hover:bg-gray-50 group">
                    <td className="px-6 py-3">
                        <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(cat._id)}
                                    className="p-0.5 hover:bg-gray-200 rounded"
                                >
                                    {isExpanded
                                        ? <ChevronDown className="w-4 h-4 text-gray-400" />
                                        : <ChevronRight className="w-4 h-4 text-gray-400" />
                                    }
                                </button>
                            ) : (
                                <span className="w-5" />
                            )}

                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-md object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                </div>
                            )}

                            <div>
                                <span className="font-medium text-secondary">{cat.name}</span>
                                {depth > 0 && (
                                    <span className="ml-2 text-xs text-gray-400">sub-category</span>
                                )}
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-3">
                        <Badge variant={cat.isActive ? 'success' : 'outline'}>
                            {cat.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{cat.sortOrder}</td>
                    <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!cat.parentCategory && (
                                <button
                                    onClick={() => openCreate(cat._id)}
                                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-primary"
                                    title="Add sub-category"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => openEdit(cat)}
                                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setDeleteModal({ open: true, category: cat })}
                                className="p-1.5 hover:bg-red-50 rounded-md text-gray-500 hover:text-red-500"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
                {/* Render children when expanded */}
                {hasChildren && isExpanded && cat.children.map(child => (
                    <CategoryRow key={child._id} cat={{ ...child, children: [] }} depth={depth + 1} />
                ))}
            </>
        );
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-secondary">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage product categories and sub-categories</p>
                </div>
                <Button onClick={() => openCreate()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Tree Table */}
            {!loading && (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Slug</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Order</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tree.map(parent => (
                                    <CategoryRow key={parent._id} cat={parent} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {tree.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No categories yet. Create your first category to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create / Edit Modal */}
            <Modal
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditId(null); setForm(emptyForm); }}
                title={editId ? 'Edit Category' : 'Create Category'}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <div className="space-y-4">
                            {/* Parent Category Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                <select
                                    name="parentCategory"
                                    value={form.parentCategory}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">None (Top-level category)</option>
                                    {parentCategories
                                        .filter(p => p._id !== editId)
                                        .map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <Input
                                        name="name"
                                        value={form.name}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="e.g. Diamonds"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <Input
                                        name="slug"
                                        value={form.slug}
                                        onChange={handleFormChange}
                                        placeholder="auto-generated"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Brief description of this category"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <Input
                                        name="image"
                                        value={form.image}
                                        onChange={handleFormChange}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <Input
                                        name="sortOrder"
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={handleFormChange}
                                    />
                                </div>
                            </div>

                            {/* Image Preview */}
                            {form.image && (
                                <div className="mt-2">
                                    <img
                                        src={form.image}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-lg object-cover border"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Why This Category Exists</label>
                                <textarea
                                    name="whyExists"
                                    value={form.whyExists}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Helps customers understand what they'll find here"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                    <Input
                                        name="seoTitle"
                                        value={form.seoTitle}
                                        onChange={handleFormChange}
                                        placeholder="Page title for search engines"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                                    <Input
                                        name="seoDescription"
                                        value={form.seoDescription}
                                        onChange={handleFormChange}
                                        placeholder="Meta description"
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setFormOpen(false); setEditId(null); setForm(emptyForm); }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> {editId ? 'Update' : 'Create'}</>
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, category: null })}
                title="Delete Category"
                size="sm"
            >
                <ModalBody>
                    <p className="text-gray-600">
                        Are you sure you want to delete <strong>{deleteModal.category?.name}</strong>?
                        {deleteModal.category && !deleteModal.category.parentCategory && (
                            <span className="block mt-2 text-sm text-red-500">
                                This will also deactivate all sub-categories under it.
                            </span>
                        )}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" onClick={() => setDeleteModal({ open: false, category: null })}>
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
