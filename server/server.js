import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';

// Models for seeding
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import Blog from './models/Blog.js';
import FAQ from './models/FAQ.js';
import Customer from './models/Customer.js';
import Category from './models/Category.js';
import mongoose from 'mongoose';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminUserRoutes);

// Test API route
app.get('/api', (req, res) => {
  res.json({ message: "Backend API is running" });
});

// Base route
app.get('/', (req, res) => {
  res.send('Veda Global API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Auto-seed Database function
const seedDatabase = async () => {
  try {
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    console.log(`--- Backend Database Status ---`);
    console.log(`Connected DB name: ${dbName}`);
    console.log(`Connection URI host: ${host}`);

    const productsCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const usersCount = await Customer.countDocuments();
    const adminsCount = await Admin.countDocuments();

    console.log(`Products count: ${productsCount}`);
    console.log(`Categories count: ${categoriesCount}`);
    console.log(`Users count: ${usersCount}`);
    console.log(`Admins count: ${adminsCount}`);
    console.log(`-------------------------------`);

    // 1. Seed Admin
    let admin = await Admin.findOne({ email: 'admin@vedaglobal.com' });
    if (!admin) {
      console.log('Seeding default admin user...');
      admin = new Admin({
        email: 'admin@vedaglobal.com',
        password: 'Admin@1234'
      });
      await admin.save();
      console.log('Default admin created: admin@vedaglobal.com / Admin@1234');
    } else {
      admin.password = 'Admin@1234';
      await admin.save();
      console.log('Admin credentials synced: admin@vedaglobal.com / Admin@1234');
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding sample products...');
      const sampleProducts = [
        {
          name: 'Premium Basmati Rice (1121)',
          category: 'Rice',
          shortDescription: 'Extra-long grain, aromatic Indian Basmati rice aged to perfection.',
          description: 'Our aged 1121 Basmati Rice is sourced from the pristine foothills of the Himalayas. Known for its distinct fragrance, fluffy texture, and elongated grains that double in size after cooking. Perfect for premium restaurants and international retail markets.',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
          benefits: ['Low glycemic index', 'Rich in natural aroma', 'Non-sticky and fluffy structure', 'Gluten-free nutrient source'],
          packagingOptions: ['1kg Jute Bag', '5kg Non-Woven Fabric Bag', '10kg PP Bag', '25kg Bulk Bag'],
          isFeatured: true
        },
        {
          name: 'Organic Flax Seeds',
          category: 'Seeds',
          shortDescription: 'Nutrient-rich, premium organic flax seeds loaded with Omega-3.',
          description: 'Sourced from organic farming communities across India. These golden brown flax seeds are rich in dietary fiber, lignans, and essential fatty acids. Meticulously cleaned and processed to ensure pure, contamination-free export quality.',
          image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800&auto=format&fit=crop',
          benefits: ['Rich in Omega-3 fatty acids', 'High in dietary fiber', 'Supports heart health', 'Great for vegetarian diets'],
          packagingOptions: ['250g Pouch', '500g Jar', '25kg Multi-wall Paper Bag'],
          isFeatured: true
        },
        {
          name: 'Kashmiri Red Chilli Powder',
          category: 'Spices',
          shortDescription: 'Rich, vibrant red color with a mild, flavorful heat level.',
          description: 'Cultivated in the cool valleys of Kashmir, these chillies are handpicked and ground under hygienic conditions. It imparts an appealing dark red color to cuisines without adding excessive heat, highly valued in global cuisines.',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
          benefits: ['High in Vitamin C', 'Boosts digestion', 'Imparts premium deep red color', 'Naturally dried and ground'],
          packagingOptions: ['100g Box', '500g Zip Lock Pouch', '20kg Kraft Bags'],
          isFeatured: true
        },
        {
          name: 'Organic Pearl Millet (Bajra)',
          category: 'Millets',
          shortDescription: 'Traditional wholesome superfood grain packed with minerals.',
          description: 'Directly sourced from rain-fed farms in Rajasthan. Pearl millet is a powerhouse of iron, calcium, and magnesium. Carefully de-stoned and graded, ready for baking and porridge formulations.',
          image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800&auto=format&fit=crop',
          benefits: ['Excellent source of plant-based protein', 'High in iron and magnesium', 'Gluten-free traditional grain', 'Helps regulate blood sugar levels'],
          packagingOptions: ['1kg Paper Bag', '5kg PP Bag', '25kg Bulk Bag'],
          isFeatured: false
        },
        {
          name: 'Cold Pressed Virgin Mustard Oil',
          category: 'Cold Pressed Oil',
          shortDescription: 'Traditionally extracted yellow mustard oil with strong natural aroma.',
          description: 'Our yellow mustard oil is extracted using traditional wood presses (Kachi Ghani) at low temperatures. This retains the pungent flavor, natural antioxidants, and nutritious profile. Zero chemical additives or heat treatments.',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
          benefits: ['Rich in monounsaturated fatty acids', 'Natural anti-bacterial qualities', 'Ideal for traditional cooking', 'Zero trans-fats'],
          packagingOptions: ['500ml Glass Bottle', '1L Tin Can', '5L PET Can', '15L Tin'],
          isFeatured: true
        },
        {
          name: 'Pure Ashwagandha Root Powder',
          category: 'Herbal Products',
          shortDescription: 'Premium adaptogenic herb for stress relief and vitality.',
          description: 'Ashwagandha (Withania somnifera) roots are sustainably harvested, washed, sun-dried, and pulverized into a fine powder. Tested for purity and standardized for premium export levels of withanolides.',
          image: 'https://images.unsplash.com/photo-1611070973770-b1a672610041?q=80&w=800&auto=format&fit=crop',
          benefits: ['Powerful natural adaptogen', 'Helps reduce stress and anxiety', 'Supports immune system', 'Enhances stamina and focus'],
          packagingOptions: ['100g Jar', '250g Foil Pouch', '25kg Fiber Drum'],
          isFeatured: false
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('Sample products seeded successfully.');
    }

    // 3. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding mock blogs...');
      const sampleBlogs = [
        {
          title: 'The Journey of Indian Spices from Farm to Table',
          slug: 'journey-of-indian-spices-farm-to-table',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
          shortDescription: 'Discover the traditional cultivation, harvesting, and strict quality verification processes behind Indian spices.',
          content: 'Indian spices have enchanted kitchens worldwide for millennia. Our journey starts in the sun-drenched red soil farms of Southern and Western India, where black pepper, turmeric, and cardamom are cultivated organically. We harvest at absolute peak maturity. Each spice is sun-dried, de-stoned, and routed to state-of-the-art facilities for steam sterilization to maintain premium health profiles. By executing strict control loops, Veda Global guarantees our international buyers receive high-potency spice extracts matching international phytosanitary regulations.'
        },
        {
          title: 'Why Organic Millets are the Future of Global Superfoods',
          slug: 'why-organic-millets-future-global-superfoods',
          image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800&auto=format&fit=crop',
          shortDescription: 'As the world shifts towards gluten-free diets, learn why Indian millets like Bajra and Ragi are leading the charge.',
          content: 'With rising global focus on nutrition, millets are experiencing a major revival. These ancient grains require minimal irrigation and zero chemical fertilizers to thrive, making them highly ecological. Millets are entirely gluten-free and packed with essential iron, dietary fiber, and complex proteins. Veda Global works closely with farming cooperatives in semi-arid zones to source premium quality Pearl Millet (Bajra) and Finger Millet (Ragi), processed gently to retain their fibrous hulls. Integrate millets into your baking formulas or health-food packaging to appeal to modern wellness-oriented buyers.'
        },
        {
          title: 'Export Packaging: Protecting Harvest Quality in Transit',
          slug: 'export-packaging-protecting-harvest-quality',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
          shortDescription: 'An inside look at how Veda Global packages delicate goods to withstand long sea routes and weather variance.',
          content: 'Global logistics presents severe challenges like heat spikes, container rain, and physical impact during cargo handling. To counter this, Veda Global implements multi-layered preservation controls. From oxygen barriers and food-grade vacuum sealing for spices and seeds to robust corrugated structures for bottle cargo, we protect product integrity. We offer jute bags with internal food-grade liners for grain cargoes, ensuring ventilation and preventing moisture build-up. We also customize layouts, logos, and languages to deliver retail-ready products directly to international supermarket networks.'
        }
      ];

      await Blog.insertMany(sampleBlogs);
      console.log('Sample blogs seeded successfully.');
    }

    // 4. Seed FAQs
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      console.log('Seeding default FAQs...');
      const sampleFAQs = [
        {
          question: 'What is your minimum order quantity (MOQ)?',
          answer: 'For standard ocean freight consignments, our standard MOQ is 1 FCL (Full Container Load). However, we accommodate trial runs and mixed container assortments of different product lines for new business partners.'
        },
        {
          question: 'Are Veda Global products certified organic?',
          answer: 'Yes. Our dedicated organic catalogs are certified under USDA Organic (NOP), India Organic (NPOP), and EU organic certifications, audited regularly by SGS.'
        },
        {
          question: 'What payment methods and terms do you accept?',
          answer: 'We accept irrevocable Letter of Credit (L/C) at sight, Document against Payment (D/P), or Telegraphic Transfer (T/T) with a 30% advance deposit and the remaining balance due against shipping documents.'
        },
        {
          question: 'Do you offer private labeling (OEM) packaging?',
          answer: 'Absolutely. We support customized retail-ready packaging including high-barrier stand-up pouches, custom jars, cartons, and bulk bags labeled with your brand artwork, barcodes, and local language regulations.'
        },
        {
          question: 'How do you ensure phytosanitary quality control?',
          answer: 'Every shipment undergoes custom inspections, fumigation, and holds certificates of analysis covering moisture level, microbial count, and heavy metal testing issued by NABL-accredited laboratories.'
        }
      ];

      await FAQ.insertMany(sampleFAQs);
      console.log('Sample FAQs seeded successfully.');
    }

    // Migration/Updates for missing wholesalePrice and stockQuantity
    const productsToUpdate = await Product.find({});
    let updatedCount = 0;
    for (const p of productsToUpdate) {
      let changed = false;
      
      // wholesalePrice
      if (p.wholesalePrice === undefined || p.wholesalePrice === null || p.wholesalePrice === 0) {
        const basePrice = p.retailPrice || p.price || 0;
        p.wholesalePrice = basePrice ? Math.round(basePrice * 0.85 * 100) / 100 : 0;
        changed = true;
      }
      
      // stockQuantity
      if (p.stockQuantity === undefined || p.stockQuantity === null || p.stockQuantity === 0) {
        p.stockQuantity = 100;
        changed = true;
      }
      
      if (changed) {
        await p.save();
        updatedCount++;
      }
    }
    if (updatedCount > 0) {
      console.log(`Migrated ${updatedCount} products with missing wholesalePrice / stockQuantity default values.`);
    }

    // Ensure the specified 4 featured products exist and are configured correctly
    const targetFeaturedProducts = [
      {
        name: 'Organic Chia Seeds',
        category: 'Seeds',
        shortDescription: 'Premium organic chia seeds rich in Omega-3 fibers and plant protein.',
        description: 'Sourced from organic farming tracts. Handled under stringent hygienic conditions to deliver clean, dark chia seeds with outstanding water absorption capacity.',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800&auto=format&fit=crop',
        price: 150,
        retailPrice: 150,
        wholesalePrice: 120,
        stockQuantity: 100,
        isFeatured: true,
        featured: true,
        isBestSeller: false,
        bestseller: false
      },
      {
        name: 'Premium Basmati Rice',
        category: 'Grains',
        shortDescription: 'Extra-long grain, aromatic Indian Basmati rice aged to perfection.',
        description: 'Our aged Basmati Rice is sourced from the pristine foothills of the Himalayas. Known for its distinct fragrance, fluffy texture, and elongated grains.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
        price: 120,
        retailPrice: 120,
        wholesalePrice: 100,
        stockQuantity: 100,
        isFeatured: true,
        featured: true,
        isBestSeller: false,
        bestseller: false
      },
      {
        name: 'Cold Pressed Sunflower Oil',
        category: 'Cold Pressed Oil',
        shortDescription: 'Wood pressed high-oleic sunflower seed oil with light texture.',
        description: 'Produced from organic sunflower crop seeds. Wood-pressed under sterile conditions to keep all unsaturated fatty acids intact.',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
        price: 220,
        retailPrice: 220,
        wholesalePrice: 180,
        stockQuantity: 100,
        isFeatured: true,
        featured: true,
        isBestSeller: false,
        bestseller: false
      },
      {
        name: 'Fenugreek Leaf',
        category: 'Herbal Products',
        shortDescription: 'Aromatic, dried herb with bitter flavor.',
        description: 'Fenugreek leaves are aromatic, nutrient-rich greens used in culinary and medicinal applications, known for their slightly bitter taste and health benefits.',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
        price: 90,
        retailPrice: 90,
        wholesalePrice: 75,
        stockQuantity: 100,
        isFeatured: true,
        featured: true,
        isBestSeller: false,
        bestseller: false
      }
    ];

    for (const target of targetFeaturedProducts) {
      const regexName = new RegExp(`^${target.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
      let prod = await Product.findOne({ name: regexName });
      
      if (!prod) {
        // Fallback: search for a partial match (e.g. 'Chia Seeds')
        const regexPartial = new RegExp(target.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split(' ').pop(), 'i');
        prod = await Product.findOne({ name: regexPartial });
      }

      if (prod) {
        prod.name = target.name;
        prod.isFeatured = true;
        prod.featured = true;
        prod.isBestSeller = false;
        prod.bestseller = false;
        await prod.save();
        console.log(`Updated existing product "${prod.name}" to be Featured and NOT Bestseller.`);
      } else {
        const slug = target.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
        const newProd = new Product({
          ...target,
          slug
        });
        await newProd.save();
        console.log(`Created new Featured product "${target.name}".`);
      }
    }

    // Migration for broken image URLs
    const brokenImageUrl = 'photo-1589135306090-e1793731c941';
    const workingImageUrl = 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800';

    const categoriesToMigrate = await Category.find({ image: { $regex: brokenImageUrl } });
    for (const cat of categoriesToMigrate) {
      cat.image = workingImageUrl;
      await cat.save();
      console.log(`Migrated category "${cat.name}" image to working URL.`);
    }

    const productsToMigrate = await Product.find({ image: { $regex: brokenImageUrl } });
    for (const prod of productsToMigrate) {
      prod.image = workingImageUrl;
      await prod.save();
      console.log(`Migrated product "${prod.name}" image to working URL.`);
    }

  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  await seedDatabase();
});
