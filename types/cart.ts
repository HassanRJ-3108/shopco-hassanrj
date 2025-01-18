export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    color: string
    size: string
    quantity: number
  }
  
  export interface CartState {
    items: CartItem[]
  }
  
  export type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'UPDATE_QUANTITY'; payload: CartItem }
    | { type: 'CLEAR_CART' }  