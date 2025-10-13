"use client"

import { useI18n } from "@/components/i18n-provider"
import { Banknote, CreditCard, Building2 } from "lucide-react"

interface PaymentPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const paymentMethods = [
  {
    value: "cash",
    icon: Banknote,
    titleKey: "checkout.payment.cash",
    descriptionKey: "checkout.payment.cashDesc",
    color: "bg-green-50 border-green-200 text-green-700"
  },
  {
    value: "card", 
    icon: CreditCard,
    titleKey: "checkout.payment.card",
    descriptionKey: "checkout.payment.cardDesc",
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  {
    value: "transfer",
    icon: Building2,
    titleKey: "checkout.payment.transfer", 
    descriptionKey: "checkout.payment.transferDesc",
    color: "bg-purple-50 border-purple-200 text-purple-700"
  }
]

export function PaymentPicker({ value, onChange, className }: PaymentPickerProps) {
  const { t } = useI18n() as any

  const handleSelect = (methodValue: string) => {
    onChange(methodValue)
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${className}`}>
      {paymentMethods.map((method) => {
        const Icon = method.icon
        const isSelected = method.value === value
        
        return (
          <div
            key={method.value}
            className={`relative cursor-pointer transition-all duration-150 rounded-lg border p-2 sm:p-3 hover:shadow-sm ${
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30'
            }`}
            onClick={() => handleSelect(method.value)}
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 flex-shrink-0 ${
                isSelected 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-xs sm:text-sm truncate ${
                  isSelected 
                    ? 'text-primary' 
                    : 'text-foreground'
                }`}>
                  {t(method.titleKey)}
                </div>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
