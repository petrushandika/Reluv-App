"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/ui/avatar";
import { toast } from "sonner";

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  subscriptions: number;
  subscriptionsChange: number;
  sales: number;
  salesChange: number;
  activeNow: number;
  activeChange: number;
}

interface RecentSale {
  id: string;
  name: string;
  email: string;
  amount: number;
  avatar?: string;
}

interface ChartData {
  name: string;
  total: number;
}

export default function StoreDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStats({
        totalRevenue: 45231890,
        revenueChange: 20.1,
        subscriptions: 2350,
        subscriptionsChange: 180.1,
        sales: 12234,
        salesChange: 19.0,
        activeNow: 573,
        activeChange: 201,
      });

      setRecentSales([
        { 
          id: "1", 
          name: "Olivia Martin", 
          email: "olivia.martin@email.com", 
          amount: 1999000 
        },
        { 
          id: "2", 
          name: "Jackson Lee", 
          email: "jackson.lee@email.com", 
          amount: 3900000 
        },
        { 
          id: "3", 
          name: "Isabella Nguyen", 
          email: "isabella.nguyen@email.com", 
          amount: 2990000 
        },
        { 
          id: "4", 
          name: "William Kim", 
          email: "will@email.com", 
          amount: 9900000 
        },
        { 
          id: "5", 
          name: "Sofia Davis", 
          email: "sofia.davis@email.com", 
          amount: 3900000 
        },
      ]);

      setChartData([
        { name: "Jan", total: 4000000 },
        { name: "Feb", total: 3000000 },
        { name: "Mar", total: 5000000 },
        { name: "Apr", total: 4500000 },
        { name: "May", total: 6000000 },
        { name: "Jun", total: 5500000 },
        { name: "Jul", total: 7000000 },
        { name: "Aug", total: 6500000 },
        { name: "Sep", total: 8000000 },
        { name: "Oct", total: 7500000 },
        { name: "Nov", total: 9000000 },
        { name: "Dec", total: 8500000 },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">
                    +{stats?.revenueChange}%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{stats?.subscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">
                    +{stats?.subscriptionsChange}%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{stats?.sales.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">
                    +{stats?.salesChange}%
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{stats?.activeNow}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">
                    +{stats?.activeChange}
                  </span>{" "}
                  since last hour
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Revenue chart will be displayed here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Integrate with Recharts or Chart.js
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made {recentSales.length} sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <div className="flex h-full w-full items-center justify-center bg-muted rounded-full">
                          <span className="text-xs font-medium">
                            {getInitials(sale.name)}
                          </span>
                        </div>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +{formatCurrency(sale.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
