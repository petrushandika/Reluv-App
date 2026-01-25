"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { 
  Search, 
  Filter, 
  ChevronDown,
  Star, 
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { ReviewReplyModal } from "./modals/ReviewReplyModal"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

import { useEffect } from "react"
import { getStoreReviews, StoreReview } from "../api/storeApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function StoreReviewsList() {
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [reviews, setReviews] = useState<StoreReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await getStoreReviews({
        search,
        page,
        limit: 10
      })
      setReviews(response.data)
      setMeta(response.meta)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews()
    }, 500)
    return () => clearTimeout(timer)
  }, [search, page])

  const handleReply = (review: any) => {
    setSelectedReview(review)
    setIsReplyModalOpen(true)
  }

  const handleDelete = (review: any) => {
    setSelectedReview(review)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting review:", selectedReview?.id)
    setIsDeleteModalOpen(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-3 w-3",
              i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"
            )} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Integrated Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search reviews or customers..." 
            className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/10 focus:border-sky-500 rounded-xl text-xs font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Rating
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] hidden sm:block whitespace-nowrap">
            {meta?.total || 0} Records Found
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="py-5 pl-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Review & Product</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Customer</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Commentary</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
               [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-40 ml-auto" /></TableCell>
                </TableRow>
               ))
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500 uppercase text-[10px] tracking-widest font-medium">
                  No feedback received yet
                </TableCell>
              </TableRow>
            ) : reviews.map((review) => (
              <TableRow 
                key={review.id} 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 border-none"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-start space-x-3">
                    <div className="relative h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
                      <Image 
                        src={review.product.images[0] || "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp"} 
                        alt={review.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-900 dark:text-white truncate mb-1">{review.product.name}</span>
                      {renderStars(review.rating)}
                      <span className="text-[10px] font-medium text-slate-400 mt-1.5 uppercase tracking-tighter">
                        {new Date(review.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center text-[10px] font-medium text-sky-600 overflow-hidden">
                       {review.author.profile?.avatar ? (
                         <img src={review.author.profile.avatar} className="h-full w-full object-cover" />
                       ) : (
                         `${review.author.firstName[0]}${review.author.lastName[0]}`
                       )}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {review.author.firstName} {review.author.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center justify-center w-24 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-800",
                    review.reply ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"
                  )}>
                    {review.reply ? "Replied" : "Pending"}
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         onClick={() => handleReply(review)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         {review.reply ? "Edit" : "Reply"}
                       </Button>
                       <Button 
                         variant="ghost" 
                         onClick={() => handleDelete(review)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         Delete
                       </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          Showing {reviews.length} of {meta?.total || 0} reviews
        </p>
        <div className="flex gap-2">
           <Button 
             variant="outline" 
             size="icon" 
             disabled={page === 1}
             onClick={() => setPage(page - 1)}
             className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
           >
             <ChevronLeft className="h-4 w-4 text-slate-500" />
           </Button>
           <Button 
             variant="outline" 
             size="icon" 
             disabled={page >= (meta?.totalPages || 1)}
             onClick={() => setPage(page + 1)}
             className="h-8 w-8 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all border-sky-100 dark:border-sky-500/20 disabled:opacity-50"
           >
             <ChevronRight className="h-4 w-4 text-sky-500" />
           </Button>
        </div>
      </div>

      <ReviewReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        review={selectedReview}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Sanitize Content"
        description="Are you sure you want to delete this customer review? This will remove their feedback from your public profile."
        itemName={selectedReview ? `Review by ${selectedReview.author.firstName}` : undefined}
      />
    </div>
  )
}
