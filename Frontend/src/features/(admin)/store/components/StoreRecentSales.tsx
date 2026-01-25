import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1
  }
}

import { formatDistanceToNow } from "date-fns"

interface StoreRecentSalesProps {
  orders?: any[]
}

export function StoreRecentSales({ orders = [] }: StoreRecentSalesProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">No recent sales</p>
      </div>
    )
  }

  const sales = orders.map(order => ({
    name: `${order.buyer.firstName} ${order.buyer.lastName}`.trim(),
    email: order.buyer.email,
    amount: order.totalAmount,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(order.buyer.firstName)}&background=random`,
    initials: `${order.buyer.firstName?.[0] || ""}${order.buyer.lastName?.[0] || ""}`.toUpperCase(),
    time: formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })
  }))

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {sales.map((sale, i) => (
        <motion.div 
          key={i} 
          variants={itemVariants}
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 group"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 ring-2 ring-(--border-color) ring-offset-2 ring-offset-(--bg-primary) group-hover:ring-sky-500 transition-all duration-300">
              <AvatarImage src={sale.avatar} alt={sale.name} />
              <AvatarFallback className="font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">{sale.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-none group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">{sale.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-500 font-medium truncate hidden min-[400px]:block max-w-[80px] sm:max-w-[120px]">{sale.email}</p>
                <span className="text-[9px] text-slate-300 dark:text-slate-700 hidden min-[400px]:block">•</span>
                <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{sale.time}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              +Rp. {sale.amount.toLocaleString("id-ID")}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
