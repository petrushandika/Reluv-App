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
// import { Select } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"

import { useState, useEffect } from "react"
import { 
  createStoreProduct, 
  updateStoreProduct, 
  updateStoreVariant, // Add import
  uploadImage,
  getStoreProduct 
} from "../../api/storeApi"
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
    slug: "",
    categoryId: 1, // Default category
    description: "",
    price: 0,
    stock: 0,
    condition: "NEW", // Default condition
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    images: [] as string[]
  })

  useEffect(() => {
    const loadProductDetails = async () => {
      if (product && mode === "edit") {
        try {
            // Fetch full details to ensure we have weight, dimensions etc.
            const fullProduct: any = await getStoreProduct(product.id)
            const variant = fullProduct.variants?.[0] || {}
            
            setFormData({
                name: fullProduct.name || "",
                slug: fullProduct.slug || "",
                categoryId: fullProduct.category?.id || 1,
                description: fullProduct.description || "",
                price: variant.price || fullProduct.minPrice || 0,
                stock: variant.stock || fullProduct.totalStock || 0,
                condition: variant.condition || "NEW",
                weight: variant.weight || 0,
                length: variant.length || 0,
                width: variant.width || 0,
                height: variant.height || 0,
                images: fullProduct.images || []
            })
        } catch (error) {
            console.error("Failed to load product details", error)
            // Fallback to existing product prop if fetch fails, though it might be incomplete
             const variant = product.variants?.[0] || {}
             setFormData({
                name: product.name || "",
                slug: product.slug || "",
                categoryId: product.category?.id || 1,
                description: product.description || "",
                price: variant.price || product.minPrice || 0,
                stock: variant.stock || product.totalStock || 0,
                condition: variant.condition || "NEW",
                weight: variant.weight || 0,
                length: variant.length || 0,
                width: variant.width || 0,
                height: variant.height || 0,
                images: product.images || []
            })
        }
      } else {
        setFormData({
            name: "",
            slug: "",
            categoryId: 1,
            description: "",
            price: 0,
            stock: 0,
            condition: "NEW",
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            images: []
        })
      }
    }
    loadProductDetails()
  }, [product, mode, isOpen])

  // ... (useEffect above)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    try {
      setIsSaving(true)
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const results = await Promise.all(uploadPromises)
      const newUrls = results.map(res => res.url)
      
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }))
      toast.success(`${newUrls.length} image(s) uploaded`)
    } catch {
      toast.error("Failed to upload images")
    } finally {
      setIsSaving(false)
      // Reset input value to allow selecting same files again if needed
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Auto-generate slug if empty
      const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

      const basePayload = {
        name: formData.name,
        slug: finalSlug,
        description: formData.description,
        categoryId: formData.categoryId,
        images: formData.images,
      }

      const variantData = {
        price: Number(formData.price),
        stock: Number(formData.stock),
        condition: formData.condition,
        weight: Number(formData.weight),
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
      }

      if (mode === "create") {
        // For create, we send everything including variants
        const createPayload = {
          ...basePayload,
          variants: [variantData]
        }
        await createStoreProduct(createPayload)
        toast.success("Product created successfully")
      } else {
        // For update, we must split updates
        
        // 1. Update Product Info
        await updateStoreProduct(product.id, basePayload)
        
        // 2. Update Variant Info
        // We find the variant ID from the product object. We assume the first variant is the main one for simple products.
        // We need to be careful: product prop might be summary, so we use the fetched ID if available, or fall back to prop.
        // But wait, 'product' from prop has variants array.
        const variantId = product.variants?.[0]?.id;
        
        if (variantId) {
           await updateStoreVariant(product.id, variantId, variantData);
        } else {
             // If no variant exists (which shouldn't happen for valid products), we might need to create one?
             // For now, we assume it exists as per business logic.
             console.warn("No variant ID found for product update")
        }
        
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
        <DialogHeader className="flex flex-col gap-2 text-center sm:text-left px-6 pt-8 pb-0 sm:px-8 sm:pt-10 sm:pb-0 shrink-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                {mode === "create" ? "Add New Asset" : "Modify Inventory"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                {mode === "create" ? "Register a new product" : `Editing ID: #${product?.id}`}
              </DialogDescription>
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
                <div className="relative">
                  <select 
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                    className="w-full h-11 sm:h-12 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 pr-10 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none"
                  >
                    <option value={1}>Clothing</option>
                    <option value={2}>Footwear</option>
                    <option value={3}>Accessories</option>
                    <option value={4}>Electronics</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none text-slate-400">
                    <ChevronUp className="h-3 w-3 -mb-0.5" />
                    <ChevronDown className="h-3 w-3 -mt-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Condition</Label>
                <div className="relative">
                  <select 
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full h-11 sm:h-12 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 pr-10 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none"
                  >
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none text-slate-400">
                    <ChevronUp className="h-3 w-3 -mb-0.5" />
                    <ChevronDown className="h-3 w-3 -mt-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Base Price (IDR)</Label>
                <Input 
                  required
                  type="text" 
                  placeholder="0"
                  value={formData.price === 0 ? "" : formData.price.toLocaleString("id-ID")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); 
                    const numVal = Number(val);
                    setFormData(prev => ({ ...prev, price: numVal }));
                  }}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock Count</Label>
                <Input 
                  required
                  type="text" 
                  placeholder="0"
                  value={formData.stock === 0 ? "" : formData.stock.toLocaleString("id-ID")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); 
                    const numVal = Number(val);
                    setFormData(prev => ({ ...prev, stock: numVal }));
                  }}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weight (g)</Label>
                  <Input 
                    required
                    type="number" 
                    placeholder="1000"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                  />
              </div>

              <div className="sm:col-span-2 grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Length (cm)</Label>
                    <Input 
                      required
                      type="number" 
                      placeholder="10"
                      value={formData.length || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, length: Number(e.target.value) }))}
                      className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Width (cm)</Label>
                    <Input 
                      required
                      type="number" 
                      placeholder="10"
                      value={formData.width || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
                      className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Height (cm)</Label>
                    <Input 
                      required
                      type="number" 
                      placeholder="10"
                      value={formData.height || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                      className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                    />
                  </div>
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
                      <img src={img} alt={`Product ${idx}`} className="h-full w-full object-cover" />
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
                      multiple
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
          <Button variant="ghost" onClick={() => onClose()} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border border-sky-100 dark:border-sky-900/30 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all flex-1 sm:flex-none">
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
