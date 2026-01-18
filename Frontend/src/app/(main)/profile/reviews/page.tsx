"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  Search, 
  ChevronLeft, 
  Star, 
  Info,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar"
import { PrivateRoute } from "@/shared/components/guards/RouteGuards"
import { getMe } from "@/features/(main)/user/api/userApi"
import { User as UserType } from "@/features/(auth)/types"
import { cn } from "@/shared/lib/utils"
import Image from "next/image"

const mockUserReviews = [
  {
    id: 1,
    rating: 5,
    comment: "This jacket is incredible! The material is high quality and it fits perfectly. Worth every penny.",
    createdAt: "2024-01-10T14:20:00Z",
    product: {
      name: "Vintage Denim Jacket",
      image: "/placeholder-product.png",
      storeName: "Reluv Official"
    },
    images: ["/placeholder-product.png"],
    reply: "Thank you for the amazing feedback! We're glad you like the jacket.",
    isShipped: true
  },
  {
    id: 2,
    rating: 4,
    comment: "Very comfortable tee. The color is slightly different from the photos, but I still like it.",
    createdAt: "2024-01-05T09:15:00Z",
    product: {
      name: "Classic White Tee",
      image: "/placeholder-product.png",
      storeName: "Street Style"
    },
    images: [],
    reply: null,
    isShipped: true
  }
]

export default function UserReviewsPage() {
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-3.5 w-3.5",
              i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"
            )} 
          />
        ))}
      </div>
    )
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Product Reviews</h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <MessageSquare className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      My Reviews
                    </h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">Share your experience with the community</p>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Reviews</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Helpful Votes</span>
                  <div className="text-2xl font-bold text-emerald-600">45</div>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Pending Reviews</span>
                  <div className="text-2xl font-bold text-amber-500">3</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-0.5">
                <button className="text-[11px] font-bold uppercase tracking-widest text-sky-600 border-b-2 border-sky-600 pb-3 h-full">All Reviews</button>
                <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pb-3 transition-colors h-full">To Be Reviewed</button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {mockUserReviews.map((review) => (
                  <div 
                    key={review.id}
                    className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group"
                  >
                    {/* Header: Product Info */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0">
                          <Image 
                            src={review.product.image}
                            alt={review.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">{review.product.name}</h3>
                          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mt-0.5">{review.product.storeName}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1 mb-1">
                          <Clock className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-6 leading-relaxed">
                        "{review.comment}"
                      </p>

                      {review.images.length > 0 && (
                        <div className="flex gap-3 mb-6">
                          {review.images.map((img, idx) => (
                            <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                              <Image src={img} alt="review" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Store Reply */}
                      {review.reply && (
                        <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-500/5 rounded-2xl border border-sky-100 dark:border-sky-900/30 relative">
                          <div className="absolute -top-3 left-4 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border border-sky-200 dark:border-sky-800">
                            Store Response
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic">
                            "{review.reply}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all">
                            Helpful? (12)
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="h-9 px-5 rounded-xl border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all border">
                            Edit Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {mockUserReviews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You haven't reviewed any products yet</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
