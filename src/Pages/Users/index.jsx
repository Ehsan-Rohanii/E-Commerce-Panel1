// pages/admin/Users.jsx - نسخه با input معمولی
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  Alert,
  Snackbar,
  Skeleton,
  Stack,
  Tooltip,
  useTheme,
  Switch,
  FormControlLabel,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import {
  Search,
  Edit,
  Delete,
  Close,
  Save,
  PersonAdd,
  AdminPanelSettings,
  Person,
  Phone,
  Lock,
  VpnKey,
  CalendarToday,
  Refresh,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// استایل‌ها
const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 32,
  flexWrap: 'wrap',
  gap: 16,
  direction: 'rtl',
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
  overflow: 'hidden',
  direction: 'rtl',
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f8f8',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    textAlign: 'right',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
  },
  '& .MuiTableCell-body': {
    textAlign: 'right',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}`,
  },
}))

const SearchField = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: 12,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f8f8',
  fontSize: '1rem',
  textAlign: 'right',
  outline: 'none',
  transition: 'all 0.3s ease',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  '&:focus': {
    borderColor: '#FF8C00',
    boxShadow: '0 0 0 3px rgba(255,140,0,0.1)',
  },
  '&::placeholder': {
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  },
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 8,
  padding: 6,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}))

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 1,
  fontWeight: 500,
  fontSize: '0.75rem',
  backgroundColor: status === 'active' 
    ? 'rgba(76, 175, 80, 0.15)' 
    : 'rgba(244, 67, 54, 0.15)',
  color: status === 'active' ? '#4CAF50' : '#f44336',
}))

const RoleChip = styled(Chip)(({ theme, role }) => ({
  borderRadius: 1,
  fontWeight: 500,
  fontSize: '0.7rem',
  backgroundColor: role === 'admin' 
    ? 'rgba(255, 140, 0, 0.15)' 
    : 'rgba(33, 150, 243, 0.15)',
  color: role === 'admin' ? '#FF8C00' : '#2196F3',
}))

// استایل input معمولی برای مودال
const ModalInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#fafafa',
  fontSize: '0.95rem',
  textAlign: 'right',
  outline: 'none',
  transition: 'all 0.3s ease',
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  '&:focus': {
    borderColor: '#FF8C00',
    boxShadow: '0 0 0 3px rgba(255,140,0,0.1)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  '&::placeholder': {
    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
  },
}))

const ModalLabel = styled('label')(({ theme }) => ({
  display: 'block',
  marginBottom: 6,
  fontSize: '0.85rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
  textAlign: 'right',
}))

export default function Users() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    birthDate: '',
    role: 'user',
    isActive: true,
    password: '',
    confirmPassword: '',
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage, searchTerm])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = new URL('http://localhost:5000/api/users')
      url.searchParams.append('page', page + 1)
      url.searchParams.append('limit', rowsPerPage)
      if (searchTerm.trim()) {
        url.searchParams.append('search', searchTerm.trim())
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در دریافت کاربران')
      }

      const result = await response.json()
      
      let usersArray = []
      let totalCount = 0

      if (result.success && result.data) {
        if (result.data.users && Array.isArray(result.data.users)) {
          usersArray = result.data.users
          totalCount = result.data.total || result.data.users.length
        } else if (Array.isArray(result.data)) {
          usersArray = result.data
          totalCount = result.total || result.data.length
        }
      } else if (result.users && Array.isArray(result.users)) {
        usersArray = result.users
        totalCount = result.total || result.users.length
      }

      setUsers(usersArray)
      setTotalUsers(totalCount)

    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
      setUsers([])
      setTotalUsers(0)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true,
      password: '',
      confirmPassword: '',
    })
    setOpenEditDialog(true)
  }

  const handleOpenDelete = (user) => {
    setSelectedUser(user)
    setOpenDeleteDialog(true)
  }

  const handleOpenAdd = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      birthDate: '',
      role: 'user',
      isActive: true,
      password: '',
      confirmPassword: '',
    })
    setOpenAddDialog(true)
  }

  const handleEditUser = async () => {
    try {
      const updateData = {}
      
      if (formData.fullName !== selectedUser.fullName) {
        updateData.fullName = formData.fullName
      }
      if (formData.birthDate !== (selectedUser.birthDate ? new Date(selectedUser.birthDate).toISOString().split('T')[0] : '')) {
        updateData.birthDate = formData.birthDate ? new Date(formData.birthDate).toISOString() : null
      }
      if (formData.role !== selectedUser.role) {
        updateData.role = formData.role
      }

      if (formData.isActive !== selectedUser.isActive) {
        const activeResponse = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/active-session`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })

        if (!activeResponse.ok) {
          const errorData = await activeResponse.json()
          throw new Error(errorData.message || 'خطا در تغییر وضعیت کاربر')
        }
      }

      if (Object.keys(updateData).length > 0) {
        const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(updateData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'خطا در ویرایش کاربر')
        }
      }

      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          showSnackbar('رمز عبور و تکرار آن مطابقت ندارند', 'error')
          return
        }
        const passResponse = await fetch(`http://localhost:5000/api/users/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            oldPassword: '',
            newPassword: formData.password,
          }),
        })

        if (!passResponse.ok) {
          const errorData = await passResponse.json()
          throw new Error(errorData.message || 'خطا در تغییر رمز عبور')
        }
      }

      showSnackbar('کاربر با موفقیت ویرایش شد', 'success')
      setOpenEditDialog(false)
      fetchUsers()

    } catch (err) {
      showSnackbar(err.message, 'error')
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در حذف کاربر')
      }

      showSnackbar('کاربر با موفقیت حذف شد', 'success')
      setOpenDeleteDialog(false)
      fetchUsers()

    } catch (err) {
      showSnackbar(err.message, 'error')
    }
  }

  const handleAddUser = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        showSnackbar('رمز عبور و تکرار آن مطابقت ندارند', 'error')
        return
      }

      const newUser = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        role: formData.role,
        password: formData.password,
      }

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در ایجاد کاربر')
      }

      showSnackbar('کاربر با موفقیت ایجاد شد', 'success')
      setOpenAddDialog(false)
      fetchUsers()

    } catch (err) {
      showSnackbar(err.message, 'error')
    }
  }

  const handleToggleActive = async (user) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/active-session`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در تغییر وضعیت')
      }

      showSnackbar(`وضعیت کاربر با موفقیت تغییر کرد`, 'success')
      fetchUsers()

    } catch (err) {
      showSnackbar(err.message, 'error')
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (date) => {
    if (!date) return '—'
    try {
      const d = new Date(date)
      return d.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return '—'
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, direction: 'rtl' }}>
      {/* Header */}
      <PageHeader>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#FF8C00" gutterBottom>
            مدیریت کاربران
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalUsers > 0 ? `${totalUsers} کاربر در سیستم` : 'هیچ کاربری یافت نشد'}
          </Typography>
        </Box>
        <Stack direction="row" sx={{gap:1}}>
          <Button
            variant="outlined"
            onClick={fetchUsers}
            startIcon={<Refresh />}
            sx={{
              borderRadius: 12,
              borderColor: '#FF8C00',
              color: '#FF8C00',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#FF6F00',
                backgroundColor: 'rgba(255,140,0,0.08)',
              },
            }}
          >
            بروزرسانی
          </Button>
        </Stack>
      </PageHeader>

      {/* Search */}
      <StyledPaper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <SearchField
            type="text"
            placeholder="جستجوی کاربران بر اساس نام یا شماره تلفن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <Search sx={{ color: '#FF8C00', fontSize: 22 }} />
          </Box>
          {searchTerm && (
            <Box 
              sx={{ 
                position: 'absolute', 
                right: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
              onClick={() => setSearchTerm('')}
            >
              <Close sx={{ color: '#999', fontSize: 20 }} />
            </Box>
          )}
        </Box>
      </StyledPaper>

      {/* Table */}
      <StyledPaper>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>کاربر</TableCell>
                <TableCell>شماره تلفن</TableCell>
                <TableCell>تاریخ تولد</TableCell>
                <TableCell>نقش</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={120} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      کاربری یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <StyledTableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            bgcolor: user.role === 'admin' ? '#FF8C00' : '#2196F3',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {(user.fullName || 'U')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={500}>
                            {user.fullName || 'بدون نام'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user._id?.slice(-6) || '---'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell dir="ltr">{user.phoneNumber || '—'}</TableCell>
                    <TableCell>{formatDate(user.birthDate)}</TableCell>
                    <TableCell>
                      <RoleChip sx={{borderRadius:5 , px:1}}
                        role={user.role}
                        label={user.role === 'admin' ? 'مدیر' : 'کاربر'}
                        icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={user.isActive ? 'فعال' : 'غیرفعال'}
                        onClick={() => handleToggleActive(user)}
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: user.isActive 
                            ? 'rgba(76, 175, 80, 0.15)' 
                            : 'rgba(244, 67, 54, 0.15)',
                          color: user.isActive ? '#4CAF50' : '#f44336',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="ویرایش">
                          <ActionButton onClick={() => handleOpenEdit(user)} sx={{ color: '#FF8C00' }}>
                            <Edit />
                          </ActionButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <ActionButton onClick={() => handleOpenDelete(user)} sx={{ color: '#f44336' }}>
                            <Delete />
                          </ActionButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در صفحه:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} از ${count}`
          }
          sx={{
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            direction: 'rtl',
          }}
        />
      </StyledPaper>

      {/* ==================== EDIT DIALOG ==================== */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <Box sx={{ direction: 'rtl' }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <Typography variant="h6" fontWeight={600}>
              ویرایش کاربر
            </Typography>
            <IconButton onClick={() => setOpenEditDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
          
          {/* Content */}
          <Box sx={{ padding: '24px' }}>
            <Box sx={{ mb: 2 }}>
              <ModalLabel>نام کامل</ModalLabel>
              <ModalInput
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="نام کامل را وارد کنید"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>شماره تلفن</ModalLabel>
              <ModalInput
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                disabled
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>تاریخ تولد</ModalLabel>
              <ModalInput
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleFormChange}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>نقش</ModalLabel>
              <FormControl fullWidth size="medium">
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  sx={{
                    borderRadius: 2,
                    textAlign: 'right',
                    '& .MuiSelect-select': {
                      textAlign: 'right',
                      padding: '12px 16px',
                    },
                  }}
                >
                  <MenuItem value="user">کاربر</MenuItem>
                  <MenuItem value="admin">مدیر</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    name="isActive"
                    sx={{
                      '&.Mui-checked': {
                        color: '#4CAF50',
                      },
                    }}
                  />
                }
                label={formData.isActive ? 'فعال' : 'غیرفعال'}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>رمز عبور جدید (اختیاری)</ModalLabel>
              <ModalInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="رمز عبور جدید را وارد کنید"
              />
            </Box>
            
            {formData.password && (
              <Box sx={{ mb: 2 }}>
                <ModalLabel>تکرار رمز عبور</ModalLabel>
                <ModalInput
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="رمز عبور را تکرار کنید"
                />
              </Box>
            )}
          </Box>
          
          {/* Footer */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            gap: 1,
          }}>
            <Button onClick={() => setOpenEditDialog(false)}>انصراف</Button>
            <Button
              variant="contained"
              onClick={handleEditUser}
              endIcon={<Save />}
              sx={{
                gap:1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e65100, #e67e00)',
                },
              }}
            >
              ذخیره تغییرات
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* ==================== DELETE DIALOG ==================== */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)} 
        maxWidth="xs" 
        fullWidth
      >
        <Box sx={{ direction: 'rtl' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <Typography variant="h6" fontWeight={600}>
              حذف کاربر
            </Typography>
            <IconButton onClick={() => setOpenDeleteDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
          
          <Box sx={{ padding: '24px', textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Delete sx={{ fontSize: 32, color: '#f44336' }} />
            </Box>
            
            <Typography variant="h6" fontWeight={600} gutterBottom>
              آیا از حذف این کاربر اطمینان دارید؟
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {selectedUser?.fullName || 'بدون نام'}
              <br />
              {selectedUser?.phoneNumber || '—'}
            </Typography>
            
            <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
              این عملیات قابل بازگشت نیست!
            </Alert>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            gap: 1,
          }}>
            <Button onClick={() => setOpenDeleteDialog(false)}>انصراف</Button>
            <Button
              variant="contained"
              onClick={handleDeleteUser}
              startIcon={<Delete />}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f44336',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              حذف کاربر
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* ==================== ADD DIALOG ==================== */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <Box sx={{ direction: 'rtl' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <Typography variant="h6" fontWeight={600}>
              افزودن کاربر جدید
            </Typography>
            <IconButton onClick={() => setOpenAddDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
          
          <Box sx={{ padding: '24px' }}>
            <Box sx={{ mb: 2 }}>
              <ModalLabel>نام کامل</ModalLabel>
              <ModalInput
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="نام کامل را وارد کنید"
                required
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>شماره تلفن</ModalLabel>
              <ModalInput
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                placeholder="شماره تلفن را وارد کنید"
                required
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>تاریخ تولد</ModalLabel>
              <ModalInput
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleFormChange}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>نقش</ModalLabel>
              <FormControl fullWidth size="medium">
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  sx={{
                    borderRadius: 2,
                    textAlign: 'right',
                    '& .MuiSelect-select': {
                      textAlign: 'right',
                      padding: '12px 16px',
                    },
                  }}
                >
                  <MenuItem value="user">کاربر</MenuItem>
                  <MenuItem value="admin">مدیر</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    name="isActive"
                    sx={{
                      '&.Mui-checked': {
                        color: '#4CAF50',
                      },
                    }}
                  />
                }
                label={formData.isActive ? 'فعال' : 'غیرفعال'}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>رمز عبور</ModalLabel>
              <ModalInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="رمز عبور را وارد کنید"
                required
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <ModalLabel>تکرار رمز عبور</ModalLabel>
              <ModalInput
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                placeholder="رمز عبور را تکرار کنید"
                required
              />
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            gap: 1,
          }}>
            <Button onClick={() => setOpenAddDialog(false)}>انصراف</Button>
            <Button
              variant="contained"
              onClick={handleAddUser}
              startIcon={<PersonAdd />}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF6F00, #FF8C00)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e65100, #e67e00)',
                },
              }}
            >
              افزودن کاربر
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            borderRadius: 2,
            width: '100%',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}