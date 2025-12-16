"use client";

import { AlertTriangle, X } from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "info" | "error";
  title: string;
  message: string;
  count?: number;
}

interface AlertsCardProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

export default function AlertsCard({ alerts, onDismiss }: AlertsCardProps) {
  if (alerts.length === 0) return null;

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-800 dark:text-yellow-200",
          icon: "text-yellow-600 dark:text-yellow-400",
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-200",
          icon: "text-red-600 dark:text-red-400",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-200",
          icon: "text-blue-600 dark:text-blue-400",
        };
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type);
        return (
          <div
            key={alert.id}
            className={`${styles.bg} ${styles.border} border rounded-lg p-4`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${styles.text} mb-1`}>
                      {alert.title}
                      {alert.count && (
                        <span className="ml-2 text-sm font-normal">
                          ({alert.count})
                        </span>
                      )}
                    </h4>
                    <p className={`text-sm ${styles.text} opacity-90`}>
                      {alert.message}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className={`${styles.icon} hover:opacity-70 transition-opacity`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
