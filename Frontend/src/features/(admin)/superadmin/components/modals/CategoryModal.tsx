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
import { CategoryListItem, CreateCategoryDto, UpdateCategoryDto } from "../../api/superadminApi"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface CategoryModalProps {
  isOpen: boolean
  onClose: (refresh?: boolean) => void
  category?: CategoryListItem | null
  parentId?: number
  mode: "create" | "edit" | "addSubcategory"
  onSave: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>
}

export function CategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  parentId,
  mode, 
  onSave 
}: CategoryModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: parentId || null,
  })

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        parentId: category.parentId || null,
      })
    } else if (mode === "addSubcategory" && parentId) {
      setFormData({
        name: "",
        slug: "",
        parentId: parentId,
      })
    } else {
      setFormData({
        name: "",
        slug: "",
        parentId: parentId || null,
      })
    }
  }, [mode, category, parentId, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      
      if (mode === "edit" && category) {
        await onSave({
          id: category.id,
          name: formData.name,
          slug: finalSlug,
          parentId: formData.parentId,
        } as UpdateCategoryDto)
        toast.success("Category updated successfully")
      } else {
        await onSave({
          name: formData.name,
          slug: finalSlug,
          parentId: formData.parentId,
        } as CreateCategoryDto)
        toast.success(mode === "addSubcategory" ? "Subcategory created successfully" : "Category created successfully")
      }
      onClose(true)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save category")
    } finally {
      setIsSaving(false)
    }
  }

  const getTitle = () => {
    if (mode === "edit") return "Edit Category"
    if (mode === "addSubcategory") return "Add Subcategory"
    return "Create Category"
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            {mode === "addSubcategory" 
              ? "Create a new subcategory" 
              : mode === "edit" 
              ? "Update category information"
              : "Create a new category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                const newName = e.target.value
                setFormData(prev => ({
                  ...prev,
                  name: newName,
                  slug: prev.slug || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }))
              }}
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Slug
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              placeholder="category-slug"
              required
            />
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              className="h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest"
            >
              {isSaving ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

