import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['fio', 'phone', 'location', 'productType', 'size', 'quantity', 'totalPrice']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate phone number format
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

    // Validate payment type
    const validPaymentTypes = ['cash', 'card', 'transfer']
    if (body.paymentType && !validPaymentTypes.includes(body.paymentType)) {
      return NextResponse.json(
        { error: 'Invalid payment type. Use: cash, card, or transfer' },
        { status: 400 }
      )
    }

    // Create order object
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fio: body.fio,
      phone: body.phone,
      email: body.email || null,
      paymentType: body.paymentType || 'cash',
      location: body.location,
      comments: body.comments || null,
      productType: body.productType,
      size: body.size,
      quantity: parseInt(body.quantity),
      totalPrice: parseInt(body.totalPrice),
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Here you would typically save to database
    // For now, we'll just log the order
    console.log('New order received:', order)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      order: order
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
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
