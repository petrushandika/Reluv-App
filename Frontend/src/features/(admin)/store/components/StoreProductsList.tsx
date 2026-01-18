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
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  Layers, 
  CircleDot 
} from "lucide-react"

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
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Product</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-colors group">
              <TableCell className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{product.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center mt-1">
                      <CircleDot className={cn("h-2.5 w-2.5 mr-1.5", 
                        product.condition === "New" ? "text-emerald-500" : 
                        product.condition === "Like New" ? "text-sky-500" : "text-amber-500"
                      )} />
                      {product.condition}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md w-fit border border-slate-200 dark:border-slate-800/50">
                  <Layers className="h-3 w-3 mr-1.5 text-slate-400" />
                  {product.category}
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-900 dark:text-white">
                Rp. {product.price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Package className={cn("h-3.5 w-3.5 mr-2", product.stock <= 2 ? "text-rose-500" : "text-slate-400")} />
                  <span className={cn("text-sm font-bold", product.stock <= 2 ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300")}>
                    {product.stock}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-bold text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 border-2 rounded-full",
                    product.status === "published" ? "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30" :
                    product.status === "draft" ? "text-slate-500 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700" :
                    "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30"
                  )}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end space-x-1.5">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30 rounded-xl transition-all">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 rounded-xl transition-all">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 rounded-xl transition-all">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
