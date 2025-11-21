'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  quantity: number;
  options: Record<string, string>;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  basePrice: number;
  onVariantChange?: (variant: ProductVariant | null) => void;
}

export default function VariantSelector({
  variants,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  if (!variants || variants.length === 0) {
    return null;
  }

  // Extract unique option types (e.g., "size", "color")
  const optionTypes = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.options)))
  );

  // Get unique values for each option type
  const optionValues: Record<string, Set<string>> = {};
  optionTypes.forEach((type) => {
    optionValues[type] = new Set(
      variants.map((v) => v.options[type]).filter(Boolean)
    );
  });

  const handleOptionSelect = (optionType: string, value: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionType]: value,
    };
    setSelectedOptions(newSelectedOptions);

    // Find matching variant
    const matchingVariant = variants.find((variant) => {
      return Object.entries(newSelectedOptions).every(
        ([key, val]) => variant.options[key] === val
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.id);
      onVariantChange?.(matchingVariant);
    } else {
      setSelectedVariant(null);
      onVariantChange?.(null);
    }
  };

  const getVariantForOption = (optionType: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionType]: value };
    return variants.find((variant) => {
      return Object.entries(testOptions).every(
        ([key, val]) => variant.options[key] === val
      );
    });
  };

  const selectedVariantData = variants.find((v) => v.id === selectedVariant);
  const displayPrice = selectedVariantData?.price || basePrice;

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">₹{displayPrice.toFixed(2)}</span>
        {selectedVariantData?.price &&
          selectedVariantData.price !== basePrice && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{basePrice.toFixed(2)}
            </span>
          )}
      </div>

      {/* Variant Options */}
      {optionTypes.map((optionType) => (
        <div key={optionType} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium capitalize">
              {optionType}
              {selectedOptions[optionType] && (
                <span className="text-muted-foreground ml-2">
                  - {selectedOptions[optionType]}
                </span>
              )}
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from(optionValues[optionType]).map((value) => {
              const variantForOption = getVariantForOption(optionType, value);
              const isSelected = selectedOptions[optionType] === value;
              const isOutOfStock =
                variantForOption && variantForOption.quantity === 0;

              return (
                <button
                  key={value}
                  onClick={() =>
                    !isOutOfStock && handleOptionSelect(optionType, value)
                  }
                  disabled={isOutOfStock}
                  className={cn(
                    'px-4 py-2 rounded-md border-2 transition-all font-medium text-sm',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted hover:border-foreground',
                    isOutOfStock && 'opacity-50 cursor-not-allowed line-through'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock Status */}
      {selectedVariantData && (
        <div className="flex items-center gap-2">
          {selectedVariantData.quantity > 0 ? (
            <>
              <Badge variant="default" className="bg-green-500">
                In Stock
              </Badge>
              {selectedVariantData.quantity < 10 && (
                <span className="text-sm text-muted-foreground">
                  Only {selectedVariantData.quantity} left
                </span>
              )}
            </>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      )}

      {!selectedVariant && Object.keys(selectedOptions).length > 0 && (
        <p className="text-sm text-muted-foreground">
          Please select all options to see availability
        </p>
      )}
    </div>
  );
}
