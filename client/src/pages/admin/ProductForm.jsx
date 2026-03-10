import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Upload,
    X,
    Loader2,
    Star,
    ImagePlus,
    GripVertical,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { productAPI } from '../../services/api';
import { categories, materials } from '../../data/constants';
import api from '../../services/api';

// ========================================
// PRODUCT FORM — Create / Edit Products
// ========================================
export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [form, setForm] = useState({
        name: '',
        sku: '',
        price: '',
        originalPrice: '',
        category: '',
        categorySlug: '',
        material: '',
        materialId: '',
        purity: '',
        description: '',
        shortDescription: '',
        stock: '0',
        isNewArrival: false,
        isBestSeller: false,
        isActive: true,
        // Weight
        weightGross: '',
        weightNet: '',
        // Diamond details
        diamondCarat: '',
        diamondCut: '',
        diamondClarity: '',
        diamondColor: '',
        diamondShape: '',
        diamondTotalCarat: '',
        diamondStoneCount: '',
        // Price breakdown
        goldValue: '',
        diamondValue: '',
        makingCharges: '',
        gst: '',
        // Certifications
        hallmark: '',
        certification: '',
        origin: '',
        // Policies
        returnPolicy: '30-day hassle-free returns',
        warranty: 'Lifetime manufacturing warranty',
        // Tags
        occasions: [],
        idealFor: [],
        styleNote: '',
        careInstructions: ''
    });

    // Media state
    const [media, setMedia] = useState([]);

    // Fetch existing product data for edit mode
    useEffect(() => {
        if (!isEdit) return;

        const fetchProduct = async () => {
            try {
                const { data } = await productAPI.getById(id);
                const product = data.data.product;

                setForm({
                    name: product.name || '',
                    sku: product.sku || '',
                    price: product.price?.toString() || '',
                    originalPrice: product.originalPrice?.toString() || '',
                    category: product.category || '',
                    categorySlug: product.categorySlug || '',
                    material: product.material || '',
                    materialId: product.materialId || '',
                    purity: product.purity || '',
                    description: product.description || '',
                    shortDescription: product.shortDescription || '',
                    stock: product.stock?.toString() || '0',
                    isNewArrival: product.isNewArrival || false,
                    isBestSeller: product.isBestSeller || false,
                    isActive: product.isActive !== false,
                    weightGross: product.weight?.gross?.toString() || '',
                    weightNet: product.weight?.net?.toString() || '',
                    diamondCarat: product.diamondDetails?.carat?.toString() || '',
                    diamondCut: product.diamondDetails?.cut || '',
                    diamondClarity: product.diamondDetails?.clarity || '',
                    diamondColor: product.diamondDetails?.color || '',
                    diamondShape: product.diamondDetails?.shape || '',
                    diamondTotalCarat: product.diamondDetails?.totalCarat?.toString() || '',
                    diamondStoneCount: product.diamondDetails?.stoneCount?.toString() || '',
                    goldValue: product.priceBreakdown?.goldValue?.toString() || '',
                    diamondValue: product.priceBreakdown?.diamondValue?.toString() || '',
                    makingCharges: product.priceBreakdown?.makingCharges?.toString() || '',
                    gst: product.priceBreakdown?.gst?.toString() || '',
                    hallmark: product.hallmark || '',
                    certification: product.certification || '',
                    origin: product.origin || '',
                    returnPolicy: product.returnPolicy || '30-day hassle-free returns',
                    warranty: product.warranty || 'Lifetime manufacturing warranty',
                    occasions: product.occasions || [],
                    idealFor: product.idealFor || [],
                    styleNote: product.styleNote || '',
                    careInstructions: (product.careInstructions || []).join(', ')
                });

                setMedia(product.media || []);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('Failed to load product. It may not exist.');
            } finally {
                setFetching(false);
            }
        };

        fetchProduct();
    }, [id, isEdit]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle category selection (auto-fill slug)
    const handleCategoryChange = (e) => {
        const selected = categories.find(c => c.name === e.target.value);
        setForm(prev => ({
            ...prev,
            category: selected?.name || e.target.value,
            categorySlug: selected?.slug || e.target.value.toLowerCase().replace(/\s+/g, '-')
        }));
    };

    // Handle material selection (auto-fill materialId)
    const handleMaterialChange = (e) => {
        const selected = materials.find(m => m.name === e.target.value);
        setForm(prev => ({
            ...prev,
            material: selected?.name || e.target.value,
            materialId: selected?.id || e.target.value.toLowerCase().replace(/\s+/g, '-'),
            purity: selected?.purity || prev.purity
        }));
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('media', files[i]);
            }

            const { data } = await api.post('/upload/product-media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedMedia = data.data.media.map((m, i) => ({
                url: m.url,
                key: m.key,
                type: m.type,
                isPrimary: media.length === 0 && i === 0,
                alt: form.name || 'Product image',
                sortOrder: media.length + i
            }));

            setMedia(prev => [...prev, ...uploadedMedia]);
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.message || 'Failed to upload files. Please try again.');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Set primary image
    const setPrimaryImage = (index) => {
        setMedia(prev => prev.map((m, i) => ({
            ...m,
            isPrimary: i === index
        })));
    };

    // Remove media
    const removeMedia = async (index) => {
        const item = media[index];
        try {
            if (item.key) {
                await api.delete('/upload/product-media', { data: { key: item.key } });
            }
        } catch {
            // Continue even if S3 delete fails
        }
        setMedia(prev => prev.filter((_, i) => i !== index));
    };

    // Build product data from form
    const buildProductData = () => {
        const productData = {
            name: form.name,
            sku: form.sku,
            price: Number(form.price),
            category: form.category,
            categorySlug: form.categorySlug,
            material: form.material,
            materialId: form.materialId,
            description: form.description,
            stock: Number(form.stock) || 0,
            isNewArrival: form.isNewArrival,
            isBestSeller: form.isBestSeller,
            isActive: form.isActive,
            media: media
        };

        // Optional fields
        if (form.originalPrice) productData.originalPrice = Number(form.originalPrice);
        if (form.purity) productData.purity = form.purity;
        if (form.shortDescription) productData.shortDescription = form.shortDescription;

        // Weight
        if (form.weightGross || form.weightNet) {
            productData.weight = {
                gross: form.weightGross ? Number(form.weightGross) : undefined,
                net: form.weightNet ? Number(form.weightNet) : undefined,
                unit: 'grams'
            };
        }

        // Diamond details
        if (form.diamondCarat || form.diamondCut) {
            productData.diamondDetails = {};
            if (form.diamondCarat) productData.diamondDetails.carat = Number(form.diamondCarat);
            if (form.diamondCut) productData.diamondDetails.cut = form.diamondCut;
            if (form.diamondClarity) productData.diamondDetails.clarity = form.diamondClarity;
            if (form.diamondColor) productData.diamondDetails.color = form.diamondColor;
            if (form.diamondShape) productData.diamondDetails.shape = form.diamondShape;
            if (form.diamondTotalCarat) productData.diamondDetails.totalCarat = Number(form.diamondTotalCarat);
            if (form.diamondStoneCount) productData.diamondDetails.stoneCount = Number(form.diamondStoneCount);
        }

        // Price breakdown
        if (form.goldValue || form.makingCharges) {
            productData.priceBreakdown = {};
            if (form.goldValue) productData.priceBreakdown.goldValue = Number(form.goldValue);
            if (form.diamondValue) productData.priceBreakdown.diamondValue = Number(form.diamondValue);
            if (form.makingCharges) productData.priceBreakdown.makingCharges = Number(form.makingCharges);
            if (form.gst) productData.priceBreakdown.gst = Number(form.gst);
        }

        // Certifications
        if (form.hallmark) productData.hallmark = form.hallmark;
        if (form.certification) productData.certification = form.certification;
        if (form.origin) productData.origin = form.origin;

        // Policies
        productData.returnPolicy = form.returnPolicy;
        productData.warranty = form.warranty;

        // Tags
        if (form.occasions.length > 0) productData.occasions = form.occasions;
        if (form.idealFor.length > 0) productData.idealFor = form.idealFor;
        if (form.styleNote) productData.styleNote = form.styleNote;
        if (form.careInstructions) {
            productData.careInstructions = form.careInstructions.split(',').map(s => s.trim()).filter(Boolean);
        }

        return productData;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!form.name || !form.sku || !form.price || !form.category || !form.material || !form.description) {
            setError('Please fill in all required fields: Name, SKU, Price, Category, Material, and Description.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (media.length === 0) {
            setError('Please upload at least one product image.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSaving(true);

        try {
            const productData = buildProductData();

            if (isEdit) {
                await productAPI.update(id, productData);
                setSuccess('Product updated successfully!');
            } else {
                await productAPI.create(productData);
                setSuccess('Product created successfully!');
                // Redirect to products list after short delay
                setTimeout(() => navigate('/admin/products'), 1500);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Failed to save product:', err);
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.map(e => e.msg).join(', ')
                || 'Failed to save product. Please check all fields and try again.';
            setError(msg);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    // Occasion toggle
    const toggleOccasion = (occasionId) => {
        setForm(prev => ({
            ...prev,
            occasions: prev.occasions.includes(occasionId)
                ? prev.occasions.filter(o => o !== occasionId)
                : [...prev.occasions, occasionId]
        }));
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-secondary">
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEdit ? 'Update product details' : 'Fill in the details to create a new product'}
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ───────── BASIC INFORMATION ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Celestial Diamond Pendant"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="e.g. AG-NK-001"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleCategoryChange}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Material <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="material"
                                value={form.material}
                                onChange={handleMaterialChange}
                                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            >
                                <option value="">Select material</option>
                                {materials.map(mat => (
                                    <option key={mat.id} value={mat.name}>{mat.name} ({mat.purity})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purity
                            </label>
                            <Input
                                name="purity"
                                value={form.purity}
                                onChange={handleChange}
                                placeholder="e.g. 91.6%"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="stock"
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <Input
                            name="shortDescription"
                            value={form.shortDescription}
                            onChange={handleChange}
                            placeholder="Brief one-liner about the product"
                            maxLength={200}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            maxLength={2000}
                            placeholder="Detailed product description..."
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000</p>
                    </div>
                </section>

                {/* ───────── PRICING ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Pricing</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="price"
                                type="number"
                                min="0"
                                step="1"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="e.g. 45000"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Original Price (₹) <span className="text-gray-400 text-xs">for strikethrough</span>
                            </label>
                            <Input
                                name="originalPrice"
                                type="number"
                                min="0"
                                step="1"
                                value={form.originalPrice}
                                onChange={handleChange}
                                placeholder="e.g. 55000"
                            />
                        </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-600 mb-3">Price Breakdown (Optional)</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Gold Value</label>
                                <Input name="goldValue" type="number" value={form.goldValue} onChange={handleChange} placeholder="₹" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Diamond Value</label>
                                <Input name="diamondValue" type="number" value={form.diamondValue} onChange={handleChange} placeholder="₹" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Making Charges</label>
                                <Input name="makingCharges" type="number" value={form.makingCharges} onChange={handleChange} placeholder="₹" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">GST</label>
                                <Input name="gst" type="number" value={form.gst} onChange={handleChange} placeholder="₹" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────── MEDIA ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">
                        Product Images <span className="text-red-500">*</span>
                    </h2>

                    {/* Upload area */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer
                       hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm text-gray-600">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <ImagePlus className="w-10 h-10 text-gray-400" />
                                <p className="text-sm font-medium text-gray-600">Click to upload images</p>
                                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB each. Max 10 files.</p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Image previews */}
                    {media.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {media.map((item, index) => (
                                <div
                                    key={item.key || index}
                                    className={`relative group rounded-lg overflow-hidden border-2 aspect-square ${item.isPrimary ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                                        }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt || `Product image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Primary badge */}
                                    {item.isPrimary && (
                                        <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            PRIMARY
                                        </div>
                                    )}

                                    {/* Hover overlay with actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity
                                  flex items-center justify-center gap-2">
                                        {!item.isPrimary && (
                                            <button
                                                type="button"
                                                onClick={() => setPrimaryImage(index)}
                                                className="p-1.5 bg-white rounded-full hover:bg-gray-100"
                                                title="Set as primary"
                                            >
                                                <Star className="w-4 h-4 text-primary" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="p-1.5 bg-white rounded-full hover:bg-red-50"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ───────── WEIGHT & DIAMOND DETAILS ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Specifications</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight (g)</label>
                            <Input name="weightGross" type="number" step="0.01" value={form.weightGross} onChange={handleChange} placeholder="e.g. 5.25" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight (g)</label>
                            <Input name="weightNet" type="number" step="0.01" value={form.weightNet} onChange={handleChange} placeholder="e.g. 4.80" />
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-600 mb-3">Diamond Details (if applicable)</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Carat</label>
                                <Input name="diamondCarat" type="number" step="0.01" value={form.diamondCarat} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Cut</label>
                                <Input name="diamondCut" value={form.diamondCut} onChange={handleChange} placeholder="e.g. Excellent" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Clarity</label>
                                <Input name="diamondClarity" value={form.diamondClarity} onChange={handleChange} placeholder="e.g. VS1" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Color</label>
                                <Input name="diamondColor" value={form.diamondColor} onChange={handleChange} placeholder="e.g. F" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Shape</label>
                                <Input name="diamondShape" value={form.diamondShape} onChange={handleChange} placeholder="e.g. Round" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Total Carat</label>
                                <Input name="diamondTotalCarat" type="number" step="0.01" value={form.diamondTotalCarat} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Stone Count</label>
                                <Input name="diamondStoneCount" type="number" value={form.diamondStoneCount} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────── CERTIFICATIONS & POLICIES ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Certifications & Policies</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hallmark</label>
                            <Input name="hallmark" value={form.hallmark} onChange={handleChange} placeholder="e.g. BIS 916" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                            <Input name="certification" value={form.certification} onChange={handleChange} placeholder="e.g. IGI Certified" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                            <Input name="origin" value={form.origin} onChange={handleChange} placeholder="e.g. India" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
                            <Input name="returnPolicy" value={form.returnPolicy} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
                            <Input name="warranty" value={form.warranty} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* ───────── TAGS & OCCASIONS ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Tags & Occasions</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suitable Occasions</label>
                        <div className="flex flex-wrap gap-2">
                            {['daily-wear', 'wedding', 'anniversary', 'gifting', 'office-wear', 'party'].map(occ => (
                                <button
                                    key={occ}
                                    type="button"
                                    onClick={() => toggleOccasion(occ)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${form.occasions.includes(occ)
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                                        }`}
                                >
                                    {occ.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style Note</label>
                        <Input
                            name="styleNote"
                            value={form.styleNote}
                            onChange={handleChange}
                            placeholder="e.g. Perfect for layering with gold chains"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Care Instructions <span className="text-gray-400 text-xs">(comma-separated)</span>
                        </label>
                        <Input
                            name="careInstructions"
                            value={form.careInstructions}
                            onChange={handleChange}
                            placeholder="e.g. Avoid water, Store in velvet pouch, Clean with soft cloth"
                        />
                    </div>
                </section>

                {/* ───────── TOGGLES ───────── */}
                <section className="bg-white rounded-lg border p-6 mb-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Status</h2>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary"
                            />
                            <span className="text-sm text-gray-700">Active (visible to customers)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isNewArrival"
                                checked={form.isNewArrival}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary"
                            />
                            <span className="text-sm text-gray-700">New Arrival</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isBestSeller"
                                checked={form.isBestSeller}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary"
                            />
                            <span className="text-sm text-gray-700">Best Seller</span>
                        </label>
                    </div>
                </section>

                {/* ───────── SUBMIT ───────── */}
                <div className="flex items-center gap-4 pb-8">
                    <Button type="submit" disabled={saving} className="min-w-[160px]">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {isEdit ? 'Update Product' : 'Create Product'}
                            </>
                        )}
                    </Button>

                    <Link to="/admin/products">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
