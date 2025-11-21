'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Coupon } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(50)
    .toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED', 'FREE_SHIPPING']),
  value: z.number().min(0, 'Value must be positive'),
  minPurchase: z.number().min(0).optional().or(z.literal('')),
  maxDiscount: z.number().min(0).optional().or(z.literal('')),
  usageLimit: z.number().int().min(1).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon | null;
}

export default function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      description: coupon?.description || '',
      type: coupon?.type || 'PERCENTAGE',
      value: coupon?.value || 0,
      minPurchase: coupon?.minPurchase ?? '',
      maxDiscount: coupon?.maxDiscount ?? '',
      usageLimit: coupon?.usageLimit ?? '',
      startDate: coupon?.startDate
        ? new Date(coupon.startDate).toISOString().slice(0, 16)
        : '',
      endDate: coupon?.endDate
        ? new Date(coupon.endDate).toISOString().slice(0, 16)
        : '',
      isActive: coupon?.isActive ?? true,
    },
  });

  const couponType = form.watch('type');

  async function onSubmit(data: CouponFormValues) {
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase(),
        minPurchase:
          typeof data.minPurchase === 'number' ? data.minPurchase : null,
        maxDiscount:
          typeof data.maxDiscount === 'number' ? data.maxDiscount : null,
        usageLimit:
          typeof data.usageLimit === 'number' ? data.usageLimit : null,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      const url = coupon
        ? `/api/admin/coupons/${coupon.id}`
        : '/api/admin/coupons';
      const method = coupon ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save coupon');
      }

      toast.success(coupon ? 'Coupon updated' : 'Coupon created');
      router.push('/admin/coupons');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SUMMER2024"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      disabled={!!coupon}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique code customers will use. Cannot be changed after
                    creation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summer sale discount"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Internal description for your reference
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">
                        Percentage Discount
                      </SelectItem>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                      <SelectItem value="FREE_SHIPPING">
                        Free Shipping
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {couponType !== 'FREE_SHIPPING' && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {couponType === 'PERCENTAGE'
                        ? 'Discount Percentage'
                        : 'Discount Amount'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={couponType === 'PERCENTAGE' ? '100' : undefined}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {couponType === 'PERCENTAGE'
                        ? 'Percentage off (0-100)'
                        : 'Fixed amount off in dollars'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="minPurchase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Purchase (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={field.value === '' ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? ''
                            : parseFloat(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum order value required to use this coupon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {couponType === 'PERCENTAGE' && (
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Discount (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={field.value === '' ? '' : field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? ''
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum discount amount for percentage-based coupons
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage & Validity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={field.value === '' ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? '' : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of times this coupon can be used. Leave empty
                    for unlimited.
                    {coupon && ` Used: ${coupon.usedCount} times`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Enable or disable this coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {coupon ? 'Update Coupon' : 'Create Coupon'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
