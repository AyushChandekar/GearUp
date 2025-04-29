"use client"

import { createContext, useContext, useState, useEffect } from 'react'

type Product = {
  id: string
  title: string
  price: number
  period: string
  image?: string
}

type CartItem = {
  product: Product
  quantity: number
  startDate?: Date
  endDate?: Date
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number, startDate?: Date, endDate?: Date) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateDates: (productId: string, startDate: Date, endDate: Date) => void
  clearCart: () => void
  cartTotal: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updateDates: () => {},
  clearCart: () => {},
  cartTotal: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on client side only
  useEffect(() => {
    setMounted(true)
    try {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        // Convert string dates back to Date objects
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          startDate: item.startDate ? new Date(item.startDate) : undefined,
          endDate: item.endDate ? new Date(item.endDate) : undefined,
        }))
        setCartItems(cartWithDates)
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems))
      } catch (e) {
        console.error("Failed to save cart to localStorage", e)
      }
    }
  }, [cartItems, mounted])

  const addToCart = (product: Product, quantity = 1, startDate?: Date, endDate?: Date) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                startDate: startDate || item.startDate,
                endDate: endDate || item.endDate,
              }
            : item,
        )
      } else {
        return [...prevItems, { product, quantity, startDate, endDate }]
      }
    })
    openCart()
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const updateDates = (productId: string, startDate: Date, endDate: Date) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, startDate, endDate } : item)),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.price * item.quantity
    return total + itemPrice
  }, 0)

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateDates,
        clearCart,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
