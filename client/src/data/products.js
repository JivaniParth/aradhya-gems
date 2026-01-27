// ============================================
// ARADHYA GEMS - PRODUCT DATA & CATALOG SYSTEM
// ============================================

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

// Products with enhanced data for trust & conversion
export const products = [
  {
    id: '1',
    name: 'Eternal Gold Necklace',
    price: 45000,
    originalPrice: 52000,
    category: 'Necklaces',
    categorySlug: 'necklaces',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K (75% pure gold)',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    ],
    description: 'A timeless piece crafted from 18K gold, perfect for any occasion. This exquisite necklace features a delicate chain with a subtle pendant that catches the light beautifully.',
    shortDescription: 'Delicate 18K gold chain with subtle pendant',
    stock: 15,
    isNew: true,
    isBestSeller: false,
    sku: 'AGN-001',
    weight: { gross: 12.5, net: 11.8, unit: 'grams' },
    dimensions: { length: '18 inches', pendantSize: '12mm' },
    priceBreakdown: { goldValue: 38000, makingCharges: 5700, gst: 1300, total: 45000 },
    hallmark: 'BIS 916',
    certification: 'IGI Certified',
    origin: 'Handcrafted in Jaipur, India',
    occasions: ['daily-wear', 'office-wear', 'gifting'],
    idealFor: ['Women', 'Self-purchase', 'Birthday gift'],
    styleNote: 'Pairs beautifully with both Indian and Western wear. Perfect for layering.',
    reviews: { average: 4.8, count: 47, highlights: ['Exactly as pictured', 'Beautiful packaging', 'Worth the price'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current gold rate',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Store in a soft pouch when not wearing', 'Avoid contact with perfumes and lotions', 'Clean gently with a soft cloth'],
  },
  {
    id: '2',
    name: 'Sapphire Drop Earrings',
    price: 32000,
    originalPrice: 35000,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'White Gold',
    materialId: 'gold-18k',
    purity: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'],
    description: 'Elegant drop earrings featuring deep blue sapphires set in 18K white gold. The sapphires are ethically sourced from Sri Lanka and hand-set by master craftsmen.',
    shortDescription: 'Blue sapphire drops in 18K white gold',
    stock: 8,
    isNew: false,
    isBestSeller: true,
    sku: 'AGE-002',
    weight: { gross: 5.2, net: 4.8, unit: 'grams' },
    dimensions: { length: '35mm drop', width: '8mm' },
    priceBreakdown: { goldValue: 15000, stoneValue: 12000, makingCharges: 3500, gst: 1500, total: 32000 },
    hallmark: 'BIS 750',
    certification: 'GIA Certified Sapphires',
    origin: 'Sapphires: Sri Lanka | Setting: Mumbai',
    occasions: ['party', 'wedding', 'anniversary'],
    idealFor: ['Women', 'Evening wear', 'Special occasions'],
    styleNote: 'Statement earrings that elevate any outfit. Perfect with an updo hairstyle.',
    reviews: { average: 4.9, count: 23, highlights: ['Stunning blue color', 'Lightweight', 'Premium quality'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current rates',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Store separately to avoid scratches', 'Clean with mild soapy water', 'Avoid ultrasonic cleaners'],
  },
  {
    id: '3',
    name: 'Diamond Solitaire Ring',
    price: 125000,
    originalPrice: 140000,
    category: 'Rings',
    categorySlug: 'rings',
    material: 'Platinum',
    materialId: 'platinum',
    purity: '950 Platinum',
    image: 'https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop'],
    description: 'A stunning 0.5 carat brilliant-cut diamond set in platinum. This solitaire ring features a VVS1 clarity diamond with excellent cut grade, maximizing brilliance and fire.',
    shortDescription: '0.5ct VVS1 diamond in platinum setting',
    stock: 3,
    isNew: true,
    isBestSeller: true,
    sku: 'AGR-003',
    weight: { gross: 8.2, net: 7.8, unit: 'grams' },
    dimensions: { ringSize: 'Customizable', stoneSize: '5.2mm diameter' },
    diamondDetails: { carat: 0.5, cut: 'Excellent', clarity: 'VVS1', color: 'F', shape: 'Round Brilliant' },
    priceBreakdown: { diamondValue: 85000, metalValue: 28000, makingCharges: 7500, gst: 4500, total: 125000 },
    hallmark: 'Pt 950',
    certification: 'GIA Certified Diamond',
    origin: 'Diamond: Botswana (Conflict-free) | Setting: Mumbai',
    occasions: ['wedding', 'anniversary', 'gifting'],
    idealFor: ['Engagement', 'Proposal', 'Milestone celebration'],
    styleNote: 'Timeless solitaire design that never goes out of style. A forever piece.',
    reviews: { average: 5.0, count: 12, highlights: ['Proposal was a success!', 'Exceptional sparkle', 'Worth every rupee'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime upgrade policy',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Professional cleaning recommended annually', 'Store in original box', 'Insure your piece'],
  },
  {
    id: '4',
    name: 'Minimal Gold Chain Bracelet',
    price: 18500,
    originalPrice: 20000,
    category: 'Bracelets',
    categorySlug: 'bracelets',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K (75% pure gold)',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'],
    description: 'A delicate yet durable gold chain bracelet designed for everyday elegance. The minimalist design makes it perfect for stacking or wearing solo.',
    shortDescription: 'Minimal 18K gold chain for daily wear',
    stock: 20,
    isNew: false,
    isBestSeller: false,
    sku: 'AGB-004',
    weight: { gross: 6.5, net: 6.2, unit: 'grams' },
    dimensions: { length: '7 inches (adjustable)', width: '2mm' },
    priceBreakdown: { goldValue: 15000, makingCharges: 2700, gst: 800, total: 18500 },
    hallmark: 'BIS 750',
    certification: 'BIS Hallmarked',
    origin: 'Handcrafted in Mumbai, India',
    occasions: ['daily-wear', 'office-wear', 'gifting'],
    idealFor: ['Women', 'Daily wear', 'Stacking'],
    styleNote: 'Layer with watches or other bracelets. Transitions seamlessly from day to night.',
    reviews: { average: 4.7, count: 89, highlights: ['Never take it off', 'Perfect for everyday', 'Great for gifting'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current gold rate',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Safe for daily wear', 'Avoid chlorinated water', 'Polish with soft cloth'],
  },
  {
    id: '5',
    name: 'Ruby Heart Pendant',
    price: 55000,
    originalPrice: 62000,
    category: 'Necklaces',
    categorySlug: 'necklaces',
    material: 'Rose Gold',
    materialId: 'rose-gold',
    purity: '18K Rose Gold',
    image: 'https://images.unsplash.com/photo-1600720612662-79354784db4a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1600720612662-79354784db4a?q=80&w=800&auto=format&fit=crop'],
    description: 'A captivating natural ruby in heart shape, surrounded by small diamonds, set in romantic rose gold. The ruby is sourced from Burma and features exceptional color saturation.',
    shortDescription: 'Burmese ruby heart in rose gold with diamonds',
    stock: 5,
    isNew: false,
    isBestSeller: true,
    sku: 'AGN-005',
    weight: { gross: 7.8, net: 7.2, unit: 'grams' },
    dimensions: { chainLength: '16 inches (adjustable to 18)', pendantSize: '15mm heart' },
    priceBreakdown: { rubyValue: 28000, diamondValue: 8000, goldValue: 14000, makingCharges: 3500, gst: 1500, total: 55000 },
    hallmark: 'BIS 750',
    certification: 'GRS Certified Ruby',
    origin: 'Ruby: Burma (Myanmar) | Diamonds: South Africa',
    occasions: ['anniversary', 'gifting', 'party'],
    idealFor: ['Romantic gift', 'Anniversary', "Valentine's Day"],
    styleNote: 'The warm rose gold complements the ruby perfectly. A piece that speaks of love.',
    reviews: { average: 4.9, count: 31, highlights: ['Wife loved it!', 'Stunning ruby color', 'Beautiful gift packaging'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current rates',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Store away from direct sunlight', 'Clean with soft damp cloth', 'Avoid harsh chemicals'],
  },
  {
    id: '6',
    name: 'Classic Pearl Studs',
    price: 8500,
    originalPrice: 9500,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K Gold with Freshwater Pearls',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop'],
    description: 'Timeless freshwater pearl studs in 18K gold settings. These 8mm AAA-grade pearls feature exceptional luster and perfectly round shape.',
    shortDescription: 'Classic 8mm freshwater pearl studs',
    stock: 35,
    isNew: false,
    isBestSeller: true,
    sku: 'AGE-006',
    weight: { gross: 3.2, net: 2.8, unit: 'grams' },
    dimensions: { pearlSize: '8mm diameter', postType: 'Push-back closure' },
    priceBreakdown: { pearlValue: 4500, goldValue: 2800, makingCharges: 900, gst: 300, total: 8500 },
    hallmark: 'BIS 750',
    certification: 'Pearl grading certificate included',
    origin: 'Pearls: Japan | Setting: India',
    occasions: ['daily-wear', 'office-wear', 'wedding'],
    idealFor: ['Women of all ages', 'First jewelry piece', 'Graduation gift'],
    styleNote: "The most versatile earrings you'll own. Works with everything from sarees to suits.",
    reviews: { average: 4.8, count: 156, highlights: ['Wear them every day', 'Perfect size', 'Great first fine jewelry'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Put on last, remove first', 'Wipe with soft cloth after wearing', 'Store separately from other jewelry'],
  },
  {
    id: '7',
    name: 'Diamond Tennis Bracelet',
    price: 185000,
    originalPrice: 210000,
    category: 'Bracelets',
    categorySlug: 'bracelets',
    material: 'White Gold',
    materialId: 'gold-18k',
    purity: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'],
    description: 'An iconic diamond tennis bracelet featuring 3 carats of VS clarity diamonds in 18K white gold. Each diamond is hand-set in a secure four-prong setting.',
    shortDescription: '3ct diamond line bracelet in white gold',
    stock: 2,
    isNew: true,
    isBestSeller: false,
    sku: 'AGB-007',
    weight: { gross: 15.5, net: 14.8, unit: 'grams' },
    dimensions: { length: '7 inches', width: '4mm' },
    diamondDetails: { totalCarat: 3.0, stoneCount: 45, cut: 'Very Good', clarity: 'VS1-VS2', color: 'G-H' },
    priceBreakdown: { diamondValue: 135000, goldValue: 35000, makingCharges: 10000, gst: 5000, total: 185000 },
    hallmark: 'BIS 750',
    certification: 'IGI Certified Diamonds',
    origin: 'Diamonds: Botswana (Conflict-free) | Crafted in Mumbai',
    occasions: ['party', 'wedding', 'anniversary'],
    idealFor: ['Milestone birthday', 'Silver anniversary', 'Self-celebration'],
    styleNote: 'A statement piece that elevates every look. Wear alone or stack with your watch.',
    reviews: { average: 5.0, count: 8, highlights: ['Incredible sparkle', 'Museum quality', 'Heirloom piece'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime upgrade policy',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Professional inspection annually', 'Store flat in original box', 'Insure immediately'],
  },
  {
    id: '8',
    name: 'Everyday Gold Hoops',
    price: 22000,
    originalPrice: 25000,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K (75% pure gold)',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop'],
    description: 'Medium-sized gold hoops with a modern squared profile. Lightweight and comfortable for all-day wear with a secure click-top closure.',
    shortDescription: 'Modern 18K gold hoops for everyday',
    stock: 18,
    isNew: true,
    isBestSeller: false,
    sku: 'AGE-008',
    weight: { gross: 8.0, net: 7.5, unit: 'grams' },
    dimensions: { diameter: '25mm', thickness: '3mm squared' },
    priceBreakdown: { goldValue: 18000, makingCharges: 3200, gst: 800, total: 22000 },
    hallmark: 'BIS 750',
    certification: 'BIS Hallmarked',
    origin: 'Handcrafted in Jaipur, India',
    occasions: ['daily-wear', 'office-wear', 'party'],
    idealFor: ['Women', 'Modern style', 'Versatile wear'],
    styleNote: 'The perfect size - visible but not overwhelming. Works with every hairstyle.',
    reviews: { average: 4.9, count: 67, highlights: ['So comfortable!', 'Perfect weight', 'My go-to earrings'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current gold rate',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Safe for daily wear', 'Avoid sleeping in them', 'Clean with jewelry cloth'],
  },
  {
    id: '9',
    name: 'Emerald Cocktail Ring',
    price: 95000,
    originalPrice: 110000,
    category: 'Rings',
    categorySlug: 'rings',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K Yellow Gold',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop'],
    description: "A stunning 2-carat natural Colombian emerald set in 18K gold with diamond accents. The vivid green color and exceptional clarity make this a collector's piece.",
    shortDescription: '2ct Colombian emerald with diamond halo',
    stock: 1,
    isNew: false,
    isBestSeller: true,
    sku: 'AGR-009',
    weight: { gross: 9.5, net: 8.8, unit: 'grams' },
    dimensions: { ringSize: 'Customizable', stoneSize: '9x7mm emerald cut' },
    priceBreakdown: { emeraldValue: 55000, diamondValue: 18000, goldValue: 16000, makingCharges: 4500, gst: 1500, total: 95000 },
    hallmark: 'BIS 750',
    certification: 'GRS Certified Emerald, IGI Certified Diamonds',
    origin: 'Emerald: Colombia | Diamonds: South Africa',
    occasions: ['party', 'anniversary', 'gifting'],
    idealFor: ['Statement piece', 'Emerald lover', 'Investment jewelry'],
    styleNote: 'Let this ring be the star. Pair with simple gold accessories.',
    reviews: { average: 5.0, count: 5, highlights: ['Breathtaking emerald', 'Investment piece', 'Museum quality'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Emeralds are softer - handle with care', 'Avoid ultrasonic cleaning', 'Store in padded box'],
  },
  {
    id: '10',
    name: 'Simple Gold Band',
    price: 12000,
    originalPrice: 13500,
    category: 'Rings',
    categorySlug: 'rings',
    material: 'Gold',
    materialId: 'gold-14k',
    purity: '14K (58.3% pure gold)',
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=800&auto=format&fit=crop'],
    description: 'A classic comfort-fit gold band in 14K gold. Perfect as a wedding band, everyday ring, or for stacking with other pieces.',
    shortDescription: 'Classic 14K comfort-fit band',
    stock: 50,
    isNew: false,
    isBestSeller: true,
    sku: 'AGR-010',
    weight: { gross: 4.0, net: 3.8, unit: 'grams' },
    dimensions: { width: '4mm', ringSize: 'All sizes available' },
    priceBreakdown: { goldValue: 9800, makingCharges: 1700, gst: 500, total: 12000 },
    hallmark: 'BIS 585',
    certification: 'BIS Hallmarked',
    origin: 'Handcrafted in Mumbai, India',
    occasions: ['wedding', 'daily-wear', 'anniversary'],
    idealFor: ['Wedding band', 'Couples', 'Minimalist style'],
    styleNote: "Timeless design that pairs with anything. Popular as couples' matching bands.",
    reviews: { average: 4.8, count: 234, highlights: ['Perfect wedding band', 'So comfortable', 'Great value'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current gold rate',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Safe for 24/7 wear', 'Remove for heavy physical work', 'Polish occasionally'],
  },
  {
    id: '11',
    name: 'Diamond Mangalsutra',
    price: 75000,
    originalPrice: 85000,
    category: 'Necklaces',
    categorySlug: 'necklaces',
    material: 'Gold',
    materialId: 'gold-22k',
    purity: '22K Gold with VS Diamonds',
    image: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?q=80&w=800&auto=format&fit=crop'],
    description: 'A contemporary take on the traditional mangalsutra. Features black beads strung on 22K gold wire with a modern diamond pendant that suits both Indian and Western wear.',
    shortDescription: 'Modern diamond mangalsutra in 22K gold',
    stock: 12,
    isNew: true,
    isBestSeller: true,
    sku: 'AGN-011',
    weight: { gross: 14.0, net: 13.2, unit: 'grams' },
    dimensions: { length: '18 inches (adjustable)', pendantSize: '18mm' },
    diamondDetails: { totalCarat: 0.35, stoneCount: 7, cut: 'Excellent', clarity: 'VS1', color: 'E-F' },
    priceBreakdown: { goldValue: 48000, diamondValue: 18000, makingCharges: 6500, gst: 2500, total: 75000 },
    hallmark: 'BIS 916',
    certification: 'IGI Certified Diamonds',
    origin: 'Handcrafted in Kolkata, India',
    occasions: ['wedding', 'daily-wear'],
    idealFor: ['Newlyweds', 'Modern brides', 'Anniversary upgrade'],
    styleNote: 'Designed to be worn every day without looking dated. Works with workwear to wedding wear.',
    reviews: { average: 4.9, count: 78, highlights: ['Wear it daily', 'Modern yet traditional', 'Gets so many compliments'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange at current gold rate',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Handle black beads gently', 'Store laid flat', 'Clean pendant with soft cloth'],
  },
  {
    id: '12',
    name: "Men's Platinum Band",
    price: 45000,
    originalPrice: 50000,
    category: 'Rings',
    categorySlug: 'rings',
    material: 'Platinum',
    materialId: 'platinum',
    purity: '950 Platinum',
    image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=800&auto=format&fit=crop'],
    description: "A bold men's platinum band with brushed center and polished edges. Hypoallergenic and perfect for those who prefer the weight and prestige of platinum.",
    shortDescription: "Bold brushed platinum men's band",
    stock: 8,
    isNew: false,
    isBestSeller: false,
    sku: 'AGR-012',
    weight: { gross: 12.0, net: 11.5, unit: 'grams' },
    dimensions: { width: '6mm', ringSize: 'All sizes available' },
    priceBreakdown: { platinumValue: 38000, makingCharges: 5500, gst: 1500, total: 45000 },
    hallmark: 'Pt 950',
    certification: 'PGI Certified',
    origin: 'Handcrafted in Mumbai, India',
    occasions: ['wedding', 'daily-wear'],
    idealFor: ['Men', 'Grooms', 'Platinum lovers'],
    styleNote: "The weight and feel of platinum is unmatched. A ring he'll never want to take off.",
    reviews: { average: 4.9, count: 42, highlights: ['Love the weight', 'Comfortable fit', 'Hypoallergenic - no reactions'] },
    returnPolicy: '30-day hassle-free returns',
    exchangePolicy: 'Lifetime exchange',
    warranty: 'Lifetime manufacturing warranty',
    careInstructions: ['Platinum develops natural patina', 'Can be polished to restore shine', 'Very durable for daily wear'],
  },
];

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export function filterProducts({ category, material, minPrice, maxPrice, occasion, search, sortBy }) {
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.categorySlug.toLowerCase() === category.toLowerCase());
  }
  if (material) {
    filtered = filtered.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
  }
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }
  if (occasion) {
    filtered = filtered.filter(p => p.occasions && p.occasions.includes(occasion));
  }
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.material.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
    );
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviews?.count || 0) - (a.reviews?.count || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.reviews?.average || 0) - (a.reviews?.average || 0));
        break;
      default:
        break;
    }
  }

  return filtered;
}

export function getNewArrivals() {
  return products.filter(p => p.isNew).slice(0, 8);
}

export function getBestSellers() {
  return products.filter(p => p.isBestSeller).slice(0, 8);
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug) {
  return products.filter(p => p.categorySlug === categorySlug);
}

export function getProductsByOccasion(occasionId) {
  return products.filter(p => p.occasions && p.occasions.includes(occasionId));
}

export function getCategoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}

export function getRelatedProducts(product, limit = 4) {
  return products.filter(p => p.id !== product.id && p.categorySlug === product.categorySlug).slice(0, limit);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
