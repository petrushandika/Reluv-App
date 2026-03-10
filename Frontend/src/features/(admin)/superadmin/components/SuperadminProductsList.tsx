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
  Package,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Store,
} from "lucide-react"
import Link from "next/link"
import { ProductListItem } from "../api/superadminApi"
import { useState } from "react"
import { StatusChangeModal } from "./modals/StatusChangeModal"

function getProductImageUrl(p: ProductListItem): string | null {
  if (!p.images || p.images.length === 0) return null
  const first = p.images[0]
  if (typeof first === "string") return first
  if (first && typeof first === "object" && "url" in first) return (first as { url: string }).url
  return null
}

interface SuperadminProductsListProps {
  products: ProductListItem[]
  onStatusChange?: (productId: number, status: "APPROVED" | "REJECTED") => void
  onDelete?: (product: ProductListItem) => void
}

export function SuperadminProductsList({ products, onStatusChange, onDelete }: SuperadminProductsListProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleStatusClick = (product: ProductListItem) => {
    setSelectedProduct(product)
    setIsStatusModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge 
            variant="outline" 
            className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
          >
            Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge 
            variant="outline" 
            className="text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
          >
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge 
            variant="outline" 
            className="text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
          >
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[220px] min-w-[180px] text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4 pl-4 sm:pl-6">Product</TableHead>
            <TableHead className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">Store</TableHead>
            <TableHead className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">Category</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">Price</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">Stock</TableHead>
            <TableHead className="w-[72px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">View</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4">Status</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-3 sm:py-4 pr-4 sm:pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center">
                <p className="text-sm font-medium text-slate-500">No products found</p>
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => {
              const imageUrl = getProductImageUrl(p)
              return (
                <TableRow key={p.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell className="py-3 sm:py-4 pl-4 sm:pl-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-left min-w-0">
                      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imageUrl} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400 truncate tracking-tight">/{p.slug}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-left">
                    <div className="flex items-center min-w-0">
                      <Store className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {p.store?.name || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-left">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-slate-500 border-slate-200 dark:border-slate-700 block w-fit">
                      {p.category?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center font-bold text-xs text-slate-900 dark:text-white whitespace-nowrap">
                    Rp. {p.price.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.stock}</span>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-all mx-auto"
                    >
                      <Link href={`/product/${encodeURIComponent(p.slug)}`} target="_blank" rel="noopener noreferrer" aria-label="View product">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center">
                    <div className="flex justify-center" onClick={() => handleStatusClick(p)}>
                      {getStatusBadge(p.status)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center pr-4 sm:pr-6">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                        aria-label="Edit product"
                      >
                        <Link href={`/product/${encodeURIComponent(p.slug)}`} target="_blank" rel="noopener noreferrer">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(p)}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                          aria-label="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedProduct(null)
        }}
        onConfirm={(status) => {
          if (selectedProduct && (status === "APPROVED" || status === "REJECTED")) {
            onStatusChange?.(selectedProduct.id, status)
            setIsStatusModalOpen(false)
          }
        }}
        currentStatus={selectedProduct?.status || "PENDING"}
        itemName={selectedProduct?.name || ""}
        title="Product Status"
        options={[
          { id: "APPROVED", label: "Approve", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", description: "Product is approved and will be visible on the platform." },
          { id: "REJECTED", label: "Reject", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", description: "Product does not meet standards and will be hidden." },
          { id: "PENDING", label: "Pending", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", description: "Product is awaiting review." },
        ]}
      />
    </div>
  )
}
