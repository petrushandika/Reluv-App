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
  Tag,
  ChevronRight,
} from "lucide-react"
import { CategoryListItem } from "../api/superadminApi"
import { useState, ReactElement } from "react"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

interface SuperadminCategoriesListProps {
  categories: CategoryListItem[]
  onEdit?: (category: CategoryListItem) => void
  onDelete?: (categoryId: number) => void
  onAddSubcategory?: (parentId: number) => void
}

export function SuperadminCategoriesList({ 
  categories, 
  onEdit, 
  onDelete,
  onAddSubcategory 
}: SuperadminCategoriesListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<CategoryListItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteClick = (category: CategoryListItem) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCategory) return
    await onDelete?.(selectedCategory.id)
    setIsDeleteModalOpen(false)
    setSelectedCategory(null)
  }

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: CategoryListItem, level: number = 0): ReactElement => {
    const hasChildren = category.childCategories && category.childCategories.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const productCount = category._count?.products || 0
    const childCount = category._count?.childCategories || 0

    return (
      <>
        <TableRow 
          key={category.id} 
          className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <TableCell className="py-4 pl-6" style={{ paddingLeft: `${24 + level * 24}px` }}>
            <div className="flex items-center space-x-3">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => toggleExpand(category.id)}
                >
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  />
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {category.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                  /{category.slug}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            {category.parentCategory ? (
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                {category.parentCategory.name}
              </span>
            ) : (
              <Badge 
                variant="outline" 
                className="text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
              >
                Root
              </Badge>
            )}
          </TableCell>
          <TableCell>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {productCount}
            </span>
          </TableCell>
          <TableCell>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {childCount}
            </span>
          </TableCell>
          <TableCell>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {new Date(category.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </span>
          </TableCell>
          <TableCell className="text-right pr-6">
            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => onEdit?.(category)}
                className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
              >
                Edit
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => onAddSubcategory?.(category.id)}
                className="h-8 w-16 sm:w-20 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
              >
                Add Sub
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleDeleteClick(category)}
                className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
              >
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && category.childCategories?.map((child) => 
          renderCategory(child, level + 1)
        )}
      </>
    )
  }

  const rootCategories = categories.filter(cat => !cat.parentId)

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Category</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Parent</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Products</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subcategories</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Created</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rootCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No categories found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rootCategories.map((category) => renderCategory(category, 0))
          )}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedCategory(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and will also delete all subcategories."
        itemName={selectedCategory?.name}
      />
    </div>
  )
}

