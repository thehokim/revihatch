"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/i18n-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"
import { AddressMap } from "@/components/address-map"
import { PaymentPicker } from "@/components/payment-picker"

interface OrderData {
  model: string
  modelName: string
  width: number
  height: number
  finish: string
  quantity: number
  totalPrice: number
}

export default function CheckoutPage() {
  const { t } = useI18n() as any
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fio: "",
    phone: "",
    email: "",
    location: "",
    comments: "",
    paymentType: "cash",
  })

  useEffect(() => {
    const stored = localStorage.getItem("currentOrder")
    if (stored) {
      setOrderData(JSON.parse(stored))
    } else {
      router.push("/configurator")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare order data for API
      const orderPayload = {
        fio: formData.fio,
        phone: formData.phone,
        email: formData.email || undefined,
        paymentType: formData.paymentType,
        location: formData.location,
        comments: formData.comments || undefined,
        productType: orderData?.modelName || "Unknown",
        size: `${orderData?.width} × ${orderData?.height} ${t("cfg.units.cm")}`,
        quantity: orderData?.quantity || 1,
        totalPrice: orderData?.totalPrice || 0
      }

      // Send order to API
      const response = await fetch('https://api.lyukirevizor.uz/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order')
      }

      // Store order in localStorage for admin panel
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const newOrder = {
        id: result.orderId,
        ...orderData,
        customer: formData,
        status: "new",
        createdAt: new Date().toISOString(),
      }
      orders.push(newOrder)
      localStorage.setItem("orders", JSON.stringify(orders))

      setIsSubmitting(false)
      setIsSuccess(true)

      // Clear current order
      localStorage.removeItem("currentOrder")

    } catch (error) {
      console.error('Error submitting order:', error)
      setIsSubmitting(false)
      // You could add error state here to show error message to user
      alert('Ошибка при оформлении заказа. Попробуйте еще раз.')
    }
  }

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData({ ...formData, location: address })
  }

  if (isSuccess) {
    return (
      <main className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold">{t("checkout.success.title")}</h1>
            <p className="mb-8 text-lg text-muted-foreground">{t("checkout.success.desc")}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button onClick={() => router.push("/")} size="lg">{t("checkout.success.toHome")}</Button>
              <Button onClick={() => router.push("/configurator")} variant="outline" size="lg">{t("checkout.success.newOrder")}</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!orderData) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pt-4 sm:pt-8">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{t("checkout.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("checkout.subtitle")}</p>
        </div>

        {/* Mobile Order Summary - Show first on mobile */}
        <div className="mb-6 lg:hidden max-w-sm mx-auto">
          <Card className="">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("checkout.yourOrder")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">{t("checkout.model")}</span>
                  <div className="font-medium text-xs">{t(orderData.modelName)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">{t("checkout.size")}</span>
                  <div className="font-medium text-xs">
                    {orderData.width} × {orderData.height} {t("cfg.units.cm")}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">{t("checkout.cover")}</span>
                  <div className="font-medium text-xs">{t(orderData.finish)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">{t("checkout.count")}</span>
                  <div className="font-medium text-xs">{orderData.quantity} {t("cfg.pcs")}</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-base font-semibold">{t("cfg.summary.total")}</span>
                  <span className="text-xl font-bold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(orderData.totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t("checkout.notice")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Order Form */}
          <div className="lg:col-span-2 max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="">
                <CardHeader className="sm:px-6">
                  <CardTitle className="text-base sm:text-lg leading-tight">{t("checkout.contact")}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-tight">{t("checkout.contactDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:px-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fio" className="text-sm font-medium">{t("checkout.name")} <span className="text-destructive">*</span></Label>
                      <Input
                        id="fio"
                        required
                        value={formData.fio}
                        onChange={(e) => setFormData({ ...formData, fio: e.target.value })}
                        placeholder={t("checkout.placeholder.name")}
                        className="mt-1.5 h-10 text-sm"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">{t("checkout.phone")} <span className="text-destructive">*</span></Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t("checkout.placeholder.phone")}
                          className="mt-1.5 h-10 text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">{t("checkout.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t("checkout.placeholder.email")}
                          className="mt-1.5 h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card className="">
                <CardHeader className="sm:px-6">
                  <CardTitle className="text-base sm:text-lg leading-tight">{t("checkout.address")}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-tight">{t("checkout.addressDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:px-6">
                  <AddressMap onAddressSelect={handleAddressSelect} initialAddress={formData.location} />

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">{t("checkout.fullAddress")} <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={t("checkout.placeholder.fullAddress")}
                      rows={3}
                      className="mt-1.5 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments" className="text-sm font-medium">{t("checkout.comment")}</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder={t("checkout.placeholder.comment")}
                      rows={3}
                      className="mt-1.5 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentType" className="text-sm font-medium">{t("checkout.paymentType")} <span className="text-destructive">*</span></Label>
                    <div className="mt-1.5">
                      <PaymentPicker
                        value={formData.paymentType}
                        onChange={(value) => setFormData({ ...formData, paymentType: value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-base" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t("checkout.submitting") : t("checkout.submit")}
              </Button>
            </form>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <Card className="sticky top-18">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t("checkout.yourOrder")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.model")}</span>
                    <span className="font-medium text-right">{t(orderData.modelName)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.size")}</span>
                    <span className="font-medium">
                      {orderData.width} × {orderData.height} {t("cfg.units.cm")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.cover")}</span>
                    <span className="font-medium">{t(orderData.finish)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.count")}</span>
                    <span className="font-medium">{orderData.quantity} {t("cfg.pcs")}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-lg font-semibold">{t("cfg.summary.total")}</span>
                    <span className="text-2xl font-bold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(orderData.totalPrice)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("checkout.notice")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}