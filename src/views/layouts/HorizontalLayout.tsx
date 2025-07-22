import * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { NextPage } from 'next'
import IconifyIcon from 'src/components/Icon'
import UserDropdown from 'src/views/layouts/components/user-dropdown'
import ModeToggle from './components/mode-toggle'
import LanguageDropDown from './components/language-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

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

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '24px' // keep right padding when drawer closed
        }}
      >
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
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          Fashion Shop
        </Typography>
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
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
