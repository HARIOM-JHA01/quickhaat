'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/use-cart';
import { Check } from 'lucide-react';
import AddressStep from '@/components/checkout/address-step';
import PaymentStep from '@/components/checkout/payment-step';
import ReviewStep from '@/components/checkout/review-step';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
} from '@/lib/cart-utils';
import type { PaymentMethod } from '@/components/checkout/payment-step';

type CheckoutStep = 'address' | 'payment' | 'review';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, isLoading: isCartLoading } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isCartLoading && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, isCartLoading, router]);

  // Fetch selected address details
  useEffect(() => {
    if (selectedAddressId) {
      fetch(`/api/addresses/${selectedAddressId}`)
        .then((res) => res.json())
        .then((data) => setSelectedAddress(data))
        .catch((error) => console.error('Error fetching address:', error));
    }
  }, [selectedAddressId]);

  if (status === 'loading' || isCartLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = calculateSubtotal(cart.items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  const steps = [
    { id: 'address', name: 'Address', completed: currentStep !== 'address' },
    { id: 'payment', name: 'Payment', completed: currentStep === 'review' },
    { id: 'review', name: 'Review', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : currentStep === step.id
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-500'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep === step.id
                        ? 'text-indigo-600'
                        : step.completed
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 transition-all ${
                      step.completed ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          {currentStep === 'address' && (
            <AddressStep
              selectedAddressId={selectedAddressId}
              onAddressSelect={setSelectedAddressId}
              onNext={() => setCurrentStep('payment')}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentStep
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodSelect={setSelectedPaymentMethod}
              onNext={() => setCurrentStep('review')}
              onBack={() => setCurrentStep('address')}
            />
          )}

          {currentStep === 'review' && (
            <ReviewStep
              address={selectedAddress}
              paymentMethod={selectedPaymentMethod}
              cartItems={cart.items}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              onBack={() => setCurrentStep('payment')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
