
// Funções para gerenciar o carrinho no localStorage
export const getCart = () => {
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export const addToCart = (items) => {
  const cart = getCart()
  const newCart = [...cart, ...items]
  localStorage.setItem('cart', JSON.stringify(newCart))
  // Dispara o evento para abrir o carrinho
  window.dispatchEvent(new Event('openCart'))
  return newCart
}

export const removeFromCart = (itemId) => {
  const cart = getCart()
  const newCart = cart.filter(item => item.id !== itemId)
  localStorage.setItem('cart', JSON.stringify(newCart))
  return newCart
}

export const clearCart = () => {
  localStorage.setItem('cart', JSON.stringify([]))
  return []
}
