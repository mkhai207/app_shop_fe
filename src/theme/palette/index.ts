// ** Type Imports
import { Palette } from '@mui/material'
import { Skin } from 'src/types/layouts'

const DefaultPalette = (mode: Palette['mode'], skin: Skin): Palette => {
  // ** Vars
  const whiteColor = '#FFF'
  const lightColor = 'rgb(47, 43, 61)'
  const darkColor = 'rgb(208, 212, 241)'
  const darkPaperBgColor = '#2F3349'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor
    } else if (mode === 'light') {
      return '#F8F7FA'
    } else return '#25293C'
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C', // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      borderColor: mode === 'light' ? '#E0E0E0' : '#4A5072' // them
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor
    },
    primary: {
      light: '#8479F2',
      main: '#7367F0',
      dark: '#655BD3',
      contrastText: whiteColor
    },
    secondary: {
      light: '#B2B4B8',
      main: '#A8AAAE',
      dark: '#949699',
      contrastText: whiteColor
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor
    },
    warning: {
      light: '#FFAB5A',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },
    text: {
      primary: mode === 'light' ? 'rgba(47, 43, 61, 0.78)' : 'rgba(208, 212, 241, 0.78)',
      secondary: mode === 'light' ? 'rgba(47, 43, 61, 0.68)' : 'rgba(208, 212, 241, 0.68)',
      disabled: mode === 'light' ? 'rgba(47, 43, 61, 0.42)' : 'rgba(208, 212, 241, 0.42)'
    },
    divider: mode === 'light' ? 'rgba(47, 43, 61, 0.16)' : 'rgba(208, 212, 241, 0.16)',
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor()
    },
    action: {
      active: mode === 'light' ? 'rgba(47, 43, 61, 0.54)' : 'rgba(208, 212, 241, 0.54)',
      hover: mode === 'light' ? 'rgba(47, 43, 61, 0.04)' : 'rgba(208, 212, 241, 0.04)',
      selected: mode === 'light' ? 'rgba(47, 43, 61, 0.06)' : 'rgba(208, 212, 241, 0.06)',
      selectedOpacity: 0.06,
      disabled: mode === 'light' ? 'rgba(47, 43, 61, 0.26)' : 'rgba(208, 212, 241, 0.26)',
      disabledBackground: mode === 'light' ? 'rgba(47, 43, 61, 0.12)' : 'rgba(208, 212, 241, 0.12)',
      focus: mode === 'light' ? 'rgba(47, 43, 61, 0.12)' : 'rgba(208, 212, 241, 0.12)'
    }
  } as Palette
}

export default DefaultPalette
