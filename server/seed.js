// ============================================
// ARADHYA GEMS - DATABASE SEED SCRIPT
// ============================================
// Run: npm run seed

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Seed data
const categories = [
  { 
    name: 'Necklaces', 
    slug: 'necklaces',
    description: 'Timeless necklaces crafted for everyday elegance and special occasions',
    whyExists: 'From minimal everyday chains to statement pendants, find pieces that complement your neckline and style.',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Gold & Diamond Necklaces | Aradhya Gems',
    seoDescription: 'Shop authentic gold and diamond necklaces with certified purity.',
    sortOrder: 1
  },
  { 
    name: 'Earrings', 
    slug: 'earrings',
    description: 'Elegant earrings from subtle studs to statement drops',
    whyExists: 'Whether you prefer understated studs for daily wear or eye-catching drops for celebrations.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Diamond & Gold Earrings | Aradhya Gems',
    seoDescription: 'Discover certified diamond and gold earrings.',
    sortOrder: 2
  },
  { 
    name: 'Rings', 
    slug: 'rings',
    description: 'Rings that mark moments—from daily wear to forever promises',
    whyExists: 'Find rings for every finger and every occasion.',
    image: 'https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Diamond & Gold Rings | Aradhya Gems',
    seoDescription: 'Shop engagement rings, daily wear bands, and statement rings.',
    sortOrder: 3
  },
  { 
    name: 'Bracelets', 
    slug: 'bracelets',
    description: 'Bracelets & bangles that add grace to every gesture',
    whyExists: 'From delicate chains to bold bangles, adorn your wrist with pieces that move with you.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    seoTitle: 'Gold & Diamond Bracelets | Aradhya Gems',
    seoDescription: 'Explore our collection of gold bracelets and diamond bangles.',
    sortOrder: 4
  },
];

const products = [
  {
    name: 'Eternal Gold Necklace',
    sku: 'AGN-001',
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
    isNewArrival: true,
    isBestSeller: false,
    weight: { gross: 12.5, net: 11.8, unit: 'grams' },
    priceBreakdown: { goldValue: 38000, makingCharges: 5700, gst: 1300, total: 45000 },
    hallmark: 'BIS 916',
    certification: 'IGI Certified',
    origin: 'Handcrafted in Jaipur, India',
    occasions: ['daily-wear', 'office-wear', 'gifting'],
    idealFor: ['Women', 'Self-purchase', 'Birthday gift'],
    styleNote: 'Pairs beautifully with both Indian and Western wear.',
    reviews: { average: 4.8, count: 47, highlights: ['Exactly as pictured', 'Beautiful packaging', 'Worth the price'] },
    careInstructions: ['Store in a soft pouch when not wearing', 'Avoid contact with perfumes and lotions', 'Clean gently with a soft cloth'],
  },
  {
    name: 'Sapphire Drop Earrings',
    sku: 'AGE-002',
    price: 32000,
    originalPrice: 35000,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'White Gold',
    materialId: 'gold-18k',
    purity: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'],
    description: 'Elegant drop earrings featuring deep blue sapphires set in 18K white gold. The sapphires are ethically sourced from Sri Lanka.',
    shortDescription: 'Blue sapphire drops in 18K white gold',
    stock: 8,
    isNewArrival: false,
    isBestSeller: true,
    weight: { gross: 5.2, net: 4.8, unit: 'grams' },
    priceBreakdown: { goldValue: 15000, stoneValue: 12000, makingCharges: 3500, gst: 1500, total: 32000 },
    hallmark: 'BIS 750',
    certification: 'GIA Certified Sapphires',
    origin: 'Sapphires: Sri Lanka | Setting: Mumbai',
    occasions: ['party', 'wedding', 'anniversary'],
    idealFor: ['Women', 'Evening wear', 'Special occasions'],
    styleNote: 'Statement earrings that elevate any outfit.',
    reviews: { average: 4.9, count: 23, highlights: ['Stunning blue color', 'Lightweight', 'Premium quality'] },
    careInstructions: ['Store separately to avoid scratches', 'Clean with mild soapy water'],
  },
  {
    name: 'Diamond Solitaire Ring',
    sku: 'AGR-003',
    price: 125000,
    originalPrice: 140000,
    category: 'Rings',
    categorySlug: 'rings',
    material: 'Platinum',
    materialId: 'platinum',
    purity: '950 Platinum',
    image: 'https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1605100804763-ebea240d16be?q=80&w=800&auto=format&fit=crop'],
    description: 'A stunning 0.5 carat brilliant-cut diamond set in platinum. VVS1 clarity with excellent cut grade.',
    shortDescription: '0.5ct VVS1 diamond in platinum setting',
    stock: 3,
    isNewArrival: true,
    isBestSeller: true,
    weight: { gross: 8.2, net: 7.8, unit: 'grams' },
    diamondDetails: { carat: 0.5, cut: 'Excellent', clarity: 'VVS1', color: 'F', shape: 'Round Brilliant' },
    priceBreakdown: { diamondValue: 85000, metalValue: 28000, makingCharges: 7500, gst: 4500, total: 125000 },
    hallmark: 'Pt 950',
    certification: 'GIA Certified Diamond',
    origin: 'Diamond: Botswana (Conflict-free) | Setting: Mumbai',
    occasions: ['wedding', 'anniversary', 'gifting'],
    idealFor: ['Engagement', 'Proposal', 'Milestone celebration'],
    styleNote: 'Timeless solitaire design that never goes out of style.',
    reviews: { average: 5.0, count: 12, highlights: ['Proposal was a success!', 'Exceptional sparkle'] },
    careInstructions: ['Professional cleaning recommended annually', 'Store in original box'],
  },
  {
    name: 'Minimal Gold Chain Bracelet',
    sku: 'AGB-004',
    price: 18500,
    originalPrice: 20000,
    category: 'Bracelets',
    categorySlug: 'bracelets',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K (75% pure gold)',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'],
    description: 'A delicate yet durable gold chain bracelet designed for everyday elegance.',
    shortDescription: 'Minimal 18K gold chain for daily wear',
    stock: 20,
    isNewArrival: false,
    isBestSeller: false,
    weight: { gross: 6.5, net: 6.2, unit: 'grams' },
    priceBreakdown: { goldValue: 15000, makingCharges: 2700, gst: 800, total: 18500 },
    hallmark: 'BIS 750',
    certification: 'BIS Hallmarked',
    origin: 'Handcrafted in Mumbai, India',
    occasions: ['daily-wear', 'office-wear', 'gifting'],
    idealFor: ['Women', 'Daily wear', 'Stacking'],
    styleNote: 'Layer with watches or other bracelets.',
    reviews: { average: 4.7, count: 89, highlights: ['Never take it off', 'Perfect for everyday'] },
    careInstructions: ['Safe for daily wear', 'Avoid chlorinated water'],
  },
  {
    name: 'Ruby Heart Pendant',
    sku: 'AGN-005',
    price: 55000,
    originalPrice: 62000,
    category: 'Necklaces',
    categorySlug: 'necklaces',
    material: 'Rose Gold',
    materialId: 'rose-gold',
    purity: '18K Rose Gold',
    image: 'https://images.unsplash.com/photo-1600720612662-79354784db4a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1600720612662-79354784db4a?q=80&w=800&auto=format&fit=crop'],
    description: 'A captivating natural ruby in heart shape, surrounded by small diamonds, set in romantic rose gold.',
    shortDescription: 'Burmese ruby heart in rose gold with diamonds',
    stock: 5,
    isNewArrival: false,
    isBestSeller: true,
    weight: { gross: 7.8, net: 7.2, unit: 'grams' },
    priceBreakdown: { rubyValue: 28000, diamondValue: 8000, goldValue: 14000, makingCharges: 3500, gst: 1500, total: 55000 },
    hallmark: 'BIS 750',
    certification: 'GRS Certified Ruby',
    origin: 'Ruby: Burma (Myanmar) | Diamonds: South Africa',
    occasions: ['anniversary', 'gifting', 'party'],
    idealFor: ['Romantic gift', 'Anniversary', "Valentine's Day"],
    styleNote: 'The warm rose gold complements the ruby perfectly.',
    reviews: { average: 4.9, count: 31, highlights: ['Wife loved it!', 'Stunning ruby color'] },
    careInstructions: ['Store away from direct sunlight', 'Clean with soft damp cloth'],
  },
  {
    name: 'Classic Pearl Studs',
    sku: 'AGE-006',
    price: 8500,
    originalPrice: 9500,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K Gold with Freshwater Pearls',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop'],
    description: 'Timeless freshwater pearl studs in 18K gold settings. 8mm AAA-grade pearls.',
    shortDescription: 'Classic 8mm freshwater pearl studs',
    stock: 35,
    isNewArrival: false,
    isBestSeller: true,
    weight: { gross: 3.2, net: 2.8, unit: 'grams' },
    priceBreakdown: { pearlValue: 4500, goldValue: 2800, makingCharges: 900, gst: 300, total: 8500 },
    hallmark: 'BIS 750',
    certification: 'Pearl grading certificate included',
    origin: 'Pearls: Japan | Setting: India',
    occasions: ['daily-wear', 'office-wear', 'wedding'],
    idealFor: ['Women of all ages', 'First jewelry piece', 'Graduation gift'],
    styleNote: "The most versatile earrings you'll own.",
    reviews: { average: 4.8, count: 156, highlights: ['Wear them every day', 'Perfect size'] },
    careInstructions: ['Put on last, remove first', 'Wipe with soft cloth after wearing'],
  },
  {
    name: 'Diamond Tennis Bracelet',
    sku: 'AGB-007',
    price: 185000,
    originalPrice: 210000,
    category: 'Bracelets',
    categorySlug: 'bracelets',
    material: 'White Gold',
    materialId: 'gold-18k',
    purity: '18K White Gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'],
    description: 'An iconic diamond tennis bracelet featuring 3 carats of VS clarity diamonds in 18K white gold.',
    shortDescription: '3ct diamond line bracelet in white gold',
    stock: 2,
    isNewArrival: true,
    isBestSeller: false,
    weight: { gross: 15.5, net: 14.8, unit: 'grams' },
    diamondDetails: { totalCarat: 3.0, stoneCount: 45, cut: 'Very Good', clarity: 'VS1-VS2', color: 'G-H' },
    priceBreakdown: { diamondValue: 135000, goldValue: 35000, makingCharges: 10000, gst: 5000, total: 185000 },
    hallmark: 'BIS 750',
    certification: 'IGI Certified Diamonds',
    origin: 'Diamonds: Botswana (Conflict-free) | Crafted in Mumbai',
    occasions: ['party', 'wedding', 'anniversary'],
    idealFor: ['Milestone birthday', 'Silver anniversary', 'Self-celebration'],
    styleNote: 'A statement piece that elevates every look.',
    reviews: { average: 5.0, count: 8, highlights: ['Incredible sparkle', 'Museum quality'] },
    careInstructions: ['Professional inspection annually', 'Store flat in original box'],
  },
  {
    name: 'Everyday Gold Hoops',
    sku: 'AGE-008',
    price: 22000,
    originalPrice: 25000,
    category: 'Earrings',
    categorySlug: 'earrings',
    material: 'Gold',
    materialId: 'gold-18k',
    purity: '18K (75% pure gold)',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop'],
    description: 'Medium-sized gold hoops with a modern squared profile. Lightweight and comfortable.',
    shortDescription: 'Modern 18K gold hoops for everyday',
    stock: 18,
    isNewArrival: true,
    isBestSeller: false,
    weight: { gross: 8.0, net: 7.5, unit: 'grams' },
    priceBreakdown: { goldValue: 18000, makingCharges: 3200, gst: 800, total: 22000 },
    hallmark: 'BIS 750',
    certification: 'BIS Hallmarked',
    origin: 'Handcrafted in Jaipur, India',
    occasions: ['daily-wear', 'office-wear', 'party'],
    idealFor: ['Women', 'Modern style', 'Versatile wear'],
    styleNote: 'The perfect size - visible but not overwhelming.',
    reviews: { average: 4.9, count: 67, highlights: ['So comfortable!', 'Perfect weight'] },
    careInstructions: ['Safe for daily wear', 'Avoid sleeping in them'],
  },
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@aradhyagems.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    isActive: true,
    addresses: [
      {
        type: 'home',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        isDefault: true
      }
    ]
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log('');
    console.log('🌱 Starting database seed...');
    console.log('');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({})
    ]);

    // Seed categories
    console.log('📁 Seeding categories...');
    await Category.insertMany(categories);
    console.log(`   ✅ ${categories.length} categories added`);

    // Seed products
    console.log('🛍️  Seeding products...');
    await Product.insertMany(products);
    console.log(`   ✅ ${products.length} products added`);

    // Seed users (with hashed passwords)
    console.log('👤 Seeding users...');
    for (const userData of users) {
      const user = new User(userData);
      await user.save(); // This will trigger the password hashing middleware
    }
    console.log(`   ✅ ${users.length} users added`);

    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║     ✅ DATABASE SEEDED SUCCESSFULLY!           ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║  Test Accounts:                                ║');
    console.log('║  Admin:    admin@aradhyagems.com / admin123    ║');
    console.log('║  Customer: customer@example.com / customer123  ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
