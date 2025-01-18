'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, CartAction, CartState } from '@/types/cart'

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color
      )
      if (existingItemIndex > -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: newItems }
      }
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color)
        )
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size && item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'CLEAR_CART' })
      JSON.parse(savedCart).forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item })
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

