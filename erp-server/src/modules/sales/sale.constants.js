export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  MOBILE_BANKING: "mobile_banking",
  BANK_TRANSFER: "bank_transfer",
};

export const PAYMENT_METHOD_VALUES =
  Object.values(PAYMENT_METHODS);

export const PAYMENT_STATUS = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
};

export const PAYMENT_STATUS_VALUES =
  Object.values(PAYMENT_STATUS);

export const SALE_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  CANCELLED: "cancelled",
};

export const SALE_STATUS_VALUES =
  Object.values(SALE_STATUS);