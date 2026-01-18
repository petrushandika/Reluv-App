"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Ticket, 
  Search, 
  ChevronLeft, 
  Clock, 
  Info,
  ArrowRight,
  TrendingUp,
  Tag
} from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar"
import { PrivateRoute } from "@/shared/components/guards/RouteGuards"
import { getMe } from "@/features/(main)/user/api/userApi"
import { User as UserType } from "@/features/(auth)/types"

const mockAvailableVouchers = [
  {
    id: 1,
    name: "New Year Celebration",
    code: "NY2024",
    type: "PERCENTAGE",
    value: 15,
    minPurchase: 150000,
    maxDiscount: 30000,
    expiry: "2024-12-31T23:59:59Z",
    storeName: "Reluv Official",
    description: "Special discount for all items in Reluv Official Store."
  },
  {
    id: 2,
    name: "Weekend Flash Sale",
    code: "FLASHWEEKEND",
    type: "FIXED_AMOUNT",
    value: 25000,
    minPurchase: 100000,
    maxDiscount: null,
    expiry: "2024-05-20T23:59:59Z",
    storeName: "Street Style",
    description: "Get Rp 25k off for your weekend outfit."
  },
  {
    id: 3,
    name: "First Order Special",
    code: "WELCOME50",
    type: "PERCENTAGE",
    value: 50,
    minPurchase: 50000,
    maxDiscount: 25000,
    expiry: "2024-06-01T23:59:59Z",
    storeName: "Everywhere Store",
    description: "Exclusively for your first order across the platform."
  }
]

export default function VouchersPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe()
        setUser(data)
      } catch (error) {
        console.error("Failed to fetch user", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            {}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Voucher Center</h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <Ticket className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Voucher Center
                    </h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">Claim and manage your shopping discounts</p>
                  </div>
                </div>
              </div>

              {}
              <div className="mb-8 p-6 bg-linear-to-r from-sky-600 to-indigo-600 rounded-2xl border border-white/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Tag className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 max-w-lg">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ready to Save More?</h2>
                  <p className="text-white/80 text-sm font-medium mb-6">Explore the best deals tailored just for you. Apply vouchers at checkout to enjoy exclusive prices.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Savings Potential</p>
                        <p className="text-lg font-bold text-white">Rp. 150.000+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Enter voucher code..." 
                    className="pl-11 h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-sky-500/20 focus:border-sky-500 border transition-all"
                  />
                </div>
                <Button className="h-12 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-none">
                  Claim Voucher
                </Button>
              </div>

              {}
              <div className="grid gap-6">
                {mockAvailableVouchers.map((voucher) => (
                  <div 
                    key={voucher.id}
                    className="flex flex-col md:flex-row bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-sky-300 dark:hover:border-sky-900/50 transition-all group"
                  >
                    {}
                    <div className="w-full md:w-56 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 relative">
                      <div className="absolute -top-3 -right-3 h-6 w-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 hidden md:block" />
                      <div className="absolute -bottom-3 -right-3 h-6 w-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 hidden md:block" />
                      
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {voucher.type === "PERCENTAGE" ? `${voucher.value}%` : `Rp${(voucher.value/1000)}k`} 
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        OFF
                      </div>
                      <Badge className="mt-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 font-bold px-3 py-1 rounded-lg">
                        {voucher.code}
                      </Badge>
                    </div>

                    {}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 transition-colors">
                            {voucher.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">{voucher.storeName}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            Expiry
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {new Date(voucher.expiry).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium line-clamp-1">
                        {voucher.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min. Purchase</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Rp. {voucher.minPurchase.toLocaleString("id-ID")}</span>
                          </div>
                          {voucher.maxDiscount && (
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max. Disc</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">Rp. {voucher.maxDiscount.toLocaleString("id-ID")}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" className="h-9 px-5 rounded-xl border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:bg-sky-50 transition-all border">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {}
              {mockAvailableVouchers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <Ticket className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No vouchers available right now</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
