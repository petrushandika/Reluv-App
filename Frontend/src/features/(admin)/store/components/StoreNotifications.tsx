"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import { Bell, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/features/(auth)/store/auth.store"
import { cn } from "@/shared/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  createdAt: string
  read: boolean
}

export function StoreNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    // Initialize Socket.IO connection
    // Assuming backend is running on localhost:3000 or defined in env
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    const newSocket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("auth-storage") ? JSON.parse(localStorage.getItem("auth-storage")!).state.accessToken : "",
      },
    })

    newSocket.on("connect", () => {
      console.log("Socket connected")
    })

    newSocket.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Mock initial data for demonstration if no socket
  useEffect(() => {
      if (notifications.length === 0) {
          const initial = [
            { id: "1", title: "Order #2390 Received", message: "New order needs processing", type: "success", createdAt: new Date().toISOString(), read: false },
            { id: "2", title: "Low Stock Alert", message: "Product 'Denim Jacket' is low on stock", type: "warning", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
            { id: "3", title: "System Update", message: "Maintenance scheduled for tonight", type: "info", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
            { id: "4", title: "Review Reported", message: "A user reported a review", type: "error", createdAt: new Date(Date.now() - 10000000).toISOString(), read: true },
          ] as Notification[]
           setNotifications(initial)
           setUnreadCount(2)
      }
  }, [])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getIcon = (type: string) => {
      switch (type) {
          case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />
          case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />
          case 'error': return <AlertTriangle className="h-4 w-4 text-rose-500" />
          default: return <Info className="h-4 w-4 text-sky-500" />
      }
  }

  const getBgColor = (type: string) => {
      switch (type) {
          case 'warning': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10'
          case 'success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
          case 'error': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
          default: return 'bg-sky-50 text-sky-600 dark:bg-sky-500/10'
      }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-slate-500 hover:text-sky-500 hover:bg-(--bg-primary) transition-all relative">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-1.5 w-1.5 bg-sky-500 rounded-full ring-2 ring-(--bg-primary)" />
            )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-2xl p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white">Notifications</h4>
            {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] font-medium text-sky-500 hover:text-sky-600 uppercase tracking-wider">
                    Mark Read
                </button>
            )}
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No notifications</div>
            ) : (
                notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        className={cn(
                            "flex gap-3 p-3 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer",
                            !notification.read && "bg-slate-50/50 dark:bg-slate-800/20"
                        )}
                    >
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", getBgColor(notification.type))}>
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate pr-2">{notification.title}</p>
                                <span className="text-[9px] text-slate-400 whitespace-nowrap">{new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{notification.message}</p>
                        </div>
                        {!notification.read && (
                            <div className="self-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-sky-500 hover:bg-transparent">
                View All Activity
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
