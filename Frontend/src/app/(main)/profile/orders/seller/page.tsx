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
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";

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
        router.push("/login");
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
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Order Management</h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-8 lg:pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Order Management
                    </h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">Track and fulfill your store sales</p>
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[450px] py-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div className="mb-8 p-6 bg-white dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800 shadow-none">
                    <Package className="w-20 h-20 text-sky-600 dark:text-sky-400 stroke-[1.5]" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    No sales yet
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 max-w-sm font-medium">
                    When customers purchase your products, orders will appear here for fulfillment.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <div className="flex gap-6 min-w-max pb-3">
                      {Object.entries(tabLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key as TabFilter)}
                          className={cn(
                            "px-1 text-xs font-bold uppercase tracking-widest transition-all relative py-2",
                            activeTab === key
                              ? "text-sky-600 dark:text-sky-400"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          )}
                        >
                          {label}
                          {activeTab === key && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                      <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        No orders in this category
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-sky-200 dark:hover:border-sky-900/50 transition-all group"
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 transition-colors">
                                    Order #{order.orderNumber}
                                  </h3>
                                  <Badge
                                    className={cn(
                                      "px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border-2",
                                      getStatusColor(order.status)
                                    )}
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{formatDate(order.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" />
                                    <span>{order.items.length} item(s)</span>
                                  </div>
                                  {order.buyer && (
                                    <div className="flex items-center gap-2">
                                      <User className="w-3.5 h-3.5" />
                                      <span>
                                        {order.buyer.firstName} {order.buyer.lastName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Total Revenue
                                </p>
                                <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 sm:p-6">
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0"
                                >
                                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                    <Image
                                      src={
                                        item.variant.image ||
                                        item.variant.product.images[0] ||
                                        "/placeholder-product.png"
                                      }
                                      alt={item.variant.product.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 640px) 64px, 80px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 pt-0.5">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 text-sm tracking-tight">
                                      {item.variant.product.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                                      {item.variant.size && <span>Size: {item.variant.size}</span>}
                                      {item.variant.color && <span>Color: {item.variant.color}</span>}
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                      {formatCurrency(item.total)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-5 pt-4 flex justify-end border-t border-slate-100 dark:border-slate-800">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderClick(order.id);
                                }}
                                className="flex items-center gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-all border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30"
                              >
                                View Details & Fulfill
                                <ChevronRight className="w-3.5 h-3.5" />
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

