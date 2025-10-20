// API Product Types
export interface ProductSize {
  size: string
  coefficient: number
}

export interface CalculatedPrice {
  size: string
  coefficient: number
  price: number
}

export interface PerimeterPricing {
  maxPerimeter: number
  priceUSD: number
  hasDoubleDoorOption: boolean
  hasInstallationTypeOption: boolean
  doubleDoorSurcharge?: number
  ceilingSurcharge?: number
  exampleWidth: number
  exampleHeight: number
}

export interface ProductTranslations {
  ru?: {
    name?: string
    description?: string
  }
  uz?: {
    name?: string
    description?: string
  }
  en?: {
    name?: string
    description?: string
  }
}

export interface Product {
  _id: string
  name: string | { ru: string; uz: string; en?: string }
  description: string | { ru: string; uz: string; en?: string }
  name_ru?: string
  name_uz?: string
  description_ru?: string
  description_uz?: string
  translations?: ProductTranslations
  basePrice: number
  category: string
  sizes: ProductSize[]
  images: string[]
  mainImage: string | null
  calculatedPrices: CalculatedPrice[]
  perimeterPricing?: PerimeterPricing[]
  createdAt: string
  updatedAt: string
}

// Local Product Types (for compatibility with existing code)
export interface LocalProductSize {
  id: string
  label: string
  width: number
  height: number
  priceUSD: number
}

export interface LocalProduct {
  id: string
  name: string
  description: string
  image: string
}

export interface LocalProductConfig {
  name: string
  description: string
  basePrice: number
  image: string
}

// API Response Types
export interface ProductsResponse {
  success: boolean
  data: Product[]
  message?: string
}

// Error Types
export class ApiError extends Error {
  status?: number
  
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Language utilities
export type SupportedLanguage = 'ru' | 'uz' | 'en'

export function getLocalizedText(
  product: Product, 
  field: 'name' | 'description', 
  language: SupportedLanguage = 'ru'
): string {
  // Handle new API format where name/description are objects
  if (field === 'name') {
    if (typeof product.name === 'object' && product.name !== null) {
      const result = product.name[language] || product.name.ru || ''
      console.log('getLocalizedText name object:', { language, result, productName: product.name })
      return result
    }
    if (typeof product.name === 'string') {
      return product.name
    }
  }
  
  if (field === 'description') {
    if (typeof product.description === 'object' && product.description !== null) {
      const result = product.description[language] || product.description.ru || ''
      console.log('getLocalizedText description object:', { language, result, productDescription: product.description })
      return result
    }
    if (typeof product.description === 'string') {
      return product.description
    }
  }
  
  // Try to get language-specific field first (old API format)
  if (field === 'name') {
    if (language === 'ru' && product.name_ru) {
      return product.name_ru
    }
    if (language === 'uz' && product.name_uz) {
      return product.name_uz
    }
  }
  
  if (field === 'description') {
    if (language === 'ru' && product.description_ru) {
      return product.description_ru
    }
    if (language === 'uz' && product.description_uz) {
      return product.description_uz
    }
  }
  
  // Try to get translation from translations object (oldest format)
  if (product.translations?.[language]?.[field]) {
    return product.translations[language][field]!
  }
  
  // Fallback to default field
  if (field === 'name') {
    return typeof product.name === 'string' ? product.name : `cfg.products.${product.category}.name`
  }
  
  if (field === 'description') {
    return typeof product.description === 'string' ? product.description : `cfg.products.${product.category}.desc`
  }
  
  return ''
}
