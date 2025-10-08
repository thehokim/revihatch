"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LogOut, Package, ShoppingCart, TrendingUp } from "lucide-react"

interface Order {
  id: string
  model: string
  modelName: string
  width: number
  height: number
  finish: string
  quantity: number
  totalPrice: number
  customer: {
    name: string
    phone: string
    email: string
    address: string
    comment: string
  }
  status: string
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadOrders()
    }
  }, [])

  const loadOrders = () => {
    const stored = localStorage.getItem("orders")
    if (stored) {
      setOrders(JSON.parse(stored))
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in production, use proper authentication)
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true")
      setIsAuthenticated(true)
      loadOrders()
      setError("")
    } else {
      setError("Неверный пароль")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/")
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа к панели управления</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">Демо пароль: admin123</p>
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const newOrders = orders.filter((o) => o.status === "new")
  const processingOrders = orders.filter((o) => o.status === "processing")
  const completedOrders = orders.filter((o) => o.status === "completed")
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight">REVIZOR Admin</span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Панель управления</h1>
          <p className="text-lg text-muted-foreground">Управление заказами и продуктами</p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Новые заказы</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В обработке</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingOrders.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <CardTitle>Управление заказами</CardTitle>
            <CardDescription>Просмотр и управление всеми заказами</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Все ({orders.length})</TabsTrigger>
                <TabsTrigger value="new">Новые ({newOrders.length})</TabsTrigger>
                <TabsTrigger value="processing">В обработке ({processingOrders.length})</TabsTrigger>
                <TabsTrigger value="completed">Завершенные ({completedOrders.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {orders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Заказов пока нет</p>
                ) : (
                  orders.map((order) => <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />)
                )}
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                {newOrders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Новых заказов нет</p>
                ) : (
                  newOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                {processingOrders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Нет заказов в обработке</p>
                ) : (
                  processingOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedOrders.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">Нет завершенных заказов</p>
                ) : (
                  completedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (orderId: string, status: string) => void
}) {
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  }

  const statusLabels = {
    new: "Новый",
    processing: "В обработке",
    completed: "Завершен",
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-semibold">Заказ #{order.id.slice(-6)}</h3>
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {statusLabels[order.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(order.totalPrice)}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">Детали заказа</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Модель:</span>
                  <span className="font-medium">{order.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Размер:</span>
                  <span className="font-medium">
                    {order.width} × {order.height} мм
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Покрытие:</span>
                  <span className="font-medium">{order.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Количество:</span>
                  <span className="font-medium">{order.quantity} шт.</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Клиент</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Имя: </span>
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Телефон: </span>
                  <span className="font-medium">{order.customer.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-medium">{order.customer.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Адрес: </span>
                  <span className="font-medium">{order.customer.address}</span>
                </div>
                {order.customer.comment && (
                  <div>
                    <span className="text-muted-foreground">Комментарий: </span>
                    <span className="font-medium">{order.customer.comment}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t pt-4">
            {order.status === "new" && (
              <Button size="sm" onClick={() => onUpdateStatus(order.id, "processing")}>
                Взять в работу
              </Button>
            )}
            {order.status === "processing" && (
              <Button size="sm" onClick={() => onUpdateStatus(order.id, "completed")}>
                Завершить
              </Button>
            )}
            {order.status === "completed" && (
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, "new")}>
                Вернуть в новые
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
