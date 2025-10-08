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
    name: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
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

    // Simulate order submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store order in localStorage (mock database)
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const newOrder = {
      id: Date.now().toString(),
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
  }

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData({ ...formData, address })
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
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">{t("checkout.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("checkout.subtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.contact")}</CardTitle>
                  <CardDescription>{t("checkout.contactDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="name">{t("checkout.name")} <span className="text-destructive">*</span></Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("checkout.placeholder.name")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("checkout.phone")} <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t("checkout.placeholder.phone")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("checkout.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t("checkout.placeholder.email")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.address")}</CardTitle>
                  <CardDescription>{t("checkout.addressDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AddressMap onAddressSelect={handleAddressSelect} initialAddress={formData.address} />

                  <div className="space-y-2">
                    <Label htmlFor="address">{t("checkout.fullAddress")} <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t("checkout.placeholder.fullAddress")}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">{t("checkout.comment")}</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder={t("checkout.placeholder.comment")}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("checkout.submitting") : t("checkout.submit")}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("checkout.yourOrder")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.model")}</span>
                    <span className="font-medium">{orderData.modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.size")}</span>
                    <span className="font-medium">
                      {orderData.width} × {orderData.height} мм
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
    </main>
  )
}
