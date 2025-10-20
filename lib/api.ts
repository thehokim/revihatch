import { Product, ProductsResponse, ApiError, getLocalizedText, SupportedLanguage } from './types'

const API_BASE_URL = 'https://api.lyukirevizor.uz/api'

// Mapping of product categories to local images
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'anodos': '/ano1.jpg',
  'napolny': '/nap1.jpg', 
  'floor': '/uni1.png',
  'universal': '/uni1.png',
  'transformer': '/tra1.jpg',
  'wall': '/lyuk1.png',
  'industrial': '/industrial-wall-access-panel-white.jpg',
  'premium': '/premium-anodized-aluminum-hatch.jpg',
  'minimalist': '/minimalist-invisible-wall-hatch-aluminum.jpg'
}

// Function to convert Google Drive URLs to working image URLs
function convertGoogleDriveUrl(url: string): string {
  // Extract file ID from Google Drive URL
  const idMatch = url.match(/[?&]id=([^&]+)/)
  if (!idMatch) return url
  
  const fileId = idMatch[1]
  
  // Try different Google Drive URL formats
  // Format 1: Direct view URL
  const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
  
  // Format 2: Alternative format that sometimes works better
  const altUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  
  // Format 3: Another alternative
  const altUrl2 = `https://lh3.googleusercontent.com/d/${fileId}`
  
  // Return the direct URL first, but we'll add fallback logic
  return directUrl
}

// Function to get safe image URL with fallback (uses API images with proxy)
export function getSafeImageUrl(imageUrl: string | null | undefined, category: string): string {
  // If we have an image URL from API, use it
  if (imageUrl) {
    // Use proxy for Google Drive URLs to avoid CORS issues
    if (imageUrl.includes('drive.google.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  }
  
  // Fallback to category-based local image if no API image provided
  return PRODUCT_IMAGE_MAP[category] || '/placeholder.svg'
}

// Function to get diverse images for configurator (uses API images with proxy)
export function getDiverseImageUrl(imageUrl: string | null | undefined, category: string, index: number = 0): string {
  // If we have an image URL from API, use it
  if (imageUrl) {
    // Use proxy for Google Drive URLs to avoid CORS issues
    if (imageUrl.includes('drive.google.com')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  }
  
  // Fallback to local images only if no API image provided
  const baseImage = PRODUCT_IMAGE_MAP[category] || '/placeholder.svg'
  return getVariedImageUrl(baseImage, index)
}

// Helper function to get varied local images based on index
function getVariedImageUrl(baseImage: string, index: number): string {
  // Map of category variations for different image indices
  const imageVariations: Record<string, string[]> = {
    'anodos': ['/ano1.jpg', '/ano2.jpg', '/ano3.png'],
    'napolny': ['/nap1.jpg', '/nap2.jpg', '/nap3.jpg'],
    'transformer': ['/tra1.jpg', '/tra2.jpg', '/tra3.jpg'],
    'floor': ['/uni1.png', '/uni2.png', '/uni3.png'],
    'universal': ['/uni1.png', '/uni2.png', '/uni3.png'],
    'wall': ['/lyuk1.png', '/lyuk2.png', '/lyuk3.png', '/lyuk4.png'],
    'industrial': ['/industrial-wall-access-panel-white.jpg'],
    'premium': ['/premium-anodized-aluminum-hatch.jpg'],
    'minimalist': ['/minimalist-invisible-wall-hatch-aluminum.jpg']
  }
  
  const variations = imageVariations[baseImage.split('/')[1]?.split('.')[0]] || [baseImage]
  return variations[index % variations.length] || baseImage
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Добавляем кэширование на 5 минут
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Product[] = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to fetch products',
      error instanceof Error && 'status' in error ? (error as any).status : undefined
    )
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const product: Product = await response.json()
    return product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    // Fallback to searching in all products
    try {
      const products = await fetchProducts()
      return products.find(product => product._id === id) || null
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      return null
    }
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await fetchProducts()
    return products.filter(product => product.category === category)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

// Utility function to convert API product to local format
export function convertApiProductToLocal(product: Product, language: SupportedLanguage = 'ru'): {
  id: string
  name: string
  description: string
  image: string
} {
  return {
    id: product._id,
    name: getLocalizedText(product, 'name', language),
    description: getLocalizedText(product, 'description', language),
    image: getSafeImageUrl(product.mainImage || product.images[0], product.category)
  }
}

// Utility function to convert API product sizes to local format
export function convertApiSizesToLocal(sizes: Product['sizes'], calculatedPrices?: Product['calculatedPrices']): Array<{
  id: string
  label: string
  width: number
  height: number
  priceUSD: number
}> {
  return sizes.map(size => {
    const [width, height] = size.size.split('x').map(Number)
    
    // Use calculated price if available, otherwise use coefficient as fallback
    let priceUSD = size.coefficient
    if (calculatedPrices) {
      const calculatedPrice = calculatedPrices.find(cp => cp.size === size.size)
      if (calculatedPrice) {
        priceUSD = calculatedPrice.price
      }
    }
    
    return {
      id: size.size,
      label: `${width} x ${height}`,
      width,
      height,
      priceUSD
    }
  })
}

// Utility function to get exact price for a specific size
export function getPriceForSize(product: Product, sizeId: string): number {
  const calculatedPrice = product.calculatedPrices.find(cp => cp.size === sizeId)
  if (calculatedPrice) {
    return calculatedPrice.price
  }
  
  // Fallback to coefficient calculation
  const size = product.sizes.find(s => s.size === sizeId)
  if (size) {
    return product.basePrice * size.coefficient
  }
  
  return product.basePrice
}

// Utility function to get localized product info
export function getLocalizedProduct(product: Product, language: SupportedLanguage = 'ru'): {
  name: string
  description: string
  basePrice: number
  image: string
} {
  return {
    name: getLocalizedText(product, 'name', language),
    description: getLocalizedText(product, 'description', language),
    basePrice: product.basePrice,
    image: getSafeImageUrl(product.mainImage || product.images[0], product.category)
  }
}
