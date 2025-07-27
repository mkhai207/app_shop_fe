import React from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Paper } from '@mui/material'
import { Person, ShoppingBag, LocationOn, ExitToApp } from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'

const DRAWER_WIDTH = 280

const MENU_ITEMS = [
  { id: 'profile', label: 'Thông tin', icon: <Person />, path: '/account/profile' },
  { id: 'orders', label: 'Danh sách đơn hàng', icon: <ShoppingBag />, path: '/account/order' },
  { id: 'addresses', label: 'Địa chỉ', icon: <LocationOn />, path: '/account/addresses' },
  { id: 'logout', label: 'Đăng xuất', icon: <ExitToApp />, path: '/account/logout' }
]

type TProps = {
  children: React.ReactNode
}

const AccountLayout = ({ children }: TProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const activeTab = MENU_ITEMS.find(item => item.path === pathname)?.id || 'profile'

  const handleMenuClick = (itemId: string, path: string) => {
    if (itemId === 'logout') {
      console.log('Đăng xuất...')

      return
    }
    router.push(path)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Drawer
        variant='permanent'
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'white',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#d32f2f', width: 56, height: 56, mr: 2, fontSize: '1.5rem' }}>ML</Avatar>
            <Box>
              <Typography variant='h6' fontWeight='bold'>
                Minh Khải Lê
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                lkhai4617@gmail.com
              </Typography>
            </Box>
          </Box>
        </Box>
        <List sx={{ py: 2 }}>
          {MENU_ITEMS.map(item => (
            <ListItem
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.path)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: activeTab === item.id ? '#e3f2fd' : 'transparent',
                color: activeTab === item.id ? '#1976d2' : 'inherit',
                '&:hover': {
                  bgcolor: activeTab === item.id ? '#e3f2fd' : '#f5f5f5'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.id ? '#1976d2' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ '& .MuiListItemText-primary': { fontWeight: activeTab === item.id ? 600 : 400 } }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 4,
          ml: 0
        }}
      >
        <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
          {children}
        </Paper>
      </Box>
    </Box>
  )
}

export default AccountLayout
