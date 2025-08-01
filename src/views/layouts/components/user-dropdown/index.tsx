// ** Mui Imports
import { Badge, styled } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const UserDropdown = (props: TProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const { user, logout } = useAuth()
  const router = useRouter()

  const { t } = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateMyProfile = () => {
    router.push(`/${ROUTE_CONFIG.MY_PROFILE}`)
  }

  const handleNavigateOrderHistory = () => {
    router.push(`/${ROUTE_CONFIG.ORDER_HISTORY}`)
  }

  const handleNavigateAdmin = () => {
    router.push(`/${ROUTE_CONFIG.DASHBOARD}`)
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.avatar ? (
                  <Image src={user?.avatar || ''} alt='avatar' width={80} height={80} />
                ) : (
                  <IconifyIcon icon='clarity:avatar-line' />
                )}
              </Avatar>
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2, py: 2, px: 2 }}>
          <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.avatar ? (
                <Image
                  src={user?.avatar || ''}
                  alt='avatar'
                  width={0}
                  height={0}
                  style={{
                    height: '32px',
                    width: '32px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <IconifyIcon icon='ph:user-thin' />
              )}
            </Avatar>
          </StyledBadge>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography component={'span'}>{user?.fullName}</Typography>
            <Typography component={'span'}>{user?.role?.name}</Typography>
          </Box>
        </Box>
        <Divider />
        {user?.role?.code === 'ADMIN' && (
          <MenuItem onClick={handleNavigateAdmin}>
            <Avatar>
              <IconifyIcon icon='clarity:administrator-line' />
            </Avatar>{' '}
            {t('admin-dashboard')}
          </MenuItem>
        )}

        <MenuItem onClick={handleNavigateMyProfile}>
          <Avatar>
            <IconifyIcon icon='ph:user-thin' />
          </Avatar>{' '}
          {t('my-profile')}
        </MenuItem>

        <MenuItem onClick={handleNavigateOrderHistory}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <IconifyIcon icon='lets-icons:order-light' />
          </Avatar>
          {t('order-history')}
        </MenuItem>

        <MenuItem onClick={logout}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <IconifyIcon icon='teenyicons:password-outline' />
          </Avatar>
          {t('change-password')}
        </MenuItem>

        <Divider />
        <MenuItem onClick={logout}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <IconifyIcon icon='material-symbols:logout' />
          </Avatar>
          {t('logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default UserDropdown
