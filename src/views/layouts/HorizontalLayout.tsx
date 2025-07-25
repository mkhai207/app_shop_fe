import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import UserDropdown from 'src/views/layouts/components/user-dropdown'
import ModeToggle from './components/mode-toggle'
import LanguageDropDown from './components/language-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import logo from '/public/images/fashion-shop-logo.jpg'
import Image from 'next/image'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHideMenu?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme()

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  const { user } = useAuth()
  const router = useRouter()

  const handleNavigateHome = () => {
    router.push('/')
  }

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isHideMenu && (
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                padding: '20px',
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <IconifyIcon icon='material-symbols:menu' />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleNavigateHome}>
            <Image
              src={logo}
              alt='Shop Logo'
              width={50}
              height={50}
              style={{ objectFit: 'contain', backgroundColor: 'transparent' }}
            />
            <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ mr: 2 }}>
              Fashion Shop
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageDropDown />
          <ModeToggle />
          {user ? (
            <UserDropdown />
          ) : (
            <Button
              variant='contained'
              color='primary'
              sx={{ ml: 2 }}
              onClick={() => {
                router.push(ROUTE_CONFIG.LOGIN)
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
