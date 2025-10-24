"use client";

import type React from "react";
import { Suspense } from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { useCurrency } from "@/hooks/use-currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { AddressMap } from "@/components/address-map";
import { PaymentPicker } from "@/components/payment-picker";
import { PageSkeleton } from "@/components/page-skeleton";

interface OrderData {
  productId?: string;
  model: string;
  modelName: string;
  width: number;
  height: number;
  finish: string;
  quantity: number;
  totalPrice: number;
  isCustomSize?: boolean;
  isCustomOrder?: boolean;
  flaps?: number;
  perimeter?: number;
  selectedSize?: string;
  productCategory?: string;
  currency?: 'USD' | 'UZS';
}

function SuccessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { t } = useI18n() as any;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t("checkout.success.title")}</h2>
          <p className="text-lg sm:text-lg text-gray-900 mb-2">{t("checkout.success.desc")}</p>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{t("checkout.success.desc1")}</p>
          <Button
            onClick={() => {
              onClose();
              router.push("/");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            {t("checkout.success.toHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPageContent({ onSuccess }: { onSuccess: () => void }) {
  const { t, lang } = useI18n() as any;
  const { convertUZSToUSD } = useCurrency();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+998")) {
      const digits = cleaned.slice(4);
      if (digits.length <= 9) {
        if (digits.length <= 2) {
          return `+998 ${digits}`;
        } else if (digits.length <= 5) {
          return `+998 ${digits.slice(0, 2)} ${digits.slice(2)}`;
        } else if (digits.length <= 7) {
          return `+998 ${digits.slice(0, 2)} ${digits.slice(
            2,
            5
          )} ${digits.slice(5)}`;
        } else {
          return `+998 ${digits.slice(0, 2)} ${digits.slice(
            2,
            5
          )} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
        }
      }
    }

    if (cleaned.startsWith("998")) {
      return formatPhoneNumber("+" + cleaned);
    }

    if (cleaned.match(/^[0-9]+$/)) {
      return formatPhoneNumber("+998" + cleaned);
    }

    return cleaned;
  };

  const getLocalizedProductName = (modelName: string) => {
    const productNames = {
      ru: {
        transformer: "Люк под покраску",
        anodos: "Люк настенный «Универсал»",
        floor: "Напольный люк",
        napolny: "Напольный люк",
        universal: "Напольный люк"
      },
      uz: {
        transformer: "Bo'yoq ostidagi lyuk",
        anodos: "Devor lyuki «Universal»",
        floor: "Pol lyuki",
        napolny: "Pol lyuki",
        universal: "Pol lyuki"
      }
    };
    
    if (orderData?.productCategory) {
      const categoryNames = productNames[lang as keyof typeof productNames];
      const correctName = categoryNames[orderData.productCategory as keyof typeof categoryNames];
      if (correctName) {
        return correctName;
      }
    }
    
    if (modelName && !modelName.startsWith("cfg.products.") && !modelName.includes(".")) {
      const currentLangNames = productNames[lang as keyof typeof productNames];
      const isCorrectName = Object.values(currentLangNames).includes(modelName);
      
      if (isCorrectName) {
        return modelName;
      }
    }

    if (modelName.startsWith("cfg.products.")) {
      const translated = t(modelName);
      return translated;
    }

    if (modelName.includes("Напольный") || modelName.includes("Pol")) {
      const correctName = lang === 'uz' ? 'Pol lyuki' : 'Напольный люк';
      return correctName;
    } else if (modelName.includes("Универсал") || modelName.includes("Universal")) {
      const correctName = lang === 'uz' ? 'Devor lyuki «Universal»' : 'Люк настенный «Универсал»';
      return correctName;
    } else if (modelName.includes("покраску") || modelName.includes("Bo'yoq")) {
      const correctName = lang === 'uz' ? 'Bo\'yoq ostidagi lyuk' : 'Люк под покраску';
      return correctName;
    }

    const fallback = lang === 'uz' ? 'Bo\'yoq ostidagi lyuk' : 'Люк под покраску';
    return fallback;
  };

  const getRussianPaymentType = (paymentType: string) => {
    const paymentTypes: Record<string, string> = {
      cash: "Наличными",
      card: "Банковской картой",
      transfer: "Банковский перевод",
    };

    return paymentTypes[paymentType] || "Наличными";
  };

  const getDisplaySize = () => {
    if (orderData?.selectedSize) {
      const [width, height] = orderData.selectedSize.split('x').map(Number);
      return `${width} × ${height} ${t("cfg.units.cm")}`;
    }
    return `${orderData?.width} × ${orderData?.height} ${t("cfg.units.cm")}`;
  };

  const [formData, setFormData] = useState({
    fio: "",
    phone: "",
    email: "",
    location: "",
    comments: "",
    paymentType: "cash",
  });

  useEffect(() => {
    const storedOrder = localStorage.getItem("currentOrder");
    const customOrder = localStorage.getItem("customOrder");
    
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrderData(parsedOrder);
    } else if (customOrder) {
      const parsedCustomOrder = JSON.parse(customOrder);
      setOrderData(parsedCustomOrder);
    } else {
      router.push("/configurator");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        fio: formData.fio,
        phone: formData.phone.replace(/\s/g, ""),
        email: formData.email || undefined,
        productType: getLocalizedProductName(
          orderData?.modelName || "transformer"
        ),
        size: getDisplaySize(),
        quantity: orderData?.quantity || 1,
        totalPrice: orderData?.totalPrice || 0,
        paymentType: getRussianPaymentType(formData.paymentType),
        location: formData.location,
        comments: formData.comments || undefined,
        locationCoords: addressCoords
          ? [addressCoords.lat, addressCoords.lng]
          : undefined,
      };

      const response = await fetch("https://api.lyukirevizor.uz/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order");
      }

      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder = {
        id: result.orderId,
        ...orderData,
        customer: formData,
        status: "new",
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));

      setIsSubmitting(false);
      onSuccess();

      localStorage.removeItem("currentOrder");
      localStorage.removeItem("customOrder");
    } catch (error) {
      setIsSubmitting(false);
      alert("Ошибка при оформлении заказа. Попробуйте еще раз.");
    }
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setFormData({ ...formData, location: address });
    setAddressCoords({ lat, lng });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  if (!orderData) {
    return <PageSkeleton variant="checkout" />;
  }

  return (
    <main className="min-h-screen bg-background pt-4 sm:pt-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="mb-2 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {t("checkout.title")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("checkout.subtitle")}
          </p>
        </div>

      </div>

      <div className="w-full max-w-7xl pb-4 sm:pb-6 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <Card className="">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {t("checkout.contact")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-tight">
                    {t("checkout.contactDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="fio" className="text-sm font-medium">
                        {t("checkout.name")}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fio"
                        required
                        value={formData.fio}
                        onChange={(e) =>
                          setFormData({ ...formData, fio: e.target.value })
                        }
                        placeholder={t("checkout.placeholder.name")}
                        className="mt-1.5 h-10 text-sm"
                      />
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {t("checkout.phone")}{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="+998 90 123 45 67"
                          className="mt-1.5 h-10 text-sm"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t("checkout.email")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder={t("checkout.placeholder.email")}
                          className="mt-1.5 h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {t("checkout.address")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-tight">
                    {t("checkout.addressDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                  <AddressMap
                    onAddressSelect={handleAddressSelect}
                    initialAddress={formData.location}
                  />

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">
                      {t("checkout.fullAddress")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder={t("checkout.placeholder.fullAddress")}
                      rows={3}
                      className="mt-1.5 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments" className="text-sm font-medium">
                      {t("checkout.comment")}
                    </Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                      }
                      placeholder={t("checkout.placeholder.comment")}
                      rows={3}
                      className="mt-1.5 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="paymentType"
                      className="text-sm font-medium"
                    >
                      {t("checkout.paymentType")}{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-1.5">
                      <PaymentPicker
                        value={formData.paymentType}
                        onChange={(value) =>
                          setFormData({ ...formData, paymentType: value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="flex justify-center w-full max-w-md h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-base"
                  disabled={isSubmitting}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isSubmitting
                    ? t("checkout.submitting")
                    : t("checkout.submit")}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <SuccessModal isOpen={isSuccessModalOpen} onClose={handleCloseModal} />
      <Suspense fallback={<PageSkeleton variant="checkout" />}>
        <CheckoutPageContent onSuccess={handleSuccess} />
      </Suspense>
    </>
  );
}
