// src/Pages/Sliders/Slides.jsx
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Close,
  Image,
  Visibility,
  VisibilityOff,
  Publish,
  Unpublished,
  Refresh,
  Search,
  Slideshow,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CreateSlide from './CreateSlide';


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

export default function Slides() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalSliders, setTotalSliders] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch sliders
  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const url = new URL('http://localhost:5000/api/sliders');
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
        throw new Error('خطا در دریافت اسلایدرها');
      }

      const data = await response.json();
      setSliders(data.data || data.sliders || []);
      setTotalSliders(data.total || data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching sliders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // Open create modal
  const handleOpenCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (slider) => {
    setEditData(slider);
    setModalOpen(true);
  };

  // Delete slider
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

      const response = await fetch(`http://localhost:5000/api/sliders/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در حذف اسلایدر');
      }

      setSnackbar({
        open: true,
        message: '🗑️ اسلایدر با موفقیت حذف شد',
        severity: 'success',
      });

      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchSliders();

    } catch (err) {
      console.error('Error deleting slider:', err);
      setSnackbar({
        open: true,
        message: err.message || 'خطا در حذف اسلایدر',
        severity: 'error',
      });
    }
  };

  // Toggle slider status
  const handleToggleStatus = async (slider) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/sliders/${slider._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...slider,
          isPublished: !slider.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error('خطا در تغییر وضعیت');
      }

      setSnackbar({
        open: true,
        message: `وضعیت به ${!slider.isPublished ? 'منتشر شده' : 'پیش‌نویس'} تغییر کرد`,
        severity: 'success',
      });
      fetchSliders();

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

  // Render skeletons
  const renderSkeletons = () => {
    return Array.from({ length: rowsPerPage }).map((_, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell><Skeleton variant="rectangular" width={60} height={40} sx={{ borderRadius: 1 }} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={120} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={120} /></StyledTableCell>
        <StyledTableCell><Skeleton variant="text" width={80} /></StyledTableCell>
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
              <Slideshow sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  مدیریت اسلایدرها
                </Typography>
                <Typography sx={{ opacity: 0.8, fontSize: "0.8rem" }}>
                  {totalSliders} اسلایدر
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={fetchSliders}
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
                onClick={() => navigate("/createSlide")}
                endIcon={<Add/>}
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
                ایجاد اسلاید
              </Button>
            </Box>
          </GradientHeader>

          <GlassCard>
            {/* Search */}
            <Box sx={{ mb: 3 }}>
              <SearchField
                fullWidth
                placeholder="جستجوی اسلایدر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchSliders()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#FF8C00', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { setSearchTerm(''); fetchSliders(); }}>
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
                  <Button color="inherit" size="small" onClick={fetchSliders}>
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
              <Table sx={{ minWidth: { xs: 600, sm: 700 } }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>تصویر</StyledTableCell>
                    <StyledTableCell>عنوان</StyledTableCell>
                    <StyledTableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>لینک</StyledTableCell>
                    <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>مسیر</StyledTableCell>
                    <StyledTableCell>وضعیت</StyledTableCell>
                    <StyledTableCell align="center">عملیات</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    renderSkeletons()
                  ) : sliders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Slideshow sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                          <Typography variant="body1" color="text.secondary">
                            {searchTerm ? 'نتیجه‌ای یافت نشد' : 'هیچ اسلایدری وجود ندارد'}
                          </Typography>
                          
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sliders.map((slider) => (
                      <StyledTableRow key={slider._id}>
                        <StyledTableCell>
                          <Box
                            component="img"
                            src={slider.image || '/placeholder-image.jpg'}
                            alt={slider.title}
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 1,
                              objectFit: 'cover',
                              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                            {slider.title}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          {slider.href ? (
                            <Tooltip title={slider.href}>
                              <Chip
                                label={slider.href.length > 30 ? slider.href.substring(0, 30) + '...' : slider.href}
                                size="small"
                                icon={<Image sx={{ fontSize: 14 }} />}
                                sx={{
                                  borderRadius: 1,
                                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                  fontSize: '0.7rem',
                                  maxWidth: 150,
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                          )}
                        </StyledTableCell>
                        <StyledTableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Chip
                            label={slider.path || '/'}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              bgcolor: isDark ? 'rgba(255,140,0,0.1)' : 'rgba(255,140,0,0.06)',
                              color: '#FF8C00',
                              fontSize: '0.7rem',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip
                            label={slider.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                            active={slider.isPublished ? 1 : 0}
                            onClick={() => handleToggleStatus(slider)}
                            icon={slider.isPublished ? <Publish sx={{ fontSize: 14 }} /> : <Unpublished sx={{ fontSize: 14 }} />}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="ویرایش">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(slider)}
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
                                  setDeleteTarget(slider);
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
              count={totalSliders}
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
            حذف اسلایدر
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography textAlign="center" color="text.secondary">
            آیا از حذف اسلایدر <strong>{deleteTarget?.title}</strong> اطمینان دارید؟
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
