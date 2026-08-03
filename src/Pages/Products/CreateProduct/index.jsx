// src/Pages/Products/CreateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';

export default function CreateProduct() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [product, setProduct] = useState({
    title: '',
    slug: '',
    description: '',
    inDetailReview: '',
    brandId: '',
    categoryId: '', // تغییر به تک انتخابی
    tags: [],
    isPublished: true,
    inStock: true,
  });

  const [variant, setVariant] = useState({
    price: 0,
    discountPercent: 0,
    quantity: 0,
  });

  const [infoList, setInfoList] = useState([]);
  const [newInfoKey, setNewInfoKey] = useState('');
  const [newInfoValue, setNewInfoValue] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const brandsRes = await fetch('http://localhost:5000/api/brands', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setBrands(data.data || []);
        }

        const categoriesRes = await fetch('http://localhost:5000/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
    fetchData();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setProduct(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'title') {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleVariantChange = (field) => (event) => {
    setVariant(prev => ({
      ...prev,
      [field]: parseInt(event.target.value) || 0,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !product.tags.includes(tagInput.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddInfo = () => {
    if (newInfoKey.trim() && newInfoValue.trim()) {
      setInfoList(prev => [
        ...prev,
        { key: newInfoKey.trim(), value: newInfoValue.trim() },
      ]);
      setNewInfoKey('');
      setNewInfoValue('');
    }
  };

  const handleRemoveInfo = (index) => {
    setInfoList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'لطفاً وارد حساب خود شوید',
          severity: 'warning',
        });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!product.title.trim()) {
        setSnackbar({ open: true, message: 'عنوان محصول الزامی است', severity: 'error' });
        setSubmitting(false);
        return;
      }

      if (!product.brandId) {
        setSnackbar({ open: true, message: 'برند محصول را انتخاب کنید', severity: 'error' });
        setSubmitting(false);
        return;
      }

      if (!product.categoryId) {
        setSnackbar({ open: true, message: 'دسته‌بندی محصول را انتخاب کنید', severity: 'error' });
        setSubmitting(false);
        return;
      }

      // 1. ایجاد محصول
      const productPayload = {
        title: product.title,
        slug: product.slug,
        description: product.description || '',
        inDetailReview: product.inDetailReview || '',
        brandId: product.brandId,
        categoryIds: [product.categoryId], // به صورت آرایه با یک آیتم
        images: [],
        videos: [],
        tags: product.tags || [],
        information: infoList,
        isPublished: product.isPublished,
        inStock: product.inStock,
      };

      console.log('📤 Product Payload:', productPayload);

      const productRes = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      });

      if (!productRes.ok) {
        const error = await productRes.json();
        throw new Error(error.message || 'خطا در ایجاد محصول');
      }

      const productResult = await productRes.json();
      const productId = productResult.data._id;
      console.log('✅ Product created:', productId);

      // 2. ایجاد واریانت
      const variantPayload = {
        productId: productId,
        quantity: variant.quantity,
        price: variant.price,
        discountPercent: variant.discountPercent,
      };

      console.log('📤 Variant Payload:', variantPayload);

      const variantRes = await fetch('http://localhost:5000/api/product-variant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(variantPayload),
      });

      if (!variantRes.ok) {
        const error = await variantRes.json();
        throw new Error(error.message || 'خطا در ایجاد واریانت');
      }

      console.log('✅ Variant created');

      setSnackbar({
        open: true,
        message: 'محصول با موفقیت ایجاد شد ✅',
        severity: 'success',
      });

      setTimeout(() => navigate('/products'), 2000);

    } catch (err) {
      console.error('❌ Error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در ایجاد محصول',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // استایل‌ها
  const inputStyle = {
    width: '100%',
    color: isDark ? '#fff' : '#1a1a2e',
    border: `1px solid ${isDark ? '#29476d' : '#d0d7e6'}`,
    borderRadius: '50px',
    padding: '16px 14px',
    textAlign: 'right',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '16px',
    backgroundColor: isDark ? 'transparent' : '#f8f9fa',
    transition: 'all 0.3s ease',
  };

  const selectStyle = {
    width: '100%',
    color: isDark ? '#fff' : '#1a1a2e',
    border: `1px solid ${isDark ? '#29476d' : '#d0d7e6'}`,
    borderRadius: '50px',
    padding: '16px 14px',
    textAlign: 'right',
    boxSizing: 'border-box',
    outline: 'none',
    fontSize: '16px',
    backgroundColor: isDark ? 'transparent' : '#f8f9fa',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const labelStyle = {
    color: isDark ? '#fff' : '#1a1a2e',
    marginBottom: '8px',
    textAlign: 'right',
    display: 'block',
    fontWeight: 500,
  };

  const cardStyle = {
    padding: '2rem',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    borderRadius: '16px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f6fa',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ایجاد محصول جدید
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{
              borderRadius: '50px',
              borderColor: isDark ? '#29476d' : '#d0d7e6',
              color: isDark ? '#fff' : '#1a1a2e',
            }}
          >
            بازگشت
          </Button>
        </div>

        {/* فرم */}
        <div style={cardStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* ردیف 1: عنوان و اسلاگ */}
            <div>
              <div style={labelStyle}>عنوان محصول :</div>
              <input
                type="text"
                value={product.title}
                onChange={handleChange('title')}
                placeholder="مثال : گوشی سامسونگ"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            <div>
              <div style={labelStyle}>اسلاگ (Slug) :</div>
              <input
                type="text"
                value={product.slug}
                onChange={handleChange('slug')}
                placeholder="مثال : samsung-phone"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            {/* ردیف 2: توضیحات کوتاه (تمام عرض) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>توضیحات کوتاه :</div>
              <input
                type="text"
                value={product.description}
                onChange={handleChange('description')}
                placeholder="توضیحات مختصر محصول"
                style={{ ...inputStyle, borderRadius: '16px' }}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            {/* ردیف 3: توضیحات کامل (تمام عرض) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>توضیحات کامل :</div>
              <textarea
                value={product.inDetailReview}
                onChange={handleChange('inDetailReview')}
                placeholder="توضیحات کامل و دقیق محصول"
                rows="4"
                style={{
                  ...inputStyle,
                  borderRadius: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            {/* ردیف 4: برند و دسته‌بندی */}
            <div>
              <div style={labelStyle}>برند :</div>
              <select
                value={product.brandId}
                onChange={(e) => setProduct(prev => ({ ...prev, brandId: e.target.value }))}
                style={{
                  ...selectStyle,
                  color: product.brandId ? (isDark ? '#fff' : '#1a1a2e') : '#888',
                }}
              >
                <option value="" style={{ backgroundColor: isDark ? '#1a1a2e' : '#fff' }}>
                  انتخاب برند
                </option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id} style={{ backgroundColor: isDark ? '#1a1a2e' : '#fff' }}>
                    {brand.name || brand.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>دسته‌بندی :</div>
              <select
                value={product.categoryId}
                onChange={(e) => setProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                style={{
                  ...selectStyle,
                  color: product.categoryId ? (isDark ? '#fff' : '#1a1a2e') : '#888',
                }}
              >
                <option value="" style={{ backgroundColor: isDark ? '#1a1a2e' : '#fff' }}>
                  انتخاب دسته‌بندی
                </option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} style={{ backgroundColor: isDark ? '#1a1a2e' : '#fff' }}>
                    {cat.name || cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* ردیف 5: قیمت و تخفیف */}
            <div>
              <div style={labelStyle}>قیمت (تومان) :</div>
              <input
                type="number"
                value={variant.price}
                onChange={handleVariantChange('price')}
                placeholder="مثال : 15000000"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            <div>
              <div style={labelStyle}>درصد تخفیف :</div>
              <input
                type="number"
                value={variant.discountPercent}
                onChange={handleVariantChange('discountPercent')}
                placeholder="مثال : 20"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            {/* ردیف 6: موجودی */}
            <div>
              <div style={labelStyle}>موجودی :</div>
              <input
                type="number"
                value={variant.quantity}
                onChange={handleVariantChange('quantity')}
                placeholder="مثال : 100"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
              />
            </div>

            {/* ردیف 7: تگ‌ها (تمام عرض) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>تگ‌ها :</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="تگ را وارد کنید و Enter بزنید"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                  onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
                />
                <button
                  onClick={handleAddTag}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  افزودن
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: isDark ? 'rgba(255,140,0,0.2)' : 'rgba(255,140,0,0.1)',
                      border: `1px solid #FF8C00`,
                      borderRadius: '50px',
                      color: isDark ? '#fff' : '#1a1a2e',
                      fontSize: '14px',
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0 4px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ردیف 8: اطلاعات اضافی (تمام عرض) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>اطلاعات اضافی :</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={newInfoKey}
                  onChange={(e) => setNewInfoKey(e.target.value)}
                  placeholder="عنوان (مثلاً: وزن)"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                  onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
                />
                <input
                  type="text"
                  value={newInfoValue}
                  onChange={(e) => setNewInfoValue(e.target.value)}
                  placeholder="مقدار (مثلاً: ۵۰۰ گرم)"
                  style={{ ...inputStyle, flex: 2 }}
                  onFocus={(e) => (e.target.style.borderColor = '#FF8C00')}
                  onBlur={(e) => (e.target.style.borderColor = isDark ? '#29476d' : '#d0d7e6')}
                />
                <button
                  onClick={handleAddInfo}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  افزودن
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                {infoList.map((info, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      borderRadius: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#FF8C00', fontWeight: 'bold' }}>{info.key}</span>
                    <span style={{ color: isDark ? '#fff' : '#1a1a2e' }}>: {info.value}</span>
                    <button
                      onClick={() => handleRemoveInfo(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '18px',
                        marginRight: 'auto',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ردیف 9: تنظیمات انتشار (تمام عرض) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                <label style={{ color: isDark ? '#fff' : '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.isPublished}
                    onChange={(e) => setProduct(prev => ({ ...prev, isPublished: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  منتشر شده
                </label>
                <label style={{ color: isDark ? '#fff' : '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={(e) => setProduct(prev => ({ ...prev, inStock: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  موجود
                </label>
              </div>
            </div>
          </div>

          {/* دکمه‌ها */}
          <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              onClick={() => navigate('/products')}
              disabled={submitting}
              style={{
                padding: '12px 32px',
                backgroundColor: 'transparent',
                color: isDark ? '#fff' : '#1a1a2e',
                border: `1px solid ${isDark ? '#29476d' : '#d0d7e6'}`,
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'در حال ایجاد...' : 'ایجاد محصول'}
            </button>
          </div>
        </div>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}