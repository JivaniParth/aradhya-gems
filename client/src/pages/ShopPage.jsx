import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  LayoutGrid,
  SlidersHorizontal,
  Info,
  Loader2
} from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { TrustStrip } from '../components/common/TrustComponents';
import { productAPI, categoryAPI } from '../services/api';
import { useCurrencyStore } from '../store/useCurrencyStore';
import CurrencySelector from '../components/common/CurrencySelector';
import {
  categories,
  materials,
  occasions,
  priceRanges,
  getCategoryBySlug,
  formatPrice
} from '../data/constants';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

// Map client sort values to server sort values
const SORT_MAP = {
  'popular': 'popularity',
  'newest': undefined,  // default server sort is newest
  'price-asc': 'price-low',
  'price-desc': 'price-high',
  'rating': 'rating',
};

// ========================================
// CATEGORY HEADER - SEO & Context
// ========================================
function CategoryHeader({ category, parentCategory, totalProducts }) {
  if (!category) {
    return (
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary">
            All Jewelry
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore our complete collection of {totalProducts} handcrafted pieces
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-500 font-medium ml-2">Display pricing in:</span>
          <CurrencySelector />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        {parentCategory && (
          <>
            <span>/</span>
            <Link to={`/shop/${parentCategory.slug}`} className="hover:text-primary">{parentCategory.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-secondary">{category.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary">
            {category.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {category.description || `Explore our beautiful collection of ${category.name.toLowerCase()}`}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Currency:</span>
          <CurrencySelector />
        </div>
      </div>

      {/* Why this category exists - helps decision making */}
      {category.whyExists && (
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-secondary">{category.whyExists}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ========================================
// ACTIVE FILTERS BAR
// ========================================
function ActiveFilters({ filters, onRemove, onClearAll }) {
  const activeFilters = Object.entries(filters).filter(([, value]) => value);

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'category':
        return categories.find(c => c.slug === value)?.name || value;
      case 'material':
        return materials.find(m => m.id === value)?.name || value;
      case 'occasion':
        return occasions.find(o => o.id === value)?.name || value;
      case 'minPrice':
        return `Min: ${formatPrice(value)}`;
      case 'maxPrice':
        return `Max: ${formatPrice(value)}`;
      case 'search':
        return `"${value}"`;
      default:
        return value;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4 pb-4 border-b">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map(([key, value]) => (
        <button
          key={key}
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20"
        >
          {getFilterLabel(key, value)}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-secondary underline ml-2"
      >
        Clear all
      </button>
    </div>
  );
}

// ========================================
// FILTER SECTION (Collapsible)
// ========================================
function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <span className="font-medium text-secondary">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
}

// ========================================
// MAIN SHOP PAGE
// ========================================
export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();
  const { fetchRates } = useCurrencyStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3);

  // Categories from API for sidebar + lookup
  const [apiCategories, setApiCategories] = useState([]);

  // Fetch currency rates once when store mounts
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await categoryAPI.getHierarchy();
        setApiCategories(data.data.categories || []);
      } catch {
        setApiCategories([]);
      }
    };
    fetchCats();
  }, []);

  // API state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve category slug: prioritize route params over query params
  const resolvedSlug = subCategorySlug || categorySlug || searchParams.get('category') || '';
  const selectedCategory = resolvedSlug;
  const selectedMaterial = searchParams.get('material') || '';
  const selectedOccasion = searchParams.get('occasion') || '';
  const selectedMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : undefined;
  const selectedMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : undefined;
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'popular';

  // Lookup category info from API hierarchy (supports nested)
  const findCategoryBySlug = (slug, cats) => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.children) {
        const found = findCategoryBySlug(slug, cat.children);
        if (found) return found;
      }
    }
    // Fallback to constants
    return categories.find(c => c.slug === slug) || null;
  };

  // Find parent category for breadcrumb
  const findParentOfSlug = (slug, cats) => {
    for (const cat of cats) {
      if (cat.children?.some(c => c.slug === slug)) return cat;
    }
    return null;
  };

  const categoryInfo = selectedCategory ? findCategoryBySlug(selectedCategory, apiCategories) : null;
  const parentCategoryInfo = selectedCategory ? findParentOfSlug(selectedCategory, apiCategories) : null;
  const sidebarCategories = apiCategories.length > 0 ? apiCategories : categories;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit: 50 };
        if (selectedCategory) params.category = selectedCategory;
        if (selectedMaterial) params.material = selectedMaterial;
        if (selectedOccasion) params.occasion = selectedOccasion;
        if (selectedMinPrice) params.minPrice = selectedMinPrice;
        if (selectedMaxPrice) params.maxPrice = selectedMaxPrice;
        if (searchQuery) params.search = searchQuery;
        if (sortBy && SORT_MAP[sortBy]) params.sort = SORT_MAP[sortBy];
        if (sortBy === 'newest') params.sort = undefined;
        // For 'popular', the server uses 'popularity'
        // For 'newest', the server default sort (createdAt desc) is fine

        const { data } = await productAPI.getAll(params);
        setProducts(data.data.products);
        setTotalProducts(data.data.pagination.total);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedMaterial, selectedOccasion, selectedMinPrice, selectedMaxPrice, searchQuery, sortBy]);

  // Update URL params
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const removeFilter = (key) => {
    if (key === 'category' && categorySlug) {
      // Category is set via route param, navigate to /shop
      const preserved = new URLSearchParams(searchParams);
      preserved.delete('category');
      const qs = preserved.toString();
      navigate(qs ? `/shop?${qs}` : '/shop');
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    if (categorySlug) {
      navigate('/shop');
    } else {
      setSearchParams({});
    }
  };

  const activeFilters = {
    category: selectedCategory,
    material: selectedMaterial,
    occasion: selectedOccasion,
    minPrice: selectedMinPrice,
    maxPrice: selectedMaxPrice,
    search: searchQuery,
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v);

  // ========================================
  // FILTER SIDEBAR CONTENT
  // ========================================
  // Navigate to a category route, preserving non-category query params
  const navigateToCategory = (slug, parentSlug) => {
    // Preserve existing non-category params
    const preserved = new URLSearchParams();
    for (const [key, val] of searchParams.entries()) {
      if (key !== 'category') preserved.set(key, val);
    }
    const qs = preserved.toString();
    let path = '/shop';
    if (parentSlug && slug) path = `/shop/${parentSlug}/${slug}`;
    else if (slug) path = `/shop/${slug}`;
    navigate(qs ? `${path}?${qs}` : path);
  };

  const FilterSidebarContent = () => (
    <div className="space-y-2">
      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => navigateToCategory('', '')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm text-secondary">All Categories</span>
          </label>
          {sidebarCategories.map((cat) => (
            <div key={cat._id || cat.id}>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => navigateToCategory(cat.slug, '')}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-secondary font-medium">{cat.name}</span>
              </label>
              {/* Sub-categories */}
              {cat.children?.length > 0 && (
                <div className="pl-6 space-y-1">
                  {cat.children.map((sub) => (
                    <label key={sub._id || sub.id} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === sub.slug}
                        onChange={() => navigateToCategory(sub.slug, cat.slug)}
                        className="w-3.5 h-3.5 text-primary"
                      />
                      <span className="text-sm text-muted-foreground">{sub.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="radio"
              name="price"
              checked={!selectedMinPrice && !selectedMaxPrice}
              onChange={() => {
                removeFilter('minPrice');
                removeFilter('maxPrice');
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm text-secondary">Any Price</span>
          </label>
          {priceRanges.map((range) => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="price"
                checked={selectedMinPrice === range.min && (selectedMaxPrice === range.max || (range.max === Infinity && !selectedMaxPrice))}
                onChange={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('minPrice', range.min.toString());
                  if (range.max !== Infinity) {
                    newParams.set('maxPrice', range.max.toString());
                  } else {
                    newParams.delete('maxPrice');
                  }
                  setSearchParams(newParams);
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-secondary">{range.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection title="Metal Type">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="radio"
              name="material"
              checked={!selectedMaterial}
              onChange={() => updateFilter('material', '')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm text-secondary">All Metals</span>
          </label>
          {materials.map((mat) => (
            <label key={mat.id} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="material"
                checked={selectedMaterial === mat.id}
                onChange={() => updateFilter('material', mat.id)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <span className="text-sm text-secondary">{mat.name}</span>
                <span className="text-xs text-muted-foreground ml-1">({mat.purity})</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="radio"
              name="occasion"
              checked={!selectedOccasion}
              onChange={() => updateFilter('occasion', '')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm text-secondary">All Occasions</span>
          </label>
          {occasions.map((occ) => (
            <label key={occ.id} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="occasion"
                checked={selectedOccasion === occ.id}
                onChange={() => updateFilter('occasion', occ.id)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-secondary">
                <span className="mr-1">{occ.icon}</span>
                {occ.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Need Help? */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-secondary text-sm mb-2">Need Help Choosing?</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Our experts can help you find the perfect piece.
        </p>
        <Link
          to="/contact"
          className="text-sm text-primary font-medium hover:underline"
        >
          Chat with us →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Trust Strip */}
      <TrustStrip />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              <FilterSidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Category Header */}
            <CategoryHeader
              category={categoryInfo}
              parentCategory={parentCategoryInfo}
              totalProducts={totalProducts}
            />

            {/* Search Results */}
            {searchQuery && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-secondary">
                  Showing results for <strong>"{searchQuery}"</strong>
                  <button
                    onClick={() => removeFilter('search')}
                    className="ml-2 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </p>
              </div>
            )}

            {/* Active Filters */}
            <ActiveFilters
              filters={activeFilters}
              onRemove={removeFilter}
              onClearAll={clearAllFilters}
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {Object.values(activeFilters).filter(v => v).length}
                    </span>
                  )}
                </button>

                <p className="text-sm text-muted-foreground hidden sm:block">
                  {totalProducts} {totalProducts === 1 ? 'piece' : 'pieces'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Grid Toggle (Desktop) */}
                <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`p-1.5 rounded ${gridCols === 2 ? 'bg-gray-100' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={`p-1.5 rounded ${gridCols === 3 ? 'bg-gray-100' : ''}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <p className="text-lg text-red-500 mb-2">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className={`grid gap-4 md:gap-6 ${gridCols === 2
                ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2'
                : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-secondary mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search term
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-secondary flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebarContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
              <Button
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {totalProducts} Results
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
