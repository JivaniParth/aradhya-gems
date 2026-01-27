import React from 'react';
import { 
  Shield, 
  Award, 
  RefreshCw, 
  Truck, 
  CheckCircle, 
  Clock,
  Phone,
  Star,
  Gem,
  FileCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ========================================
// TRUST BADGE - Single trust indicator
// ========================================
export function TrustBadge({ icon: Icon, title, description, className }) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-medium text-secondary text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// ========================================
// TRUST STRIP - Horizontal compact trust bar
// ========================================
export function TrustStrip({ className }) {
  const items = [
    { icon: Shield, text: 'BIS Hallmarked' },
    { icon: RefreshCw, text: 'Lifetime Exchange' },
    { icon: Truck, text: 'Free Insured Shipping' },
    { icon: FileCheck, text: 'Certificate of Authenticity' },
  ];

  return (
    <div className={cn("bg-secondary/5 border-y border-secondary/10", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center md:justify-between py-3 gap-6 overflow-x-auto scrollbar-hide">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-secondary whitespace-nowrap">
              <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// WHY BUY FROM US - Trust module for homepage
// ========================================
export function WhyBuyFromUs({ className }) {
  const reasons = [
    {
      icon: Shield,
      title: 'BIS Hallmarked Gold',
      description: 'Every gold piece is certified by the Bureau of Indian Standards for purity.',
    },
    {
      icon: Award,
      title: 'Certified Diamonds & Gems',
      description: 'GIA, IGI, and GRS certified stones with detailed grading reports.',
    },
    {
      icon: RefreshCw,
      title: 'Lifetime Exchange',
      description: 'Exchange your jewelry at current rates, anytime. No questions asked.',
    },
    {
      icon: Truck,
      title: 'Free Insured Delivery',
      description: 'Secure, tamper-proof packaging with real-time tracking.',
    },
    {
      icon: Clock,
      title: '30-Day Easy Returns',
      description: "Not satisfied? Return within 30 days for a full refund.",
    },
    {
      icon: Phone,
      title: 'Expert Support',
      description: 'Speak with jewelry experts for personalized assistance.',
    },
  ];

  return (
    <section className={cn("py-16 bg-accent/30", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-2">
            Why Buy From Aradhya Gems?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We understand buying jewelry online requires trust. Here's our promise to you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-secondary mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================================
// PRODUCT TRUST SIGNALS - For PDP
// ========================================
export function ProductTrustSignals({ product, className }) {
  return (
    <div className={cn("space-y-4 py-4 border-y border-gray-100", className)}>
      <div className="grid grid-cols-2 gap-4">
        <TrustBadge 
          icon={Shield} 
          title={product.hallmark || 'BIS Hallmarked'}
          description="Certified purity"
        />
        <TrustBadge 
          icon={Award} 
          title={product.certification || 'Certified'}
          description="Authenticity guaranteed"
        />
        <TrustBadge 
          icon={RefreshCw} 
          title="Lifetime Exchange"
          description="At current rates"
        />
        <TrustBadge 
          icon={Clock} 
          title="30-Day Returns"
          description="Hassle-free"
        />
      </div>
    </div>
  );
}

// ========================================
// PRICE BREAKDOWN - Transparent pricing
// ========================================
export function PriceBreakdown({ breakdown, className }) {
  if (!breakdown) return null;

  const items = [
    { label: 'Metal Value', value: breakdown.goldValue || breakdown.metalValue || breakdown.platinumValue },
    { label: 'Stone Value', value: breakdown.diamondValue || breakdown.stoneValue || breakdown.rubyValue || breakdown.emeraldValue || breakdown.pearlValue },
    { label: 'Making Charges', value: breakdown.makingCharges },
    { label: 'GST (3%)', value: breakdown.gst },
  ].filter(item => item.value);

  return (
    <div className={cn("bg-gray-50 rounded-lg p-4", className)}>
      <h4 className="font-medium text-secondary text-sm mb-3 flex items-center gap-2">
        <FileCheck className="w-4 h-4 text-primary" />
        Transparent Price Breakdown
      </h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-secondary">₹{item.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
          <span className="text-secondary">Total</span>
          <span className="text-primary">₹{breakdown.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

// ========================================
// REVIEW SUMMARY - Social proof
// ========================================
export function ReviewSummary({ reviews, className }) {
  if (!reviews) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= Math.round(reviews.average)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-secondary">{reviews.average}</span>
      <span className="text-sm text-muted-foreground">({reviews.count} reviews)</span>
    </div>
  );
}

// ========================================
// REVIEW HIGHLIGHTS - Key review points
// ========================================
export function ReviewHighlights({ reviews, className }) {
  if (!reviews?.highlights?.length) return null;

  return (
    <div className={cn("", className)}>
      <p className="text-xs text-muted-foreground mb-2">What customers say:</p>
      <div className="flex flex-wrap gap-2">
        {reviews.highlights.map((highlight, index) => (
          <span 
            key={index}
            className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
          >
            <CheckCircle className="w-3 h-3" />
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========================================
// ORIGIN BADGE - Sourcing transparency
// ========================================
export function OriginBadge({ origin, className }) {
  if (!origin) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <Gem className="w-4 h-4 text-primary" />
      <span className="text-muted-foreground">Origin:</span>
      <span className="text-secondary">{origin}</span>
    </div>
  );
}

// ========================================
// OCCASION TAGS - Lifestyle use
// ========================================
export function OccasionTags({ occasions, className }) {
  if (!occasions?.length) return null;

  const occasionLabels = {
    'daily-wear': '☀️ Daily Wear',
    'office-wear': '💼 Office',
    'wedding': '💒 Wedding',
    'anniversary': '💕 Anniversary',
    'gifting': '🎁 Gifting',
    'party': '✨ Party',
  };

  return (
    <div className={cn("", className)}>
      <p className="text-xs text-muted-foreground mb-2">Perfect for:</p>
      <div className="flex flex-wrap gap-2">
        {occasions.map((occasion) => (
          <span 
            key={occasion}
            className="text-xs bg-primary/5 text-secondary px-3 py-1 rounded-full border border-primary/10"
          >
            {occasionLabels[occasion] || occasion}
          </span>
        ))}
      </div>
    </div>
  );
}

// ========================================
// STOCK INDICATOR - Urgency signal
// ========================================
export function StockIndicator({ stock, className }) {
  if (stock === undefined || stock === null) return null;

  if (stock === 0) {
    return (
      <span className={cn("text-sm text-red-600 font-medium", className)}>
        Out of Stock
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span className={cn("text-sm text-orange-600 font-medium", className)}>
        Only {stock} left – Order soon
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span className={cn("text-sm text-yellow-600", className)}>
        Limited stock available
      </span>
    );
  }

  return (
    <span className={cn("text-sm text-green-600", className)}>
      ✓ In Stock
    </span>
  );
}
