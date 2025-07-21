import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { NextPage } from 'next'
import HorizontalLayout from './HorizontalLayout'

type TProps = {
  children: React.ReactNode
}

// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme()

const LayoutNotApp: NextPage<TProps> = () => {
  //   const [open, setOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <VerticalLayout toggleDrawer={() => {}} open={open} /> */}
      <HorizontalLayout toggleDrawer={() => {}} open={false} isHideMenu />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}></Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp
