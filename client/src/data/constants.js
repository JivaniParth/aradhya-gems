// ============================================
// ARADHYA GEMS - STATIC CONSTANTS & UTILITIES
// ============================================
// Static reference data that rarely changes.
// Product data is fetched from the API — see services/api.js

// Category definitions with SEO-ready content
export const categories = [
    {
        id: 'necklaces',
        name: 'Necklaces',
        slug: 'necklaces',
        description: 'Timeless necklaces crafted for everyday elegance and special occasions',
        whyExists: 'From minimal everyday chains to statement pendants, find pieces that complement your neckline and style.',
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
        seoTitle: 'Gold & Diamond Necklaces | Aradhya Gems',
        seoDescription: 'Shop authentic gold and diamond necklaces with certified purity. Free shipping, lifetime exchange, and 30-day returns.'
    },
    {
        id: 'earrings',
        name: 'Earrings',
        slug: 'earrings',
        description: 'Elegant earrings from subtle studs to statement drops',
        whyExists: 'Whether you prefer understated studs for daily wear or eye-catching drops for celebrations, we have your perfect pair.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
        seoTitle: 'Diamond & Gold Earrings | Aradhya Gems',
        seoDescription: 'Discover certified diamond and gold earrings. Every piece comes with authenticity certificate and lifetime warranty.'
    },
    {
        id: 'rings',
        name: 'Rings',
        slug: 'rings',
        description: 'Rings that mark moments—from daily wear to forever promises',
        whyExists: 'Find rings for every finger and every occasion. Engagement, everyday, or statement—crafted to last generations.',
        image: 'https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop',
        seoTitle: 'Diamond & Gold Rings | Aradhya Gems',
        seoDescription: 'Shop engagement rings, daily wear bands, and statement rings. Certified diamonds with transparent pricing.'
    },
    {
        id: 'bracelets',
        name: 'Bracelets',
        slug: 'bracelets',
        description: 'Bracelets & bangles that add grace to every gesture',
        whyExists: 'From delicate chains to bold bangles, adorn your wrist with pieces that move with you.',
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
        seoTitle: 'Gold & Diamond Bracelets | Aradhya Gems',
        seoDescription: 'Explore our collection of gold bracelets and diamond bangles. Every piece certified for purity and authenticity.'
    },
];

// Material definitions with educational content
export const materials = [
    {
        id: 'gold-22k',
        name: '22K Gold',
        purity: '91.6%',
        description: 'Traditional gold with rich, warm color. Ideal for classic designs.',
        careNote: 'Softer than 18K, best for occasional wear pieces.'
    },
    {
        id: 'gold-18k',
        name: '18K Gold',
        purity: '75%',
        description: 'Perfect balance of purity and durability. Ideal for daily wear.',
        careNote: 'Durable enough for everyday use while maintaining rich color.'
    },
    {
        id: 'gold-14k',
        name: '14K Gold',
        purity: '58.3%',
        description: 'Most durable gold option. Great for active lifestyles.',
        careNote: 'Highly resistant to scratches and wear.'
    },
    {
        id: 'platinum',
        name: 'Platinum',
        purity: '95%',
        description: 'Rare, hypoallergenic, and naturally white. The premium choice.',
        careNote: 'Develops a natural patina over time. Can be polished to restore shine.'
    },
    {
        id: 'silver',
        name: 'Sterling Silver',
        purity: '92.5%',
        description: 'Classic silver with a bright, lustrous finish.',
        careNote: 'May tarnish over time. Regular cleaning recommended.'
    },
    {
        id: 'rose-gold',
        name: 'Rose Gold',
        purity: '75% (18K)',
        description: 'Romantic pink hue from copper alloy. Modern and unique.',
        careNote: 'As durable as yellow gold of same karat.'
    },
];

// Occasions for emotional navigation
export const occasions = [
    { id: 'daily-wear', name: 'Daily Wear', icon: '☀️', description: 'Lightweight, durable pieces for everyday elegance' },
    { id: 'wedding', name: 'Wedding', icon: '💒', description: 'Bridal and celebration pieces' },
    { id: 'anniversary', name: 'Anniversary', icon: '💕', description: 'Mark milestones with timeless gifts' },
    { id: 'gifting', name: 'Gifting', icon: '🎁', description: 'Perfect presents for loved ones' },
    { id: 'office-wear', name: 'Office Wear', icon: '💼', description: 'Subtle sophistication for professional settings' },
    { id: 'party', name: 'Party & Evening', icon: '✨', description: 'Statement pieces that shine' },
];

// Price ranges for rational navigation
export const priceRanges = [
    { id: 'under-25k', name: 'Under ₹25,000', min: 0, max: 25000 },
    { id: '25k-50k', name: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { id: '50k-100k', name: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
    { id: 'above-100k', name: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export function getCategoryBySlug(slug) {
    return categories.find(c => c.slug === slug);
}

export function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
