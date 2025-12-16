"use client";

import { useState } from "react";
import StoreModal from "./StoreModal";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

interface OrderProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (order: Order, status: Order["status"]) => void;
  order: Order | null;
}

export default function OrderProcessModal({
  isOpen,
  onClose,
  onUpdateStatus,
  order,
}: OrderProcessModalProps) {
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const steps = [
    { status: "pending", label: "Pending", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    { status: "processing", label: "Processing", icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { status: "shipped", label: "Shipped", icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
    { status: "delivered", label: "Delivered", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  ] as const;

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  const handleStatusChange = async (newStatus: Order["status"]) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    onUpdateStatus(order, newStatus);
    setLoading(false);
    onClose();
  };

  return (
    <StoreModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Process Order ${order.orderNumber}`}
      description="Update the status of this order to track its progress."
      size="lg"
    >
      <div className="space-y-6">
        {/* Status Timeline / Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.status === order.status;
             // Allow moving to next step or cancelling, or moving back (optional logic)
             // For simplicity, let's allow clicking any status to set it manually
            return (
              <button
                key={step.status}
                onClick={() => handleStatusChange(step.status)}
                disabled={loading}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isActive
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-sky-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className={`p-3 rounded-full ${step.bg} dark:bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isActive ? "text-sky-700 dark:text-sky-300" : "text-gray-900 dark:text-white"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isActive ? "Current Status" : `Set to ${step.label}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cancel Option */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
           <button
            onClick={() => handleStatusChange("cancelled")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-transparent hover:border-red-200 transition-all font-medium"
           >
             <XCircle className="w-5 h-5" />
             Cancel Order
           </button>
        </div>
      </div>
    </StoreModal>
  );
}
