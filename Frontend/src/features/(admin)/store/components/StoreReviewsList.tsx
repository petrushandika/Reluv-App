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
import { 
  Star, 
  MessageSquare, 
  ExternalLink, 
  Reply,
  MoreVertical,
  Calendar,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import Image from "next/image"

const mockReviews = [
  {
    id: 1,
    rating: 5,
    comment: "Produknya sangat bagus, kualitas premium dan pengiriman sangat cepat. Recommended seller!",
    createdAt: "2024-01-15T10:00:00Z",
    author: {
      firstName: "Budi",
      lastName: "Santoso",
      profile: { avatar: null }
    },
    product: {
      name: "Vintage Denim Jacket",
      images: ["/placeholder-product.png"]
    },
    reply: "Terima kasih Kak Budi! Semoga awet jaketnya ya.",
    images: ["/placeholder-product.png"]
  },
  {
    id: 2,
    rating: 4,
    comment: "Bahan enak dipakai, cuma warnanya sedikit lebih gelap dari foto. Tapi oke lah.",
    createdAt: "2024-01-14T15:30:00Z",
    author: {
      firstName: "Siti",
      lastName: "Aminah",
      profile: { avatar: null }
    },
    product: {
      name: "Classic White Tee",
      images: ["/placeholder-product.png"]
    },
    reply: null,
    images: []
  },
  {
    id: 3,
    rating: 5,
    comment: "Sangat puas dengan pelayanannya. Seller sangat informatif.",
    createdAt: "2024-01-12T09:15:00Z",
    author: {
      firstName: "Andi",
      lastName: "Wijaya",
      profile: { avatar: null }
    },
    product: {
      name: "Slim Fit Chinos",
      images: ["/placeholder-product.png"]
    },
    reply: "Terima kasih banyak atas feedbacknya Kak Andi!",
    images: []
  }
]

export function StoreReviewsList() {
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-none">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[280px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Review & Product</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Comment</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReviews.map((review) => (
            <TableRow key={review.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-all group">
              <TableCell className="py-5 pl-6">
                <div className="flex items-start space-x-3">
                  <div className="relative h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                    <Image 
                      src={review.product.images[0] || "/placeholder-product.png"} 
                      alt={review.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate mb-1">{review.product.name}</span>
                    {renderStars(review.rating)}
                    <span className="text-[10px] font-semibold text-slate-400 mt-1.5 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center text-[10px] font-bold text-sky-600">
                    {review.author.firstName[0]}{review.author.lastName[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {review.author.firstName} {review.author.lastName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                    "{review.comment}"
                  </p>
                  {review.images.length > 0 && (
                    <div className="flex gap-1.5 mt-2.5">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                          <Image 
                            src={img} 
                            alt={`review-${idx}`} 
                            fill 
                            className="object-cover hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {review.reply ? (
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/30 font-bold text-[9px] uppercase tracking-widest px-3 py-1 border-2 rounded-full">
                    Replied
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-900/30 font-bold text-[9px] uppercase tracking-widest px-3 py-1 border-2 rounded-full">
                    No Reply
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all border">
                  {review.reply ? "Edit Reply" : "Reply Now"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
