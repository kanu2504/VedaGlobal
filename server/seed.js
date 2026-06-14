import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Enquiry from './models/Enquiry.js';
import Order from './models/Order.js';
import CMS from './models/CMS.js';
import Setting from './models/Setting.js';
import Blog from './models/Blog.js';
import FAQ from './models/FAQ.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing database...');
    await Admin.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Enquiry.deleteMany({});
    await Order.deleteMany({});
    await CMS.deleteMany({});
    await Setting.deleteMany({});
    await Blog.deleteMany({});
    await FAQ.deleteMany({});

    console.log('Seeding admin...');
    const adminEmail = 'admin@vedaglobal.com';
    const adminPassword = 'Admin@1234';
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword
    });
    await admin.save();
    console.log(`Admin created: ${adminEmail}`);

    console.log('Seeding categories...');
    const categories = [
      { name: 'Basmati Rice', slug: 'basmati-rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800', status: 'Active', displayOrder: 1 },
      { name: 'Organic Seeds', slug: 'organic-seeds', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800', status: 'Active', displayOrder: 2 },
      { name: 'Indian Spices', slug: 'indian-spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800', status: 'Active', displayOrder: 3 },
      { name: 'Millets & Grains', slug: 'millets-grains', image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800', status: 'Active', displayOrder: 4 },
      { name: 'Cold Pressed Oils', slug: 'cold-pressed-oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800', status: 'Active', displayOrder: 5 },
      { name: 'Herbal Products', slug: 'herbal-products', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800', status: 'Active', displayOrder: 6 }
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories seeded.`);

    console.log('Seeding products...');
    const products = [
      // CATEGORY: Basmati Rice
      {
        name: 'Traditional Basmati Rice',
        slug: 'traditional-basmati-rice',
        category: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?q=80&w=800',
        price: 1100,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['UK', 'USA', 'UAE', 'Canada'],
        shortDescription: 'Fragrant and aged basmati rice grains with delicious traditional texture.',
        description: 'Our Traditional Basmati Rice is aged for 1-2 years to yield absolute peak flavor. It boasts long slender grains and a characteristic earthy aroma suitable for gourmet kitchens.',
        specifications: [
          { key: 'Grain Length', value: '7.45 mm' },
          { key: 'Moisture', value: '12% max' },
          { key: 'Broken Grains', value: '1% max' }
        ],
        benefits: ['Naturally gluten-free', 'Highly aromatic', 'Grown in organic Himalayan foothills'],
        packagingOptions: ['10kg BOPP Bag', '25kg PP Bag', '50kg Jute Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Premium 1121 Basmati Rice',
        slug: 'premium-1121-basmati-rice',
        category: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
        price: 1350,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Saudi Arabia', 'UAE', 'USA', 'UK', 'Australia'],
        shortDescription: 'Extra-long grain premium basmati rice with exquisite aroma and taste.',
        description: 'Highly acclaimed for its incredible grain length which doubles upon cooking. This aged 1121 Basmati variety is perfect for Biryanis and premium catering events.',
        specifications: [
          { key: 'Grain Length', value: '8.35 mm' },
          { key: 'Moisture', value: '12.5% max' },
          { key: 'Admixture', value: '1% max' }
        ],
        benefits: ['Extra fluffy and non-sticky', 'Premium long structure', 'Low Glycemic Index (GI)'],
        packagingOptions: ['25kg PP Bag', '50kg Jute Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Golden Sella Basmati Rice',
        slug: 'golden-sella-basmati-rice',
        category: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800',
        price: 980,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Iran', 'Iraq', 'Kuwait', 'Saudi Arabia'],
        shortDescription: 'Parboiled golden basmati rice grains with robust nutrients and texture.',
        description: 'Parboiled golden sella rice grains that remain firm and hold shape during prolonged cooking. Highly favored in Middle Eastern recipes and commercial culinary operations.',
        specifications: [
          { key: 'Grain Length', value: '8.30 mm' },
          { key: 'Color', value: 'Golden/Creamy' },
          { key: 'Moisture', value: '12% max' }
        ],
        benefits: ['Rich nutritional retention', 'Extremely low breakage rate', 'Excellent for bulk banquet cooking'],
        packagingOptions: ['25kg PP Bag', '50kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Brown Basmati Rice',
        slug: 'brown-basmati-rice',
        category: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800',
        price: 1250,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Germany', 'France', 'USA', 'Netherlands'],
        shortDescription: 'Nutrient-rich brown basmati rice preserving whole bran qualities.',
        description: 'Unpolished whole grain brown basmati rice keeping the nutrient-dense outer husk intact. Features a rich, nutty flavor profile and abundance of dietary fibers.',
        specifications: [
          { key: 'Purity', value: '98% min' },
          { key: 'Moisture', value: '12% max' },
          { key: 'Broken Grains', value: '2% max' }
        ],
        benefits: ['High in fiber and magnesium', 'Supports metabolic digestion', 'Perfect for health-focused diets'],
        packagingOptions: ['5kg Retail Bag', '25kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Organic Basmati Rice',
        slug: 'organic-basmati-rice',
        category: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
        price: 1500,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Switzerland', 'Denmark', 'Japan'],
        shortDescription: 'Certified pesticide-free basmati rice harvested from cooperative farms.',
        description: 'Grown on certified organic cooperative farms without any chemical pesticides, herbicides, or synthetic fertilizers. Offers pure traditional fragrance and high culinary purity.',
        specifications: [
          { key: 'Organic Certification', value: 'USDA Organic / NPOP' },
          { key: 'Grain Length', value: '7.40 mm' },
          { key: 'Moisture', value: '12% max' }
        ],
        benefits: ['Zero chemical pesticide residue', 'Environmentally sustainable crop', 'Pristine traditional taste'],
        packagingOptions: ['10kg Eco Bag', '25kg Paper Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },

      // CATEGORY: Organic Seeds
      {
        name: 'Chia Seeds',
        slug: 'chia-seeds',
        category: 'Organic Seeds',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800',
        price: 1600,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Australia', 'Japan', 'Germany'],
        shortDescription: 'Premium organic chia seeds rich in Omega-3 fibers and plant protein.',
        description: 'Sourced from organic farming tracts. Handled under stringent hygienic conditions to deliver clean, dark chia seeds with outstanding water absorption capacity.',
        specifications: [
          { key: 'Purity', value: '99.9% min' },
          { key: 'Moisture', value: '8% max' },
          { key: 'Foreign Seeds', value: '0.1% max' }
        ],
        benefits: ['Outstanding source of Omega-3', 'High in dietary soluble fiber', 'Boosts natural energy levels'],
        packagingOptions: ['25kg Multi-wall Paper Bag', '500g Stand-up Pouch'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Flax Seeds',
        slug: 'flax-seeds',
        category: 'Organic Seeds',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800',
        price: 850,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Canada', 'Belgium', 'UK', 'USA'],
        shortDescription: 'Golden brown flax seeds loaded with dietary lignans and healthy fats.',
        description: 'High-quality golden brown seeds cleaned with specialized mechanical gravity separators. Yields abundant alpha-linolenic acid (ALA) for cardiovascular support.',
        specifications: [
          { key: 'Purity', value: '99% min' },
          { key: 'Moisture', value: '9% max' },
          { key: 'Oil Content', value: '38% min' }
        ],
        benefits: ['Abundant in lignans', 'Rich in dietary plant fiber', 'Improves heart and gut health'],
        packagingOptions: ['25kg PP Bag', '50kg Jute Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Pumpkin Seeds',
        slug: 'pumpkin-seeds',
        category: 'Organic Seeds',
        image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800',
        price: 2400,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Spain', 'France', 'USA', 'Italy'],
        shortDescription: 'Raw, unsalted green pumpkin kernels full of zinc and iron.',
        description: 'Peeled green pumpkin seed kernels (pepitas) featuring a mild nutty flavor. Perfect for healthy snacks, bread toppings, and energy bars.',
        specifications: [
          { key: 'Purity', value: '99.5% min' },
          { key: 'Moisture', value: '7.5% max' },
          { key: 'Broken Kernels', value: '3% max' }
        ],
        benefits: ['Rich source of magnesium and zinc', 'Supports prostate and heart health', 'Packed with plant-based protein'],
        packagingOptions: ['20kg Vacuum Bag in Carton', '25kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Sunflower Seeds',
        slug: 'sunflower-seeds',
        category: 'Organic Seeds',
        image: 'https://images.unsplash.com/photo-1599307767316-776533ab941c?q=80&w=800',
        price: 950,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Netherlands', 'Germany', 'USA', 'Poland'],
        shortDescription: 'Clean hulled sunflower seed kernels containing high Vitamin E levels.',
        description: 'Clean sunflower seed kernels obtained from robust crops. Sifted and graded under certified procedures to ensure zero shell fragments.',
        specifications: [
          { key: 'Purity', value: '99% min' },
          { key: 'Moisture', value: '8% max' },
          { key: 'Shell Residue', value: '0.05% max' }
        ],
        benefits: ['Rich in natural Vitamin E', 'Supports immune system', 'Very high in dietary minerals'],
        packagingOptions: ['25kg Paper Bag', '50kg Bulk sacks'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Sesame Seeds',
        slug: 'sesame-seeds',
        category: 'Organic Seeds',
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800',
        price: 1400,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Japan', 'China', 'Singapore', 'USA', 'Korea'],
        shortDescription: 'Sortex-cleaned natural white hulled sesame seeds with high oil content.',
        description: 'Top-tier hulled white sesame seeds with distinct nutty taste. Extensively processed using Sortex optical sorting systems to ensure maximum purity.',
        specifications: [
          { key: 'Purity', value: '99.95% min' },
          { key: 'Moisture', value: '6% max' },
          { key: 'Oil Content', value: '48% min' }
        ],
        benefits: ['Supports healthy bone structures', 'Abundant in phytosterols', 'High protein concentration'],
        packagingOptions: ['25kg PP Bag with inner liner', '25kg BOPP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },

      // CATEGORY: Indian Spices
      {
        name: 'Turmeric Powder',
        slug: 'turmeric-powder',
        category: 'Indian Spices',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800',
        price: 1850,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Germany', 'Japan', 'UK', 'Australia'],
        shortDescription: 'Pure turmeric powder with high curcumin content (5%+) for natural healing.',
        description: 'Sourced from selected Alleppey turmeric fingers. Graded, pulverized, and packed under certified hygienic parameters to ensure maximum curcumol retention.',
        specifications: [
          { key: 'Curcumin Content', value: '5.0% min' },
          { key: 'Moisture', value: '9% max' },
          { key: 'Lead (Pb)', value: 'Negative / Free' }
        ],
        benefits: ['Highly potent anti-inflammatory', 'Deep, natural golden color', 'Fights oxidative stress'],
        packagingOptions: ['25kg Kraft Paper Bag', '50kg HDPE Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Red Chilli Powder',
        slug: 'red-chilli-powder',
        category: 'Indian Spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
        price: 2600,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Mexico', 'Spain', 'USA', 'Malaysia'],
        shortDescription: 'Sun-dried red chilli powder providing rich ASTA color and mild pungency.',
        description: 'Grown in high-grade Guntur and Kashmiri farming hubs. Features excellent natural capsaicin oil retention for rich color and balanced heat levels.',
        specifications: [
          { key: 'Color ASTA', value: '110-130' },
          { key: 'Pungency', value: '15000-25000 SHU' },
          { key: 'Moisture', value: '10% max' }
        ],
        benefits: ['Vibrant natural red coloring', 'Boosts metabolism', 'Rich source of Vitamin C'],
        packagingOptions: ['20kg Paper Bag', '25kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Coriander Powder',
        slug: 'coriander-powder',
        category: 'Indian Spices',
        image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?q=80&w=800',
        price: 1150,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['South Africa', 'UAE', 'Morocco', 'Sri Lanka'],
        shortDescription: 'Freshly ground coriander seeds yielding citrusy and warm herbal flavors.',
        description: 'Made from premium sun-dried coriander seeds harvested in Rajasthan. Ground at low temperatures to conserve natural volatile oils and refreshing aroma.',
        specifications: [
          { key: 'Moisture', value: '9% max' },
          { key: 'Total Ash', value: '7% max' },
          { key: 'Volatile Oil', value: '0.25% min' }
        ],
        benefits: ['Assists gut digestion', 'Rich warm citrus flavor', 'Aromatic culinary enhancer'],
        packagingOptions: ['25kg Jute Bag', '25kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Cumin Seeds',
        slug: 'cumin-seeds',
        category: 'Indian Spices',
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800',
        price: 3300,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Turkey', 'USA', 'Singapore', 'UAE', 'Egypt'],
        shortDescription: 'High-oil Indian Jeera seeds machine-cleaned to 99.5% purity.',
        description: 'Premium Indian cumin seeds (Jeera) harvested in arid regions of Gujarat. Known for bold grain size, high thymol content, and intense herbal fragrance.',
        specifications: [
          { key: 'Purity', value: '99.5% min' },
          { key: 'Moisture', value: '8.5% max' },
          { key: 'Foreign Matter', value: '0.5% max' }
        ],
        benefits: ['Promotes enzymatic digestion', 'Intense aromatic spice base', 'High concentrations of iron'],
        packagingOptions: ['25kg Jute Bag', '50kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Garam Masala',
        slug: 'garam-masala',
        category: 'Indian Spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
        price: 2800,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'UK', 'Australia', 'Canada'],
        shortDescription: 'Premium spice blend combining cardamom, cinnamon, cloves, and mace.',
        description: 'A traditional royal spice blend formulated by expert spice blenders. Combines cardamoms, cinnamons, cloves, and mace in precise ratios to maximize culinary depth.',
        specifications: [
          { key: 'Blend Type', value: 'Whole Roasted & Ground' },
          { key: 'Moisture', value: '8% max' },
          { key: 'Color', value: 'Dark Brown' }
        ],
        benefits: ['Perfect warmth profile', 'Authentic Indian spice blend', 'Completely free of artificial preservatives'],
        packagingOptions: ['500g Retail Box', '20kg Kraft Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },

      // CATEGORY: Millets & Grains
      {
        name: 'Pearl Millet Bajra',
        slug: 'pearl-millet-bajra',
        category: 'Millets & Grains',
        image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=800',
        price: 450,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Nigeria', 'Kenya', 'Belgium', 'UAE'],
        shortDescription: 'Nutrient-rich whole grain Bajra containing abundant iron and proteins.',
        description: 'Sourced from climate-resilient farms in Rajasthan. Cleansed using advanced dehulling and sorting methods to deliver high-quality, pesticide-free grains.',
        specifications: [
          { key: 'Purity', value: '99% min' },
          { key: 'Moisture', value: '12% max' },
          { key: 'Foreign Matter', value: '1% max' }
        ],
        benefits: ['Extremely high in dietary iron', 'Gluten-free energy source', 'Improves digestive health'],
        packagingOptions: ['25kg PP Bag', '50kg Jute Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Finger Millet Ragi',
        slug: 'finger-millet-ragi',
        category: 'Millets & Grains',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800',
        price: 480,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'UK', 'Singapore', 'Uganda'],
        shortDescription: 'Gluten-free ancient crop containing exceptional calcium profiles.',
        description: 'Ragi is loaded with natural calcium, fibers, and iron. Meticulously sortex-cleaned to remove dirt and weed seeds, ensuring ideal grade for health foods.',
        specifications: [
          { key: 'Calcium Content', value: '344 mg / 100g' },
          { key: 'Moisture', value: '11% max' },
          { key: 'Purity', value: '99% min' }
        ],
        benefits: ['Unmatched calcium concentration', 'Supports baby nutrition', 'Highly stable shelf life'],
        packagingOptions: ['25kg BOPP Bag', '50kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Foxtail Millet',
        slug: 'foxtail-millet-grain',
        category: 'Millets & Grains',
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=800',
        price: 520,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Japan', 'Germany', 'USA', 'Malaysia'],
        shortDescription: 'High-protein grain (Kangni) helping regulate blood sugar levels.',
        description: 'Sourced from organic farming groups. Foxtail millet (Kangni) is rich in dietary fibers, essential minerals, and has low Glycemic Index (GI).',
        specifications: [
          { key: 'Protein', value: '12.2% min' },
          { key: 'Dietary Fiber', value: '8.0% min' },
          { key: 'Moisture', value: '12% max' }
        ],
        benefits: ['Assists in glucose management', 'Highly stable amino acid profile', 'Rich in B vitamins'],
        packagingOptions: ['25kg PP Bag', '50kg Jute Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Little Millet',
        slug: 'little-millet',
        category: 'Millets & Grains',
        image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800',
        price: 540,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Italy', 'Spain', 'Switzerland', 'Canada'],
        shortDescription: 'Tiny nutritious grains (Kutki) high in antioxidants and dietary fibers.',
        description: 'A traditional small grain crop (Kutki) harvested in tribal agricultural clusters of central India. Completely organic and unpolished to retain minerals.',
        specifications: [
          { key: 'Purity', value: '98.5% min' },
          { key: 'Dietary Fiber', value: '7.8% min' },
          { key: 'Moisture', value: '11% max' }
        ],
        benefits: ['Rich source of natural antioxidants', 'Highly digestible protein', 'Low carbohydrate index'],
        packagingOptions: ['25kg Kraft Paper Bag', '50kg PP Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Whole Wheat Grains',
        slug: 'whole-wheat-grains',
        category: 'Millets & Grains',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
        price: 490,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Oman', 'Saudi Arabia', 'Egypt', 'Yemen'],
        shortDescription: 'Golden bold Lokwan whole wheat grains processed for global baking.',
        description: 'Lokwan whole wheat grains grown under direct sunlight in central India. Selected for bold kernel size and excellent gluten-starch ratio perfect for bakeries.',
        specifications: [
          { key: 'Gluten Content', value: '9% min' },
          { key: 'Protein', value: '11.5% min' },
          { key: 'Moisture', value: '12% max' }
        ],
        benefits: ['Ideal for premium baking flours', 'Provides abundant energy', 'Excellent grain thickness'],
        packagingOptions: ['50kg PP Bag', 'Bulk Vessel Load'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },

      // CATEGORY: Cold Pressed Oils
      {
        name: 'Cold Pressed Mustard Oil',
        slug: 'cold-pressed-mustard-oil',
        category: 'Cold Pressed Oils',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800',
        price: 1800,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Bangladesh', 'Nepal', 'Mauritius'],
        shortDescription: 'Kachi Ghani cold pressed mustard oil preserving essential compounds.',
        description: 'Traditional wood-pressed (Kachi Ghani) yellow mustard oil extracted under 45°C. Free from mineral oils, bleaching agents, or chemical preservatives.',
        specifications: [
          { key: 'Extraction', value: 'Cold Pressed / Wood Pressed' },
          { key: 'FFA', value: '0.75% max' },
          { key: 'Allyl Isothiocyanate', value: '0.20% min' }
        ],
        benefits: ['Aids blood circulation', 'Rich in monounsaturated fats', 'Protects against bacteria'],
        packagingOptions: ['1L Glass Bottle', '5L Tin Container', '200L Metal Drum'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Cold Pressed Coconut Oil',
        slug: 'cold-pressed-coconut-oil',
        category: 'Cold Pressed Oils',
        image: 'https://images.unsplash.com/photo-1611070973770-b1a672610041?q=80&w=800',
        price: 2900,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'UK', 'Australia', 'Canada'],
        shortDescription: 'Virgin cold pressed coconut oil extracted from fresh coastal coconuts.',
        description: 'Pure white coconut oil extracted from coastal sun-dried copra. Unrefined, unbleached, and undeodorized to conserve original lauric acid vitamins.',
        specifications: [
          { key: 'Lauric Acid', value: '49% min' },
          { key: 'Moisture', value: '0.1% max' },
          { key: 'Color', value: 'Water Clear (Above 25°C)' }
        ],
        benefits: ['High in Medium Chain Triglycerides (MCTs)', 'Delightful tropical fragrance', 'Moisturizes skin and hair'],
        packagingOptions: ['500ml Jar', '1L Bottle', '200L FlexiTank'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Cold Pressed Groundnut Oil',
        slug: 'cold-pressed-groundnut-oil',
        category: 'Cold Pressed Oils',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=800',
        price: 2300,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['China', 'Singapore', 'Indonesia', 'USA'],
        shortDescription: 'Nutrient-rich wood pressed peanut oil with high smoke points.',
        description: 'Extracted slowly from sun-dried peanuts. Naturally filtered using cotton cloth sheets to maintain healthy unsaturated fats and original nutty flavors.',
        specifications: [
          { key: 'Free Fatty Acids (FFA)', value: '0.9% max' },
          { key: 'Smoke Point', value: '228°C' },
          { key: 'Acid Value', value: '1.8 max' }
        ],
        benefits: ['Zero trans fats', 'Abundant in Vitamin E', 'Perfect deep-frying stability'],
        packagingOptions: ['15L Tin Box', '200L Drum', 'FlexiTank'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Cold Pressed Sesame Oil',
        slug: 'cold-pressed-sesame-oil',
        category: 'Cold Pressed Oils',
        image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800',
        price: 3600,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['Japan', 'China', 'Germany', 'USA'],
        shortDescription: 'Aromatic golden wood pressed sesame oil loaded with natural antioxidants.',
        description: 'Cold pressed sesame oil extracted from black and white sesame seeds. Yields robust concentrations of sesamol and sesamolin antioxidants.',
        specifications: [
          { key: 'Color Index', value: 'Light Amber' },
          { key: 'Refractive Index', value: '1.465 - 1.469' },
          { key: 'Iodine Value', value: '103-117' }
        ],
        benefits: ['Rich source of sesamol', 'Supports heart functions', 'Provides deep savory flavor'],
        packagingOptions: ['1L Bottle', '5L Tin Container', '200L Drum'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Cold Pressed Sunflower Oil',
        slug: 'cold-pressed-sunflower-oil',
        category: 'Cold Pressed Oils',
        image: 'https://images.unsplash.com/photo-1599307767316-776533ab941c?q=80&w=800',
        price: 1750,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['UAE', 'Oman', 'Bahrain', 'Malaysia'],
        shortDescription: 'Wood pressed high-oleic sunflower seed oil with light texture.',
        description: 'Produced from organic sunflower crop seeds. Wood-pressed under sterile conditions to keep all unsaturated fatty acids intact. Highly stable shelf life.',
        specifications: [
          { key: 'Oleic Acid Content', value: '78% min' },
          { key: 'Peroxide Value', value: '2.5 max' },
          { key: 'Moisture', value: '0.05% max' }
        ],
        benefits: ['Extremely light digestive profile', 'Supports cholesterol balance', 'Packed with Vitamin E'],
        packagingOptions: ['1L PET Bottle', '5L Bottle', 'FlexiTank'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },

      // CATEGORY: Herbal Products
      {
        name: 'Ashwagandha Powder',
        slug: 'ashwagandha-powder',
        category: 'Herbal Products',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800',
        price: 3800,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'UK', 'Germany', 'Japan', 'Canada'],
        shortDescription: 'Organic adaptogenic Ashwagandha root powder containing high withanolides.',
        description: 'Sourced from sun-dried Withania somnifera (Ashwagandha) roots. Ground into a fine powder without any heat or chemicals to protect natural adaptogenic properties.',
        specifications: [
          { key: 'Withanolides', value: '2.5% min (HPLC)' },
          { key: 'Mesh Size', value: '80-100 mesh' },
          { key: 'Heavy Metals', value: 'Negative / Safe limits' }
        ],
        benefits: ['Helps reduce stress and anxiety', 'Supports immune health', 'Boosts energy levels naturally'],
        packagingOptions: ['25kg Fiber Drum', '1kg Foil pouch'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: true,
        isFeatured: true,
        bestseller: true,
        isBestSeller: true,
        status: 'Active'
      },
      {
        name: 'Amla Powder',
        slug: 'amla-powder',
        category: 'Herbal Products',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800',
        price: 1200,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Germany', 'France', 'Australia'],
        shortDescription: 'Dried organic gooseberry powder containing highly concentrated Vitamin C.',
        description: 'Pure Amla (Emblica officinalis) fruit powder made from deseeded, sun-dried amla berries. Known as one of the richest natural sources of Vitamin C and bioflavonoids.',
        specifications: [
          { key: 'Vitamin C Content', value: '1.2% min' },
          { key: 'Purity', value: '99% min' },
          { key: 'Moisture', value: '8% max' }
        ],
        benefits: ['Rich in natural Vitamin C', 'Supports healthy hair growth', 'Enhances skin radiance'],
        packagingOptions: ['20kg Paper Bag', '1kg Zip Pouch'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Tulsi Herbal Tea',
        slug: 'tulsi-herbal-tea',
        category: 'Herbal Products',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800',
        price: 1900,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['UK', 'USA', 'Germany', 'Sweden'],
        shortDescription: 'Organic Rama and Krishna Tulsi leaf blend for soothing herbal tea infusions.',
        description: 'A premium blend of dried Rama and Krishna Tulsi leaves (Holy Basil) harvested under organic conditions. Produces a refreshing, caffeine-free herbal tea infusion.',
        specifications: [
          { key: 'Ingredients', value: '100% Tulsi Leaves' },
          { key: 'Format', value: 'Cut Leaves / TBC' },
          { key: 'Moisture', value: '10% max' }
        ],
        benefits: ['Reduces stress levels', 'Rich in antioxidants', 'Supports respiratory health'],
        packagingOptions: ['10kg Carton Box', '100g Retail Canister'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Neem Powder',
        slug: 'neem-powder',
        category: 'Herbal Products',
        image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800',
        price: 1050,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'Japan', 'South Africa', 'Germany'],
        shortDescription: 'Pure sun-dried neem leaf powder for cosmetic and agriculture blends.',
        description: 'Made from premium leaves of Azadirachta indica (Neem). Fine-ground and sifted, keeping all natural azadirachtin properties active. Highly valued in cosmetic and natural pest controls.',
        specifications: [
          { key: 'Azadirachtin', value: '0.15% min' },
          { key: 'Mesh Size', value: '100 mesh' },
          { key: 'Moisture', value: '8.5% max' }
        ],
        benefits: ['Powerful natural purifier', 'Excellent anti-acne skincare agent', 'Safe organic pesticide base'],
        packagingOptions: ['25kg PP Bag', '1kg Kraft pouch'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      },
      {
        name: 'Moringa Powder',
        slug: 'moringa-powder',
        category: 'Herbal Products',
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=800',
        price: 1550,
        priceRange: 'Export Quote Based',
        origin: 'India',
        moq: '25kg+',
        packaging: 'Custom Available',
        exportMarkets: ['USA', 'UK', 'France', 'South Korea'],
        shortDescription: 'Organic moringa leaf powder packed with vital amino acids and iron.',
        description: 'Sun-dried moringa (Moringa oleifera) leaf powder processed at low temperatures. A premium superfood containing comprehensive amino acids, vitamins, and minerals.',
        specifications: [
          { key: 'Chlorophyll', value: 'Rich green color' },
          { key: 'Mesh Size', value: '80 mesh' },
          { key: 'Moisture', value: '7% max' }
        ],
        benefits: ['Boosts energy and immunity', 'High concentration of plant-protein', 'Improves body detox pathways'],
        packagingOptions: ['25kg Fiber Drum', '500g Stand-up Bag'],
        stockStatus: 'In Stock',
        b2bVisible: true,
        b2cVisible: true,
        featured: false,
        isFeatured: false,
        bestseller: false,
        isBestSeller: false,
        status: 'Active'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded.`);

    console.log('Seeding CMS pages...');
    const cmsPages = [
      {
        key: 'homepage',
        value: {
          welcomeTitle: 'Premium Agricultural Exports',
          welcomeSub: 'Connecting Global Markets with Quality Indian Harvests',
          aboutSection: {
            title: 'About Veda Global',
            content: 'Veda Global is a leading exporter of agricultural products from India. We specialize in Basmati Rice, Grains, Pulses, Seeds, Spices, and Wood-Pressed Oils, ensuring premium quality through meticulous quality assurance and direct farm sourcing.'
          },
          whyChooseUs: [
            { title: 'Direct Farm Sourcing', description: 'We source directly from local farming cooperatives to ensure absolute peak freshness.' },
            { title: 'Global Standards', description: 'Our facilities meet USDA Organic, ISO, and SGS food quality audit certifications.' },
            { title: 'Export Grade Packaging', description: 'Multi-layer preservation controls protect crop integrity during sea freight.' }
          ]
        }
      },
      {
        key: 'about',
        value: {
          title: 'Cultivating Trust Globally',
          content: 'Since our inception, Veda Global has worked to bridge the gap between hard-working Indian farmers and international markets. We build long-term relationships through absolute supply-chain transparency, fair trade practices, and strict quality control loops.',
          milestones: [
            { year: '2021', title: 'Company Founded', description: 'Started local grain and spice exports.' },
            { year: '2023', title: 'Global Expansion', description: 'Partnered with EU and US food networks.' },
            { year: '2025', title: 'Sustainability Loop', description: 'Transitioned to 100% solar powered grading facilities.' }
          ]
        }
      },
      {
        key: 'faq',
        value: [
          { question: 'What is your minimum order quantity (MOQ)?', answer: 'For B2B wholesale freight consignments, our standard MOQ is 1 FCL (Full Container Load). Retail buyers in B2C mode can place orders of any quantity.' },
          { question: 'Are Veda Global products certified organic?', answer: 'Yes. Our dedicated organic catalogs are certified under USDA Organic, India Organic (NPOP), and EU organic certifications, audited regularly by SGS.' },
          { question: 'What payment methods and terms do you accept?', answer: 'We accept Letter of Credit (L/C) at sight, D/P, or Telegraphic Transfer (T/T) with 30% advance deposit. B2C retail orders support Cash on Delivery and Bank Transfer.' }
        ]
      },
      {
        key: 'privacy_policy',
        value: {
          title: 'Privacy Policy',
          content: 'At Veda Global, we value your privacy. We collect only necessary user details (name, email, phone, shipping address) to process orders, handle enquiries, and optimize our browser testing and user experiences. We do not sell or lease your personal information to third-party advertisers.'
        }
      },
      {
        key: 'terms_conditions',
        value: {
          title: 'Terms & Conditions',
          content: 'All wholesale orders placed in B2B mode are governed by formal Proforma Invoices and Bilateral Agreements. Prices listed are subject to market agricultural updates.'
        }
      },
      {
        key: 'shipping_policy',
        value: {
          title: 'Shipping Policy',
          content: 'For B2B orders, shipping is handled via FOB, CFR, or CIF terms from major Indian ports.'
        }
      },
      {
        key: 'refund_policy',
        value: {
          title: 'Return & Refund Policy',
          content: 'We take pride in our harvests. If you receive damaged packaging or products not matching physical specifications, report within 7 days with photos/lab certificates for replacement or full refunds.'
        }
      },
      {
        key: 'testimonials',
        value: [
          { name: 'John Doe', company: 'Global Foods LLC', message: 'Veda Global Basmati Rice quality is unparalleled. Prompt shipping and immaculate packaging!' },
          { name: 'Sarah Connor', company: 'Organic Life Ltd', message: 'The organic flax seeds arrived in pristine shape. curcumin levels of turmeric exceeded specifications!' }
        ]
      }
    ];

    for (const page of cmsPages) {
      await CMS.create(page);
    }
    console.log('CMS pages seeded successfully.');

    console.log('Seeding settings...');
    const settings = [
      { key: 'website_name', value: 'Veda Global Exports' },
      { key: 'logo_placeholder', value: 'Veda Global' },
      { key: 'default_mode', value: 'B2C' },
      { key: 'contact_info', value: { email: 'info@vedaglobal.com', phone: '+91 98765 43210', address: '123 Agri Chambers, Mumbai, India' } },
      { key: 'social_links', value: { facebook: 'https://facebook.com/vedaglobal', linkedin: 'https://linkedin.com/company/vedaglobal', twitter: 'https://twitter.com/vedaglobal' } },
      { key: 'business_details', value: { gst: '27AAAAA0000A1Z', IEC: '0123456789' } }
    ];

    for (const setting of settings) {
      await Setting.create(setting);
    }
    console.log('Settings seeded successfully.');

    console.log('Seeding enquiries...');
    const sampleProduct = createdProducts[1]; // Premium 1121 Basmati Rice
    const enquiries = [
      {
        productId: sampleProduct._id,
        productName: sampleProduct.name,
        companyName: 'EuroFoods Importers',
        contactPerson: 'Dieter Meier',
        email: 'dieter@eurofoods.de',
        phone: '+49 176 1234567',
        country: 'Germany',
        quantity: 25,
        message: 'Looking to purchase bulk export orders of Premium Basmati Rice. Please provide quotes FOB Nhava Sheva.',
        enquiryType: 'Bulk Order',
        status: 'Pending',
        mode: 'Wholesale'
      },
      {
        productId: createdProducts[5]._id, // Chia Seeds
        productName: createdProducts[5].name,
        companyName: 'Healthy Living Stores',
        contactPerson: 'Sarah Connor',
        email: 'sarah@organiclife.com',
        phone: '+1 555 9876',
        country: 'USA',
        quantity: 50,
        message: 'Requesting wholesale quote for 50 boxes of Chia seeds.',
        enquiryType: 'Bulk Order',
        status: 'Pending',
        mode: 'Wholesale'
      },
      {
        productId: createdProducts[10]._id, // Turmeric Powder
        productName: createdProducts[10].name,
        companyName: '',
        contactPerson: 'Amit Sharma',
        email: 'amit@example.com',
        phone: '+91 99999 88888',
        country: 'India',
        quantity: 2,
        message: 'Is this turmeric powder purely organic? Do you sell smaller packets for trial?',
        enquiryType: 'Product Enquiry',
        status: 'Pending',
        mode: 'Retail'
      }
    ];
    await Enquiry.insertMany(enquiries);
    console.log('Enquiries seeded successfully.');

    console.log('Seeding orders...');
    const orders = [
      {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        address: '123 Sage Street, Delhi',
        pincode: '110001',
        items: [
          {
            productId: sampleProduct._id,
            productName: sampleProduct.name,
            quantity: 3,
            price: sampleProduct.price
          }
        ],
        totalAmount: sampleProduct.price * 3,
        paymentMode: 'Cash on Delivery (COD)',
        orderStatus: 'Pending',
        mode: 'Retail'
      },
      {
        customerName: 'Robert Johnson',
        email: 'robert@wholesalebuyers.com',
        phone: '+1 303 555 0192',
        address: '789 Bulk Cargo Blvd, Houston',
        pincode: '77001',
        items: [
          {
            productId: createdProducts[12]._id, // Coriander Powder
            productName: createdProducts[12].name,
            quantity: 500,
            price: createdProducts[12].price
          }
        ],
        totalAmount: createdProducts[12].price * 500,
        paymentMode: 'Direct Bank Transfer',
        orderStatus: 'Processing',
        mode: 'Wholesale'
      }
    ];
    await Order.insertMany(orders);
    console.log('Orders seeded successfully.');

    console.log('Database Seeding Completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
