"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ChevronLeft,
  Package,
  Calendar,
  ChevronRight,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CreditCard,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { getMe } from "@/features/(main)/user/api/userApi";
import { User as UserType } from "@/features/(auth)/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar";
import Image from "next/image";
import Spinner from "@/shared/components/common/Spinner";
import { getSellerOrders, getSellerOrder } from "@/features/(main)/orders/api/ordersApi";
import { Order, OrderStatus } from "@/features/(main)/orders/types";
import { getStatusColor, formatCurrency, formatDate } from "@/features/(main)/orders/utils";
import { toast } from "sonner";

type TabFilter = "all" | "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";

const tabLabels: Record<TabFilter, string> = {
  all: "Semua",
  PENDING: "Belum Dibayar",
  PAID: "Pesanan Baru",
  SHIPPED: "Siap Kirim",
  DELIVERED: "Dalam Pengiriman",
  COMPLETED: "Pesanan Selesai",
  CANCELLED: "Dibatalkan",
};

const OrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchOrder = async () => {
        setIsLoading(true);
        try {
          const orderData = await getSellerOrder(orderId);
          setOrder(orderData);
        } catch {
          toast.error("Failed to Load Order", {
            description: "Unable to load order details. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    } else {
      setOrder(null);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="md" />
            </div>
          ) : order ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Order ID:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {order.buyer && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Buyer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.buyer.firstName} {order.buyer.lastName}
                        </span>
                      </div>
                      {order.buyer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {order.buyer.email}
                          </span>
                        </div>
                      )}
                      {order.buyer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {order.buyer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.location && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h3>
                    <div className="space-y-1 text-sm text-gray-900 dark:text-white">
                      <p className="font-medium">{order.location.recipient}</p>
                      <p>{order.location.address}</p>
                      <p>
                        {order.location.subDistrict}, {order.location.district}
                      </p>
                      <p>
                        {order.location.city}, {order.location.province} {order.location.postalCode}
                      </p>
                      {order.location.phone && (
                        <p className="flex items-center gap-2 mt-2">
                          <Phone className="w-4 h-4" />
                          {order.location.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {order.payment && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.payment.method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.payment.status}
                        </span>
                      </div>
                      {order.payment.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Paid At:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(order.payment.paidAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {order.shipment && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Courier:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.shipment.courier} - {order.shipment.service}
                        </span>
                      </div>
                      {order.shipment.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tracking:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.shipment.trackingNumber}
                          </span>
                        </div>
                      )}
                      {order.shipment.shippedAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Shipped At:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(order.shipment.shippedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={
                            item.variant.image ||
                            item.variant.product.images[0] ||
                            "/placeholder-product.png"
                          }
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.variant.product.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(order.itemsAmount)}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">
                        -{formatCurrency(order.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Order Notes
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-white">{order.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Order not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SellerOrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        router.push("/auth/login");
        return;
      }

      try {
        const [userData, ordersData] = await Promise.all([getMe(), getSellerOrders()]);
        setUser(userData);
        setOrders(ordersData);
      } catch {
        setUser(null);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Order List</h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6 lg:pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Order List
                  </h1>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                  <div className="mb-8 flex items-center justify-center">
                    <Package className="w-24 h-24 sm:w-32 sm:h-32 text-sky-600 dark:text-sky-400 stroke-[1.5]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No orders yet
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                    When customers purchase your products, orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <div className="flex gap-4 sm:gap-6 min-w-max">
                      {Object.entries(tabLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key as TabFilter)}
                          className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                            activeTab === key
                              ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No orders found in this category
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Order #{order.orderNumber}
                                  </h3>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(order.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    <span>{order.items.length} item(s)</span>
                                  </div>
                                  {order.buyer && (
                                    <div className="flex items-center gap-1">
                                      <User className="w-4 h-4" />
                                      <span>
                                        {order.buyer.firstName} {order.buyer.lastName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                  Total
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 sm:p-6">
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                                >
                                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <Image
                                      src={
                                        item.variant.image ||
                                        item.variant.product.images[0] ||
                                        "/placeholder-product.png"
                                      }
                                      alt={item.variant.product.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 80px, 96px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                      {item.variant.product.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {item.variant.size && (
                                        <span>Size: {item.variant.size}</span>
                                      )}
                                      {item.variant.color && (
                                        <span>Color: {item.variant.color}</span>
                                      )}
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                                      {formatCurrency(item.total)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderClick(order.id);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer"
                              >
                                View Details
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>

        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOrderId(null);
          }}
          orderId={selectedOrderId}
        />
      </div>
    </PrivateRoute>
  );
};

export default SellerOrdersPage;

