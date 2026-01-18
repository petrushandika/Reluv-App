import { OrderStatus } from "../types";

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 border";
    case "PAID":
      return "text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30 border";
    case "SHIPPED":
      return "text-blue-600 border-blue-100 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-900/30 border";
    case "DELIVERED":
    case "COMPLETED":
      return "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 border";
    case "CANCELLED":
    case "REFUNDED":
      return "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 border";
    default:
      return "text-slate-500 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 border";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
