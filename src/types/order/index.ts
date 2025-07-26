type TOrderDetail = {
  quantity: number
  product_variant_id: string
}

export type TCreateOrderForm = {
  paymentMethod: string
  shipping_address: string
  name: string
  phone: string
}

export type TCreateOrder = {
  status?: string
  paymentMethod: string
  orderDetails: TOrderDetail[]
  shipping_address: string
  name: string
  phone: string
  discount_code?: string
}
