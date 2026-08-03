// src/Pages/Discounts/Discounts.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Fade,
  Zoom,
  Skeleton,
  Tooltip,
  LinearProgress,
  TablePagination,
  InputAdornment,
  TextField,
  Switch,
  FormControlLabel,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
  Discount,
  Percent,
  AttachMoney,
  DateRange,
  Refresh,
  Search,
  Publish,
  Unpublished,
  LocalShipping,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// استایل‌های سفارشی
const GradientHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  padding: theme.spacing(3, 4),
  borderRadius: '16px 16px 0 0',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '0 0 20px 20px',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.03)' 
    : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.08)' 
    : 'rgba(255,140,0,0.08)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.4)'
    : '0 8px 32px rgba(255,140,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.85rem',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: '8px 6px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,140,0,0.05)' 
      : 'rgba(255,140,0,0.03)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  borderRadius: '12px',
  fontWeight: 600,
  padding: '8px 20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 3px 16px rgba(255, 140, 0, 0.25)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 6px 24px rgba(255, 140, 0, 0.35)',
  },
}));

const StatusChip = styled(Chip)(({ theme, active }) => ({
  borderRadius: '50px',
  fontWeight: 600,
  fontSize: '0.7rem',
  height: 28,
  backgroundColor: active 
    ? theme.palette.mode === 'dark' ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.1)'
    : theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.2)' : 'rgba(244,67,54,0.1)',
  color: active ? '#4CAF50' : '#f44336',
  border: `1px solid ${active ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)'}`,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.02)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.1)' 
        : 'rgba(0,0,0,0.08)',
    },
    '&:hover fieldset': {
      borderColor: '#FF8C00',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF8C00',
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '0.85rem',
    padding: '10px 14px',
  },
}));

const StyledInput = styled('input')(({ theme, isDark }) => ({
  width: '100%',
  color: isDark ? '#fff' : '#1a1a2e',
  border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
  borderRadius: '12px',
  padding: '12px 16px',
  textAlign: 'right',
  boxSizing: 'border-box',
  outline: 'none',
  fontSize: '14px',
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

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a2e',
  marginBottom: '6px',
  textAlign: 'right',
  display: 'block',
  fontWeight: 700,
  fontSize: '13px',
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
    marginLeft: '6px',
    verticalAlign: 'middle',
    color: '#FF8C00',
  },
}));

export default function Discounts() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalDiscounts, setTotalDiscounts] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    freeShipping: false,
    maxUsage: '',
    isPublished: true,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch discounts
  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const url = new URL('http://localhost:5000/api/discounts');
      url.searchParams.append('page', page + 1);
      url.searchParams.append('limit', rowsPerPage);
      
      if (searchTerm.trim()) {
        url.searchParams.append('search', searchTerm.trim());
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت کدهای تخفیف');
      }

      const data = await response.json();
      setDiscounts(data.data || data.discounts || []);
      setTotalDiscounts(data.total || data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Handle form changes
  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Open create modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditData(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
      freeShipping: false,
      maxUsage: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (discount) => {
    setModalMode('edit');
    setEditData(discount);
    setFormData({
      code: discount.code || '',
      type: discount.type || 'percentage',
      value: discount.value || '',
      minPrice: discount.minPrice || '',
      maxPrice: discount.maxPrice || '',
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
      freeShipping: discount.freeShipping || false,
      maxUsage: discount.maxUsage || '',
      isPublished: discount.isPublished !== undefined ? discount.isPublished : true,
    });
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  // Submit form
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
        return;
      }

      if (!formData.code.trim()) {
        setSnackbar({ open: true, message: 'کد تخفیف الزامی است', severity: 'error' });
        setSubmitting(false);
        return;
      }

      if (!formData.value) {
        setSnackbar({ open: true, message: 'مقدار تخفیف الزامی است', severity: 'error' });
        setSubmitting(false);
        return;
      }

      const payload = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minPrice: formData.minPrice ? Number(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        freeShipping: formData.freeShipping,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : undefined,
        isPublished: formData.isPublished,
      };

      let response;

      if (modalMode === 'create') {
        response = await fetch('http://localhost:5000/api/discounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`http://localhost:5000/api/discounts/${editData._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در ذخیره کد تخفیف');
      }

      setSnackbar({
        open: true,
        message: modalMode === 'create' ? '✅ کد تخفیف با موفقیت ایجاد شد' : '✅ کد تخفیف با موفقیت بروزرسانی شد',
        severity: 'success',
      });

      handleCloseModal();
      fetchDiscounts();

    } catch (err) {
      console.error('❌ Error:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در ذخیره کد تخفیف',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete discount
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'لطفاً وارد حساب خود شوید',
          severity: 'warning',
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/discounts/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در حذف کد تخفیف');
      }

      setSnackbar({
        open: true,
        message: '🗑️ کد تخفیف با موفقیت حذف شد',
        severity: 'success',
      });

      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchDiscounts();

    } catch (err) {
      console.error('Error deleting discount:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در حذف کد تخفیف',
        severity: 'error',
      });
    }
  };

  // Toggle discount status
  const handleToggleStatus = async (discount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/discounts/${discount._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...discount,
          isPublished: !discount.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error('خطا در تغییر وضعیت');
      }

      setSnackbar({
        open: true,
        message: `وضعیت به ${!discount.isPublished ? 'فعال' : 'غیرفعال'} تغییر کرد`,
        severity: 'success',
      });
      fetchDiscounts();

    } catch (err) {
      console.error('Error toggling status:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error',
      });
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render skeletons
  const renderSkeletons = () => {
    return Array.from({ length: rowsPerPage }).map((_, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell><Skeleton variant="text" width={80} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={60} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={60} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={100} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={120} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} /></StyledTableCell>
        <StyledTableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </StyledTableCell>
      </StyledTableRow>
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, direction: 'rtl' }}>
      <Fade in timeout={500}>
        <Box>
          <GradientHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Discount sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  مدیریت کدهای تخفیف
                </Typography>
                <Typography sx={{ opacity: 0.8, fontSize: "0.8rem" }}>
                  {totalDiscounts} کد تخفیف
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={fetchDiscounts}
                endIcon={<Refresh />}
                sx={{
                    gap:1 ,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                بروزرسانی
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenCreate}
                endIcon={<Add />}
                sx={{
                    gap:1 ,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                ایجاد کد تخفیف
              </Button>
            </Box>
          </GradientHeader>

          <GlassCard>
            {/* Search */}
            <Box sx={{ mb: 3 }}>
              <SearchField
                fullWidth
                placeholder="جستجوی کد تخفیف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchDiscounts()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#FF8C00', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { setSearchTerm(''); fetchDiscounts(); }}>
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,140,0,0.05)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF6F00, #FF8C00)',
                    },
                  }} 
                />
              </Box>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2, borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={fetchDiscounts}>
                    تلاش مجدد
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Table */}
            <TableContainer component={Paper} sx={{ 
              borderRadius: 2, 
              overflowX: 'auto',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            }}>
              <Table sx={{ minWidth: { xs: 700, sm: 800 } }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>کد</StyledTableCell>
                    <StyledTableCell>نوع</StyledTableCell>
                    <StyledTableCell>مقدار</StyledTableCell>
                    <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>حداقل قیمت</StyledTableCell>
                    <StyledTableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>تاریخ شروع</StyledTableCell>
                    <StyledTableCell>وضعیت</StyledTableCell>
                    <StyledTableCell align="center">عملیات</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    renderSkeletons()
                  ) : discounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Discount sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'نتیجه‌ای یافت نشد' : 'هیچ کد تخفیفی وجود ندارد'}
                          </Typography>
                          {/* <Button
                            variant="outlined"
                            onClick={handleOpenCreate}
                            sx={{ mt: 2, borderRadius: 2 }}
                          >
                            ایجاد کد تخفیف جدید
                          </Button> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    discounts.map((discount) => (
                      <StyledTableRow key={discount._id}>
                        <StyledTableCell>
                          <Chip
                            label={discount.code}
                            sx={{
                              borderRadius: 1,
                              bgcolor: isDark ? 'rgba(255,140,0,0.15)' : 'rgba(255,140,0,0.08)',
                              color: '#FF8C00',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={discount.type === 'percentage' ? 'درصدی' : 'مبلغ ثابت'}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                              fontSize: '0.7rem',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography fontWeight={700} color="#FF8C00">
                            {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value.toLocaleString()} تومان`}
                          </Typography>
                          {discount.freeShipping && (
                            <Chip
                              label="ارسال رایگان"
                              size="small"
                              icon={<LocalShipping sx={{ fontSize: 14 }} />}
                              sx={{
                                borderRadius: 1,
                                bgcolor: isDark ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.08)',
                                color: '#4CAF50',
                                fontSize: '0.6rem',
                                height: 20,
                                mt: 0.5,
                              }}
                            />
                          )}
                        </StyledTableCell>
                        <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          {discount.minPrice ? `${discount.minPrice.toLocaleString()} تومان` : '-'}
                        </StyledTableCell>
                        <StyledTableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {formatDate(discount.startDate)}
                            <br />
                            <span style={{ fontSize: '0.6rem' }}>تا {formatDate(discount.endDate)}</span>
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip
                            label={discount.isPublished ? 'فعال' : 'غیرفعال'}
                            active={discount.isPublished ? 1 : 0}
                            onClick={() => handleToggleStatus(discount)}
                            icon={discount.isPublished ? <Publish sx={{ fontSize: 14 }} /> : <Unpublished sx={{ fontSize: 14 }} />}
                          />
                          {discount.maxUsage && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem' }}>
                              استفاده: {discount.usedCount || 0}/{discount.maxUsage}
                            </Typography>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="ویرایش">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(discount)}
                                sx={{
                                  color: '#FF8C00',
                                  '&:hover': { backgroundColor: 'rgba(255,140,0,0.08)' },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setDeleteTarget(discount);
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{
                                  color: '#f44336',
                                  '&:hover': { backgroundColor: 'rgba(244,67,54,0.08)' },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalDiscounts}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="تعداد در صفحه:"
              sx={{
                '& .MuiTablePagination-select': {
                  textAlign: 'right',
                },
                '& .MuiTablePagination-displayedRows': {
                  fontSize: '0.8rem',
                },
              }}
            />
          </GlassCard>
        </Box>
      </Fade>

      {/* Create/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? '#0a0a0a' : '#ffffff',
            p: 0,
            maxHeight: '90vh',
            direction: 'rtl',
          },
        }}
      >
        <GradientHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Discount sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {modalMode === 'create' ? 'کد تخفیف جدید' : 'ویرایش کد تخفیف'}
              </Typography>
              <Typography sx={{ opacity: 0.8, fontSize: "0.75rem" }}>
                {modalMode === 'create' ? 'اطلاعات کد تخفیف را تکمیل کنید' : 'اطلاعات کد تخفیف را ویرایش کنید'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleCloseModal} disabled={submitting} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </GradientHeader>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {submitting && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress sx={{ height: 5, borderRadius: 3 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
                {modalMode === 'create' ? 'در حال ایجاد...' : 'در حال بروزرسانی...'}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2, sm: 2.5 } }}>
            
            {/* کد تخفیف */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Label>
                <Discount fontSize="small" />
                کد تخفیف <Typography component="span" color="error" sx={{ mr: 0.5 }}>*</Typography>
              </Label>
              <StyledInput
                type="text"
                value={formData.code}
                onChange={handleFormChange('code')}
                placeholder="SUMMER20"
                isDark={isDark}
                style={{ textTransform: 'uppercase' }}
              />
            </Box>

            {/* نوع تخفیف */}
            <Box>
              <Label>
                <Percent fontSize="small" />
                نوع تخفیف <Typography component="span" color="error" sx={{ mr: 0.5 }}>*</Typography>
              </Label>
              <select
                value={formData.type}
                onChange={handleFormChange('type')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  color: isDark ? '#fff' : '#1a1a2e',
                  fontSize: '14px',
                  textAlign: 'right',
                  outline: 'none',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <option value="percentage">درصدی</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </Box>

            {/* مقدار تخفیف */}
            <Box>
              <Label>
                <AttachMoney fontSize="small" />
                مقدار تخفیف <Typography component="span" color="error" sx={{ mr: 0.5 }}>*</Typography>
              </Label>
              <StyledInput
                type="number"
                value={formData.value}
                onChange={handleFormChange('value')}
                placeholder={formData.type === 'percentage' ? 'مثال: 20' : 'مثال: 50000'}
                isDark={isDark}
              />
            </Box>

            {/* حداقل قیمت */}
            <Box>
              <Label>
                <AttachMoney fontSize="small" />
                حداقل قیمت
              </Label>
              <StyledInput
                type="number"
                value={formData.minPrice}
                onChange={handleFormChange('minPrice')}
                placeholder="مثال: 100000"
                isDark={isDark}
              />
            </Box>

            {/* حداکثر قیمت */}
            <Box>
              <Label>
                <AttachMoney fontSize="small" />
                حداکثر قیمت
              </Label>
              <StyledInput
                type="number"
                value={formData.maxPrice}
                onChange={handleFormChange('maxPrice')}
                placeholder="مثال: 1000000"
                isDark={isDark}
              />
            </Box>

            {/* تاریخ شروع */}
            <Box>
              <Label>
                <DateRange fontSize="small" />
                تاریخ شروع
              </Label>
              <StyledInput
                type="datetime-local"
                value={formData.startDate}
                onChange={handleFormChange('startDate')}
                isDark={isDark}
              />
            </Box>

            {/* تاریخ پایان */}
            <Box>
              <Label>
                <DateRange fontSize="small" />
                تاریخ پایان
              </Label>
              <StyledInput
                type="datetime-local"
                value={formData.endDate}
                onChange={handleFormChange('endDate')}
                isDark={isDark}
              />
            </Box>

            {/* حداکثر استفاده */}
            <Box>
              <Label>
                <Percent fontSize="small" />
                حداکثر استفاده
              </Label>
              <StyledInput
                type="number"
                value={formData.maxUsage}
                onChange={handleFormChange('maxUsage')}
                placeholder="مثال: 100"
                isDark={isDark}
              />
            </Box>

            {/* ارسال رایگان */}
            <Box>
              <Label>
                <LocalShipping fontSize="small" />
                ارسال رایگان
              </Label>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa', borderRadius: '12px' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.freeShipping}
                      onChange={handleFormChange('freeShipping')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF8C00' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF8C00' },
                      }}
                    />
                  }
                  label={
                    <Typography fontWeight={600} color={formData.freeShipping ? '#FF8C00' : 'text.secondary'}>
                      {formData.freeShipping ? '✅ فعال' : '⛔ غیرفعال'}
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {/* انتشار */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 1.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fa',
                borderRadius: '12px',
              }}>
                <Publish sx={{ color: '#FF8C00' }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={handleFormChange('isPublished')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF8C00' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF8C00' },
                      }}
                    />
                  }
                  label={
                    <Typography fontWeight={600} color={formData.isPublished ? '#FF8C00' : 'text.secondary'}>
                      {formData.isPublished ? '✅ فعال' : '⛔ غیرفعال'}
                    </Typography>
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 0, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            disabled={submitting}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: isDark ? '#fff' : '#1a1a2e',
              '&:hover': { borderColor: '#FF8C00' },
            }}
          >
            انصراف
          </Button>
          <GradientButton
            onClick={handleSubmit}
            disabled={submitting}
            endIcon={submitting ? null : (modalMode === 'create' ? <Add /> : <Save />)}
            sx={{ gap: 1, minWidth: 150 }}
          >
            {submitting 
              ? (modalMode === 'create' ? 'در حال ایجاد...' : 'در حال بروزرسانی...')
              : (modalMode === 'create' ? 'ایجاد' : 'بروزرسانی')
            }
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: isDark ? '#0a0a0a' : '#ffffff',
            direction: 'rtl',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Delete sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            حذف کد تخفیف
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center" color="text.secondary">
            آیا از حذف کد تخفیف <strong>{deleteTarget?.code}</strong> اطمینان دارید؟
            <br />
            <Typography variant="caption" color="error">
              این عمل قابل بازگشت نیست!
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}