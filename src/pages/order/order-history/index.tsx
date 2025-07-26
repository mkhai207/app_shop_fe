import { NextPage } from 'next'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import OrderHistoryPage from 'src/views/pages/order/order-history'

type TProps = {}

const OrderHistory: NextPage<TProps> = () => {
  return (
    <>
      <OrderHistoryPage />
    </>
  )
}

export default OrderHistory

OrderHistory.getLayout = (page: React.ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
