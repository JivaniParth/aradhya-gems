import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  RefreshCw,
  Shield,
  Award,
  Info,
  ChevronDown,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { productAPI } from '../services/api';
import {
  formatPrice,
  materials as allMaterials
} from '../data/constants';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import ProductCard from '../components/shop/ProductCard';
import CurrencySelector from '../components/common/CurrencySelector';
import {
  ProductTrustSignals,
  PriceBreakdown,
  ReviewSummary,
  ReviewHighlights,
  OriginBadge,
  OccasionTags,
  StockIndicator
} from '../components/common/TrustComponents';

// ========================================
// IMAGE GALLERY
// ========================================
function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = (direction) => {
    if (direction === 'prev') {
      setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-colors ${activeIndex === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// COLLAPSIBLE SECTION
// ========================================
function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-secondary">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

// ========================================
// MAIN PRODUCT DETAILS PAGE
// ========================================
export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { fetchRates } = useCurrencyStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  // Fetch currency rates once when store mounts
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setQuantity(1);
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.data.product);
        setRelatedProducts(data.data.relatedProducts || []);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link to="/shop">
          <Button variant="outline">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  // Use virtual `images` getter or fallback to media array
  const images = product.images?.length > 0
    ? product.images
    : (product.image ? [product.image] : []);
  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);
  const materialInfo = allMaterials.find(m => m.id === product.materialId);
  const isNew = product.isNewArrival || product.isNew;

  const handleAddToCart = () => {
    addItem(productId, quantity);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-secondary truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* RIGHT: Product Info */}
          <div>
            {/* ABOVE THE FOLD: What, Who, Why Trust */}

            {/* Category & Badges */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-primary font-medium uppercase tracking-wide">
                {product.category}
              </span>
              {isNew && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            {/* Product Name - WHAT IS THIS */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-2">
              {product.name}
            </h1>

            {/* Short Description - WHO IS THIS FOR */}
            <p className="text-muted-foreground mb-4">
              {product.shortDescription || product.description.slice(0, 100)}
            </p>

            {/* Reviews - WHY SHOULD I TRUST */}
            <div className="flex items-center gap-4 mb-6">
              <ReviewSummary reviews={product.reviews} />
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 relative">
              <div className="absolute top-4 right-4 z-10 hidden sm:block">
                <CurrencySelector />
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-secondary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <div className="sm:hidden mb-3">
                <CurrencySelector />
              </div>

              {/* Price includes GST */}
              <p className="text-xs text-muted-foreground mb-3">
                Inclusive of all taxes. Free shipping on this order.
              </p>

              {/* Price Breakdown Toggle */}
              <button
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                {showPriceBreakdown ? 'Hide' : 'View'} price breakdown
              </button>

              {showPriceBreakdown && (
                <div className="mt-4">
                  <PriceBreakdown breakdown={product.priceBreakdown} />
                </div>
              )}
            </div>

            {/* Metal & Purity - Critical Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Metal & Purity</p>
                <p className="font-medium text-secondary">{product.purity}</p>
                {materialInfo && (
                  <p className="text-xs text-muted-foreground mt-1">{materialInfo.description}</p>
                )}
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="font-medium text-secondary">
                  {product.weight?.net} {product.weight?.unit}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Net weight (excl. stones)
                </p>
              </div>
            </div>

            {/* Hallmark & Certification */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>{product.hallmark}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>{product.certification}</span>
              </div>
            </div>

            {/* Diamond Details (if applicable) */}
            {product.diamondDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-secondary text-sm mb-3">Diamond Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Carat</p>
                    <p className="font-medium">{product.diamondDetails.carat || product.diamondDetails.totalCarat}ct</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Clarity</p>
                    <p className="font-medium">{product.diamondDetails.clarity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Color</p>
                    <p className="font-medium">{product.diamondDetails.color}</p>
                  </div>
                  {product.diamondDetails.cut && (
                    <div>
                      <p className="text-muted-foreground text-xs">Cut</p>
                      <p className="font-medium">{product.diamondDetails.cut}</p>
                    </div>
                  )}
                  {product.diamondDetails.shape && (
                    <div>
                      <p className="text-muted-foreground text-xs">Shape</p>
                      <p className="font-medium">{product.diamondDetails.shape}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <StockIndicator stock={product.stock} />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(productId)}
                className={`p-3 border rounded-lg hover:bg-gray-50 ${inWishlist ? 'border-red-300 bg-red-50' : ''
                  }`}
              >
                <Heart
                  className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`}
                />
              </button>
            </div>

            {/* Quick Trust Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Insured Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>30-Day Returns</span>
              </div>
            </div>

            {/* Occasion Tags */}
            <div className="mb-6">
              <OccasionTags occasions={product.occasions} />
            </div>

            {/* Style Note */}
            {product.styleNote && (
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-secondary italic">
                  "{product.styleNote}"
                </p>
              </div>
            )}

            {/* Review Highlights */}
            <ReviewHighlights reviews={product.reviews} className="mb-6" />

            {/* Collapsible Sections */}
            <div className="border-t border-gray-100">
              <CollapsibleSection title="Product Description" defaultOpen>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CollapsibleSection>

              <CollapsibleSection title="Dimensions & Specifications">
                <div className="space-y-2 text-sm">
                  {product.dimensions && Object.entries(
                    product.dimensions instanceof Map ? Object.fromEntries(product.dimensions) : product.dimensions
                  ).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-secondary">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Weight</span>
                    <span className="text-secondary">{product.weight?.gross} {product.weight?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="text-secondary">{product.sku}</span>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Origin & Sourcing">
                <div className="space-y-3 text-sm">
                  <OriginBadge origin={product.origin} />
                  <p className="text-muted-foreground">
                    All our pieces are ethically sourced and handcrafted by skilled artisans.
                    We maintain full transparency about the origin of our materials.
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Care Instructions">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.careInstructions?.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-4 text-sm">
                  <div>
                    <h5 className="font-medium text-secondary mb-1">Shipping</h5>
                    <p className="text-muted-foreground">
                      Free insured shipping across India. Delivered in 3-5 business days
                      in tamper-proof packaging with real-time tracking.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-secondary mb-1">Returns</h5>
                    <p className="text-muted-foreground">{product.returnPolicy}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-secondary mb-1">Exchange</h5>
                    <p className="text-muted-foreground">{product.exchangePolicy}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-secondary mb-1">Warranty</h5>
                    <p className="text-muted-foreground">{product.warranty}</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-secondary mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </section>
        )}

        {/* Education Section - Inline, Optional */}
        <section className="mt-16 bg-accent/30 rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-serif font-bold text-secondary mb-4">
            Understanding {product.material} Jewelry
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-secondary mb-2">About {product.purity}</h4>
              <p className="text-sm text-muted-foreground">
                {materialInfo?.description} {materialInfo?.careNote}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-2">Why We Chose This Material</h4>
              <p className="text-sm text-muted-foreground">
                This piece uses {product.material} for its perfect balance of beauty and durability,
                ensuring it can be worn and treasured for generations.
              </p>
            </div>
          </div>
          <Link
            to="/guide/metals"
            className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
          >
            Read our complete metal guide →
          </Link>
        </section>
      </div>
    </div>
  );
}
