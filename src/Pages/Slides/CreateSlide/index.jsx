// src/Pages/Sliders/CreateSlider.jsx
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
  Image,
  Link as LinkIcon,
  Settings,
  Publish,
  Save,
  Slideshow,
  OpenInNew,
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

export default function CreateSlide() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [slider, setSlider] = useState({
    title: '',
    image: '',
    href: '',
    path: '/',
    isPublished: true,
  });

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

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setSlider(prev => ({ ...prev, [field]: value }));
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
    setSlider(prev => ({ ...prev, image: '' }));
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

      if (!slider.title.trim()) {
        setSnackbar({ open: true, message: 'عنوان اسلایدر الزامی است', severity: 'error' });
        setSubmitting(false);
        return;
      }

      const sliderPayload = {
        title: slider.title,
        image: slider.image || '',
        href: slider.href || '',
        path: slider.path || '/',
        isPublished: slider.isPublished,
      };

      const sliderRes = await fetch('http://localhost:5000/api/sliders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sliderPayload),
      });

      if (!sliderRes.ok) {
        const error = await sliderRes.json();
        throw new Error(error.message || 'خطا در ایجاد اسلایدر');
      }

      const sliderResult = await sliderRes.json();
      const sliderId = sliderResult.data._id;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        await fetch(`http://localhost:5000/api/sliders/${sliderId}/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      }

      setSnackbar({
        open: true,
        message: '✅ اسلایدر با موفقیت ایجاد شد',
        severity: 'success',
      });

      setTimeout(() => navigate('/sliders'), 2000);

    } catch (err) {
      console.error('❌ Error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در ایجاد اسلایدر',
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
              <Slideshow sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  ایجاد اسلایدر جدید
                </Typography>
                <Typography sx={{ opacity: 0.8, fontSize: "0.8rem" }}>
                  اطلاعات اسلایدر را تکمیل کنید
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              endIcon={<ArrowBack />}
              sx={{
                gap: 1,
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
                  در حال ایجاد اسلایدر...
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
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Label>
                  <Slideshow fontSize="small" />
                  عنوان اسلایدر
                  <Typography component="span" color="error" sx={{ mr: 0.5 }}>*</Typography>
                </Label>
                <StyledInput
                  type="text"
                  value={slider.title}
                  onChange={handleChange('title')}
                  placeholder="مثال: تخفیف ویژه نوروز"
                  isDark={isDark}
                  onFocus={() => handleFocus('title')}
                  onBlur={() => handleBlur('title')}
                  style={{
                    borderColor: isFocused.title ? '#FF8C00' : undefined,
                  }}
                />
              </Box>

              {/* لینک href */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Label>
                  <LinkIcon fontSize="small" />
                  لینک (href)
                </Label>
                <StyledInput
                  type="url"
                  value={slider.href}
                  onChange={handleChange('href')}
                  placeholder="https://example.com/category/mobile"
                  isDark={isDark}
                  onFocus={() => handleFocus('href')}
                  onBlur={() => handleBlur('href')}
                  style={{
                    borderColor: isFocused.href ? '#FF8C00' : undefined,
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDark ? '#888' : '#999', 
                    mt: 0.5, 
                    display: 'block',
                    textAlign: 'right',
                  }}
                >
                  🔗 لینک مقصد هنگام کلیک روی اسلایدر
                </Typography>
              </Box>

              {/* مسیر path */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Label>
                  <OpenInNew fontSize="small" />
                  مسیر (path)
                </Label>
                <StyledInput
                  type="text"
                  value={slider.path}
                  onChange={handleChange('path')}
                  placeholder="/"
                  isDark={isDark}
                  onFocus={() => handleFocus('path')}
                  onBlur={() => handleBlur('path')}
                  style={{
                    borderColor: isFocused.path ? '#FF8C00' : undefined,
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDark ? '#888' : '#999', 
                    mt: 0.5, 
                    display: 'block',
                    textAlign: 'right',
                  }}
                >
                  📍 مسیر داخلی برنامه (مثال: /products، /about)
                </Typography>
              </Box>

              {/* تصویر */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Label>
                  <Image fontSize="small" />
                  تصویر اسلایدر
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        (فرمت‌های مجاز: jpg, png, webp)
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
                            width: 120,
                            height: 80,
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
                        checked={slider.isPublished}
                        onChange={(e) => setSlider(prev => ({ ...prev, isPublished: e.target.checked }))}
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
                      <Typography fontWeight={600} color={slider.isPublished ? '#FF8C00' : 'text.secondary'}>
                        {slider.isPublished ? '✅ منتشر شده' : '📝 پیش‌نویس'}
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
                onClick={() => navigate('/sliders')}
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
                  gap: 1,
                  minWidth: 180,
                }}
              >
                {submitting ? 'در حال ایجاد...' : 'ایجاد اسلایدر'}
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