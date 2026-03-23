
import { supabase } from './supabase'

export const createOrder = async (orderData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        total: orderData.total,
        shipping_address: orderData.shipping_address,
        notes: orderData.notes
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // Criar os itens do pedido
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price.base
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Erro ao criar pedido')
  }
}

export const getUserOrders = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        shipping_address:addresses!shipping_address(
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          postal_code
        ),
        items:order_items(
          quantity,
          price,
          product:products(
            id,
            name,
            images
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw new Error('Erro ao carregar pedidos')
  }
}

export const getOrderById = async (orderId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        shipping_address:addresses!shipping_address(
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          postal_code
        ),
        items:order_items(
          quantity,
          price,
          product:products(
            id,
            name,
            images
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('Erro ao carregar pedido')
  }
}
