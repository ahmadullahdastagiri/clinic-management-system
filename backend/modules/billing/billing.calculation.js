/**
 * Calculate the amount of a single invoice item.
 */
export function calculateItemAmount(quantity, unitPrice) {
  return quantity * unitPrice;
}

/**
 * Calculate subtotal from invoice items.
 */
export function calculateSubtotal(items = []) {
  return items.reduce((total, item) => {
    const amount =
      item.amount ?? calculateItemAmount(item.quantity, item.unitPrice);

    return total + amount;
  }, 0);
}

/**
 * Calculate discount.
 *
 * discountType:
 * - "fixed"
 * - "percentage"
 */
export function calculateDiscount(
  subtotal,
  discountValue = 0,
  discountType = "fixed",
) {
  if (discountValue <= 0) return 0;

  if (discountType === "percentage") {
    return (subtotal * discountValue) / 100;
  }

  return Math.min(discountValue, subtotal);
}

/**
 * Calculate tax after discount.
 */
export function calculateTax(subtotal, discount = 0, taxRate = 0) {
  const taxableAmount = Math.max(0, subtotal - discount);

  return (taxableAmount * taxRate) / 100;
}

/**
 * Calculate invoice total.
 */
export function calculateTotal(subtotal, discount = 0, tax = 0) {
  return subtotal - discount + tax;
}

/**
 * Sum all completed payments.
 */
export function calculatePaidAmount(payments = []) {
  return payments.reduce((total, payment) => {
    if (payment.status === "completed") {
      return total + payment.amount;
    }

    return total;
  }, 0);
}

/**
 * Calculate remaining balance.
 */
export function calculateDueAmount(totalAmount, paidAmount) {
  return Math.max(0, totalAmount - paidAmount);
}

/**
 * Determine invoice payment status.
 */
export function calculateInvoiceStatus(totalAmount, paidAmount) {
  if (paidAmount <= 0) {
    return "issued";
  }

  if (paidAmount >= totalAmount) {
    return "paid";
  }

  return "partially-paid";
}

/**
 * Calculate every billing value at once.
 */
export function calculateInvoiceTotals({
  items = [],
  discountValue = 0,
  discountType = "fixed",
  taxRate = 0,
  payments = [],
}) {
  const subtotal = calculateSubtotal(items);

  const discount = calculateDiscount(subtotal, discountValue, discountType);

  const tax = calculateTax(subtotal, discount, taxRate);

  const totalAmount = calculateTotal(subtotal, discount, tax);

  const paidAmount = calculatePaidAmount(payments);

  const dueAmount = calculateDueAmount(totalAmount, paidAmount);

  const status = calculateInvoiceStatus(totalAmount, paidAmount);

  return {
    subtotal,
    discount,
    tax,
    totalAmount,
    paidAmount,
    dueAmount,
    status,
  };
}
