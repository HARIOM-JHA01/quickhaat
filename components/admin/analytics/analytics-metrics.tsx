'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

interface Metrics {
  revenue: { value: number; change: number };
  orders: { value: number; change: number };
  customers: { value: number; change: number };
  avgOrderValue: { value: number; change: number };
}

export default function AnalyticsMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch('/api/admin/analytics?days=30');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !metrics) {
    return null;
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.revenue.value.toFixed(2)}`,
      change: metrics.revenue.change,
      icon: DollarSign,
    },
    {
      title: 'Orders',
      value: metrics.orders.value.toString(),
      change: metrics.orders.change,
      icon: ShoppingCart,
    },
    {
      title: 'New Customers',
      value: metrics.customers.value.toString(),
      change: metrics.customers.change,
      icon: Users,
    },
    {
      title: 'Avg Order Value',
      value: `$${metrics.avgOrderValue.value.toFixed(2)}`,
      change: metrics.avgOrderValue.change,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p
                className={`text-xs ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {card.change.toFixed(1)}% from last period
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
