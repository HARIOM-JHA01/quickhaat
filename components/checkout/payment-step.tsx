"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { toast } from "sonner";

export type PaymentMethod = "CARD" | "STRIPE" | "CASH_ON_DELIVERY";

interface PaymentStepProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentMethods = [
  {
    id: "CASH_ON_DELIVERY" as PaymentMethod,
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: Banknote,
    badge: "Most Popular",
  },
  {
    id: "CARD" as PaymentMethod,
    name: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: CreditCard,
    badge: null,
  },
  {
    id: "STRIPE" as PaymentMethod,
    name: "Online Payment",
    description: "Pay with UPI, Net Banking, or Wallet",
    icon: Wallet,
    badge: null,
  },
];

export default function PaymentStep({
  selectedPaymentMethod,
  onPaymentMethodSelect,
  onNext,
  onBack,
}: PaymentStepProps) {
  const handleNext = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Payment Method</h2>

      <RadioGroup
        value={selectedPaymentMethod || ""}
        onValueChange={(value) => onPaymentMethodSelect(value as PaymentMethod)}
        className="space-y-3"
      >
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-start p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === method.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={() => onPaymentMethodSelect(method.id)}
                className="mt-1 mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-6 w-6 text-indigo-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {method.name}
                      </span>
                      {method.badge && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </RadioGroup>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All transactions are secure and encrypted</li>
          <li>
            • For Cash on Delivery, payment is collected at the time of delivery
          </li>
          <li>
            • Online payments are processed through secure payment gateways
          </li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} size="lg">
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedPaymentMethod}
          size="lg"
        >
          Review Order
        </Button>
      </div>
    </div>
  );
}
