"use client";

import { formatDistanceToNow } from "date-fns";
import { Package, ShoppingCart, Star, DollarSign } from "lucide-react";

interface Activity {
  id: string;
  type: "order" | "product" | "review" | "payment";
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-5 h-5" />;
      case "product":
        return <Package className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "order":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "product":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "review":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
      case "payment":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Recent Activities
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Latest updates from your store
        </p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent activities
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
              {activity.amount && (
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Rp {activity.amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
