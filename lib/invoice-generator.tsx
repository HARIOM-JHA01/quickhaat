import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (optional - using default fonts for now)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf'
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
  },
  value: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
    borderBottom: '1px solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  tableCol1: {
    width: '50%',
  },
  tableCol2: {
    width: '15%',
    textAlign: 'center',
  },
  tableCol3: {
    width: '17.5%',
    textAlign: 'right',
  },
  tableCol4: {
    width: '17.5%',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '2px solid #d1d5db',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    width: 150,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    marginRight: 20,
  },
  totalValue: {
    width: 100,
    fontSize: 10,
    color: '#111827',
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #d1d5db',
  },
  grandTotalLabel: {
    width: 150,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginRight: 20,
  },
  grandTotalValue: {
    width: 100,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  addressBox: {
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    marginTop: 5,
  },
  addressText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
});

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  shippingAddress: InvoiceAddress;
  paymentMethod: string;
}

export const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Company Logo/Name */}
      <View style={styles.header}>
        <Text style={styles.logo}>QUICKHAAT</Text>
        <Text style={styles.companyInfo}>
          Your One-Stop Shop for Quality Products
        </Text>
        <Text style={styles.companyInfo}>Email: support@quickhaat.com</Text>
        <Text style={styles.companyInfo}>Phone: +1 (555) 123-4567</Text>
      </View>

      {/* Invoice Title */}
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      {/* Invoice Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Invoice Number:</Text>
            <Text style={styles.value}>{data.orderNumber}</Text>
          </View>
          <View>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{data.orderDate}</Text>
          </View>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.value}>{data.customerName}</Text>
        <Text style={styles.label}>{data.customerEmail}</Text>
      </View>

      {/* Shipping Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ship To:</Text>
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>{data.shippingAddress.street}</Text>
          <Text style={styles.addressText}>
            {data.shippingAddress.city}, {data.shippingAddress.state}{' '}
            {data.shippingAddress.postalCode}
          </Text>
          <Text style={styles.addressText}>{data.shippingAddress.country}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol1}>Item Description</Text>
          <Text style={styles.tableCol2}>Qty</Text>
          <Text style={styles.tableCol3}>Unit Price</Text>
          <Text style={styles.tableCol4}>Total</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol1}>{item.name}</Text>
            <Text style={styles.tableCol2}>{item.quantity}</Text>
            <Text style={styles.tableCol3}>${item.price.toFixed(2)}</Text>
            <Text style={styles.tableCol4}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping:</Text>
          <Text style={styles.totalValue}>${data.shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>${data.tax.toFixed(2)}</Text>
        </View>
        {data.discount && data.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.totalValue}>-${data.discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Total Amount:</Text>
          <Text style={styles.grandTotalValue}>${data.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method:</Text>
        <Text style={styles.label}>{data.paymentMethod}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text>
          For questions about this invoice, please contact support@quickhaat.com
        </Text>
      </View>
    </Page>
  </Document>
);

/**
 * Generate invoice PDF buffer from order data
 * @param data Invoice data including order details, items, and customer info
 * @returns Promise<Buffer> PDF file as buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const pdfBuffer = await renderToBuffer(<InvoiceDocument data={data} />);
  return Buffer.from(pdfBuffer);
}

/**
 * Format order data for invoice generation
 * This helper formats order data from the database into the format expected by the invoice generator
 */
export function formatOrderForInvoice(order: any): InvoiceData {
  return {
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    customerName: order.user.name,
    customerEmail: order.user.email,
    items: order.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    subtotal: order.subtotal,
    shipping: order.shippingCost,
    tax: order.tax,
    discount: order.discount || 0,
    total: order.total,
    shippingAddress: {
      street: order.address.street,
      city: order.address.city,
      state: order.address.state,
      postalCode: order.address.postalCode,
      country: order.address.country,
    },
    paymentMethod:
      order.paymentMethod === 'CASH_ON_DELIVERY'
        ? 'Cash on Delivery'
        : order.paymentMethod === 'STRIPE'
          ? 'Credit/Debit Card'
          : order.paymentMethod,
  };
}
