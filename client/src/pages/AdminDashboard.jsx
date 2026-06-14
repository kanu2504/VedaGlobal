import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import '../styles/admin.css';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/admin/StatCard';
import ProductFormModal from '../components/admin/ProductFormModal';
import { getImageUrl } from '../utils/imageHelper';

// --- CUSTOM ANIMATED SVG CHARTS ---

const BarChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No category data available</div>;
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', padding: '10px 0' }}>
      {data.map((item, idx) => {
        const percentage = (item.count / maxCount) * 100;
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '120px', fontSize: '0.8rem', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{item._id || 'Uncategorized'}</span>
            <div style={{ flex: 1, height: '14px', backgroundColor: 'var(--admin-bg)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--admin-emerald), var(--admin-gold))', borderRadius: '6px' }}
              />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', width: '30px', textAlign: 'right' }}>{item.count}</span>
          </div>
        );
      })}
    </div>
  );
};

const PieChart = ({ data, colors = ['var(--admin-emerald)', 'var(--admin-gold)', '#809671', '#4B5563', '#2E7D32'] }) => {
  if (!data || data.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>No status data available</div>;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  let accumulatedAngle = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
      <svg width="120" height="120" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
        {total === 0 ? (
          <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="var(--admin-border)" strokeWidth="6" />
        ) : (
          data.map((item, idx) => {
            const percentage = (item.count / total) * 100;
            const strokeDash = `${percentage} ${100 - percentage}`;
            const strokeOffset = 100 - accumulatedAngle;
            accumulatedAngle += percentage;
            return (
              <circle
                key={idx}
                cx="20"
                cy="20"
                r="15.915"
                fill="transparent"
                stroke={colors[idx % colors.length]}
                strokeWidth="6.5"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            );
          })
        )}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '120px', flex: 1 }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colors[idx % colors.length], display: 'inline-block' }}></span>
            <span style={{ color: 'var(--admin-text-muted)', textTransform: 'capitalize' }}>{item._id || 'New'}:</span>
            <strong style={{ marginLeft: 'auto' }}>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ ordersData = [], enquiriesData = [] }) => {
  const months = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`
    });
  }

  const dataPoints = months.map(m => {
    const orderMatch = ordersData.find(o => o._id.month === m.month && o._id.year === m.year);
    const enquiryMatch = enquiriesData.find(e => e._id.month === m.month && e._id.year === m.year);
    return {
      label: m.label,
      orders: orderMatch ? orderMatch.count : 0,
      enquiries: enquiryMatch ? enquiryMatch.count : 0
    };
  });

  const maxVal = Math.max(...dataPoints.map(d => Math.max(d.orders, d.enquiries)), 1);

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index) => paddingLeft + (index * (chartWidth / (dataPoints.length - 1)));
  const getY = (value) => paddingTop + chartHeight - (value / maxVal) * chartHeight;

  let orderPath = '';
  let enquiryPath = '';
  dataPoints.forEach((pt, idx) => {
    const x = getX(idx);
    const yOrders = getY(pt.orders);
    const yEnquiries = getY(pt.enquiries);

    if (idx === 0) {
      orderPath = `M ${x} ${yOrders}`;
      enquiryPath = `M ${x} ${yEnquiries}`;
    } else {
      orderPath += ` L ${x} ${yOrders}`;
      enquiryPath += ` L ${x} ${yEnquiries}`;
    }
  });

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ minWidth: '400px', overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = paddingTop + chartHeight - ratio * chartHeight;
          const labelVal = Math.round(ratio * maxVal);
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="var(--admin-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fill="var(--admin-text-muted)" style={{ fontSize: '9px', fontWeight: '500' }}>{labelVal}</text>
            </g>
          );
        })}

        {dataPoints.map((pt, idx) => {
          const x = getX(idx);
          return (
            <text key={idx} x={x} y={height - 8} textAnchor="middle" fill="var(--admin-text-muted)" style={{ fontSize: '9px', fontWeight: '500' }}>{pt.label}</text>
          );
        })}

        <motion.path
          d={enquiryPath}
          fill="none"
          stroke="var(--admin-emerald)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        <motion.path
          d={orderPath}
          fill="none"
          stroke="var(--admin-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {dataPoints.map((pt, idx) => {
          const x = getX(idx);
          return (
            <g key={idx}>
              <circle cx={x} cy={getY(pt.orders)} r="3.5" fill="var(--admin-gold)" stroke="var(--admin-card-bg)" strokeWidth="1" />
              <circle cx={x} cy={getY(pt.enquiries)} r="3.5" fill="var(--admin-emerald)" stroke="var(--admin-card-bg)" strokeWidth="1" />
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px', fontSize: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '20px', height: '3px', background: 'var(--admin-emerald)', display: 'inline-block', borderRadius: '2px' }}></span>
          <span style={{ color: 'var(--admin-text-muted)' }}>Enquiries</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '20px', height: '3px', background: 'var(--admin-gold)', display: 'inline-block', borderRadius: '2px' }}></span>
          <span style={{ color: 'var(--admin-text-muted)' }}>Orders</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [banners, setBanners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // CMS/Settings state
  const [homepageCMS, setHomepageCMS] = useState({
    welcomeTitle: '',
    welcomeSub: '',
    aboutSection: { title: '', content: '' },
    whyChooseUs: []
  });
  const [aboutCMS, setAboutCMS] = useState({
    title: '',
    content: '',
    milestones: []
  });
  const [policies, setPolicies] = useState({
    privacy_policy: { title: '', content: '' },
    terms_conditions: { title: '', content: '' },
    shipping_policy: { title: '', content: '' },
    refund_policy: { title: '', content: '' }
  });
  const [webSettings, setWebSettings] = useState({
    website_name: '',
    logo_placeholder: '',
    contact_info: { email: '', phone: '', address: '' },
    social_links: { facebook: '', linkedin: '', twitter: '' }
  });
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [bestsellerFilter, setBestsellerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Tab-specific filters
  const [enquiryModeFilter, setEnquiryModeFilter] = useState('All');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [orderModeFilter, setOrderModeFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    image: '',
    price: 0,
    shortDescription: '',
    description: '',
    specifications: '',
    benefits: '',
    packagingOptions: '',
    stockStatus: 'In Stock',
    b2bVisible: true,
    b2cVisible: true,
    units: 'Kg',
    packSizes: '1kg',
    minOrderQuantity: 1,
    retailPrice: 0,
    wholesalePrice: 0,
    stockQuantity: 0,
    visibility: 'Both',
    featured: false,
    bestseller: false,
    status: 'Active'
  });

  // Modal handlers for Category, FAQ, Banner, Testimonial, and Admin
  const [categoryModal, setCategoryModal] = useState({ open: false, editing: null, name: '', image: '', displayOrder: 0 });
  const [faqModal, setFaqModal] = useState({ open: false, editing: null, question: '', answer: '' });
  const [bannerModal, setBannerModal] = useState({ open: false, editing: null, desktopImage: '', mobileImage: '', title: '', subtitle: '', linkButton: '', active: true });
  const [testimonialModal, setTestimonialModal] = useState({ open: false, editing: null, customerName: '', countryCity: '', rating: 5, reviewText: '', productName: '', showOnHomepage: true });
  const [adminModal, setAdminModal] = useState({ open: false, email: '', password: '', name: '', phone: '', role: 'Admin' });
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Blogs modal state
  const [blogModal, setBlogModal] = useState({
    open: false,
    editing: null,
    title: '',
    image: '',
    shortDescription: '',
    content: '',
    author: '',
    category: '',
    publishedDate: '',
    status: 'Published',
    isVisible: true,
    isFeatured: false
  });
  const [blogErrors, setBlogErrors] = useState({});
  const [isBlogSubmitted, setIsBlogSubmitted] = useState(false);

  // New Customer states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', address: '', pincode: '' });

  // New Admin states
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminEditForm, setAdminEditForm] = useState({ name: '', email: '', phone: '', avatar: 'A' });
  const [changingRoleAdmin, setChangingRoleAdmin] = useState(null);
  const [adminRoleForm, setAdminRoleForm] = useState({ role: 'Admin' });
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  // Profile Edit modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: 'A',
    password: ''
  });

  // Validation States
  const [categoryErrors, setCategoryErrors] = useState({});
  const [isCategorySubmitted, setIsCategorySubmitted] = useState(false);
  const [faqErrors, setFaqErrors] = useState({});
  const [isFaqSubmitted, setIsFaqSubmitted] = useState(false);
  const [bannerErrors, setBannerErrors] = useState({});
  const [isBannerSubmitted, setIsBannerSubmitted] = useState(false);
  const [testimonialErrors, setTestimonialErrors] = useState({});
  const [isTestimonialSubmitted, setIsTestimonialSubmitted] = useState(false);
  const [adminErrors, setAdminErrors] = useState({});
  const [isAdminSubmitted, setIsAdminSubmitted] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
  const [customerErrors, setCustomerErrors] = useState({});
  const [isCustomerSubmitted, setIsCustomerSubmitted] = useState(false);
  const [adminEditErrors, setAdminEditErrors] = useState({});
  const [isAdminEditSubmitted, setIsAdminEditSubmitted] = useState(false);
  const [passwordResetErrors, setPasswordResetErrors] = useState({});
  const [isPasswordResetSubmitted, setIsPasswordResetSubmitted] = useState(false);
  const [settingsErrors, setSettingsErrors] = useState({});
  const [isSettingsSubmitted, setIsSettingsSubmitted] = useState(false);
  // Backend stats aggregation state
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeMode: 'B2C',
    categoriesCount: [],
    b2cCount: 0,
    b2bCount: 0,
    enquiriesStatusCount: [],
    ordersStatusCount: [],
    monthlyOrders: [],
    monthlyEnquiries: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate('/admin', { replace: true });
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, orderRes, enqRes, settingsRes, bannerRes, testimonialRes, customersRes, adminsRes, faqRes, homepageCMSRes, aboutCMSRes, privacyRes, termsRes, shippingRes, refundRes, statsRes, blogsRes] = await Promise.all([
        axios.get('/products'),
        axios.get('/categories/admin'),
        axios.get('/orders'),
        axios.get('/enquiries'),
        axios.get('/settings'),
        axios.get('/banners/admin'),
        axios.get('/testimonials/admin'),
        axios.get('/users'),
        axios.get('/admins'),
        axios.get('/faqs'),
        axios.get('/cms/homepage'),
        axios.get('/cms/about'),
        axios.get('/cms/privacy_policy'),
        axios.get('/cms/terms_conditions'),
        axios.get('/cms/shipping_policy'),
        axios.get('/cms/refund_policy'),
        axios.get('/admin/dashboard'),
        axios.get('/blogs')
      ]);

      console.log('--- Frontend API Data Fetch Stats ---');
      console.log('Products:', prodRes.data?.length);
      console.log('Categories:', catRes.data?.length);
      console.log('Orders:', orderRes.data?.length);
      console.log('Enquiries:', enqRes.data?.length);
      console.log('Settings:', settingsRes.data ? 'Fetched' : 'None');
      console.log('Banners:', bannerRes.data?.length);
      console.log('Testimonials:', testimonialRes.data?.length);
      console.log('Customers:', customersRes.data?.length);
      console.log('Admins:', adminsRes.data?.length);

      setProducts(prodRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);
      setEnquiries(enqRes.data);
      if (settingsRes.data) {
        setWebsiteMode(settingsRes.data.default_mode || settingsRes.data.mode || 'B2C');
        setWebSettings({
          website_name: settingsRes.data.website_name || '',
          logo_placeholder: settingsRes.data.logo_placeholder || '',
          contact_info: settingsRes.data.contact_info || { email: '', phone: '', address: '' },
          social_links: settingsRes.data.social_links || { facebook: '', linkedin: '', twitter: '' }
        });
      }
      setBanners(bannerRes.data);
      setTestimonials(testimonialRes.data);
      setCustomers(customersRes.data);
      setAdmins(adminsRes.data);
      setFaqs(faqRes.data);
      setBlogs(blogsRes.data);
      
      if (statsRes.data) {
        setDashboardStats(statsRes.data);
      }

      if (homepageCMSRes.data) setHomepageCMS(homepageCMSRes.data);
      if (aboutCMSRes.data) setAboutCMS(aboutCMSRes.data);
      setPolicies({
        privacy_policy: privacyRes.data || { title: '', content: '' },
        terms_conditions: termsRes.data || { title: '', content: '' },
        shipping_policy: shippingRes.data || { title: '', content: '' },
        refund_policy: refundRes.data || { title: '', content: '' }
      });

    } catch (error) {
      console.error('Failed to load dashboard data', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminInfo');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  // Profile Modal opener
  const openProfileEdit = () => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        setProfileForm({
          name: parsed.name || 'Super Admin',
          email: parsed.email || '',
          phone: parsed.phone || '',
          avatar: parsed.avatar || 'A',
          password: ''
        });
        setIsProfileModalOpen(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getAdminInputStyle = (isSubmittedField, errorsField, fieldName, fieldValue, extraStyles = {}) => {
    let base = { ...extraStyles };
    if (!isSubmittedField) return base;
    if (errorsField[fieldName]) {
      return {
        ...base,
        border: '2px solid #DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.04)',
      };
    }
    if (fieldValue !== '' && fieldValue !== undefined && fieldValue !== null) {
      return {
        ...base,
        border: '2px solid #16A34A',
      };
    }
    return base;
  };

  const validateProfile = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileForm.name.trim()) errs.name = 'Full Name is required';
    if (!profileForm.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(profileForm.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (profileForm.password && profileForm.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileSubmitted(true);
    if (!validateProfile()) return;
    try {
      const payload = { ...profileForm };
      if (!payload.password) delete payload.password;
      
      const { data } = await axios.put('/admin/profile', payload);
      
      // Update local storage
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        const parsed = JSON.parse(adminInfo);
        localStorage.setItem('adminInfo', JSON.stringify({ ...parsed, ...data }));
      }
      
      setIsProfileModalOpen(false);
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Website settings state
  const [websiteMode, setWebsiteMode] = useState('B2C');
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  const handleModeChange = async (newMode) => {
    setIsUpdatingMode(true);
    try {
      const { data } = await axios.put('/settings/mode', { mode: newMode });
      setWebsiteMode(data.mode);
      alert(`Website mode updated to ${newMode === 'B2C' ? 'Retail / B2C (E-commerce)' : 'Wholesale / B2B (Enquiry)'} successfully!`);
    } catch (err) {
      console.error('Failed to update website mode', err);
      alert('Failed to update website mode: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdatingMode(false);
    }
  };

  // PRODUCT HANDLERS
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Grains',
      image: '',
      price: 0,
      shortDescription: '',
      description: '',
      specifications: '',
      benefits: '',
      packagingOptions: '',
      stockStatus: 'In Stock',
      b2bVisible: true,
      b2cVisible: true,
      units: 'Kg',
      packSizes: '1kg',
      minOrderQuantity: 1,
      retailPrice: 0,
      wholesalePrice: 0,
      stockQuantity: 0,
      visibility: 'Both',
      featured: false,
      bestseller: false,
      status: 'Active'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      image: product.image,
      price: product.price || 0,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      specifications: product.specifications ? product.specifications.map(s => `${s.key}:${s.value}`).join(', ') : '',
      benefits: product.benefits ? product.benefits.join(', ') : '',
      packagingOptions: product.packagingOptions ? product.packagingOptions.join(', ') : '',
      stockStatus: product.stockStatus || 'In Stock',
      b2bVisible: product.b2bVisible !== undefined ? product.b2bVisible : true,
      b2cVisible: product.b2cVisible !== undefined ? product.b2cVisible : true,
      units: product.units || 'Kg',
      packSizes: product.packSizes || '1kg',
      minOrderQuantity: product.minOrderQuantity || 1,
      retailPrice: product.retailPrice || product.price || 0,
      wholesalePrice: product.wholesalePrice || 0,
      stockQuantity: product.stockQuantity || 0,
      visibility: product.modeVisibility 
        ? (product.modeVisibility.includes('B2C') && product.modeVisibility.includes('B2B') ? 'Both' : product.modeVisibility[0])
        : (product.b2bVisible && product.b2cVisible ? 'Both' : (product.b2bVisible ? 'B2B' : 'B2C')),
      featured: product.isFeatured || product.featured || false,
      bestseller: product.isBestSeller || product.bestseller || false,
      status: product.status || 'Active'
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formattedSpecs = productForm.specifications.split(',')
      .map(i => i.trim())
      .filter(i => i !== '' && i.includes(':'))
      .map(i => {
        const [k, v] = i.split(':');
        return { key: k.trim(), value: v.trim() };
      });
    const formattedBenefits = productForm.benefits.split(',').map(i => i.trim()).filter(i => i !== '');
    const formattedPackaging = productForm.packagingOptions.split(',').map(i => i.trim()).filter(i => i !== '');

    let modeVisibility = ['B2C', 'B2B'];
    let b2cVisible = true;
    let b2bVisible = true;

    if (productForm.visibility === 'B2C') {
      modeVisibility = ['B2C'];
      b2cVisible = true;
      b2bVisible = false;
    } else if (productForm.visibility === 'B2B') {
      modeVisibility = ['B2B'];
      b2cVisible = false;
      b2bVisible = true;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.retailPrice || productForm.price),
      retailPrice: Number(productForm.retailPrice || productForm.price || 0),
      wholesalePrice: Number(productForm.wholesalePrice || 0),
      minOrderQuantity: Number(productForm.minOrderQuantity || 1),
      stockQuantity: Number(productForm.stockQuantity || 0),
      modeVisibility,
      b2cVisible,
      b2bVisible,
      specifications: formattedSpecs,
      benefits: formattedBenefits,
      packagingOptions: formattedPackaging,
      featured: productForm.featured,
      isFeatured: productForm.featured,
      bestseller: productForm.bestseller,
      isBestSeller: productForm.bestseller
    };

    try {
      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, payload);
      } else {
        await axios.post('/products', payload);
      }
      setIsProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed: ' + (err.response?.data?.message || 'Error occurred'));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const validateCategory = () => {
    const errs = {};
    if (!categoryModal.name?.trim()) errs.name = 'Category Name is required';
    if (!categoryModal.image?.trim()) {
      errs.image = 'Image URL is required';
    }
    if (categoryModal.displayOrder === '' || categoryModal.displayOrder === undefined) {
      errs.displayOrder = 'Display Order is required';
    }
    setCategoryErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsCategorySubmitted(true);
    if (!validateCategory()) return;
    const payload = { name: categoryModal.name, image: categoryModal.image, displayOrder: Number(categoryModal.displayOrder) };
    try {
      if (categoryModal.editing) {
        await axios.put(`/categories/${categoryModal.editing._id}`, payload);
      } else {
        await axios.post('/categories', payload);
      }
      setCategoryModal({ open: false, editing: null, name: '', image: '', displayOrder: 0 });
      setIsCategorySubmitted(false);
      setCategoryErrors({});
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await axios.delete(`/categories/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CRUD FOR BANNERS
  const validateBanner = () => {
    const errs = {};
    if (!bannerModal.desktopImage?.trim()) {
      errs.desktopImage = 'Desktop Image URL is required';
    } else if (!bannerModal.desktopImage.trim().startsWith('http')) {
      errs.desktopImage = 'Please enter a valid image URL';
    }
    if (!bannerModal.mobileImage?.trim()) {
      errs.mobileImage = 'Mobile Image URL is required';
    } else if (!bannerModal.mobileImage.trim().startsWith('http')) {
      errs.mobileImage = 'Please enter a valid image URL';
    }
    setBannerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    setIsBannerSubmitted(true);
    if (!validateBanner()) return;
    const payload = { ...bannerModal };
    try {
      if (bannerModal.editing) {
        await axios.put(`/banners/${bannerModal.editing._id}`, payload);
      } else {
        await axios.post('/banners', payload);
      }
      setBannerModal({ open: false, editing: null, desktopImage: '', mobileImage: '', title: '', subtitle: '', linkButton: '', active: true });
      setIsBannerSubmitted(false);
      setBannerErrors({});
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Remove this banner?')) {
      try {
        await axios.delete(`/banners/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CRUD FOR TESTIMONIALS
  const validateTestimonial = () => {
    const errs = {};
    if (!testimonialModal.customerName?.trim()) errs.customerName = 'Customer Name is required';
    if (testimonialModal.rating === '' || testimonialModal.rating === undefined || testimonialModal.rating < 1 || testimonialModal.rating > 5) {
      errs.rating = 'Rating must be between 1 and 5';
    }
    if (!testimonialModal.reviewText?.trim()) errs.reviewText = 'Review Text is required';
    setTestimonialErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setIsTestimonialSubmitted(true);
    if (!validateTestimonial()) return;
    const payload = { ...testimonialModal, rating: Number(testimonialModal.rating) };
    try {
      if (testimonialModal.editing) {
        await axios.put(`/testimonials/${testimonialModal.editing._id}`, payload);
      } else {
        await axios.post('/testimonials', payload);
      }
      setTestimonialModal({ open: false, editing: null, customerName: '', countryCity: '', rating: 5, reviewText: '', productName: '', showOnHomepage: true });
      setIsTestimonialSubmitted(false);
      setTestimonialErrors({});
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to save testimonial');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Remove testimonial?')) {
      try {
        await axios.delete(`/testimonials/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CRUD FOR BLOGS
  const validateBlog = () => {
    const errs = {};
    if (!blogModal.title?.trim()) errs.title = 'Title is required';
    if (!blogModal.shortDescription?.trim()) errs.shortDescription = 'Short Description is required';
    if (!blogModal.content?.trim()) errs.content = 'Content is required';
    setBlogErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setIsBlogSubmitted(true);
    if (!validateBlog()) return;
    const payload = {
      title: blogModal.title,
      image: blogModal.image || undefined,
      shortDescription: blogModal.shortDescription,
      content: blogModal.content,
      author: blogModal.author || undefined,
      category: blogModal.category || undefined,
      publishedDate: blogModal.publishedDate ? new Date(blogModal.publishedDate) : undefined,
      status: blogModal.status,
      isVisible: blogModal.isVisible,
      isFeatured: blogModal.isFeatured
    };
    try {
      if (blogModal.editing) {
        await axios.put(`/blogs/${blogModal.editing._id}`, payload);
      } else {
        await axios.post('/blogs', payload);
      }
      setBlogModal({
        open: false,
        editing: null,
        title: '',
        image: '',
        shortDescription: '',
        content: '',
        author: '',
        category: '',
        publishedDate: '',
        status: 'Published',
        isVisible: true,
        isFeatured: false
      });
      setIsBlogSubmitted(false);
      setBlogErrors({});
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to save blog post');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Remove this blog post?')) {
      try {
        await axios.delete(`/blogs/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleBlogVisibility = async (id) => {
    try {
      await axios.patch(`/blogs/${id}/toggle-visibility`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle visibility');
    }
  };

  const handleToggleBlogFeatured = async (blog) => {
    try {
      await axios.put(`/blogs/${blog._id}`, {
        ...blog,
        isFeatured: !blog.isFeatured
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle featured status');
    }
  };

  // CRUD FOR FAQS
  const validateFAQ = () => {
    const errs = {};
    if (!faqModal.question?.trim()) errs.question = 'Question is required';
    if (!faqModal.answer?.trim()) errs.answer = 'Answer is required';
    setFaqErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFAQSubmit = async (e) => {
    e.preventDefault();
    setIsFaqSubmitted(true);
    if (!validateFAQ()) return;
    try {
      if (faqModal.editing) {
        await axios.put(`/faqs/${faqModal.editing._id}`, { question: faqModal.question, answer: faqModal.answer });
      } else {
        await axios.post('/faqs', { question: faqModal.question, answer: faqModal.answer });
      }
      setFaqModal({ open: false, editing: null, question: '', answer: '' });
      setIsFaqSubmitted(false);
      setFaqErrors({});
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to save FAQ');
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (window.confirm('Remove this FAQ?')) {
      try {
        await axios.delete(`/faqs/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CMS UPDATES
  const handleHomepageCMSSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/cms/homepage', { value: homepageCMS });
      alert('Homepage CMS updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update Homepage CMS');
    }
  };

  const handleAboutCMSSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/cms/about', { value: aboutCMS });
      alert('About Us CMS updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update About Us CMS');
    }
  };

  const handlePolicySubmit = async (policyKey) => {
    try {
      await axios.put(`/cms/${policyKey}`, { value: policies[policyKey] });
      alert('Policy content updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update policy');
    }
  };

  const validateSettings = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!webSettings.website_name?.trim()) errs.website_name = 'Brand Name is required';
    if (!webSettings.logo_placeholder?.trim()) errs.logo_placeholder = 'Logo text is required';
    if (!webSettings.contact_info?.email?.trim()) {
      errs.email = 'Contact Email is required';
    } else if (!emailRegex.test(webSettings.contact_info.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setSettingsErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setIsSettingsSubmitted(true);
    if (!validateSettings()) return;
    try {
      await axios.put('/settings/website_name', { value: webSettings.website_name });
      await axios.put('/settings/logo_placeholder', { value: webSettings.logo_placeholder });
      await axios.put('/settings/contact_info', { value: webSettings.contact_info });
      await axios.put('/settings/social_links', { value: webSettings.social_links });
      setIsSettingsSubmitted(false);
      setSettingsErrors({});
      alert('Website settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    }
  };

  // --- CUSTOMER ACTIONS ---
  const handleCustomerBlock = async (id) => {
    try {
      const { data } = await axios.patch(`/users/${id}/block`);
      alert(data.message || 'Block status updated');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to toggle block status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCustomerDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer account?')) {
      try {
        await axios.delete(`/users/${id}`);
        alert('Customer deleted successfully');
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete customer: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleCustomerEditOpen = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      pincode: customer.pincode || ''
    });
  };

  const validateCustomerEdit = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerForm.name?.trim()) errs.name = 'Name is required';
    if (!customerForm.email?.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(customerForm.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setCustomerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCustomerEditSubmit = async (e) => {
    e.preventDefault();
    setIsCustomerSubmitted(true);
    if (!validateCustomerEdit()) return;
    try {
      await axios.put(`/users/${editingCustomer._id}`, customerForm);
      alert('Customer updated successfully');
      setEditingCustomer(null);
      setIsCustomerSubmitted(false);
      setCustomerErrors({});
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update customer: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- ADMIN ACTIONS ---
  const handleAdminDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this administrator account?')) {
      try {
        await axios.delete(`/admins/${id}`);
        alert('Admin account removed');
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete admin: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAdminEditOpen = (admin) => {
    setEditingAdmin(admin);
    setAdminEditForm({
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone || '',
      avatar: admin.avatar || 'A'
    });
  };

  const validateAdminEdit = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!adminEditForm.name?.trim()) errs.name = 'Name is required';
    if (!adminEditForm.email?.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(adminEditForm.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    setAdminEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdminEditSubmit = async (e) => {
    e.preventDefault();
    setIsAdminEditSubmitted(true);
    if (!validateAdminEdit()) return;
    try {
      await axios.put(`/admins/${editingAdmin._id}`, adminEditForm);
      alert('Admin profile updated');
      setEditingAdmin(null);
      setIsAdminEditSubmitted(false);
      setAdminEditErrors({});
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update admin: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRoleChangeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/admins/${changingRoleAdmin._id}/role`, { role: adminRoleForm.role });
      alert('Admin role changed successfully');
      setChangingRoleAdmin(null);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to change role: ' + (err.response?.data?.message || err.message));
    }
  };

  const validatePasswordReset = () => {
    const errs = {};
    if (!newPassword) {
      errs.password = 'Password is required';
    } else if (newPassword.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    setPasswordResetErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsPasswordResetSubmitted(true);
    if (!validatePasswordReset()) return;
    try {
      await axios.patch(`/admins/${resetPasswordAdmin._id}/reset-password`, { password: newPassword });
      alert('Password reset successfully');
      setResetPasswordAdmin(null);
      setNewPassword('');
      setIsPasswordResetSubmitted(false);
      setPasswordResetErrors({});
      fetchDashboardData();
    } catch (err) {
      alert('Failed to reset password: ' + (err.response?.data?.message || err.message));
    }
  };

  // ADMIN USERS CRUD
  const validateAdmin = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!adminModal.name?.trim()) errs.name = 'Admin Name is required';
    if (!adminModal.email?.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(adminModal.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!adminModal.password) {
      errs.password = 'Password is required';
    } else if (adminModal.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    setAdminErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsAdminSubmitted(true);
    if (!validateAdmin()) return;
    try {
      await axios.post('/admins', { 
        email: adminModal.email, 
        password: adminModal.password,
        name: adminModal.name || 'Admin',
        phone: adminModal.phone || '',
        role: adminModal.role || 'Admin'
      });
      setAdminModal({ open: false, email: '', password: '', name: '', phone: '', role: 'Admin' });
      setIsAdminSubmitted(false);
      setAdminErrors({});
      fetchDashboardData();
      alert('New admin registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add admin: ' + (err.response?.data?.message || err.message));
    }
  };

  // Safely grab arrays
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  // Filter lists based on search, category filters
  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesBestseller = bestsellerFilter === 'All' ||
                              (bestsellerFilter === 'Yes' && (p.bestseller || p.isBestSeller)) ||
                              (bestsellerFilter === 'No' && !(p.bestseller || p.isBestSeller));
    return matchesSearch && matchesCategory && matchesBestseller;
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getProductImage = (prod) => {
    return getImageUrl(prod ? prod.image : null);
  };

  // Stats calculation
  const totalProducts = safeProducts.length;
  const totalOrders = safeOrders.length;
  const totalEnquiries = safeEnquiries.length;
  const totalRevenue = safeOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p style={{ marginTop: '16px', color: 'var(--admin-accent-sage)', fontWeight: '600' }}>Loading VedaGlobal Admin Console...</p>
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      websiteMode={websiteMode}
      onModeChange={handleModeChange}
      onEditProfile={openProfileEdit}
    >
      {/* Dashboard Screen */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
          
          {/* Animated Summary Cards using Framer Motion */}
          <motion.div 
            className="admin-stats-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div whileHover={{ y: -4 }} className="admin-stat-card" onClick={() => setActiveTab('products')}>
              <div className="admin-stat-card-left">
                <h4>Total Products</h4>
                <div className="stat-value">{totalProducts}</div>
              </div>
              <div className="admin-stat-card-icon">📦</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="admin-stat-card" onClick={() => setActiveTab('orders')}>
              <div className="admin-stat-card-left">
                <h4>Total Orders</h4>
                <div className="stat-value">{totalOrders}</div>
              </div>
              <div className="admin-stat-card-icon">🛒</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="admin-stat-card" onClick={() => setActiveTab('enquiries')}>
              <div className="admin-stat-card-left">
                <h4>Total Enquiries</h4>
                <div className="stat-value">{totalEnquiries}</div>
              </div>
              <div className="admin-stat-card-icon">📩</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="admin-stat-card" onClick={() => setActiveTab('users-admins')}>
              <div className="admin-stat-card-left">
                <h4>Total Customers</h4>
                <div className="stat-value">{customers.length}</div>
              </div>
              <div className="admin-stat-card-icon">👥</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="admin-stat-card">
              <div className="admin-stat-card-left">
                <h4>Active Mode</h4>
                <div className="stat-value" style={{ color: 'var(--admin-accent-vanilla)', fontSize: '1.35rem' }}>
                  {websiteMode === 'B2C' ? 'B2C Retail' : 'B2B Wholesale'}
                </div>
              </div>
              <div className="admin-stat-card-icon">⚙️</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="admin-stat-card">
              <div className="admin-stat-card-left">
                <h4>Total Revenue</h4>
                <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <div className="admin-stat-card-icon">💰</div>
            </motion.div>
          </motion.div>

          {/* Custom Animated SVG Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', width: '100%' }}>
            
            {/* Monthly Enquiries & Orders Line Chart */}
            <motion.div 
              className="admin-card chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ boxShadow: 'var(--admin-shadow)', border: '1px solid var(--admin-border)' }}
            >
              <h3>Monthly Trends (Last 6 Months)</h3>
              <LineChart 
                ordersData={dashboardStats.monthlyOrders || []} 
                enquiriesData={dashboardStats.monthlyEnquiries || []} 
              />
            </motion.div>

            {/* Products by Category Bar Chart */}
            <motion.div 
              className="admin-card chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ boxShadow: 'var(--admin-shadow)', border: '1px solid var(--admin-border)' }}
            >
              <h3>Products by Category</h3>
              <BarChart data={dashboardStats.categoriesCount || []} />
            </motion.div>

            {/* Orders Status Pie Chart */}
            <motion.div 
              className="admin-card chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ boxShadow: 'var(--admin-shadow)', border: '1px solid var(--admin-border)' }}
            >
              <h3>Orders Status Distribution</h3>
              <PieChart 
                data={dashboardStats.ordersStatusCount || []} 
                colors={['#809671', '#D4AF37', '#e5d2b8', '#ef4444', '#3b82f6']} 
              />
            </motion.div>

            {/* Enquiries Status Pie Chart */}
            <motion.div 
              className="admin-card chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ boxShadow: 'var(--admin-shadow)', border: '1px solid var(--admin-border)' }}
            >
              <h3>Enquiries Status Distribution</h3>
              <PieChart 
                data={dashboardStats.enquiriesStatusCount || []} 
                colors={['#e5d2b8', '#809671', '#3b82f6', '#ef4444']} 
              />
            </motion.div>

            {/* Product Visibility Mode comparative layout */}
            <motion.div 
              className="admin-card chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ boxShadow: 'var(--admin-shadow)', border: '1px solid var(--admin-border)', gridColumn: '1 / -1' }}
            >
              <h3>Website Mode Visibility Ratio</h3>
              <div style={{ display: 'flex', gap: '30px', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>B2C Retail Visible</span>
                  <h2 style={{ fontSize: '2rem', color: '#809671', margin: '5px 0' }}>{dashboardStats.b2cCount || 0}</h2>
                  <small style={{ color: 'var(--admin-text-muted)' }}>Products in Retail market</small>
                </div>
                <div style={{ width: '1px', height: '60px', background: 'var(--admin-border)' }} className="hide-on-mobile"></div>
                <div style={{ textAlign: 'center', flex: 1, minWidth: '120px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>B2B Wholesale Visible</span>
                  <h2 style={{ fontSize: '2rem', color: '#D4AF37', margin: '5px 0' }}>{dashboardStats.b2bCount || 0}</h2>
                  <small style={{ color: 'var(--admin-text-muted)' }}>Products in Bulk market</small>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tables Grid Layout */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', width: '100%' }}>
            <div className="admin-card table-card">
              <div className="admin-card-header"><h2>Recent Orders</h2></div>
              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeOrders.slice(0, 5).map(o => (
                      <tr key={o._id}>
                        <td>{o.customerName}</td>
                        <td>₹{o.totalAmount}</td>
                        <td><span className={`admin-badge status-${o.orderStatus.toLowerCase()}`}>{o.orderStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card table-card">
              <div className="admin-card-header"><h2>Recent Enquiries</h2></div>
              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Product</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeEnquiries.slice(0, 5).map(e => (
                      <tr key={e._id}>
                        <td>{e.contactPerson}</td>
                        <td>{e.productName}</td>
                        <td><span className="admin-badge admin-badge-vanilla">{e.status || 'New'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Catalog Screen */}
      {activeTab === 'products' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Product Catalog</h2>
            <button className="admin-btn admin-btn-primary" onClick={openCreateProductModal}>+ Add Product</button>
          </div>
          
          <div className="admin-filters-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <select className="admin-filter-dropdown" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {safeCategories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            <select className="admin-filter-dropdown" value={bestsellerFilter} onChange={e => setBestsellerFilter(e.target.value)}>
              <option value="All">All Items</option>
              <option value="Yes">Bestseller Only</option>
              <option value="No">Others Only</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Retail Price</th>
                  <th>Wholesale Price</th>
                  <th>Stock Qty</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(prod => (
                  <tr key={prod._id}>
                    <td><img src={getProductImage(prod)} alt={prod.name} className="admin-table-thumb" style={{ width: '45px', height: '45px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                    <td><strong>{prod.name}</strong></td>
                    <td>{prod.category}</td>
                    <td>₹{prod.retailPrice || prod.price}</td>
                    <td>₹{prod.wholesalePrice || 0}</td>
                    <td>{prod.stockQuantity || 0} ({prod.units || 'Kg'})</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(!prod.modeVisibility || prod.modeVisibility.includes('B2C')) && <span className="admin-badge admin-badge-sage">B2C</span>}
                        {(!prod.modeVisibility || prod.modeVisibility.includes('B2B')) && <span className="admin-badge admin-badge-vanilla">B2B</span>}
                      </div>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-icon-btn edit" onClick={() => openEditProductModal(prod)}>✏️</button>
                        <button className="admin-action-icon-btn delete" onClick={() => handleDeleteProduct(prod._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories CRUD Screen */}
      {activeTab === 'categories' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Categories</h2>
            <button className="admin-btn admin-btn-primary" onClick={() => setCategoryModal({ open: true, editing: null, name: '', image: '', displayOrder: 0 })}>+ Add Category</button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Name</th>
                  <th>Display Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeCategories.map(cat => (
                  <tr key={cat._id}>
                    <td><img src={getImageUrl(cat.image)} alt={cat.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                    <td><strong>{cat.name}</strong></td>
                    <td>{cat.displayOrder || 0}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-icon-btn edit" onClick={() => setCategoryModal({ open: true, editing: cat, name: cat.name, image: cat.image, displayOrder: cat.displayOrder || 0 })}>✏️</button>
                        <button className="admin-action-icon-btn delete" onClick={() => handleDeleteCategory(cat._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Homepage CMS Screen */}
      {activeTab === 'homepage-cms' && (
        <div className="admin-card animate-fade-in" style={{ padding: '30px' }}>
          <div className="admin-card-header" style={{ marginBottom: '25px' }}>
            <h2>Homepage CMS Settings</h2>
          </div>
          <form onSubmit={handleHomepageCMSSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="cms-home-welcomeTitle" className="admin-form-label">Hero Title</label>
              <input type="text" id="cms-home-welcomeTitle" name="welcomeTitle" className="admin-form-input" value={homepageCMS.welcomeTitle || ''} onChange={e => setHomepageCMS({ ...homepageCMS, welcomeTitle: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="cms-home-welcomeSub" className="admin-form-label">Hero Subtitle</label>
              <input type="text" id="cms-home-welcomeSub" name="welcomeSub" className="admin-form-input" value={homepageCMS.welcomeSub || ''} onChange={e => setHomepageCMS({ ...homepageCMS, welcomeSub: e.target.value })} />
            </div>
            <div style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>About Us Section preview on Homepage</h4>
              <div className="admin-form-group">
                <label htmlFor="cms-home-aboutTitle" className="admin-form-label">Section Title</label>
                <input type="text" id="cms-home-aboutTitle" name="aboutTitle" className="admin-form-input" value={homepageCMS.aboutSection?.title || ''} onChange={e => setHomepageCMS({ ...homepageCMS, aboutSection: { ...homepageCMS.aboutSection, title: e.target.value } })} />
              </div>
              <div className="admin-form-group" style={{ marginTop: '10px' }}>
                <label htmlFor="cms-home-aboutContent" className="admin-form-label">Section Content</label>
                <textarea id="cms-home-aboutContent" name="aboutContent" rows="4" className="admin-form-input" value={homepageCMS.aboutSection?.content || ''} onChange={e => setHomepageCMS({ ...homepageCMS, aboutSection: { ...homepageCMS.aboutSection, content: e.target.value } })}></textarea>
              </div>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ alignSelf: 'flex-start' }}>Save Homepage CMS</button>
          </form>
        </div>
      )}

      {/* About Us CMS Screen */}
      {activeTab === 'about-us' && (
        <div className="admin-card animate-fade-in" style={{ padding: '30px' }}>
          <div className="admin-card-header" style={{ marginBottom: '25px' }}>
            <h2>About Us Content Settings</h2>
          </div>
          <form onSubmit={handleAboutCMSSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="cms-about-title" className="admin-form-label">About Page Title</label>
              <input type="text" id="cms-about-title" name="title" className="admin-form-input" value={aboutCMS.title || ''} onChange={e => setAboutCMS({ ...aboutCMS, title: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="cms-about-content" className="admin-form-label">About Content Description</label>
              <textarea id="cms-about-content" name="content" rows="6" className="admin-form-input" value={aboutCMS.content || ''} onChange={e => setAboutCMS({ ...aboutCMS, content: e.target.value })}></textarea>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ alignSelf: 'flex-start' }}>Save About Content</button>
          </form>
        </div>
      )}

      {/* Blogs CRUD Screen */}
      {activeTab === 'blogs' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Blogs & Articles</h2>
            <button className="admin-btn admin-btn-primary" onClick={() => setBlogModal({
              open: true,
              editing: null,
              title: '',
              image: '',
              shortDescription: '',
              content: '',
              author: 'Veda Global Trade Desk',
              category: 'Export Insights',
              publishedDate: new Date().toISOString().split('T')[0],
              status: 'Published',
              isVisible: true,
              isFeatured: false
            })}>+ Add Blog</button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(blogs || []).map(b => (
                  <tr key={b._id}>
                    <td><img src={getImageUrl(b.image)} alt={b.title} style={{ width: '50px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.category}</td>
                    <td>{b.author}</td>
                    <td>
                      <span className={`admin-badge ${b.status === 'Published' ? 'admin-badge-sage' : 'admin-badge-vanilla'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleToggleBlogFeatured(b)}
                        className="admin-action-icon-btn" 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem' }}
                      >
                        {b.isFeatured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleToggleBlogVisibility(b._id)}
                        className="admin-btn"
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '0.75rem', 
                          borderRadius: '4px',
                          backgroundColor: b.isVisible ? 'var(--admin-emerald)' : '#ef4444',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        {b.isVisible ? 'Show' : 'Hide'}
                      </button>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-icon-btn edit" onClick={() => setBlogModal({
                          open: true,
                          editing: b,
                          title: b.title,
                          image: b.image || '',
                          shortDescription: b.shortDescription,
                          content: b.content,
                          author: b.author || '',
                          category: b.category || '',
                          publishedDate: b.publishedDate ? new Date(b.publishedDate).toISOString().split('T')[0] : '',
                          status: b.status || 'Published',
                          isVisible: b.isVisible !== undefined ? b.isVisible : true,
                          isFeatured: b.isFeatured || false
                        })}>✏️</button>
                        <button className="admin-action-icon-btn delete" onClick={() => handleDeleteBlog(b._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Policies & FAQ Tab */}
      {activeTab === 'policies' && (
        <div className="admin-card animate-fade-in" style={{ padding: '30px' }}>
          <div className="admin-card-header" style={{ marginBottom: '20px' }}>
            <h2>Policies & FAQs Management</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {['privacy_policy', 'terms_conditions', 'shipping_policy', 'refund_policy'].map(policy => (
              <div key={policy} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                <h4 style={{ textTransform: 'capitalize', color: 'var(--text-main)', marginBottom: '15px' }}>{policy.replace('_', ' ')}</h4>
                <div className="admin-form-group">
                  <label className="admin-form-label">Title</label>
                  <input type="text" className="admin-form-input" value={policies[policy]?.title || ''} onChange={e => setPolicies({ ...policies, [policy]: { ...policies[policy], title: e.target.value } })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label className="admin-form-label">Content</label>
                  <textarea rows="4" className="admin-form-input" value={policies[policy]?.content || ''} onChange={e => setPolicies({ ...policies, [policy]: { ...policies[policy], content: e.target.value } })}></textarea>
                </div>
                <button type="button" onClick={() => handlePolicySubmit(policy)} className="admin-btn admin-btn-secondary" style={{ marginTop: '10px' }}>Update {policy.replace('_', ' ')}</button>
              </div>
            ))}

            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ color: 'var(--text-main)', margin: 0 }}>Frequently Asked Questions (FAQs)</h4>
                <button type="button" onClick={() => setFaqModal({ open: true, editing: null, question: '', answer: '' })} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>+ Add FAQ</button>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map(f => (
                      <tr key={f._id}>
                        <td><strong>{f.question}</strong></td>
                        <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.answer}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button className="admin-action-icon-btn edit" onClick={() => setFaqModal({ open: true, editing: f, question: f.question, answer: f.answer })}>✏️</button>
                            <button className="admin-action-icon-btn delete" onClick={() => handleDeleteFAQ(f._id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enquiries combined page */}
      {activeTab === 'enquiries' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Product Enquiries Queue</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="admin-filter-dropdown" value={enquiryModeFilter} onChange={e => setEnquiryModeFilter(e.target.value)}>
                <option value="All">All Visibility Mode</option>
                <option value="B2C">B2C Retail</option>
                <option value="B2B">B2B Wholesale</option>
              </select>
              <select className="admin-filter-dropdown" value={enquiryStatusFilter} onChange={e => setEnquiryStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {safeEnquiries
                  .filter(e => enquiryModeFilter === 'All' || e.mode === enquiryModeFilter)
                  .filter(e => enquiryStatusFilter === 'All' || (e.status || 'New') === enquiryStatusFilter)
                  .map(enq => (
                    <tr key={enq._id}>
                      <td>#{enq._id.slice(-6)}</td>
                      <td><strong>{enq.contactPerson}</strong></td>
                      <td>{enq.email}</td>
                      <td>{enq.productName}</td>
                      <td>{enq.quantity || 1}</td>
                      <td>
                        <select
                          className="admin-form-input"
                          value={enq.status || 'New'}
                          onChange={async (e) => {
                            try {
                              await axios.put(`/enquiries/${enq._id}`, { status: e.target.value });
                              fetchDashboardData();
                            } catch (err) {
                              alert('Failed to update status');
                            }
                          }}
                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}
                        >
                          <option value="New">New</option>
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders combined page */}
      {activeTab === 'orders' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Customer Orders List</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="admin-filter-dropdown" value={orderModeFilter} onChange={e => setOrderModeFilter(e.target.value)}>
                <option value="All">All Mode Orders</option>
                <option value="B2C">B2C Retail</option>
                <option value="B2B">B2B Wholesale</option>
              </select>
              <select className="admin-filter-dropdown" value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Placed">Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {safeOrders
                  .filter(o => orderModeFilter === 'All' || (o.mode || 'B2C') === orderModeFilter)
                  .filter(o => orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter)
                  .map(ord => (
                    <tr key={ord._id}>
                      <td>#{ord._id.slice(-6)}</td>
                      <td><strong>{ord.customerName}</strong></td>
                      <td>₹{ord.totalAmount}</td>
                      <td>
                        <select
                          className="admin-form-input"
                          value={ord.orderStatus || 'Pending'}
                          onChange={e => handleUpdateOrderStatus(ord._id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td><span className={`admin-badge ${(ord.mode || 'B2C') === 'B2B' ? 'admin-badge-vanilla' : 'admin-badge-sage'}`}>{ord.mode || 'B2C'}</span></td>
                      <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => setSelectedOrderDetails(ord)} className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>View Info</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Banners tab */}
      {activeTab === 'banners' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Desktop/Mobile Banners</h2>
            <button className="admin-btn admin-btn-primary" onClick={() => setBannerModal({ open: true, editing: null, desktopImage: '', mobileImage: '', title: '', subtitle: '', linkButton: '', active: true })}>+ Add Banner</button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Desktop Image</th>
                  <th>Title</th>
                  <th>Subtitle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map(b => (
                  <tr key={b._id}>
                    <td><img src={b.desktopImage} alt={b.title} style={{ width: '80px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                    <td><strong>{b.title || 'Untitled'}</strong></td>
                    <td>{b.subtitle || 'N/A'}</td>
                    <td><span className={`admin-badge ${b.active ? 'admin-badge-sage' : 'admin-badge-vanilla'}`}>{b.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-icon-btn edit" onClick={() => setBannerModal({ open: true, editing: b, desktopImage: b.desktopImage, mobileImage: b.mobileImage, title: b.title || '', subtitle: b.subtitle || '', linkButton: b.linkButton || '', active: b.active })}>✏️</button>
                        <button className="admin-action-icon-btn delete" onClick={() => handleDeleteBanner(b._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Testimonials tab */}
      {activeTab === 'testimonials' && (
        <div className="admin-card animate-fade-in">
          <div className="admin-card-header">
            <h2>Customer Reviews & Testimonials</h2>
            <button className="admin-btn admin-btn-primary" onClick={() => setTestimonialModal({ open: true, editing: null, customerName: '', countryCity: '', rating: 5, reviewText: '', productName: '', showOnHomepage: true })}>+ Add Testimonial</button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Review</th>
                  <th>Rating</th>
                  <th>Product</th>
                  <th>Homepage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.customerName}</strong> ({t.countryCity || 'N/A'})</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.reviewText}</td>
                    <td>{'⭐'.repeat(t.rating)}</td>
                    <td>{t.productName || 'N/A'}</td>
                    <td>{t.showOnHomepage ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-action-icon-btn edit" onClick={() => setTestimonialModal({ open: true, editing: t, customerName: t.customerName, countryCity: t.countryCity || '', rating: t.rating, reviewText: t.reviewText, productName: t.productName || '', showOnHomepage: t.showOnHomepage })}>✏️</button>
                        <button className="admin-action-icon-btn delete" onClick={() => handleDeleteTestimonial(t._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Website Settings */}
      {activeTab === 'settings' && (
        <div className="admin-card animate-fade-in" style={{ padding: '30px' }}>
          <div className="admin-card-header" style={{ marginBottom: '20px' }}>
            <h2>Global Settings & Info</h2>
          </div>
          <form onSubmit={handleSettingsSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group">
              <label htmlFor="settings-brand-name" className="admin-form-label">Brand Name *</label>
              <AnimatePresence>
                {isSettingsSubmitted && settingsErrors.website_name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="validation-error-text"
                  >
                    ⚠️ {settingsErrors.website_name}
                  </motion.div>
                )}
              </AnimatePresence>
              <input 
                type="text" 
                id="settings-brand-name"
                name="website_name"
                className="admin-form-input" 
                value={webSettings.website_name} 
                onChange={e => {
                  setWebSettings({ ...webSettings, website_name: e.target.value });
                  if (isSettingsSubmitted) {
                    setSettingsErrors(prev => {
                      const next = { ...prev };
                      delete next.website_name;
                      return next;
                    });
                  }
                }} 
                style={getAdminInputStyle(isSettingsSubmitted, settingsErrors, 'website_name', webSettings.website_name)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="settings-logo-placeholder" className="admin-form-label">Logo Text/Placeholder *</label>
              <AnimatePresence>
                {isSettingsSubmitted && settingsErrors.logo_placeholder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="validation-error-text"
                  >
                    ⚠️ {settingsErrors.logo_placeholder}
                  </motion.div>
                )}
              </AnimatePresence>
              <input 
                type="text" 
                id="settings-logo-placeholder"
                name="logo_placeholder"
                className="admin-form-input" 
                value={webSettings.logo_placeholder} 
                onChange={e => {
                  setWebSettings({ ...webSettings, logo_placeholder: e.target.value });
                  if (isSettingsSubmitted) {
                    setSettingsErrors(prev => {
                      const next = { ...prev };
                      delete next.logo_placeholder;
                      return next;
                    });
                  }
                }} 
                style={getAdminInputStyle(isSettingsSubmitted, settingsErrors, 'logo_placeholder', webSettings.logo_placeholder)}
              />
            </div>
            <div style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>Contact Info</h4>
              <div className="admin-form-group">
                <label htmlFor="settings-contact-email" className="admin-form-label">Contact Email *</label>
                <AnimatePresence>
                  {isSettingsSubmitted && settingsErrors.email && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="validation-error-text"
                    >
                      ⚠️ {settingsErrors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input 
                  type="email" 
                  id="settings-contact-email"
                  name="email"
                  className="admin-form-input" 
                  value={webSettings.contact_info.email} 
                  onChange={e => {
                    setWebSettings({ ...webSettings, contact_info: { ...webSettings.contact_info, email: e.target.value } });
                    if (isSettingsSubmitted) {
                      setSettingsErrors(prev => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }} 
                  style={getAdminInputStyle(isSettingsSubmitted, settingsErrors, 'email', webSettings.contact_info.email)}
                />
              </div>
              <div className="admin-form-group" style={{ marginTop: '10px' }}>
                <label htmlFor="settings-contact-phone" className="admin-form-label">Phone</label>
                <input type="text" id="settings-contact-phone" name="phone" className="admin-form-input" value={webSettings.contact_info.phone} onChange={e => setWebSettings({ ...webSettings, contact_info: { ...webSettings.contact_info, phone: e.target.value } })} />
              </div>
              <div className="admin-form-group" style={{ marginTop: '10px' }}>
                <label htmlFor="settings-contact-address" className="admin-form-label">Address</label>
                <input type="text" id="settings-contact-address" name="address" className="admin-form-input" value={webSettings.contact_info.address} onChange={e => setWebSettings({ ...webSettings, contact_info: { ...webSettings.contact_info, address: e.target.value } })} />
              </div>
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ alignSelf: 'flex-start' }}>Save Global Settings</button>
          </form>
        </div>
      )}

      {/* Users / Admins Management Screen */}
      {activeTab === 'users-admins' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Registered Clients (Customers)</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Pincode</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c._id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.phone || 'N/A'}</td>
                      <td>{c.address || 'N/A'}</td>
                      <td>{c.pincode || 'N/A'}</td>
                      <td>
                        <span className={`admin-badge ${c.isBlocked ? 'admin-badge-danger' : 'admin-badge-sage'}`}>
                          {c.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          <button 
                            onClick={() => setSelectedCustomer(c)} 
                            className="admin-btn" 
                            style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: 'var(--admin-emerald)', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => handleCustomerEditOpen(c)} 
                            className="admin-btn" 
                            style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: 'var(--admin-gold)', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleCustomerBlock(c._id)} 
                            className="admin-btn" 
                            style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#111827', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                          >
                            {c.isBlocked ? '🔓 Unblock' : '🚫 Block'}
                          </button>
                          <button 
                            onClick={() => handleCustomerDelete(c._id)} 
                            className="admin-btn" 
                            style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Administrator Accounts</h2>
              <button className="admin-btn admin-btn-primary" onClick={() => setAdminModal({ open: true, email: '', password: '', name: '', phone: '', role: 'Admin' })}>+ Register Admin</button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Admin Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(a => {
                    const isSystemAdmin = a.email === 'admin@vedaglobal.com' || a.role === 'Super Admin';
                    return (
                      <tr key={a._id}>
                        <td>
                          <div className="admin-avatar" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>{a.avatar || 'A'}</div>
                        </td>
                        <td>{a.name || 'System Admin'}</td>
                        <td><strong>{a.email}</strong></td>
                        <td>{a.phone || 'N/A'}</td>
                        <td>
                          <span className={`admin-badge ${a.role === 'Super Admin' ? 'admin-badge-danger' : a.role === 'Manager' ? 'admin-badge-info' : 'admin-badge-vanilla'}`}>
                            {a.role || 'Admin'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            <button 
                              onClick={() => handleAdminEditOpen(a)} 
                              className="admin-btn" 
                              style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: 'var(--admin-gold)', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => { setChangingRoleAdmin(a); setAdminRoleForm({ role: a.role || 'Admin' }); }} 
                              disabled={a.email === 'admin@vedaglobal.com'}
                              className="admin-btn" 
                              style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: 'var(--admin-emerald)', color: 'white', cursor: isSystemAdmin ? 'not-allowed' : 'pointer', borderRadius: '6px', opacity: a.email === 'admin@vedaglobal.com' ? 0.5 : 1 }}
                              title={a.email === 'admin@vedaglobal.com' ? 'Cannot change role of default system admin' : 'Change role'}
                            >
                              🏷️ Role
                            </button>
                            <button 
                              onClick={() => { setResetPasswordAdmin(a); setNewPassword(''); }} 
                              className="admin-btn" 
                              style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer', borderRadius: '6px' }}
                            >
                              🔑 Reset
                            </button>
                            <button 
                              onClick={() => handleAdminDelete(a._id)} 
                              disabled={isSystemAdmin} 
                              className="admin-btn" 
                              style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white', cursor: isSystemAdmin ? 'not-allowed' : 'pointer', borderRadius: '6px', opacity: isSystemAdmin ? 0.5 : 1 }}
                              title={isSystemAdmin ? 'System admin cannot be deleted' : 'Delete admin'}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Category CRUD Modal */}
      {categoryModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>{categoryModal.editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="admin-modal-close" onClick={() => {
                setCategoryModal({ open: false, editing: null, name: '', image: '', displayOrder: 0 });
                setIsCategorySubmitted(false);
                setCategoryErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleCategorySubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="cat-name" className="admin-form-label">Category Name *</label>
                  <AnimatePresence>
                    {isCategorySubmitted && categoryErrors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {categoryErrors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="cat-name"
                    name="name"
                    className="admin-form-input" 
                    value={categoryModal.name} 
                    onChange={e => {
                      setCategoryModal({ ...categoryModal, name: e.target.value });
                      if (isCategorySubmitted) {
                        setCategoryErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isCategorySubmitted, categoryErrors, 'name', categoryModal.name)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="cat-image" className="admin-form-label">Image URL *</label>
                  <AnimatePresence>
                    {isCategorySubmitted && categoryErrors.image && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {categoryErrors.image}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="url" 
                    id="cat-image"
                    name="image"
                    className="admin-form-input" 
                    value={categoryModal.image} 
                    onChange={e => {
                      setCategoryModal({ ...categoryModal, image: e.target.value });
                      if (isCategorySubmitted) {
                        setCategoryErrors(prev => {
                          const next = { ...prev };
                          delete next.image;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isCategorySubmitted, categoryErrors, 'image', categoryModal.image)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="cat-displayOrder" className="admin-form-label">Display Order *</label>
                  <AnimatePresence>
                    {isCategorySubmitted && categoryErrors.displayOrder && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {categoryErrors.displayOrder}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="number" 
                    id="cat-displayOrder"
                    name="displayOrder"
                    className="admin-form-input" 
                    value={categoryModal.displayOrder} 
                    onChange={e => {
                      setCategoryModal({ ...categoryModal, displayOrder: e.target.value });
                      if (isCategorySubmitted) {
                        setCategoryErrors(prev => {
                          const next = { ...prev };
                          delete next.displayOrder;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isCategorySubmitted, categoryErrors, 'displayOrder', categoryModal.displayOrder)}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setCategoryModal({ open: false, editing: null, name: '', image: '', displayOrder: 0 });
                  setIsCategorySubmitted(false);
                  setCategoryErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>{faqModal.editing ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button className="admin-modal-close" onClick={() => {
                setFaqModal({ open: false, editing: null, question: '', answer: '' });
                setIsFaqSubmitted(false);
                setFaqErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleFAQSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="faq-question" className="admin-form-label">Question *</label>
                  <AnimatePresence>
                    {isFaqSubmitted && faqErrors.question && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {faqErrors.question}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="faq-question"
                    name="question"
                    className="admin-form-input" 
                    value={faqModal.question} 
                    onChange={e => {
                      setFaqModal({ ...faqModal, question: e.target.value });
                      if (isFaqSubmitted) {
                        setFaqErrors(prev => {
                          const next = { ...prev };
                          delete next.question;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isFaqSubmitted, faqErrors, 'question', faqModal.question)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="faq-answer" className="admin-form-label">Answer *</label>
                  <AnimatePresence>
                    {isFaqSubmitted && faqErrors.answer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {faqErrors.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea 
                    id="faq-answer"
                    name="answer"
                    rows="4" 
                    className="admin-form-input" 
                    value={faqModal.answer} 
                    onChange={e => {
                      setFaqModal({ ...faqModal, answer: e.target.value });
                      if (isFaqSubmitted) {
                        setFaqErrors(prev => {
                          const next = { ...prev };
                          delete next.answer;
                          return next;
                        });
                      }
                    }}
                    style={getAdminInputStyle(isFaqSubmitted, faqErrors, 'answer', faqModal.answer)}
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setFaqModal({ open: false, editing: null, question: '', answer: '' });
                  setIsFaqSubmitted(false);
                  setFaqErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner CRUD Modal */}
      {bannerModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>{bannerModal.editing ? 'Edit Slider Banner' : 'Add Slider Banner'}</h3>
              <button className="admin-modal-close" onClick={() => {
                setBannerModal({ open: false, editing: null, desktopImage: '', mobileImage: '', title: '', subtitle: '', linkButton: '', active: true });
                setIsBannerSubmitted(false);
                setBannerErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleBannerSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="banner-desktopImage" className="admin-form-label">Desktop Image URL *</label>
                  <AnimatePresence>
                    {isBannerSubmitted && bannerErrors.desktopImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {bannerErrors.desktopImage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="url" 
                    id="banner-desktopImage"
                    name="desktopImage"
                    className="admin-form-input" 
                    value={bannerModal.desktopImage} 
                    onChange={e => {
                      setBannerModal({ ...bannerModal, desktopImage: e.target.value });
                      if (isBannerSubmitted) {
                        setBannerErrors(prev => {
                          const next = { ...prev };
                          delete next.desktopImage;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isBannerSubmitted, bannerErrors, 'desktopImage', bannerModal.desktopImage)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="banner-mobileImage" className="admin-form-label">Mobile Image URL *</label>
                  <AnimatePresence>
                    {isBannerSubmitted && bannerErrors.mobileImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {bannerErrors.mobileImage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="url" 
                    id="banner-mobileImage"
                    name="mobileImage"
                    className="admin-form-input" 
                    value={bannerModal.mobileImage} 
                    onChange={e => {
                      setBannerModal({ ...bannerModal, mobileImage: e.target.value });
                      if (isBannerSubmitted) {
                        setBannerErrors(prev => {
                          const next = { ...prev };
                          delete next.mobileImage;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isBannerSubmitted, bannerErrors, 'mobileImage', bannerModal.mobileImage)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="banner-title" className="admin-form-label">Title</label>
                  <input type="text" id="banner-title" name="title" className="admin-form-input" value={bannerModal.title} onChange={e => setBannerModal({ ...bannerModal, title: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="banner-subtitle" className="admin-form-label">Subtitle</label>
                  <input type="text" id="banner-subtitle" name="subtitle" className="admin-form-input" value={bannerModal.subtitle} onChange={e => setBannerModal({ ...bannerModal, subtitle: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="banner-linkButton" className="admin-form-label">Button Link / Label</label>
                  <input type="text" id="banner-linkButton" name="linkButton" className="admin-form-input" value={bannerModal.linkButton} onChange={e => setBannerModal({ ...bannerModal, linkButton: e.target.value })} />
                </div>
                <div className="admin-checkbox-group" style={{ marginTop: '15px' }}>
                  <input type="checkbox" id="bannerActive" name="active" checked={bannerModal.active} onChange={e => setBannerModal({ ...bannerModal, active: e.target.checked })} />
                  <label htmlFor="bannerActive">Active Banner</label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setBannerModal({ open: false, editing: null, desktopImage: '', mobileImage: '', title: '', subtitle: '', linkButton: '', active: true });
                  setIsBannerSubmitted(false);
                  setBannerErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial CRUD Modal */}
      {testimonialModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>{testimonialModal.editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button className="admin-modal-close" onClick={() => {
                setTestimonialModal({ open: false, editing: null, customerName: '', countryCity: '', rating: 5, reviewText: '', productName: '', showOnHomepage: true });
                setIsTestimonialSubmitted(false);
                setTestimonialErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleTestimonialSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="test-customerName" className="admin-form-label">Customer Name *</label>
                  <AnimatePresence>
                    {isTestimonialSubmitted && testimonialErrors.customerName && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {testimonialErrors.customerName}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="test-customerName"
                    name="customerName"
                    className="admin-form-input" 
                    value={testimonialModal.customerName} 
                    onChange={e => {
                      setTestimonialModal({ ...testimonialModal, customerName: e.target.value });
                      if (isTestimonialSubmitted) {
                        setTestimonialErrors(prev => {
                          const next = { ...prev };
                          delete next.customerName;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isTestimonialSubmitted, testimonialErrors, 'customerName', testimonialModal.customerName)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="test-countryCity" className="admin-form-label">Country / City</label>
                  <input type="text" id="test-countryCity" name="countryCity" className="admin-form-input" value={testimonialModal.countryCity} onChange={e => setTestimonialModal({ ...testimonialModal, countryCity: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="test-rating" className="admin-form-label">Rating (1-5) *</label>
                  <AnimatePresence>
                    {isTestimonialSubmitted && testimonialErrors.rating && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {testimonialErrors.rating}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    id="test-rating"
                    name="rating"
                    className="admin-form-input" 
                    value={testimonialModal.rating} 
                    onChange={e => {
                      setTestimonialModal({ ...testimonialModal, rating: e.target.value });
                      if (isTestimonialSubmitted) {
                        setTestimonialErrors(prev => {
                          const next = { ...prev };
                          delete next.rating;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isTestimonialSubmitted, testimonialErrors, 'rating', testimonialModal.rating)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="test-reviewText" className="admin-form-label">Review text *</label>
                  <AnimatePresence>
                    {isTestimonialSubmitted && testimonialErrors.reviewText && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {testimonialErrors.reviewText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea 
                    id="test-reviewText"
                    name="reviewText"
                    rows="4" 
                    className="admin-form-input" 
                    value={testimonialModal.reviewText} 
                    onChange={e => {
                      setTestimonialModal({ ...testimonialModal, reviewText: e.target.value });
                      if (isTestimonialSubmitted) {
                        setTestimonialErrors(prev => {
                          const next = { ...prev };
                          delete next.reviewText;
                          return next;
                        });
                      }
                    }}
                    style={getAdminInputStyle(isTestimonialSubmitted, testimonialErrors, 'reviewText', testimonialModal.reviewText)}
                  ></textarea>
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="test-productName" className="admin-form-label">Product Name</label>
                  <input type="text" id="test-productName" name="productName" className="admin-form-input" value={testimonialModal.productName} onChange={e => setTestimonialModal({ ...testimonialModal, productName: e.target.value })} />
                </div>
                <div className="admin-checkbox-group" style={{ marginTop: '15px' }}>
                  <input type="checkbox" id="testShow" name="showOnHomepage" checked={testimonialModal.showOnHomepage} onChange={e => setTestimonialModal({ ...testimonialModal, showOnHomepage: e.target.checked })} />
                  <label htmlFor="testShow">Show on Homepage</label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setTestimonialModal({ open: false, editing: null, customerName: '', countryCity: '', rating: 5, reviewText: '', productName: '', showOnHomepage: true });
                  setIsTestimonialSubmitted(false);
                  setTestimonialErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Account Modal */}
      {adminModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>Register New Administrator</h3>
              <button className="admin-modal-close" onClick={() => {
                setAdminModal({ open: false, email: '', password: '', name: '', phone: '', role: 'Admin' });
                setIsAdminSubmitted(false);
                setAdminErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleAdminSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="reg-admin-name" className="admin-form-label">Admin Name *</label>
                  <AnimatePresence>
                    {isAdminSubmitted && adminErrors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {adminErrors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="reg-admin-name"
                    name="name"
                    className="admin-form-input" 
                    value={adminModal.name || ''} 
                    onChange={e => {
                      setAdminModal({ ...adminModal, name: e.target.value });
                      if (isAdminSubmitted) {
                        setAdminErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isAdminSubmitted, adminErrors, 'name', adminModal.name)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="reg-admin-email" className="admin-form-label">Email Address *</label>
                  <AnimatePresence>
                    {isAdminSubmitted && adminErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {adminErrors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="email" 
                    id="reg-admin-email"
                    name="email"
                    className="admin-form-input" 
                    value={adminModal.email || ''} 
                    onChange={e => {
                      setAdminModal({ ...adminModal, email: e.target.value });
                      if (isAdminSubmitted) {
                        setAdminErrors(prev => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isAdminSubmitted, adminErrors, 'email', adminModal.email)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="reg-admin-phone" className="admin-form-label">Phone</label>
                  <input type="text" id="reg-admin-phone" name="phone" className="admin-form-input" value={adminModal.phone || ''} onChange={e => setAdminModal({ ...adminModal, phone: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="reg-admin-password" className="admin-form-label">Password *</label>
                  <AnimatePresence>
                    {isAdminSubmitted && adminErrors.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {adminErrors.password}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="password" 
                    id="reg-admin-password"
                    name="password"
                    className="admin-form-input" 
                    value={adminModal.password || ''} 
                    onChange={e => {
                      setAdminModal({ ...adminModal, password: e.target.value });
                      if (isAdminSubmitted) {
                        setAdminErrors(prev => {
                          const next = { ...prev };
                          delete next.password;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isAdminSubmitted, adminErrors, 'password', adminModal.password)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="reg-admin-role" className="admin-form-label">Role</label>
                  <select id="reg-admin-role" name="role" className="admin-form-input" value={adminModal.role || 'Admin'} onChange={e => setAdminModal({ ...adminModal, role: e.target.value })}>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setAdminModal({ open: false, email: '', password: '', name: '', phone: '', role: 'Admin' });
                  setIsAdminSubmitted(false);
                  setAdminErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer View Details Modal */}
      {selectedCustomer && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>Customer Profile Details</h3>
              <button className="admin-modal-close" onClick={() => setSelectedCustomer(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedCustomer.address || 'N/A'}</p>
                <p><strong>Pincode:</strong> {selectedCustomer.pincode || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedCustomer.isBlocked ? 'Blocked' : 'Active'}</p>
                <p><strong>Registered Date:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Edit Modal */}
      {editingCustomer && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>Edit Customer Details</h3>
              <button className="admin-modal-close" onClick={() => {
                setEditingCustomer(null);
                setIsCustomerSubmitted(false);
                setCustomerErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleCustomerEditSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="edit-cust-name" className="admin-form-label">Name *</label>
                  <AnimatePresence>
                    {isCustomerSubmitted && customerErrors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {customerErrors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="edit-cust-name"
                    name="name"
                    className="admin-form-input" 
                    value={customerForm.name || ''} 
                    onChange={e => {
                      setCustomerForm({ ...customerForm, name: e.target.value });
                      if (isCustomerSubmitted) {
                        setCustomerErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isCustomerSubmitted, customerErrors, 'name', customerForm.name)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-cust-email" className="admin-form-label">Email Address *</label>
                  <AnimatePresence>
                    {isCustomerSubmitted && customerErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {customerErrors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="email" 
                    id="edit-cust-email"
                    name="email"
                    className="admin-form-input" 
                    value={customerForm.email || ''} 
                    onChange={e => {
                      setCustomerForm({ ...customerForm, email: e.target.value });
                      if (isCustomerSubmitted) {
                        setCustomerErrors(prev => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isCustomerSubmitted, customerErrors, 'email', customerForm.email)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-cust-phone" className="admin-form-label">Phone</label>
                  <input 
                    type="text" 
                    id="edit-cust-phone"
                    name="phone"
                    className="admin-form-input" 
                    value={customerForm.phone || ''} 
                    onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-cust-address" className="admin-form-label">Address</label>
                  <input 
                    type="text" 
                    id="edit-cust-address"
                    name="address"
                    className="admin-form-input" 
                    value={customerForm.address || ''} 
                    onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} 
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-cust-pincode" className="admin-form-label">Pincode</label>
                  <input 
                    type="text" 
                    id="edit-cust-pincode"
                    name="pincode"
                    className="admin-form-input" 
                    value={customerForm.pincode || ''} 
                    onChange={e => setCustomerForm({ ...customerForm, pincode: e.target.value })} 
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setEditingCustomer(null);
                  setIsCustomerSubmitted(false);
                  setCustomerErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingAdmin && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>Edit Admin Account</h3>
              <button className="admin-modal-close" onClick={() => {
                setEditingAdmin(null);
                setIsAdminEditSubmitted(false);
                setAdminEditErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleAdminEditSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="edit-admin-name" className="admin-form-label">Admin Name *</label>
                  <AnimatePresence>
                    {isAdminEditSubmitted && adminEditErrors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {adminEditErrors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="edit-admin-name"
                    name="name"
                    className="admin-form-input" 
                    value={adminEditForm.name} 
                    onChange={e => {
                      setAdminEditForm({ ...adminEditForm, name: e.target.value });
                      if (isAdminEditSubmitted) {
                        setAdminEditErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isAdminEditSubmitted, adminEditErrors, 'name', adminEditForm.name)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-admin-email" className="admin-form-label">Email Address *</label>
                  <AnimatePresence>
                    {isAdminEditSubmitted && adminEditErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {adminEditErrors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="email" 
                    id="edit-admin-email"
                    name="email"
                    className="admin-form-input" 
                    value={adminEditForm.email} 
                    onChange={e => {
                      setAdminEditForm({ ...adminEditForm, email: e.target.value });
                      if (isAdminEditSubmitted) {
                        setAdminEditErrors(prev => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isAdminEditSubmitted, adminEditErrors, 'email', adminEditForm.email)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-admin-phone" className="admin-form-label">Phone Number</label>
                  <input type="text" id="edit-admin-phone" name="phone" className="admin-form-input" value={adminEditForm.phone} onChange={e => setAdminEditForm({ ...adminEditForm, phone: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="edit-admin-avatar" className="admin-form-label">Avatar Initials (1 Char)</label>
                  <input type="text" id="edit-admin-avatar" name="avatar" maxLength="1" className="admin-form-input" required value={adminEditForm.avatar} onChange={e => setAdminEditForm({ ...adminEditForm, avatar: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setEditingAdmin(null);
                  setIsAdminEditSubmitted(false);
                  setAdminEditErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Role Change Modal */}
      {changingRoleAdmin && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3>Change Admin Role</h3>
              <button className="admin-modal-close" onClick={() => setChangingRoleAdmin(null)}>×</button>
            </div>
            <form onSubmit={handleRoleChangeSubmit}>
              <div className="admin-modal-body">
                <p style={{ marginBottom: '15px' }}>Modify role for <strong>{changingRoleAdmin.email}</strong></p>
                <div className="admin-form-group">
                  <label htmlFor="edit-admin-role" className="admin-form-label">Role</label>
                  <select id="edit-admin-role" name="role" className="admin-form-input" value={adminRoleForm.role} onChange={e => setAdminRoleForm({ role: e.target.value })}>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setChangingRoleAdmin(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Update Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Password Reset Modal */}
      {resetPasswordAdmin && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h3>Reset Password</h3>
              <button className="admin-modal-close" onClick={() => {
                setResetPasswordAdmin(null);
                setIsPasswordResetSubmitted(false);
                setPasswordResetErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleResetPasswordSubmit} noValidate>
              <div className="admin-modal-body">
                <p style={{ marginBottom: '15px' }}>Set new password for <strong>{resetPasswordAdmin.email}</strong></p>
                <div className="admin-form-group">
                  <label htmlFor="reset-admin-password" className="admin-form-label">New Password *</label>
                  <AnimatePresence>
                    {isPasswordResetSubmitted && passwordResetErrors.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {passwordResetErrors.password}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="password" 
                    id="reset-admin-password"
                    name="password"
                    className="admin-form-input" 
                    value={newPassword} 
                    onChange={e => {
                      setNewPassword(e.target.value);
                      if (isPasswordResetSubmitted) {
                        setPasswordResetErrors(prev => {
                          const next = { ...prev };
                          delete next.password;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isPasswordResetSubmitted, passwordResetErrors, 'password', newPassword)}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setResetPasswordAdmin(null);
                  setIsPasswordResetSubmitted(false);
                  setPasswordResetErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Info Modal */}
      {selectedOrderDetails && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <h3>Order Info Details (#{selectedOrderDetails._id.slice(-8)})</h3>
              <button className="admin-modal-close" onClick={() => setSelectedOrderDetails(null)}>×</button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Customer Contact</h4>
                  <p style={{ margin: '2px 0' }}><strong>Name:</strong> {selectedOrderDetails.customerName}</p>
                  <p style={{ margin: '2px 0' }}><strong>Email:</strong> {selectedOrderDetails.email}</p>
                  <p style={{ margin: '2px 0' }}><strong>Phone:</strong> {selectedOrderDetails.phone}</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Shipping Address</h4>
                  <p style={{ margin: '2px 0' }}>{selectedOrderDetails.address}</p>
                  <p style={{ margin: '2px 0' }}><strong>Pincode:</strong> {selectedOrderDetails.pincode}</p>
                </div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Ordered Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrderDetails.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                      <span>{it.productName} (x{it.quantity})</span>
                      <strong>₹{it.price * it.quantity}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <span>Payment Mode: <strong>{selectedOrderDetails.paymentMode}</strong></span>
                <span style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>Total Amount: <strong>₹{selectedOrderDetails.totalAmount}</strong></span>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-primary" onClick={() => setSelectedOrderDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="admin-modal-overlay" style={{ zIndex: 11000 }}>
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>Edit Admin Profile</h3>
              <button className="admin-modal-close" onClick={() => {
                setIsProfileModalOpen(false);
                setIsProfileSubmitted(false);
                setProfileErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="admin-profile-name" className="admin-form-label">Full Name *</label>
                  <AnimatePresence>
                    {isProfileSubmitted && profileErrors.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {profileErrors.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="admin-profile-name"
                    name="name"
                    className="admin-form-input" 
                    value={profileForm.name} 
                    onChange={e => {
                      setProfileForm({ ...profileForm, name: e.target.value });
                      if (isProfileSubmitted) {
                        setProfileErrors(prev => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isProfileSubmitted, profileErrors, 'name', profileForm.name)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="admin-profile-email" className="admin-form-label">Email Address *</label>
                  <AnimatePresence>
                    {isProfileSubmitted && profileErrors.email && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {profileErrors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="email" 
                    id="admin-profile-email"
                    name="email"
                    className="admin-form-input" 
                    value={profileForm.email} 
                    onChange={e => {
                      setProfileForm({ ...profileForm, email: e.target.value });
                      if (isProfileSubmitted) {
                        setProfileErrors(prev => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isProfileSubmitted, profileErrors, 'email', profileForm.email)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="admin-profile-phone" className="admin-form-label">Phone Number</label>
                  <input type="tel" id="admin-profile-phone" name="phone" className="admin-form-input" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="admin-profile-avatar" className="admin-form-label">Avatar Initial (1 Letter) *</label>
                  <input type="text" id="admin-profile-avatar" name="avatar" maxLength="1" className="admin-form-input" required value={profileForm.avatar} onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value.toUpperCase() })} style={{ width: '60px', textAlign: 'center' }} />
                </div>
                <div className="admin-form-group" style={{ marginTop: '10px' }}>
                  <label htmlFor="admin-profile-password" className="admin-form-label">New Password (optional)</label>
                  <AnimatePresence>
                    {isProfileSubmitted && profileErrors.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="validation-error-text"
                      >
                        ⚠️ {profileErrors.password}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="password" 
                    id="admin-profile-password"
                    name="password"
                    placeholder="Leave empty to keep current" 
                    className="admin-form-input" 
                    value={profileForm.password} 
                    onChange={e => {
                      setProfileForm({ ...profileForm, password: e.target.value });
                      if (isProfileSubmitted) {
                        setProfileErrors(prev => {
                          const next = { ...prev };
                          delete next.password;
                          return next;
                        });
                      }
                    }} 
                    style={getAdminInputStyle(isProfileSubmitted, profileErrors, 'password', profileForm.password)}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsProfileSubmitted(false);
                  setProfileErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog CRUD Modal */}
      {blogModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box" style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h3>{blogModal.editing ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
              <button className="admin-modal-close" onClick={() => {
                setBlogModal({ open: false, editing: null, title: '', image: '', shortDescription: '', content: '', author: '', category: '', publishedDate: '', status: 'Published', isVisible: true, isFeatured: false });
                setIsBlogSubmitted(false);
                setBlogErrors({});
              }}>×</button>
            </div>
            <form onSubmit={handleBlogSubmit} noValidate>
              <div className="admin-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div className="admin-form-group">
                  <label htmlFor="blog-title" className="admin-form-label">Title *</label>
                  <AnimatePresence>
                    {isBlogSubmitted && blogErrors.title && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="validation-error-text">
                        ⚠️ {blogErrors.title}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input 
                    type="text" 
                    id="blog-title"
                    name="title"
                    className="admin-form-input" 
                    value={blogModal.title} 
                    onChange={e => {
                      setBlogModal({ ...blogModal, title: e.target.value });
                      if (isBlogSubmitted) {
                        setBlogErrors(prev => { const n = { ...prev }; delete n.title; return n; });
                      }
                    }}
                    style={getAdminInputStyle(isBlogSubmitted, blogErrors, 'title', blogModal.title)}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="blog-image" className="admin-form-label">Blog Image URL / Path</label>
                  <input 
                    type="text" 
                    id="blog-image"
                    name="image"
                    className="admin-form-input" 
                    value={blogModal.image} 
                    onChange={e => setBlogModal({ ...blogModal, image: e.target.value })}
                    placeholder="e.g. /uploads/image.png or external URL"
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="admin-form-group" style={{ flex: 1 }}>
                    <label htmlFor="blog-author" className="admin-form-label">Author</label>
                    <input 
                      type="text" 
                      id="blog-author"
                      name="author"
                      className="admin-form-input" 
                      value={blogModal.author} 
                      onChange={e => setBlogModal({ ...blogModal, author: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ flex: 1 }}>
                    <label htmlFor="blog-category" className="admin-form-label">Category</label>
                    <input 
                      type="text" 
                      id="blog-category"
                      name="category"
                      className="admin-form-input" 
                      value={blogModal.category} 
                      onChange={e => setBlogModal({ ...blogModal, category: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="admin-form-group" style={{ flex: 1 }}>
                    <label htmlFor="blog-published-date" className="admin-form-label">Published Date</label>
                    <input 
                      type="date" 
                      id="blog-published-date"
                      name="publishedDate"
                      className="admin-form-input" 
                      value={blogModal.publishedDate} 
                      onChange={e => setBlogModal({ ...blogModal, publishedDate: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ flex: 1 }}>
                    <label htmlFor="blog-status" className="admin-form-label">Status</label>
                    <select 
                      id="blog-status"
                      name="status"
                      className="admin-form-input" 
                      value={blogModal.status} 
                      onChange={e => setBlogModal({ ...blogModal, status: e.target.value })}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '30px', margin: '10px 0' }}>
                  <label htmlFor="blog-is-visible" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input 
                      type="checkbox" 
                      id="blog-is-visible"
                      name="isVisible"
                      checked={blogModal.isVisible} 
                      onChange={e => setBlogModal({ ...blogModal, isVisible: e.target.checked })}
                    />
                    Show on Website (Visibility)
                  </label>
                  <label htmlFor="blog-is-featured" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input 
                      type="checkbox" 
                      id="blog-is-featured"
                      name="isFeatured"
                      checked={blogModal.isFeatured} 
                      onChange={e => setBlogModal({ ...blogModal, isFeatured: e.target.checked })}
                    />
                    Featured Blog
                  </label>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="blog-short-description" className="admin-form-label">Short Description *</label>
                  <AnimatePresence>
                    {isBlogSubmitted && blogErrors.shortDescription && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="validation-error-text">
                        ⚠️ {blogErrors.shortDescription}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea 
                    rows="3" 
                    id="blog-short-description"
                    name="shortDescription"
                    className="admin-form-input" 
                    value={blogModal.shortDescription} 
                    onChange={e => {
                      setBlogModal({ ...blogModal, shortDescription: e.target.value });
                      if (isBlogSubmitted) {
                        setBlogErrors(prev => { const n = { ...prev }; delete n.shortDescription; return n; });
                      }
                    }}
                    style={getAdminInputStyle(isBlogSubmitted, blogErrors, 'shortDescription', blogModal.shortDescription)}
                  ></textarea>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="blog-content" className="admin-form-label">Full Content *</label>
                  <AnimatePresence>
                    {isBlogSubmitted && blogErrors.content && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="validation-error-text">
                        ⚠️ {blogErrors.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea 
                    rows="10" 
                    id="blog-content"
                    name="content"
                    className="admin-form-input" 
                    value={blogModal.content} 
                    onChange={e => {
                      setBlogModal({ ...blogModal, content: e.target.value });
                      if (isBlogSubmitted) {
                        setBlogErrors(prev => { const n = { ...prev }; delete n.content; return n; });
                      }
                    }}
                    style={getAdminInputStyle(isBlogSubmitted, blogErrors, 'content', blogModal.content)}
                  ></textarea>
                </div>

              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => {
                  setBlogModal({ open: false, editing: null, title: '', image: '', shortDescription: '', content: '', author: '', category: '', publishedDate: '', status: 'Published', isVisible: true, isFeatured: false });
                  setIsBlogSubmitted(false);
                  setBlogErrors({});
                }}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        onSubmit={handleProductSubmit}
        categories={categories}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
