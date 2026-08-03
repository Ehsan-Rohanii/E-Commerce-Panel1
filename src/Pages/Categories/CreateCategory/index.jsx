// src/Pages/Categories/CreateCategory.jsx
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
  Box,
  Fade,
  Zoom,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  FormControlLabel,
  Switch,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Delete,
  Add,
  Close,
  CheckCircle,
  Category,
  Image,
  Link as LinkIcon,
  Settings,
  Publish,
  Save,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// انیمیشن‌ها
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// استایل‌های سفارشی
const GradientHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  padding: theme.spacing(3, 4),
  borderRadius: '16px 16px 0 0',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.03)' 
    : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.08)' 
    : 'rgba(255,140,0,0.08)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.4)'
    : '0 8px 32px rgba(255,140,0,0.08)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledInput = styled('input')(({ theme, isDark }) => ({
  width: '100%',
  color: isDark ? '#fff' : '#1a1a2e',
  border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  borderRadius: '12px',
  padding: '14px 16px',
  textAlign: 'right',
  boxSizing: 'border-box',
  outline: 'none',
  fontSize: '15px',
  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  '&:focus': {
    borderColor: '#FF8C00',
    boxShadow: '0 0 0 4px rgba(255,140,0,0.1)',
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
  },
  '&:hover': {
    borderColor: '#FF8C00',
  },
  '&::placeholder': {
    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  },
}));

const StyledSelect = styled('select')(({ theme, isDark }) => ({
  width: '100%',
  color: isDark ? '#fff' : '#1a1a2e',
  border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  borderRadius: '12px',
  padding: '14px 16px',
  textAlign: 'right',
  boxSizing: 'border-box',
  outline: 'none',
  fontSize: '15px',
  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  fontFamily: 'inherit',
  appearance: 'auto',
  '&:focus': {
    borderColor: '#FF8C00',
    boxShadow: '0 0 0 4px rgba(255,140,0,0.1)',
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
  },
  '&:hover': {
    borderColor: '#FF8C00',
  },
  '& option': {
    backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
    padding: '8px',
  },
}));

const StyledSelectMultiple = styled(StyledSelect)({
  minHeight: '140px',
  padding: '12px 16px',
  '& option': {
    padding: '10px 12px',
    borderRadius: '8px',
    margin: '4px 0',
  },
});

const UploadArea = styled(Box)(({ theme, isDark }) => ({
  border: `2px dashed ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,140,0,0.2)'}`,
  borderRadius: '16px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,140,0,0.02)',
  '&:hover': {
    borderColor: '#FF8C00',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,140,0,0.05)',
  },
}));

const SubCategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: '50px',
  padding: '4px 8px',
  height: 'auto',
  '& .MuiChip-label': {
    padding: '6px 12px',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.25)'
    : 'rgba(255,140,0,0.12)',
  border: '1px solid #FF8C00',
  color: theme.palette.mode === 'dark' ? '#fff' : '#1a1a2e',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(255,140,0,0.2)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  borderRadius: '14px',
  fontWeight: 700,
  padding: '12px 36px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 20px rgba(255, 140, 0, 0.3)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 8px 30px rgba(255, 140, 0, 0.4)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a2e',
  marginBottom: '8px',
  textAlign: 'right',
  display: 'block',
  fontWeight: 700,
  fontSize: '14px',
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
    marginLeft: '6px',
    verticalAlign: 'middle',
    color: '#FF8C00',
  },
}));

export default function CreateCategory() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [category, setCategory] = useState({
    title: '',
    slug: '',
    image: '',
    supCategoryId: '',
    subCategoryIds: [],
    isPublished: true,
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isFocused, setIsFocused] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setCategory(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'title') {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubCategoryChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setCategory(prev => ({ ...prev, subCategoryIds: selectedOptions }));
  };

  const handleRemoveSubCategory = (idToRemove) => {
    setCategory(prev => ({
      ...prev,
      subCategoryIds: prev.subCategoryIds.filter(id => id !== idToRemove)
    }));
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

      if (!category.title.trim()) {
        setSnackbar({ open: true, message: 'عنوان دسته‌بندی الزامی است', severity: 'error' });
        setSubmitting(false);
        return;
      }

      const categoryPayload = {
        title: category.title,
        slug: category.slug,
        image: category.image || '',
        supCategoryId: category.supCategoryId || null,
        subCategoryIds: category.subCategoryIds || [],
        isPublished: category.isPublished,
      };

      const categoryRes = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryPayload),
      });

      if (!categoryRes.ok) {
        const error = await categoryRes.json();
        throw new Error(error.message || 'خطا در ایجاد دسته‌بندی');
      }

      const categoryResult = await categoryRes.json();
      const categoryId = categoryResult.data._id;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        await fetch(`http://localhost:5000/api/categories/${categoryId}/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      }

      setSnackbar({
        open: true,
        message: '✅ دسته‌بندی با موفقیت ایجاد شد',
        severity: 'success',
      });

      setTimeout(() => navigate('/categories'), 2000);

    } catch (err) {
      console.error('❌ Error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در ایجاد دسته‌بندی',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, direction: 'rtl' }}>
      <Fade in timeout={500}>
        <Box>
          <GradientHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Category sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  ایجاد دسته‌بندی جدید
                </Typography>
                <Typography sx={{ opacity: 0.8 , fontSize: "0.8rem"}}>
                  اطلاعات دسته‌بندی را تکمیل کنید
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/categories')}
              endIcon={<ArrowBack />}
              sx={{
                gap : 1 ,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              بازگشت
            </Button>
          </GradientHeader>

          <GlassCard sx={{ borderRadius: '0 0 20px 20px' }}>
            {submitting && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,140,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF6F00, #FF8C00)',
                    },
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                  در حال ایجاد دسته‌بندی...
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: { xs: 2, sm: 3 },
              }}
            >
              {/* عنوان */}
              <Box>
                <Label>
                  <Category fontSize="small" />
                  عنوان دسته‌بندی
                  <Typography component="span" color="error" sx={{ mr: 0.5 }}>*</Typography>
                </Label>
                <StyledInput
                  type="text"
                  value={category.title}
                  onChange={handleChange('title')}
                  placeholder="مثال: گوشی موبایل"
                  isDark={isDark}
                  onFocus={() => handleFocus('title')}
                  onBlur={() => handleBlur('title')}
                  style={{
                    borderColor: isFocused.title ? '#FF8C00' : undefined,
                  }}
                />
              </Box>

              {/* اسلاگ */}
              <Box>
                <Label sx={{gap:1}}>
                  اسلاگ (Slug)
                  <LinkIcon fontSize="small" />
                </Label>
                <StyledInput
                  type="text"
                  value={category.slug}
                  onChange={handleChange('slug')}
                  placeholder="مثال: mobile-phones"
                  isDark={isDark}
                  onFocus={() => handleFocus('slug')}
                  onBlur={() => handleBlur('slug')}
                  style={{
                    borderColor: isFocused.slug ? '#FF8C00' : undefined,
                  }}
                />
              </Box>

              {/* دسته‌بندی والد */}
              <Box>
                <Label>
                  <Settings fontSize="small" />
                  دسته‌بندی والد
                </Label>
                <StyledSelect
                  value={category.supCategoryId}
                  onChange={(e) => setCategory(prev => ({ ...prev, supCategoryId: e.target.value }))}
                  isDark={isDark}
                  onFocus={() => handleFocus('supCategoryId')}
                  onBlur={() => handleBlur('supCategoryId')}
                  style={{
                    borderColor: isFocused.supCategoryId ? '#FF8C00' : undefined,
                    color: category.supCategoryId ? (isDark ? '#fff' : '#1a1a2e') : '#999',
                  }}
                >
                  <option value="">بدون والد</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title || cat.name}
                    </option>
                  ))}
                </StyledSelect>
              </Box>

              {/* زیردسته‌ها */}
              <Box>
                <Label>
                  <Category fontSize="small" />
                  زیردسته‌ها
                </Label>
                <StyledSelectMultiple
                  multiple
                  value={category.subCategoryIds}
                  onChange={handleSubCategoryChange}
                  isDark={isDark}
                  onFocus={() => handleFocus('subCategoryIds')}
                  onBlur={() => handleBlur('subCategoryIds')}
                  style={{
                    borderColor: isFocused.subCategoryIds ? '#FF8C00' : undefined,
                  }}
                >
                  {categories
                    .filter(cat => cat._id !== category.supCategoryId)
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title || cat.name}
                      </option>
                    ))}
                </StyledSelectMultiple>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDark ? '#888' : '#999', 
                    mt: 1, 
                    display: 'block',
                    textAlign: 'right',
                  }}
                >
                  💡 کلید Ctrl را نگه دارید و چند گزینه انتخاب کنید
                </Typography>
              </Box>

              {/* نمایش زیردسته‌های انتخاب شده */}
              {category.subCategoryIds.length > 0 && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Box sx={{ 
                    p: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
                    borderRadius: '12px',
                    border: `2px dashed ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,140,0,0.15)'}`,
                  }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: 'text.secondary' }}>
                      📌 زیردسته‌های انتخاب شده ({category.subCategoryIds.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {category.subCategoryIds.map(id => {
                        const cat = categories.find(c => c._id === id);
                        return (
                          <SubCategoryChip
                            key={id}
                            label={cat?.title || cat?.name || id}
                            onDelete={() => handleRemoveSubCategory(id)}
                            deleteIcon={<Close sx={{ fontSize: 18 }} />}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* تصویر */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Label>
                  <Image fontSize="small" />
                  تصویر دسته‌بندی
                </Label>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <UploadArea
                      isDark={isDark}
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                      <CloudUpload sx={{ fontSize: 40, color: '#FF8C00', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        برای آپلود تصویر کلیک کنید
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        یا فایل را بکشید و رها کنید
                      </Typography>
                    </UploadArea>
                  </Box>
                  
                  {imagePreview && (
                    <Zoom in>
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="پیش‌نمایش"
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: 'cover',
                            border: '3px solid #FF8C00',
                            boxShadow: '0 4px 20px rgba(255,140,0,0.2)',
                          }}
                        />
                        <IconButton
                          onClick={handleRemoveImage}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#ff6b6b',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#e55a5a',
                              transform: 'scale(1.1)',
                            },
                            width: 28,
                            height: 28,
                            boxShadow: '0 2px 8px rgba(255,107,107,0.4)',
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    </Zoom>
                  )}
                </Box>
              </Box>

              {/* انتشار */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3,
                  p: 2,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
                  borderRadius: '12px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}>
                  <Publish sx={{ color: '#FF8C00' }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={category.isPublished}
                        onChange={(e) => setCategory(prev => ({ ...prev, isPublished: e.target.checked }))}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FF8C00',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#FF8C00',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography fontWeight={600} color={category.isPublished ? '#FF8C00' : 'text.secondary'}>
                        {category.isPublished ? '✅ منتشر شده' : '📝 پیش‌نویس'}
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

            {/* دکمه‌ها */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              flexWrap: 'wrap',
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/categories')}
                disabled={submitting}
                sx={{
                  borderRadius: '12px',
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: isDark ? '#fff' : '#1a1a2e',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FF8C00',
                    backgroundColor: isDark ? 'rgba(255,140,0,0.1)' : 'rgba(255,140,0,0.05)',
                  },
                }}
              >
                انصراف
              </Button>
              <GradientButton
                onClick={handleSubmit}
                disabled={submitting}
                endIcon={submitting ? null : <Save />}
                sx={{
                  gap:1 ,
                  minWidth: 180,
                }}
              >
                {submitting ? 'در حال ایجاد...' : ' ایجاد دسته‌بندی'}
              </GradientButton>
            </Box>
          </GlassCard>
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 24 },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}