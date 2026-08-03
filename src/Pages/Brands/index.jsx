// components/Brands.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Skeleton,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Link,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Fade,
  Collapse,
  Chip,
  Zoom,
  Divider,
  alpha,
} from '@mui/material'
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  BrandingWatermark as BrandIcon,
  Home,
  Add,
  Close,
  TrendingUp,
  NewReleases,
  Star,
  Dashboard,
  Store,
  Business,
} from '@mui/icons-material'
import { styled, keyframes } from '@mui/material/styles'
import BrandCard from './BrandsCard'

// انیمیشن‌های سفارشی
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const shimmerAnimation = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

// استایل‌های پیشرفته
const GlassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderRadius: 20,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.08)' 
    : 'rgba(255, 140, 0, 0.1)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0,0,0,0.4)'
    : '0 8px 32px rgba(255, 140, 0, 0.08)',
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 16,
    marginBottom: theme.spacing(3),
  },
}))

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  borderRadius: 14,
  fontWeight: 700,
  padding: '10px 28px',
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
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    borderRadius: 12,
    fontSize: '0.8rem',
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.08)' 
        : 'rgba(0,0,0,0.04)',
      '& fieldset': {
        borderColor: '#FF8C00',
        borderWidth: 2,
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.08)' 
        : 'rgba(0,0,0,0.04)',
      '& fieldset': {
        borderColor: '#FF8C00',
        borderWidth: 2,
        boxShadow: '0 0 0 4px rgba(255, 140, 0, 0.1)',
      },
    },
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.1)' 
        : 'rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 12,
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'right',
    padding: theme.spacing(1.8, 2),
    fontSize: '0.95rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.2, 1.5),
      fontSize: '0.85rem',
    },
  },
}))

const BrandGrid = styled(Box)(({ theme, viewMode }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
  ...(viewMode === 'grid'
    ? {
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        },
        [theme.breakpoints.between('sm', 'md')]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        },
      }
    : {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
      }),
}))

const FilterChip = styled(Chip)(({ theme, active }) => ({
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '0.85rem',
  padding: '4px 8px',
  height: 36,
  transition: 'all 0.3s ease',
  background: active 
    ? 'linear-gradient(135deg, #FF6F00, #FF8C00)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.04)',
  color: active ? '#fff' : 'text.secondary',
  border: `1px solid ${active 
    ? 'transparent' 
    : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.06)'}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: active 
      ? '0 4px 15px rgba(255, 140, 0, 0.3)'
      : '0 4px 15px rgba(0,0,0,0.08)',
  },
  '& .MuiChip-icon': {
    color: active ? '#fff' : '#FF8C00',
  },
}))

const HeroSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a0a00, #2d1a00)'
    : 'linear-gradient(135deg, #fff8f0, #fff0e0)',
  borderRadius: 24,
  padding: theme.spacing(4, 5),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,140,0,0.1)' 
    : 'rgba(255,140,0,0.15)'}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 16,
    marginBottom: theme.spacing(3),
  },
}))

const StatsBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.8, 2),
  borderRadius: 30,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.15)'
    : 'rgba(255,140,0,0.08)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.2)'
    : 'rgba(255,140,0,0.15)'}`,
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#FF8C00',
}))

export default function Brands() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBrands, setTotalBrands] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterFeatured, setFilterFeatured] = useState(false)
  const itemsPerPage = isXs ? 6 : isSm ? 9 : 15

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL('http://localhost:5000/api/brands')
      url.searchParams.append('page', page)
      url.searchParams.append('limit', itemsPerPage)
      url.searchParams.append('isPublished', true)
      
      if (searchTerm.trim()) {
        url.searchParams.append('search', searchTerm.trim())
      }

      if (sortBy === 'newest') {
        url.searchParams.append('sort', '-createdAt')
      } else if (sortBy === 'oldest') {
        url.searchParams.append('sort', 'createdAt')
      } else if (sortBy === 'popular') {
        url.searchParams.append('sort', '-viewCount')
      }

      if (filterFeatured) {
        url.searchParams.append('featured', true)
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success === false) {
        throw new Error(data.message || 'خطا در دریافت برندها')
      }

      const brandsData = data.brands || data.data || data || []
      setBrands(Array.isArray(brandsData) ? brandsData : [])
      
      setTotalPages(data.totalPages || data.pagination?.totalPages || 1)
      setTotalBrands(data.total || data.pagination?.total || brandsData.length || 0)

    } catch (err) {
      console.error('Error fetching brands:', err)
      setError(err.message || 'خطا در دریافت برندها. لطفاً دوباره تلاش کنید.')
      setBrands([])
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm, itemsPerPage, sortBy, filterFeatured])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setTimeout(() => fetchBrands(), 0)
    if (isXs) setShowMobileSearch(false)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBrandClick = (brandId, slug) => {
    navigate(`/brands/${slug || brandId}`)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
    setTimeout(() => fetchBrands(), 0)
  }

  const renderSkeletons = () => {
    const count = isXs ? 4 : isSm ? 6 : 10
    return (
      <BrandGrid viewMode="grid">
        {[...Array(count)].map((_, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Skeleton 
              variant="rounded" 
              height={isXs ? 200 : 280} 
              sx={{ 
                borderRadius: 4,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08), rgba(0,0,0,0.04))',
                backgroundSize: '200% 100%',
                animation: `${shimmerAnimation} 1.5s ease-in-out infinite`,
              }} 
            />
          </Box>
        ))}
      </BrandGrid>
    )
  }

  const renderHeader = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: isXs ? 'flex-start' : 'center',
      mb: { xs: 2, sm: 3 },
      flexDirection: isXs ? 'column' : 'row',
      gap: isXs ? 2 : 0,
    }}>
      <Breadcrumbs 
        sx={{ 
          '& .MuiBreadcrumbs-separator': { 
            mx: { xs: 0.5, sm: 1 },
            color: 'text.disabled',
          },
          '& .MuiBreadcrumbs-ol': {
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          },
          '& .MuiTypography-root': {
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            fontWeight: 500,
          },
          '& .MuiLink-root': {
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: '#FF8C00',
            },
          }
        }}
      >
        <Link
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
          }}
        >
          <Home sx={{ ml: 0.5, fontSize: { xs: 16, sm: 18 } }} />
          <span style={{ display: isXs ? 'none' : 'inline' }}>خانه</span>
        </Link>
        <Typography color="#FF8C00" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
          <BrandIcon sx={{ ml: 0.5, fontSize: { xs: 16, sm: 18 } }} />
          برندها
        </Typography>
      </Breadcrumbs>

      <GradientButton
        onClick={() => navigate("/createBrand")}
        endIcon={!isXs && <Add />}
        sx={{
          minWidth: isXs ? 'auto' : undefined,
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.2 },
        }}
      >
        {isXs ? '+' : 'برند جدید'}
      </GradientButton>
    </Box>
  )

  const renderHeroSection = () => (
    <HeroSection>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flex: 1,
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'rgba(255,140,0,0.1)',
            }}>
              <Business sx={{ fontSize: 32, color: '#FF8C00' }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                fontWeight={800} 
                color="#FF8C00"
                sx={{
                  mb: 0.5,
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                }}
              >
                برندها
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalBrands > 0 
                  ? `${totalBrands} برند فعال` 
                  : 'هنوز برندی ایجاد نشده'}
              </Typography>
            </Box>
          </Box>
          
          {/* آمار به سمت چپ */}
          {totalBrands > 0 && (
            <StatsBadge sx={{ 
              flexShrink: 0,
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}>
              <Store sx={{ fontSize: 18 }} />
              <Typography component="span" fontWeight={700}>
                {totalBrands}
              </Typography>
              <Typography component="span" sx={{ opacity: 0.7 }}>
                برند
              </Typography>
            </StatsBadge>
          )}
        </Stack>
      </Box>
    </HeroSection>
  )

  const renderSearchSection = () => {
    if (isXs) {
      return (
        <>
          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              sx={{
                flex: 1,
                borderRadius: 14,
                borderColor: 'rgba(255,140,0,0.2)',
                color: searchTerm ? '#FF8C00' : 'text.secondary',
                justifyContent: 'flex-start',
                py: 1.5,
                bgcolor: searchTerm ? 'rgba(255,140,0,0.05)' : 'transparent',
                '&:hover': {
                  borderColor: '#FF8C00',
                  backgroundColor: 'rgba(255,140,0,0.05)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {searchTerm ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography noWrap sx={{ flex: 1, fontWeight: 500 }}>
                    "{searchTerm}"
                  </Typography>
                  <Chip 
                    label={`${brands.length} نتیجه`} 
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: '#FF8C00',
                      color: '#fff',
                      height: 20,
                      '& .MuiChip-label': { fontSize: '0.65rem', px: 1 },
                    }}
                  />
                </Box>
              ) : (
                'جستجوی برند...'
              )}
            </Button>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                onClick={() => setViewMode('grid')}
                size="small"
                sx={{ 
                  bgcolor: viewMode === 'grid' ? '#FF8C00' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'inherit',
                  borderRadius: 2,
                  p: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: viewMode === 'grid' ? '#e67e00' : 'rgba(255,140,0,0.1)',
                  },
                }}
              >
                <GridView fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                size="small"
                sx={{ 
                  bgcolor: viewMode === 'list' ? '#FF8C00' : 'transparent',
                  color: viewMode === 'list' ? '#fff' : 'inherit',
                  borderRadius: 2,
                  p: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: viewMode === 'list' ? '#e67e00' : 'rgba(255,140,0,0.1)',
                  },
                }}
              >
                <ViewList fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Collapse in={showMobileSearch}>
            <GlassPaper sx={{ p: 2, mb: 2 }}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  autoFocus
                  placeholder="جستجوی برند..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#FF8C00', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={clearSearch}>
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 12,
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                    }
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    sx={{
                      bgcolor: '#FF8C00',
                      borderRadius: 12,
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#e67e00' },
                    }}
                  >
                    جستجو
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setShowMobileSearch(false)
                      clearSearch()
                    }}
                    sx={{ borderRadius: 12, flexShrink: 0 }}
                  >
                    لغو
                  </Button>
                </Stack>
              </form>
            </GlassPaper>
          </Collapse>
        </>
      )
    }

    return (
      <GlassPaper elevation={0}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          alignItems="center"
        >
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, width: '100%' }}>
            <StyledTextField
              fullWidth
              placeholder="جستجوی برند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit" sx={{ color: '#FF8C00' }}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <FilterChip
              icon={<NewReleases />}
              label="جدیدترین"
              active={sortBy === 'newest'}
              onClick={() => setSortBy('newest')}
            />
            <FilterChip
              icon={<Star />}
              label="محبوب‌ترین"
              active={sortBy === 'popular'}
              onClick={() => setSortBy('popular')}
            />
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            
            <IconButton
              onClick={() => setViewMode('grid')}
              size={isSm ? 'small' : 'medium'}
              sx={{ 
                bgcolor: viewMode === 'grid' ? '#FF8C00' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'grid' ? '#e67e00' : 'rgba(255,140,0,0.1)' },
                borderRadius: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              size={isSm ? 'small' : 'medium'}
              sx={{ 
                bgcolor: viewMode === 'list' ? '#FF8C00' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'list' ? '#e67e00' : 'rgba(255,140,0,0.1)' },
                borderRadius: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Stack>
      </GlassPaper>
    )
  }

  const renderContent = () => {
    if (loading) return renderSkeletons()

    if (error) {
      return (
        <Fade in timeout={500}>
          <Alert 
            severity="error" 
            action={
              <IconButton color="inherit" onClick={fetchBrands}>
                <Search />
              </IconButton>
            }
            sx={{ 
              borderRadius: 3,
              '& .MuiAlert-icon': { fontSize: 28 },
            }}
          >
            {error}
          </Alert>
        </Fade>
      )
    }

    if (brands.length === 0) {
      return (
        <Fade in timeout={500}>
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 6, sm: 8 },
            px: { xs: 2, sm: 0 },
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              p: 3,
              borderRadius: '50%',
              bgcolor: 'rgba(255,140,0,0.08)',
              mb: 3,
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}>
              <Business sx={{ fontSize: { xs: 48, sm: 64 }, color: '#FF8C00' }} />
            </Box>
            <Typography variant={isXs ? 'h6' : 'h5'} fontWeight={700} color="text.primary" gutterBottom>
              {searchTerm ? 'نتیجه‌ای یافت نشد' : 'برندی وجود ندارد'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
              {searchTerm 
                ? `هیچ برندی با عبارت "${searchTerm}" پیدا نشد. لطفاً عبارت دیگری را امتحان کنید.`
                : 'اولین برند را ایجاد کنید و محصولات خود را سازماندهی نمایید.'}
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                onClick={clearSearch}
                sx={{ 
                  mt: 3, 
                  borderRadius: 3,
                  borderColor: '#FF8C00',
                  color: '#FF8C00',
                  '&:hover': {
                    borderColor: '#e67e00',
                    bgcolor: 'rgba(255,140,0,0.05)',
                  },
                }}
              >
                پاک کردن جستجو
              </Button>
            )}
            {!searchTerm && (
              <GradientButton
                onClick={() => navigate("/createBrand")}
                startIcon={<Add />}
                sx={{ mt: 3 }}
              >
                ایجاد برند جدید
              </GradientButton>
            )}
          </Box>
        </Fade>
      )
    }

    return (
      <BrandGrid viewMode={viewMode}>
        {brands.map((brand, index) => (
          <Zoom 
            in 
            timeout={400} 
            key={brand._id} 
            style={{ transitionDelay: `${index * 40}ms` }}
          >
            <Box sx={{ height: '100%' }}>
              <BrandCard 
                brand={brand} 
                onClick={() => handleBrandClick(brand._id, brand.slug)}
                viewMode={viewMode}
              />
            </Box>
          </Zoom>
        ))}
      </BrandGrid>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, direction: 'rtl' }}>
      {renderHeader()}
      {renderHeroSection()}
      {renderSearchSection()}
      {renderContent()}

      {!loading && brands.length > 0 && totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: 4, sm: 5 },
          '& .MuiPagination-root': {
            '& .MuiPaginationItem-root': {
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              minWidth: { xs: 36, sm: 44 },
              height: { xs: 36, sm: 44 },
              borderRadius: 2,
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,140,0,0.08)',
              },
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                boxShadow: '0 6px 20px rgba(255, 140, 0, 0.4)',
              },
            },
          }
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isXs ? 'small' : 'large'}
            siblingCount={isXs ? 0 : 1}
            boundaryCount={isXs ? 1 : 2}
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  )
}