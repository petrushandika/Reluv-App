"use client";

import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Search, 
  Filter,
  ShoppingBag,
  Package, 
  Clock, 
  Truck, 
  CheckCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { toast } from "sonner";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { format } from "date-fns";

interface Order {
  id: number;
  orderNumber: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: number;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: {
    city: string;
    province: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      
      // Mock data for demo
      const mockOrders: Order[] = [
        { 
          id: 1, 
          orderNumber: "ORD-2024-001", 
          buyer: { firstName: "John", lastName: "Doe", email: "john@doe.com" }, 
          items: 2, 
          totalAmount: 3000000, 
          status: "pending", 
          createdAt: new Date().toISOString(), 
          shippingAddress: { city: "Jakarta", province: "DKI" } 
        },
        { 
          id: 2, 
          orderNumber: "ORD-2024-002", 
          buyer: { firstName: "Jane", lastName: "Smith", email: "jane@smith.com" }, 
          items: 1, 
          totalAmount: 1500000, 
          status: "processing", 
          createdAt: new Date(Date.now() - 86400000).toISOString(), 
          shippingAddress: { city: "Bandung", province: "JB" } 
        },
        { 
          id: 3, 
          orderNumber: "ORD-2024-003", 
          buyer: { firstName: "Bob", lastName: "Wilson", email: "bob@wilson.com" }, 
          items: 3, 
          totalAmount: 4500000, 
          status: "shipped", 
          createdAt: new Date(Date.now() - 172800000).toISOString(), 
          shippingAddress: { city: "Surabaya", province: "JT" } 
        },
        { 
          id: 4, 
          orderNumber: "ORD-2024-004", 
          buyer: { firstName: "Alice", lastName: "Brown", email: "alice@brown.com" }, 
          items: 1, 
          totalAmount: 1200000, 
          status: "delivered", 
          createdAt: new Date(Date.now() - 259200000).toISOString(), 
          shippingAddress: { city: "Medan", province: "SU" } 
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          `${o.buyer.firstName} ${o.buyer.lastName}`.toLowerCase().includes(q) ||
          o.buyer.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (dateRangeFilter && dateRangeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((o) => {
        const orderDate = new Date(o.createdAt);
        switch (dateRangeFilter) {
          case "today": return orderDate >= today;
          case "week": return orderDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          case "month": return orderDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          default: return true;
        }
      });
    }

    switch (sortBy) {
      case "newest": filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest": filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "amount_high": filtered.sort((a, b) => b.totalAmount - a.totalAmount); break;
      case "amount_low": filtered.sort((a, b) => a.totalAmount - b.totalAmount); break;
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, dateRangeFilter, sortBy, orders]);

  const handleUpdateStatus = async (order: Order, newStatus: Order["status"]) => {
    const prevOrders = [...orders];
    setOrders(orders.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Order ${order.orderNumber} updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order");
      setOrders(prevOrders);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "processing":
        return <Badge variant="default">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Shipped</Badge>;
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => {
    const colorClasses = {
      blue: "bg-gradient-to-br from-sky-500 to-blue-600",
      yellow: "bg-gradient-to-br from-yellow-500 to-orange-600",
      indigo: "bg-gradient-to-br from-indigo-500 to-purple-600",
      purple: "bg-gradient-to-br from-purple-500 to-pink-600",
      green: "bg-gradient-to-br from-green-500 to-emerald-600",
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
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and process your store orders efficiently.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Orders" value={stats.total} icon={ShoppingBag} color="blue" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard label="Processing" value={stats.processing} icon={Package} color="indigo" />
        <StatCard label="On Delivery" value={stats.shipped} icon={Truck} color="purple" />
        <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="green" />
      </div>

      {/* Main Content */}
      <Card className="glossy-card">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders..."
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">On Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Time Period
                </label>
                <Select value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)}>
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                  Sort By
                </label>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Highest Amount</option>
                  <option value="amount_low">Lowest Amount</option>
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
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="text-gray-500 dark:text-gray-400">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No orders found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-medium text-sky-600 dark:text-sky-400">{order.orderNumber}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.buyer.firstName} {order.buyer.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{order.buyer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{order.items} items</TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white">{order.shippingAddress.city}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{order.shippingAddress.province}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => toast.info(`Viewing order ${order.orderNumber}`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredOrders.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{orders.length}</span> orders
          </p>
        </div>
      </Card>
    </div>
  );
}
