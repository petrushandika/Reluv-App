"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, SlidersHorizontal, Filter, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductTable from "@/features/(admin)/store/components/ProductTable";
import StoreHeader from "@/features/(admin)/store/components/shared/StoreHeader";
import DeleteConfirmationModal from "@/features/(admin)/store/components/shared/DeleteConfirmationModal";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: "active" | "draft" | "inactive";
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Nike Air Max 90",
          category: "Sneakers",
          price: 1500000,
          stock: 45,
          sales: 120,
          status: "active",
          image: "/placeholder.jpg",
        },
        {
          id: 2,
          name: "Adidas Ultraboost",
          category: "Running",
          price: 2100000,
          stock: 30,
          sales: 85,
          status: "active",
          image: "/placeholder.jpg",
        },
        {
          id: 3,
          name: "Puma Hoodie",
          category: "Apparel",
          price: 850000,
          stock: 0,
          sales: 200,
          status: "inactive",
          image: "/placeholder.jpg",
        },
        {
          id: 4,
          name: "Vintage Denim Jacket",
          category: "Jackets",
          price: 450000,
          stock: 5,
          sales: 15,
          status: "active",
          image: "/placeholder.jpg",
        },
        {
          id: 5,
          name: "Converse Chuck Taylor",
          category: "Sneakers",
          price: 750000,
          stock: 12,
          sales: 350,
          status: "draft",
          image: "/placeholder.jpg",
        },
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    // Category Filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "stock_low":
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case "sales_high":
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, statusFilter, categoryFilter, sortBy]);

  const initiateDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      setIsDeleting(true);
      // Simulate API
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <StoreHeader 
        title="Products" 
        description="Manage your product inventory, track stock, and update prices."
      >
        <button
          onClick={fetchProducts}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
        <button
          onClick={() => router.push("/store/products/new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20 text-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </StoreHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, color: "text-gray-900 dark:text-white" },
          { label: "Active", value: stats.active, color: "text-green-600 dark:text-green-400" },
          { label: "Low Stock", value: stats.lowStock, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600 dark:text-red-400" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/30 dark:bg-gray-900/10">
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:text-white transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all text-sm font-medium whitespace-nowrap ${
                showFilters 
                  ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 animate-in slide-in-from-top-2">
            {[
              {
                label: "Status",
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: "all", label: "All Status" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "draft", label: "Draft" },
                ]
              },
              {
                label: "Category",
                value: categoryFilter,
                onChange: setCategoryFilter,
                options: [
                  { value: "all", label: "All Categories" },
                  { value: "Sneakers", label: "Sneakers" },
                  { value: "Running", label: "Running" },
                  { value: "Apparel", label: "Apparel" },
                  { value: "Jackets", label: "Jackets" },
                ]
              },
              {
                label: "Sort By",
                value: sortBy,
                onChange: setSortBy,
                options: [
                  { value: "newest", label: "Newest First" },
                  { value: "price_high", label: "Price: High to Low" },
                  { value: "price_low", label: "Price: Low to High" },
                  { value: "sales_high", label: "Best Selling" },
                  { value: "stock_low", label: "Low Stock" },
                ]
              }
            ].map((filter, idx) => (
              <div key={idx}>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  {filter.label}
                </label>
                <div className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500 dark:text-white appearance-none"
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <ProductTable
            products={filteredProducts}
            onEdit={(product) => router.push(`/store/products/${product.id}`)}
            onDelete={initiateDelete}
          />
        </div>

        {/* Pagination/Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> products
          </p>
          {/* Add pagination controls here if needed */}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedProduct?.name || "Product"}
        isDeleting={isDeleting}
      />
    </div>
  );
}
