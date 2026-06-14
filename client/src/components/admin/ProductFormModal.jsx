import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductFormModal = ({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  onSubmit,
  categories = []
}) => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!productForm.name?.trim()) {
      errs.name = 'Product Name is required';
    }
    if (productForm.retailPrice === '' || productForm.retailPrice === undefined || productForm.retailPrice === null) {
      errs.retailPrice = 'Retail Price is required';
    }
    if (productForm.wholesalePrice === '' || productForm.wholesalePrice === undefined || productForm.wholesalePrice === null) {
      errs.wholesalePrice = 'Wholesale Price is required';
    }
    if (productForm.stockQuantity === '' || productForm.stockQuantity === undefined || productForm.stockQuantity === null) {
      errs.stockQuantity = 'Stock Quantity is required';
    }
    if (!productForm.image?.trim()) {
      errs.image = 'Product Image URL is required';
    } else if (!productForm.image.trim().startsWith('http') && !productForm.image.trim().startsWith('/uploads')) {
      errs.image = 'Please enter a valid image URL';
    }
    if (!productForm.shortDescription?.trim()) {
      errs.shortDescription = 'Short Description is required';
    }
    if (!productForm.description?.trim()) {
      errs.description = 'Description is required';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validate()) {
      onSubmit(e);
    }
  };

  const getInputStyle = (field, value, extraStyles = {}) => {
    let base = { ...extraStyles };
    if (!isSubmitted) return base;
    if (formErrors[field]) {
      return {
        ...base,
        border: '2px solid #DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.04)',
      };
    }
    if (value !== '' && value !== undefined && value !== null) {
      return {
        ...base,
        border: '2px solid #16A34A',
      };
    }
    return base;
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-box">
        <div className="admin-modal-header">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="admin-modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-modal-body">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-name" className="admin-form-label">Product Name *</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="text"
                  id="pform-name"
                  name="name"
                  className="admin-form-input"
                  value={productForm.name}
                  onChange={e => {
                    setProductForm({ ...productForm, name: e.target.value });
                    if (isSubmitted) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.name;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. 1121 Basmati Rice"
                  style={getInputStyle('name', productForm.name)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-category" className="admin-form-label">Category</label>
                <select
                  id="pform-category"
                  name="category"
                  className="admin-form-input"
                  value={productForm.category}
                  onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                >
                  {categories.length > 0 ? (
                    categories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)
                  ) : (
                    <>
                      <option value="Grains">Grains</option>
                      <option value="Spices">Spices</option>
                      <option value="Oilseeds">Oilseeds</option>
                      <option value="Pulses">Pulses</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-retailPrice" className="admin-form-label">Retail Price (INR) *</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.retailPrice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.retailPrice}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="number"
                  id="pform-retailPrice"
                  name="retailPrice"
                  className="admin-form-input"
                  value={productForm.retailPrice || productForm.price || ''}
                  onChange={e => {
                    setProductForm({ ...productForm, retailPrice: e.target.value, price: e.target.value });
                    if (isSubmitted) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.retailPrice;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. 85"
                  style={getInputStyle('retailPrice', productForm.retailPrice || productForm.price)}
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-wholesalePrice" className="admin-form-label">Wholesale Price (INR) *</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.wholesalePrice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.wholesalePrice}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="number"
                  id="pform-wholesalePrice"
                  name="wholesalePrice"
                  className="admin-form-input"
                  value={productForm.wholesalePrice}
                  onChange={e => {
                    setProductForm({ ...productForm, wholesalePrice: e.target.value });
                    if (isSubmitted) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.wholesalePrice;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. 70"
                  style={getInputStyle('wholesalePrice', productForm.wholesalePrice)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-stockStatus" className="admin-form-label">Stock Status</label>
                <select
                  id="pform-stockStatus"
                  name="stockStatus"
                  className="admin-form-input"
                  value={productForm.stockStatus}
                  onChange={e => setProductForm({ ...productForm, stockStatus: e.target.value })}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-stockQuantity" className="admin-form-label">Stock Quantity *</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.stockQuantity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.stockQuantity}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="number"
                  id="pform-stockQuantity"
                  name="stockQuantity"
                  className="admin-form-input"
                  value={productForm.stockQuantity}
                  onChange={e => {
                    setProductForm({ ...productForm, stockQuantity: e.target.value });
                    if (isSubmitted) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.stockQuantity;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. 500"
                  style={getInputStyle('stockQuantity', productForm.stockQuantity)}
                />
              </div>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="pform-image" className="admin-form-label">Product Image URL *</label>
              <AnimatePresence>
                {isSubmitted && formErrors.image && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="validation-error-text"
                  >
                    ⚠️ {formErrors.image}
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                type="url"
                id="pform-image"
                name="image"
                className="admin-form-input"
                value={productForm.image}
                onChange={e => {
                  setProductForm({ ...productForm, image: e.target.value });
                  if (isSubmitted) {
                    setFormErrors(prev => {
                      const next = { ...prev };
                      delete next.image;
                      return next;
                    });
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                style={getInputStyle('image', productForm.image)}
              />
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="pform-shortDescription" className="admin-form-label">Short Description *</label>
              <AnimatePresence>
                {isSubmitted && formErrors.shortDescription && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="validation-error-text"
                  >
                    ⚠️ {formErrors.shortDescription}
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                type="text"
                id="pform-shortDescription"
                name="shortDescription"
                className="admin-form-input"
                value={productForm.shortDescription}
                onChange={e => {
                  setProductForm({ ...productForm, shortDescription: e.target.value });
                  if (isSubmitted) {
                    setFormErrors(prev => {
                      const next = { ...prev };
                      delete next.shortDescription;
                      return next;
                    });
                  }
                }}
                placeholder="Brief single-line summary of the product"
                style={getInputStyle('shortDescription', productForm.shortDescription)}
              />
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="pform-description" className="admin-form-label">Description *</label>
              <AnimatePresence>
                {isSubmitted && formErrors.description && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="validation-error-text"
                  >
                    ⚠️ {formErrors.description}
                  </motion.div>
                )}
              </AnimatePresence>
              <textarea
                id="pform-description"
                name="description"
                className="admin-form-input"
                rows="4"
                value={productForm.description}
                onChange={e => {
                  setProductForm({ ...productForm, description: e.target.value });
                  if (isSubmitted) {
                    setFormErrors(prev => {
                      const next = { ...prev };
                      delete next.description;
                      return next;
                    });
                  }
                }}
                placeholder="Full details of the product including origin, qualities, etc."
                style={getInputStyle('description', productForm.description)}
              ></textarea>
            </div>

            <div className="admin-form-group full-width">
              <label htmlFor="pform-specifications" className="admin-form-label">Specifications (Format: Key:Value, Key2:Value2)</label>
              <input
                type="text"
                id="pform-specifications"
                name="specifications"
                className="admin-form-input"
                value={productForm.specifications}
                onChange={e => setProductForm({ ...productForm, specifications: e.target.value })}
                placeholder="e.g. Moisture:12%, Purity:99%, Average Length:8.35mm"
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-benefits" className="admin-form-label">Benefits (comma-separated)</label>
                <input
                  type="text"
                  id="pform-benefits"
                  name="benefits"
                  className="admin-form-input"
                  value={productForm.benefits}
                  onChange={e => setProductForm({ ...productForm, benefits: e.target.value })}
                  placeholder="e.g. Long Grain, Aromatic, Nutrient Rich"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-packagingOptions" className="admin-form-label">Packaging Options (comma-separated)</label>
                <input
                  type="text"
                  id="pform-packagingOptions"
                  name="packagingOptions"
                  className="admin-form-input"
                  value={productForm.packagingOptions}
                  onChange={e => setProductForm({ ...productForm, packagingOptions: e.target.value })}
                  placeholder="e.g. 25kg PP Bag, 50kg Jute Bag, Custom Packaging"
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-units" className="admin-form-label">Available Units</label>
                <select
                  id="pform-units"
                  name="units"
                  className="admin-form-input"
                  value={productForm.units || 'Kg'}
                  onChange={e => setProductForm({ ...productForm, units: e.target.value })}
                >
                  <option value="Gram">Gram</option>
                  <option value="Kg">Kg</option>
                  <option value="Quintal">Quintal</option>
                  <option value="Ton">Ton</option>
                  <option value="Packet">Packet</option>
                  <option value="Box">Box</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Liter">Liter</option>
                  <option value="Piece">Piece</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-packSizes" className="admin-form-label">Pack Size</label>
                <select
                  id="pform-packSizes"
                  name="packSizes"
                  className="admin-form-input"
                  value={productForm.packSizes || '1kg'}
                  onChange={e => setProductForm({ ...productForm, packSizes: e.target.value })}
                >
                  <option value="100g">100g</option>
                  <option value="250g">250g</option>
                  <option value="500g">500g</option>
                  <option value="1kg">1kg</option>
                  <option value="5kg">5kg</option>
                  <option value="10kg">10kg</option>
                  <option value="25kg">25kg</option>
                  <option value="50kg">50kg</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="pform-minOrderQuantity" className="admin-form-label">Minimum Order Quantity</label>
                <input
                  type="number"
                  id="pform-minOrderQuantity"
                  name="minOrderQuantity"
                  className="admin-form-input"
                  value={productForm.minOrderQuantity || 1}
                  onChange={e => setProductForm({ ...productForm, minOrderQuantity: e.target.value })}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="pform-visibility" className="admin-form-label">Product Visibility</label>
                <select
                  id="pform-visibility"
                  name="visibility"
                  className="admin-form-input"
                  value={productForm.visibility || 'Both'}
                  onChange={e => setProductForm({ ...productForm, visibility: e.target.value })}
                >
                  <option value="B2C">B2C Only</option>
                  <option value="B2B">B2B Only</option>
                  <option value="Both">Both (B2C & B2B)</option>
                </select>
              </div>
            </div>

            <div className="admin-checkbox-row">
              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                />
                <label htmlFor="featured">Mark as Featured</label>
              </div>
              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={productForm.bestseller}
                  onChange={e => setProductForm({ ...productForm, bestseller: e.target.checked })}
                />
                <label htmlFor="bestseller">Mark as Bestseller</label>
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
