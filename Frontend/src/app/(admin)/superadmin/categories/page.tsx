"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { SuperadminCategoriesList } from "@/features/(admin)/superadmin/components/SuperadminCategoriesList"
import { 
  Search, 
  Filter, 
  Download,
  Tag,
  Package,
  Layers,
  Plus,
  CheckCircle2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  CategoryListItem,
  CreateCategoryDto,
  UpdateCategoryDto
} from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { CategoryModal } from "@/features/(admin)/superadmin/components/modals/CategoryModal"
import { toast } from "sonner"

export default function SuperadminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryListItem | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "addSubcategory">("create")
  const [parentIdForSubcategory, setParentIdForSubcategory] = useState<number | undefined>(undefined)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleEdit = (category: CategoryListItem) => {
    setSelectedCategory(category)
    setModalMode("edit")
    setIsCategoryModalOpen(true)
  }

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId)
      toast.success("Category deleted successfully")
      await fetchCategories()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category")
    }
  }

  const handleAddSubcategory = (parentId: number) => {
    setParentIdForSubcategory(parentId)
    setSelectedCategory(null)
    setModalMode("addSubcategory")
    setIsCategoryModalOpen(true)
  }

  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setParentIdForSubcategory(undefined)
    setModalMode("create")
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    try {
      if (modalMode === "edit" && "id" in data) {
        await updateCategory(data.id, data)
        toast.success("Category updated successfully")
      } else {
        await createCategory(data as CreateCategoryDto)
        toast.success(modalMode === "addSubcategory" ? "Subcategory created successfully" : "Category created successfully")
      }
      await fetchCategories()
    } catch (error: any) {
      throw error
    }
  }

  const stats = {
    total: categories.length,
    root: categories.filter(c => !c.parentId).length,
    withProducts: categories.filter(c => (c._count?.products || 0) > 0).length,
    withSubcategories: categories.filter(c => (c._count?.childCategories || 0) > 0).length,
  }

  return (
    <DashboardShell 
      title="Categories" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            onClick={handleCreateCategory}
            className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Categories</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Tag className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All categories</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Root Categories</CardTitle>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Layers className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.root}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Top level categories
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">With Products</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Package className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.withProducts}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stats.total > 0 ? `${Math.round((stats.withProducts / stats.total) * 100)}% active` : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">With Subcategories</CardTitle>
              <div className="bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Layers className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.withSubcategories}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Has child categories
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search categories by name or slug..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium"
            />
          </form>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <SuperadminCategoriesList 
            categories={categories} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddSubcategory={handleAddSubcategory}
          />
        )}
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={(refresh) => {
          setIsCategoryModalOpen(false)
          setSelectedCategory(null)
          setParentIdForSubcategory(undefined)
          if (refresh) {
            fetchCategories()
          }
        }}
        category={selectedCategory}
        parentId={parentIdForSubcategory}
        mode={modalMode}
        onSave={handleSaveCategory}
      />
    </DashboardShell>
  )
}

