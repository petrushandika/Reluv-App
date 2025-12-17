"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Filter, Zap, Gift, Package2, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Promotion {
  id: number;
  name: string;
  type: "FLASH_SALE" | "BOGO" | "BUNDLE" | "SEASONAL" | "CUSTOM";
  description?: string;
  discount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productsCount: number;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchPromotions = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockPromotions: Promotion[] = [
        {
          id: 1,
          name: "Flash Sale Weekend",
          type: "FLASH_SALE",
          description: "Special weekend flash sale with up to 50% off",
          discount: 50,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          productsCount: 25,
        },
        {
          id: 2,
          name: "Buy 1 Get 1 Sneakers",
          type: "BOGO",
          description: "Buy one sneaker, get one free",
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          productsCount: 15,
        },
        {
          id: 3,
          name: "Summer Collection Bundle",
          type: "BUNDLE",
          description: "Complete summer outfit at special price",
          discount: 30,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          productsCount: 8,
        },
        {
          id: 4,
          name: "End of Year Sale",
          type: "SEASONAL",
          description: "Year-end clearance sale",
          discount: 40,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false,
          productsCount: 50,
        },
      ];
      
      setPromotions(mockPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    let filtered = [...promotions];

    if (searchQuery) {
      filtered = filtered.filter((promo) =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((promo) => promo.type === typeFilter);
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((promo) => {
        const now = new Date();
        const start = new Date(promo.startDate);
        const end = new Date(promo.endDate);
        return promo.isActive && now >= start && now <= end;
      });
    } else if (statusFilter === "upcoming") {
      filtered = filtered.filter((promo) => new Date(promo.startDate) > new Date());
    } else if (statusFilter === "expired") {
      filtered = filtered.filter((promo) => new Date(promo.endDate) < new Date());
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((promo) => !promo.isActive);
    }

    setFilteredPromotions(filtered);
  }, [promotions, searchQuery, typeFilter, statusFilter]);

  const handleDelete = async (promotion: Promotion) => {
    if (!confirm(`Are you sure you want to delete "${promotion.name}"?`)) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPromotions(promotions.filter((p) => p.id !== promotion.id));
      toast.success("Promotion deleted successfully");
    } catch (error) {
      toast.error("Failed to delete promotion");
    }
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setPromotions(promotions.map(p => 
        p.id === promotion.id ? { ...p, isActive: !p.isActive } : p
      ));
      toast.success(`Promotion ${promotion.isActive ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error("Failed to update promotion");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading promotions...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => {
      const now = new Date();
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return p.isActive && now >= start && now <= end;
    }).length,
    upcoming: promotions.filter((p) => new Date(p.startDate) > new Date()).length,
    expired: promotions.filter((p) => new Date(p.endDate) < new Date()).length,
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "FLASH_SALE":
        return <Badge className="bg-red-600 hover:bg-red-700"><Zap className="w-3 h-3 mr-1" />Flash Sale</Badge>;
      case "BOGO":
        return <Badge className="bg-green-600 hover:bg-green-700"><Gift className="w-3 h-3 mr-1" />BOGO</Badge>;
      case "BUNDLE":
        return <Badge className="bg-purple-600 hover:bg-purple-700"><Package2 className="w-3 h-3 mr-1" />Bundle</Badge>;
      case "SEASONAL":
        return <Badge className="bg-orange-600 hover:bg-orange-700"><Calendar className="w-3 h-3 mr-1" />Seasonal</Badge>;
      case "CUSTOM":
        return <Badge variant="default">Custom</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    } else if (now < start) {
      return <Badge className="bg-blue-600 hover:bg-blue-700">Upcoming</Badge>;
    } else if (now > end) {
      return <Badge variant="destructive">Expired</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => {
    const colorClasses = {
      blue: "bg-gradient-to-br from-sky-500 to-blue-600",
      green: "bg-gradient-to-br from-green-500 to-emerald-600",
      orange: "bg-gradient-to-br from-orange-500 to-red-600",
      purple: "bg-gradient-to-br from-purple-500 to-pink-600",
    }[color] || "bg-gray-500";

    return (
      <Card className="glossy-card hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl ${colorClasses} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white glossy-text-title">
            Promotions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage promotional campaigns for your products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPromotions}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => toast.info("Create promotion feature coming soon")}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create Promotion</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Promotions" value={stats.total} icon={Gift} color="blue" />
        <StatCard label="Active" value={stats.active} icon={Zap} color="green" />
        <StatCard label="Upcoming" value={stats.upcoming} icon={Calendar} color="purple" />
        <StatCard label="Expired" value={stats.expired} icon={Package2} color="orange" />
      </div>

      {/* Main Content */}
      <Card className="glossy-card">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all font-medium ${
                showFilters 
                  ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Type
                </label>
                <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="FLASH_SALE">Flash Sale</option>
                  <option value="BOGO">Buy One Get One</option>
                  <option value="BUNDLE">Bundle</option>
                  <option value="SEASONAL">Seasonal</option>
                  <option value="CUSTOM">Custom</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No promotions found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{promotion.name}</p>
                          {promotion.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{promotion.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                      <TableCell>
                        {promotion.discount ? (
                          <span className="font-medium text-green-600 dark:text-green-400">{promotion.discount}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{promotion.productsCount} products</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(promotion.startDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(promotion.endDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleToggleStatus(promotion)} className="cursor-pointer">
                          {getStatusBadge(promotion)}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toast.info("View feature coming soon")}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toast.info("Edit feature coming soon")}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(promotion)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredPromotions.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{promotions.length}</span> promotions
          </p>
        </div>
      </Card>
    </div>
  );
}
