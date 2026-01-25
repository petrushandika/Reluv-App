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
import { Plus } from "lucide-react"

import { useState, useEffect } from "react"
import { createStoreProduct, updateStoreProduct, uploadImage } from "../../api/storeApi"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProductModalProps {
  isOpen: boolean
  onClose: (refresh?: boolean) => void
  product?: any // For edit mode
  mode: "create" | "edit"
}

export function ProductModal({ isOpen, onClose, product, mode }: ProductModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    categoryId: 1, // Default category
    description: "",
    price: 0,
    stock: 0,
    images: [] as string[]
  })

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        categoryId: product.category?.id || 1,
        description: product.description || "",
        price: product.minPrice || 0,
        stock: product.totalStock || 0,
        images: product.images || []
      })
    } else {
      setFormData({
        name: "",
        categoryId: 1,
        description: "",
        price: 0,
        stock: 0,
        images: []
      })
    }
  }, [product, mode, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setIsSaving(true)
      const { url } = await uploadImage(file)
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }))
      toast.success("Image uploaded")
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Backend expects price and stock in variants. For now we simplify or match backend DTO.
      // Based on typical Reluv DTO, we might need to send variants.
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        images: formData.images,
        variants: [
            {
                price: Number(formData.price),
                stock: Number(formData.stock),
                sku: `${formData.name.substring(0, 3).toUpperCase()}-${Date.now()}`
            }
        ]
      }

      if (mode === "create") {
        await createStoreProduct(payload)
        toast.success("Product created successfully")
      } else {
        await updateStoreProduct(product.id, payload)
        toast.success("Product updated successfully")
      }
      onClose(true)
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 sm:p-8 pb-0 shrink-0">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                {mode === "create" ? "Add New Asset" : "Modify Inventory"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                {mode === "create" ? "Register a new product" : `Editing ID: #${product?.id}`}
              </DialogDescription>
            </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Name</Label>
                <Input 
                  required
                  placeholder="e.g. Classic Leather Jacket" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</Label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                  className="w-full h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none"
                >
                  <option value={1}>Clothing</option>
                  <option value={2}>Footwear</option>
                  <option value={3}>Accessories</option>
                  <option value={4}>Electronics</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Condition</Label>
                <select 
                  className="w-full h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Base Price (IDR)</Label>
                <Input 
                  required
                  type="number" 
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock Count</Label>
                <Input 
                  required
                  type="number" 
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detail your product's condition, history, and key features..." 
                  className="min-h-[100px] sm:min-h-[120px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl resize-none p-4 text-xs leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">Product Imagery</Label>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={img} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="text-white hover:text-white hover:bg-white/20"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 hover:border-sky-500 hover:bg-sky-500/5 transition-all group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-sky-500">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 group-hover:text-white" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-sky-500">Upload</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={() => onClose()} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button 
            form="product-form"
            type="submit"
            disabled={isSaving} 
            className="rounded-xl px-6 sm:px-8 h-11 sm:h-12 bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 flex-1 sm:flex-none"
          >
            {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "create" ? "Deploy" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
