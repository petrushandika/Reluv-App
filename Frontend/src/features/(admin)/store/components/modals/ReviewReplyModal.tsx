"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { MessageSquare, Star, Quote } from "lucide-react"
import { cn } from "@/shared/lib/utils"

import { useState, useEffect } from "react"
import { replyToReview } from "../../api/storeApi"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ReviewReplyModalProps {
  isOpen: boolean
  onClose: (refresh?: boolean) => void
  review: any
}

export function ReviewReplyModal({ isOpen, onClose, review }: ReviewReplyModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [reply, setReply] = useState("")

  useEffect(() => {
    if (review) {
      setReply(review.reply || "")
    }
  }, [review, isOpen])

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty")
      return
    }

    setIsSaving(true)
    try {
      await replyToReview(review.id, reply)
      toast.success("Reply published")
      onClose(true)
    } catch (error: any) {
      toast.error(error.message || "Failed to publish reply")
    } finally {
      setIsSaving(false)
    }
  }

  if (!review) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 sm:p-8 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <MessageSquare className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                {review.reply ? "Modify Response" : "Send Feedback Response"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                Engaging with {review.author?.firstName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="relative p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 group">
               <Quote className="absolute top-4 right-4 h-6 w-6 sm:h-8 sm:w-8 text-slate-200 dark:text-slate-800 group-hover:text-amber-500/20 transition-colors" />
               <div className="flex items-center gap-2 mb-3">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800")} />
                 ))}
                 <span className="text-[9px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                 </span>
               </div>
               <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">
                 "{review.comment}"
               </p>
            </div>

            <div className="space-y-3">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1">Your Response</Label>
               <Textarea 
                 placeholder="Write a thoughtful reply..."
                 value={reply}
                 onChange={(e) => setReply(e.target.value)}
                 className="min-h-[120px] sm:min-h-[140px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl p-4 text-xs leading-relaxed focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
               />
               <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] sm:text-[9px] font-medium text-slate-400 uppercase tracking-widest">Professional & friendly</span>
                  <span className="text-[8px] sm:text-[9px] font-medium text-amber-500 uppercase tracking-widest cursor-pointer hover:underline">Use Template</span>
               </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={() => onClose()} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="rounded-xl px-6 sm:px-8 h-11 sm:h-12 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-black dark:hover:bg-white transition-all active:scale-95 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-none shadow-xl shadow-black/10 flex-1 sm:flex-none"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : review.reply ? "Update" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
