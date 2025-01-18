import { CartItem, CartAction } from '@/types/cart'

export const addToCart = (dispatch: React.Dispatch<CartAction>, item: CartItem) => {
  dispatch({ type: 'ADD_TO_CART', payload: item })
}

export const removeFromCart = (dispatch: React.Dispatch<CartAction>, item: Omit<CartItem, 'quantity'>) => {
  dispatch({ type: 'REMOVE_FROM_CART', payload: item })
}

export const updateQuantity = (dispatch: React.Dispatch<CartAction>, item: CartItem) => {
  dispatch({ type: 'UPDATE_QUANTITY', payload: item })
}

export const clearCart = (dispatch: React.Dispatch<CartAction>) => {
  dispatch({ type: 'CLEAR_CART' })
}
