/**
 * Seed script: Adds "Diamonds" parent category and diamond-shape subcategories.
 * Does NOT touch existing categories.
 *
 * Usage:  node server/scripts/seed-categories.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const shapes = [
    { name: 'Round', slug: 'round', sortOrder: 1, description: 'Classic round brilliant cut diamond' },
    { name: 'Princess', slug: 'princess', sortOrder: 2, description: 'Modern square princess cut diamond' },
    { name: 'Oval', slug: 'oval', sortOrder: 3, description: 'Elongated oval cut diamond' },
    { name: 'Marquise', slug: 'marquise', sortOrder: 4, description: 'Boat-shaped marquise cut diamond' },
    { name: 'Cushion', slug: 'cushion', sortOrder: 5, description: 'Pillow-shaped cushion cut diamond' },
    { name: 'Pear', slug: 'pear', sortOrder: 6, description: 'Teardrop pear cut diamond' },
    { name: 'Emerald', slug: 'emerald', sortOrder: 7, description: 'Step-cut emerald shape diamond' },
    { name: 'Square', slug: 'square', sortOrder: 8, description: 'Square cut diamond' },
    { name: 'Pie Cut', slug: 'pie-cut', sortOrder: 9, description: 'Illusion setting pie cut diamond' },
    { name: 'Rose Cut', slug: 'rose-cut', sortOrder: 10, description: 'Vintage-style rose cut diamond' },
];

async function seed() {
    console.log('Connecting to MongoDB …');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // 1. Upsert parent "Diamonds"
    let parent = await Category.findOne({ slug: 'diamonds' });
    if (!parent) {
        parent = await Category.create({
            name: 'Diamonds',
            slug: 'diamonds',
            description: 'Explore our collection of loose and set diamonds in every shape',
            sortOrder: 0,
        });
        console.log('✔ Created parent category: Diamonds');
    } else {
        console.log('ℹ Parent "Diamonds" already exists — skipping.');
    }

    // 2. Upsert each shape as a child
    for (const shape of shapes) {
        const exists = await Category.findOne({ slug: shape.slug, parentCategory: parent._id });
        if (!exists) {
            await Category.create({
                ...shape,
                parentCategory: parent._id,
            });
            console.log(`  ✔ Created sub-category: ${shape.name}`);
        } else {
            console.log(`  ℹ "${shape.name}" already exists — skipping.`);
        }
    }

    console.log('\nDone. Disconnecting …');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
