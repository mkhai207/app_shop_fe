// ** Mui Imports
import { Badge } from '@mui/material'
import { Icon } from '@iconify/react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

type TProps = {}

const CartProduct = (props: TProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const { t } = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('cart')}>
          <IconButton onClick={handleClick} size='small' sx={{ ml: 2 }} color='inherit'>
            <Badge color='primary' badgeContent={2}>
              <Icon icon='material-symbols:shopping-cart' />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  )
}

export default CartProduct
