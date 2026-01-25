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
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { ProductModal } from "./modals/ProductModal"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

const products = [
  {
    id: "PROD-001",
    name: "Classic Leather Jacket",
    category: "Clothing",
    price: 1200000,
    stock: 5,
    condition: "Good",
    status: "published",
    image: "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp",
  },
  {
    id: "PROD-002",
    name: "Limited Edition Sneakers",
    category: "Footwear",
    price: 3500000,
    stock: 2,
    condition: "Like New",
    status: "published",
    image: "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp",
  },
  {
    id: "PROD-003",
    name: "Vintage Denim Jeans",
    category: "Clothing",
    price: 450000,
    stock: 0,
    condition: "Fair",
    status: "sold",
    image: "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp",
  },
  {
    id: "PROD-004",
    name: "Minimalist Watch",
    category: "Accessories",
    price: 850000,
    stock: 12,
    condition: "New",
    status: "draft",
    image: "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp",
  },
  {
    id: "PROD-005",
    name: "Leather Messenger Bag",
    category: "Accessories",
    price: 1100000,
    stock: 3,
    condition: "Good",
    status: "published",
    image: "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp",
  },
]

export function StoreProductsList() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDelete = (product: any) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting product:", selectedProduct?.id)
    setIsDeleteModalOpen(false)
  }
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Integrated Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/10 focus:border-sky-500 rounded-xl text-xs font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filters
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] hidden sm:block whitespace-nowrap">
            {products.length} Products Found
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="py-5 pl-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Product Portfolio</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Inventory</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Pricing</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 border-none"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{product.category}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 w-24">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400 uppercase">Stock</span>
                      <span className={cn(
                        "text-[10px] font-medium",
                        product.stock <= 2 ? "text-rose-500" : "text-slate-900 dark:text-white"
                      )}>{product.stock} Units</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          product.stock <= 2 ? "bg-rose-500" : "bg-sky-500"
                        )}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                      Rp {(product.price / 1000).toLocaleString()}k
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-tighter">Net Price</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center justify-center w-24 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-800",
                    product.status === "published" ? "text-emerald-500 bg-emerald-500/5" :
                    product.status === "draft" ? "text-slate-500 bg-slate-500/5" :
                    "text-rose-500 bg-rose-500/5"
                  )}>
                    {product.status}
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         onClick={() => handleEdit(product)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         Edit
                       </Button>
                       <Button 
                         variant="ghost" 
                         onClick={() => handleDelete(product)}
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
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Inventory Manifest v1.0.4</p>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             <ChevronLeft className="h-4 w-4 text-slate-500" />
           </Button>
           <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all border-sky-100 dark:border-sky-500/20">
             <ChevronRight className="h-4 w-4 text-sky-500" />
           </Button>
        </div>
      </div>

      <ProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={selectedProduct}
        mode="edit"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Purge"
        description="Are you sure you want to delete this product? This action is irreversible."
        itemName={selectedProduct?.name}
      />
    </div>
  )
}
