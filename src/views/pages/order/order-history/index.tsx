import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

const OrderHistoryPage = () => {
  const orders = [
    {
      id: 'TBT15454841',
      product: "World's Most Expensive T Shirt",
      category: "Women's Clothes",
      date: '01 Jul, 2022',
      amount: '$287.53',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-800',
      icon: '👔',
      iconBg: 'bg-gray-100'
    },
    {
      id: 'TBT15425012',
      product: 'Onyx SmartGRID Chair Red',
      category: 'Furniture & Decor',
      date: '01 Feb, 2023',
      amount: '$39.99',
      status: 'Shipping',
      statusColor: 'bg-purple-100 text-purple-800',
      icon: '🪑',
      iconBg: 'bg-red-100'
    },
    {
      id: 'TBT1524563',
      product: 'Slippers Open Toe',
      category: 'Footwear',
      date: '09 Dec, 2022',
      amount: '$874.00',
      status: 'Out Of Delivery',
      statusColor: 'bg-red-100 text-red-800',
      icon: '👡',
      iconBg: 'bg-green-100'
    },
    {
      id: 'TBT1524530',
      product: 'Hp Trendsetter Backpack',
      category: 'Handbags & Clutches',
      date: '02 Jan, 2023',
      amount: '$32.00',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-800',
      icon: '🎒',
      iconBg: 'bg-purple-100'
    },
    {
      id: 'TBT13642870',
      product: 'Innovative education book',
      category: 'Books',
      date: '08 Jan, 2023',
      amount: '$18.32',
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      icon: '📚',
      iconBg: 'bg-blue-100'
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ backgroundColor: order.iconBg }}>{order.icon}</Avatar>
                    <Box>
                      <Typography variant='body2' fontWeight={500}>
                        {order.product}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {order.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{order.amount}</TableCell>
                <TableCell>
                  <Chip label={order.status} sx={{ color: order.statusColor }} size='small' />
                </TableCell>
                <TableCell>
                  <Button variant='contained' size='small'>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default OrderHistoryPage
