import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    
    // Validate required fields
    const requiredFields = ['fio', 'phone', 'productType', 'size', 'quantity', 'totalPrice', 'paymentType', 'location']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate phone number format (no spaces)
    const phoneRegex = /^\+998[0-9]{9}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use +998XXXXXXXXX' },
        { status: 400 }
      )
    }

    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
    }

    // Validate payment type (accept localized names)
    const validPaymentTypes = [
      'cash', 'card', 'transfer', // English
      'Наличными', 'Банковской картой', 'Банковский перевод', // Russian
      'Naqd pul', 'Bank kartasi', 'Bank o\'tkazmasi' // Uzbek
    ]
    if (body.paymentType && !validPaymentTypes.includes(body.paymentType)) {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      )
    }

    // Create order object
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fio: body.fio,
      phone: body.phone,
      email: body.email || null,
      productType: body.productType,
      size: body.size,
      quantity: parseInt(body.quantity),
      totalPrice: parseInt(body.totalPrice),
      paymentType: body.paymentType,
      location: body.location,
      comments: body.comments || null,
      locationCoords: body.locationCoords || null,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      order: order
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Orders API endpoint' },
    { status: 200 }
  )
}
