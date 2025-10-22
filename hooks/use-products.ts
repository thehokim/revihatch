import { useState, useEffect } from 'react'
import { fetchProducts, fetchProductsByCategory } from '@/lib/api'
import { Product, SupportedLanguage } from '@/lib/types'

export function useProducts(language: SupportedLanguage = 'ru') {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
      } catch (err) {
        setError('Не удалось загрузить продукты')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [language])

  const loadProductByCategory = async (category: string) => {
    const existingProduct = products.find(p => p.category === category)
    if (existingProduct) {
      return existingProduct
    }

    try {
      const categoryProducts = await fetchProductsByCategory(category)
      if (categoryProducts.length > 0) {
        setProducts(prev => [...prev.filter(p => p.category !== category), ...categoryProducts])
        return categoryProducts[0]
      }
    } catch (error) {}
    
    return null
  }

  const getProductByCategory = (category: string) => {
    return products.find(p => p.category === category)
  }

  const getProductById = (id: string) => {
    return products.find(p => p._id === id)
  }

  return {
    products,
    loading,
    error,
    loadProductByCategory,
    getProductByCategory,
    getProductById
  }
}
