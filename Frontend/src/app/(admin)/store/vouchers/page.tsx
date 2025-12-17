"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Filter, Percent, Tag, Edit, Trash2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface Voucher {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  usedCount: number;
  expiry: string;
  isActive: boolean;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchVouchers = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockVouchers: Voucher[] = [
        {
          id: 1,
          code: "WELCOME10",
          name: "Welcome Discount",
          description: "10% off for new customers",
          type: "PERCENTAGE",
          value: 10,
          maxDiscount: 50000,
          minPurchase: 100000,
          usageLimit: 100,
          usedCount: 45,
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
        {
          id: 2,
          code: "FREESHIP",
          name: "Free Shipping",
          description: "Free shipping for orders above 200k",
          type: "FREE_SHIPPING",
          value: 0,
          minPurchase: 200000,
          usageLimit: 50,
          usedCount: 12,
          expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
        {
          id: 3,
          code: "SAVE50K",
          name: "Save 50K",
          description: "Get 50k off on minimum purchase 500k",
          type: "FIXED_AMOUNT",
          value: 50000,
          minPurchase: 500000,
          usageLimit: 20,
          usedCount: 18,
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
      ];
      
      setVouchers(mockVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to load vouchers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    let filtered = [...vouchers];

    if (searchQuery) {
      filtered = filtered.filter((voucher) =>
        voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((voucher) => voucher.type === typeFilter);
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((voucher) => voucher.isActive && new Date(voucher.expiry) > new Date());
    } else if (statusFilter === "expired") {
      filtered = filtered.filter((voucher) => new Date(voucher.expiry) <= new Date());
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((voucher) => !voucher.isActive);
    }

    setFilteredVouchers(filtered);
  }, [vouchers, searchQuery, typeFilter, statusFilter]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Voucher code copied!");
  };

  const handleDelete = async (voucher: Voucher) => {
    if (!confirm(`Are you sure you want to delete "${voucher.code}"?`)) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setVouchers(vouchers.filter((v) => v.id !== voucher.id));
      toast.success("Voucher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete voucher");
    }
  };

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setVouchers(vouchers.map(v => 
        v.id === voucher.id ? { ...v, isActive: !v.isActive } : v
      ));
      toast.success(`Voucher ${voucher.isActive ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error("Failed to update voucher");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading vouchers...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: vouchers.length,
    active: vouchers.filter((v) => v.isActive && new Date(v.expiry) > new Date()).length,
    expired: vouchers.filter((v) => new Date(v.expiry) <= new Date()).length,
    totalUsed: vouchers.reduce((acc, v) => acc + v.usedCount, 0),
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return <Badge variant="default">Percentage</Badge>;
      case "FIXED_AMOUNT":
        return <Badge className="bg-green-600 hover:bg-green-700">Fixed Amount</Badge>;
      case "FREE_SHIPPING":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Free Shipping</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatValue = (voucher: Voucher) => {
    if (voucher.type === "PERCENTAGE") {
      return `${voucher.value}%`;
    } else if (voucher.type === "FIXED_AMOUNT") {
      return formatCurrency(voucher.value);
    } else {
      return "Free Shipping";
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => {
    const colorClasses = {
      blue: "bg-gradient-to-br from-sky-500 to-blue-600",
      green: "bg-gradient-to-br from-green-500 to-emerald-600",
      red: "bg-gradient-to-br from-red-500 to-rose-600",
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
            Vouchers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage discount vouchers for your customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVouchers}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create Voucher</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vouchers" value={stats.total} icon={Tag} color="blue" />
        <StatCard label="Active" value={stats.active} icon={Percent} color="green" />
        <StatCard label="Expired" value={stats.expired} icon={Tag} color="red" />
        <StatCard label="Total Used" value={stats.totalUsed} icon={Tag} color="purple" />
      </div>

      {/* Main Content */}
      <Card className="glossy-card">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search vouchers..."
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
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
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
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No vouchers found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm font-semibold text-sky-600 dark:text-sky-400">
                            {voucher.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(voucher.code)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{voucher.name}</p>
                          {voucher.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{voucher.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                      <TableCell className="font-medium">{formatValue(voucher)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{voucher.usedCount}</span>
                          {voucher.usageLimit && (
                            <span className="text-gray-500 dark:text-gray-400"> / {voucher.usageLimit}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(voucher.expiry), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(voucher)}
                          className="cursor-pointer"
                        >
                          {voucher.isActive && new Date(voucher.expiry) > new Date() ? (
                            <Badge variant="success">Active</Badge>
                          ) : new Date(voucher.expiry) <= new Date() ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toast.info("Edit feature coming soon")}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher)}
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
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredVouchers.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{vouchers.length}</span> vouchers
          </p>
        </div>
      </Card>
    </div>
  );
}
