"use client";

import { formatDistanceToNow } from "date-fns";
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { statusColors } from "@/features/(admin)/store/theme/storeTheme";

interface Order {
  id: number;
  orderNumber: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: number;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    city: string;
    province: string;
  };
}

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: Order["status"]) => void;
}

export default function OrderTable({ orders, onView, onUpdateStatus }: OrderTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    const colors = statusColors[status];
    const icons = {
      pending: Package,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    const statusFlow: Record<Order["status"], Order["status"] | null> = {
      pending: "processing",
      processing: "shipped",
      shipped: "delivered",
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                Details
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Order Number */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.shippingAddress.city}, {order.shippingAddress.province}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.buyer.firstName} {order.buyer.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.buyer.email}
                        </p>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {order.items} {order.items === 1 ? "item" : "items"}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Rp {order.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </span>
                    </td>

                    {/* Details (Eye Icon) */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onView(order)}
                        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions (Process Button) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end w-[120px] ml-auto">
                        {order.status !== "delivered" && order.status !== "cancelled" ? (
                          <button
                            onClick={() => onUpdateStatus(order, order.status)}
                            className="w-full h-8 px-3 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                          >
                            Process
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic block text-center w-full">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
