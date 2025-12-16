"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string; // e.g., "bg-blue-500"
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
}: StatCardProps) {
  // Extract color name/shade to create a lighter background for the icon container if needed
  // For simplicity, we assume iconColor is a full class like "bg-blue-500" passed from parent
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            {value}
          </h3>
          
          {(subtitle || trend) && (
            <div className="flex flex-wrap items-center gap-2">
              {trend && (
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${
                    trend.isPositive
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {subtitle || "vs last month"}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl shadow-sm ${iconColor} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {/* We assume iconColor passed is like "bg-blue-500", so we need to handle the text color carefully. 
              Actually, usually we want icon to be white on colored bg. 
              Let's adjust: parent passes "bg-blue-500", we render it.
          */}
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
