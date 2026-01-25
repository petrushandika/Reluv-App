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
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { Package, Image as ImageIcon, Plus } from "lucide-react"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any // For edit mode
  mode: "create" | "edit"
}

export function ProductModal({ isOpen, onClose, product, mode }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 sm:p-8 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
              <Package className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                {mode === "create" ? "Add New Asset" : "Modify Inventory"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                {mode === "create" ? "Register a new product" : `Editing ID: ${product?.id || 'PROD-XXX'}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Name</Label>
                <Input 
                  placeholder="e.g. Classic Leather Jacket" 
                  defaultValue={product?.name}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</Label>
                <Select defaultValue={product?.category || "Clothing"}>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Condition</Label>
                <Select defaultValue={product?.condition || "New"}>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Base Price (IDR)</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  defaultValue={product?.price}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock Count</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  defaultValue={product?.stock}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea 
                  placeholder="Detail your product's condition, history, and key features..." 
                  className="min-h-[100px] sm:min-h-[120px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl resize-none p-4 text-xs leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">Product Imagery</Label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
                  {product?.image ? (
                     <div className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                       <img src={product.image} className="h-full w-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20">Change</Button>
                       </div>
                     </div>
                  ) : null}
                  <button type="button" className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 hover:border-sky-500 hover:bg-sky-500/5 transition-all group">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-sky-500">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-hover:text-white" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-sky-500">Upload</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={onClose} className="rounded-xl px-6 sm:px-8 h-11 sm:h-12 bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 flex-1 sm:flex-none">
            {mode === "create" ? "Deploy" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
