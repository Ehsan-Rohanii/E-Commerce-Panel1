// components/Categories.jsx
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
  Badge,
  Zoom,
  Divider,
  alpha,
} from '@mui/material'
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  Category as CategoryIcon,
  Home,
  Add,
  Close,
  TrendingUp,
  NewReleases,
  Star,
  Dashboard,
  Sort,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material'
import { styled, keyframes } from '@mui/material/styles'
import CategoryCard from './CategoryCard'

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
  padding: theme.spacing(2, 2.5),
  borderRadius: 16,
  background: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,255,255,0.06)' 
    : 'rgba(255, 140, 0, 0.08)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 24px rgba(0,0,0,0.3)'
    : '0 4px 24px rgba(255, 140, 0, 0.06)',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    borderRadius: 12,
    marginBottom: theme.spacing(2),
  },
}))

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
  color: '#fff',
  borderRadius: 12,
  fontWeight: 600,
  padding: '8px 20px',
  fontSize: '0.85rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 3px 16px rgba(255, 140, 0, 0.25)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 6px 24px rgba(255, 140, 0, 0.35)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '6px 14px',
    borderRadius: 10,
    fontSize: '0.75rem',
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 14,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.04)' 
      : 'rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.06)' 
        : 'rgba(0,0,0,0.03)',
      '& fieldset': {
        borderColor: '#FF8C00',
        borderWidth: 1.5,
      },
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.06)' 
        : 'rgba(0,0,0,0.03)',
      '& fieldset': {
        borderColor: '#FF8C00',
        borderWidth: 1.5,
        boxShadow: '0 0 0 3px rgba(255, 140, 0, 0.08)',
      },
    },
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.08)' 
        : 'rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 10,
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'right',
    padding: theme.spacing(1.4, 1.5),
    fontSize: '0.85rem',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.2),
      fontSize: '0.8rem',
    },
  },
}))

const CategoryGrid = styled(Box)(({ theme, viewMode }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
  },
  ...(viewMode === 'grid'
    ? {
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        },
        [theme.breakpoints.between('sm', 'md')]: {
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        },
      }
    : {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1.5),
      }),
}))

const FilterChip = styled(Chip)(({ theme, active }) => ({
  borderRadius: 10,
  fontWeight: 500,
  fontSize: '0.75rem',
  padding: '2px 6px',
  height: 32,
  transition: 'all 0.3s ease',
  background: active 
    ? 'linear-gradient(135deg, #FF6F00, #FF8C00)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.03)',
  color: active ? '#fff' : 'text.secondary',
  border: `1px solid ${active 
    ? 'transparent' 
    : theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.05)'}`,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: active 
      ? '0 3px 12px rgba(255, 140, 0, 0.25)'
      : '0 3px 12px rgba(0,0,0,0.06)',
  },
  '& .MuiChip-icon': {
    color: active ? '#fff' : '#FF8C00',
    fontSize: '1rem',
  },
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}))

const HeroSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a0a00, #2d1a00)'
    : 'linear-gradient(135deg, #fff8f0, #fff0e0)',
  borderRadius: 20,
  padding: theme.spacing(3, 4),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255,140,0,0.08)' 
    : 'rgba(255,140,0,0.12)'}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    background: 'radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2.5),
    borderRadius: 14,
    marginBottom: theme.spacing(2),
  },
}))

const StatsBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.12)'
    : 'rgba(255,140,0,0.06)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255,140,0,0.15)'
    : 'rgba(255,140,0,0.1)'}`,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#FF8C00',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.3, 1),
    fontSize: '0.65rem',
  },
}))

export default function Categories() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCategories, setTotalCategories] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterFeatured, setFilterFeatured] = useState(false)
  const itemsPerPage = isXs ? 6 : isSm ? 9 : 15

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL('http://localhost:5000/api/categories')
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
        throw new Error(data.message || 'خطا در دریافت دسته‌بندی‌ها')
      }

      const categoriesData = data.categories || data.data || data || []
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      
      setTotalPages(data.totalPages || data.pagination?.totalPages || 1)
      setTotalCategories(data.total || data.pagination?.total || categoriesData.length || 0)

    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message || 'خطا در دریافت دسته‌بندی‌ها. لطفاً دوباره تلاش کنید.')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm, itemsPerPage, sortBy, filterFeatured])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setTimeout(() => fetchCategories(), 0)
    if (isXs) setShowMobileSearch(false)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryClick = (categoryId, slug) => {
    navigate(`/categories/${slug || categoryId}`)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
    setTimeout(() => fetchCategories(), 0)
  }

  const renderSkeletons = () => {
    const count = isXs ? 4 : isSm ? 6 : 10
    return (
      <CategoryGrid viewMode="grid">
        {[...Array(count)].map((_, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Skeleton 
              variant="rounded" 
              height={isXs ? 180 : 240} 
              sx={{ 
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.06), rgba(0,0,0,0.03))',
                backgroundSize: '200% 100%',
                animation: `${shimmerAnimation} 1.5s ease-in-out infinite`,
              }} 
            />
          </Box>
        ))}
      </CategoryGrid>
    )
  }

  const renderHeader = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: isXs ? 'flex-start' : 'center',
      mb: { xs: 1.5, sm: 2 },
      flexDirection: isXs ? 'column' : 'row',
      gap: isXs ? 1.5 : 0,
    }}>
      <Breadcrumbs 
        sx={{ 
          '& .MuiBreadcrumbs-separator': { 
            mx: { xs: 0.5, sm: 0.8 },
            color: 'text.disabled',
          },
          '& .MuiBreadcrumbs-ol': {
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          },
          '& .MuiTypography-root': {
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            fontWeight: 500,
          },
          '& .MuiLink-root': {
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
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
          <Home sx={{ ml: 0.3, fontSize: { xs: 14, sm: 16 } }} />
          <span style={{ display: isXs ? 'none' : 'inline', fontSize: '0.75rem' }}>خانه</span>
        </Link>
        <Typography color="#FF8C00" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
          <CategoryIcon sx={{ ml: 0.3, fontSize: { xs: 14, sm: 16 } }} />
          دسته‌بندی‌ها
        </Typography>
      </Breadcrumbs>

      <GradientButton
        onClick={() => navigate("/createCategory")}
        endIcon={!isXs && <Add />}
        sx={{
          minWidth: isXs ? 'auto' : undefined,
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 0.7, sm: 1 },
        }}
      >
        {isXs ? '+' : 'دسته‌بندی جدید'}
      </GradientButton>
    </Box>
  )

  const renderHeroSection = () => (
    <HeroSection>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={1.5} 
          alignItems="center" 
          justifyContent="space-between"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flex: 1,
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              p: 1,
              borderRadius: '50%',
              bgcolor: 'rgba(255,140,0,0.08)',
            }}>
              <CategoryIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#FF8C00' }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color="#FF8C00"
                sx={{
                  mb: 0.2,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                }}
              >
                دسته‌بندی‌ها
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                {totalCategories > 0 
                  ? `${totalCategories} دسته‌بندی فعال` 
                  : 'هنوز دسته‌بندی ایجاد نشده'}
              </Typography>
            </Box>
          </Box>
          
          {totalCategories > 0 && (
            <StatsBadge sx={{ 
              flexShrink: 0,
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}>
              <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 } }} />
              <Typography component="span" fontWeight={700} sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                {totalCategories}
              </Typography>
              <Typography component="span" sx={{ opacity: 0.7, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                دسته‌بندی
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
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              sx={{
                flex: 1,
                borderRadius: 12,
                borderColor: 'rgba(255,140,0,0.15)',
                color: searchTerm ? '#FF8C00' : 'text.secondary',
                justifyContent: 'flex-start',
                py: 1.2,
                bgcolor: searchTerm ? 'rgba(255,140,0,0.04)' : 'transparent',
                fontSize: '0.75rem',
                '&:hover': {
                  borderColor: '#FF8C00',
                  backgroundColor: 'rgba(255,140,0,0.04)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {searchTerm ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
                  <Typography noWrap sx={{ flex: 1, fontWeight: 500, fontSize: '0.75rem' }}>
                    "{searchTerm}"
                  </Typography>
                  <Chip 
                    label={`${categories.length}`} 
                    size="small"
                    sx={{ 
                      borderRadius: 1.5,
                      bgcolor: '#FF8C00',
                      color: '#fff',
                      height: 18,
                      '& .MuiChip-label': { fontSize: '0.55rem', px: 0.8 },
                    }}
                  />
                </Box>
              ) : (
                'جستجوی دسته‌بندی...'
              )}
            </Button>
            <Stack direction="row" spacing={0.3}>
              <IconButton
                onClick={() => setViewMode('grid')}
                size="small"
                sx={{ 
                  bgcolor: viewMode === 'grid' ? '#FF8C00' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'inherit',
                  borderRadius: 1.5,
                  p: 0.7,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: viewMode === 'grid' ? '#e67e00' : 'rgba(255,140,0,0.08)',
                  },
                }}
              >
                <GridView sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                size="small"
                sx={{ 
                  bgcolor: viewMode === 'list' ? '#FF8C00' : 'transparent',
                  color: viewMode === 'list' ? '#fff' : 'inherit',
                  borderRadius: 1.5,
                  p: 0.7,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: viewMode === 'list' ? '#e67e00' : 'rgba(255,140,0,0.08)',
                  },
                }}
              >
                <ViewList sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          <Collapse in={showMobileSearch}>
            <GlassPaper sx={{ p: 1.5, mb: 1.5 }}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  autoFocus
                  placeholder="جستجوی دسته‌بندی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#FF8C00', fontSize: 18 }} />
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
                      borderRadius: 10,
                      bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                      fontSize: '0.8rem',
                    }
                  }}
                />
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    sx={{
                      bgcolor: '#FF8C00',
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      py: 0.8,
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
                    sx={{ 
                      borderRadius: 10, 
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      px: 1.5,
                    }}
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
          spacing={1.5}
          alignItems="center"
        >
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, width: '100%' }}>
            <StyledTextField
              fullWidth
              placeholder="جستجوی دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit" sx={{ color: '#FF8C00', p: 0.5 }}>
                      <Search sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} size="small">
                      <Close sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <FilterChip
              icon={<NewReleases sx={{ fontSize: '1rem' }} />}
              label="جدیدترین"
              active={sortBy === 'newest'}
              onClick={() => setSortBy('newest')}
            />
            <FilterChip
              icon={<Star sx={{ fontSize: '1rem' }} />}
              label="محبوب‌ترین"
              active={sortBy === 'popular'}
              onClick={() => setSortBy('popular')}
            />
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.3 }} />
            
            <IconButton
              onClick={() => setViewMode('grid')}
              size="small"
              sx={{ 
                bgcolor: viewMode === 'grid' ? '#FF8C00' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'grid' ? '#e67e00' : 'rgba(255,140,0,0.08)' },
                borderRadius: 1.5,
                transition: 'all 0.3s ease',
                p: 0.8,
              }}
            >
              <GridView sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              size="small"
              sx={{ 
                bgcolor: viewMode === 'list' ? '#FF8C00' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'inherit',
                '&:hover': { bgcolor: viewMode === 'list' ? '#e67e00' : 'rgba(255,140,0,0.08)' },
                borderRadius: 1.5,
                transition: 'all 0.3s ease',
                p: 0.8,
              }}
            >
              <ViewList sx={{ fontSize: 20 }} />
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
              <IconButton color="inherit" onClick={fetchCategories} size="small">
                <Search sx={{ fontSize: 20 }} />
              </IconButton>
            }
            sx={{ 
              borderRadius: 2.5,
              '& .MuiAlert-icon': { fontSize: 22 },
              '& .MuiAlert-message': { fontSize: '0.85rem' },
            }}
          >
            {error}
          </Alert>
        </Fade>
      )
    }

    if (categories.length === 0) {
      return (
        <Fade in timeout={500}>
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 0 },
          }}>
            <Box sx={{ 
              display: 'inline-flex',
              p: 2.5,
              borderRadius: '50%',
              bgcolor: 'rgba(255,140,0,0.06)',
              mb: 2,
              animation: `${floatAnimation} 3s ease-in-out infinite`,
            }}>
              <CategoryIcon sx={{ fontSize: { xs: 40, sm: 52 }, color: '#FF8C00' }} />
            </Box>
            <Typography variant={isXs ? 'h6' : 'h5'} fontWeight={700} color="text.primary" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
              {searchTerm ? 'نتیجه‌ای یافت نشد' : 'دسته‌بندی‌ای وجود ندارد'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
              {searchTerm 
                ? `هیچ دسته‌بندی با عبارت "${searchTerm}" پیدا نشد.`
                : 'اولین دسته‌بندی را ایجاد کنید و محتوای خود را سازماندهی نمایید.'}
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                onClick={clearSearch}
                sx={{ 
                  mt: 2, 
                  borderRadius: 2.5,
                  borderColor: '#FF8C00',
                  color: '#FF8C00',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#e67e00',
                    bgcolor: 'rgba(255,140,0,0.04)',
                  },
                }}
              >
                پاک کردن جستجو
              </Button>
            )}
            {!searchTerm && (
              <GradientButton
                onClick={() => navigate("/createCategory")}
                startIcon={<Add />}
                sx={{ mt: 2 }}
              >
                ایجاد دسته‌بندی جدید
              </GradientButton>
            )}
          </Box>
        </Fade>
      )
    }

    return (
      <CategoryGrid viewMode={viewMode}>
        {categories.map((category, index) => (
          <Zoom 
            in 
            timeout={300} 
            key={category._id} 
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            <Box sx={{ height: '100%' }}>
              <CategoryCard 
                category={category} 
                onClick={() => handleCategoryClick(category._id, category.slug)}
                viewMode={viewMode}
              />
            </Box>
          </Zoom>
        ))}
      </CategoryGrid>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 2, md: 3 }, direction: 'rtl' }}>
      {renderHeader()}
      {renderHeroSection()}
      {renderSearchSection()}
      {renderContent()}

      {!loading && categories.length > 0 && totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: 3, sm: 4 },
          '& .MuiPagination-root': {
            '& .MuiPaginationItem-root': {
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              minWidth: { xs: 32, sm: 38 },
              height: { xs: 32, sm: 38 },
              borderRadius: 1.5,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,140,0,0.06)',
              },
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
              color: '#fff',
              boxShadow: '0 3px 12px rgba(255, 140, 0, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E65100, #FF6F00)',
                boxShadow: '0 4px 16px rgba(255, 140, 0, 0.3)',
              },
            },
          }
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isXs ? 'small' : 'medium'}
            siblingCount={isXs ? 0 : 1}
            boundaryCount={isXs ? 1 : 2}
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  )
}