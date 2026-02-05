"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Switch } from "@/shared/components/ui/switch"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  Settings2,
  Shield,
  Mail,
  CreditCard,
  Truck,
  Globe,
  Database,
  Bell,
  AlertTriangle,
  Save,
  RefreshCw
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState } from "react"

export default function SuperadminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // General Settings
  const [platformName, setPlatformName] = useState("Reluv")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowRegistration, setAllowRegistration] = useState(true)

  // Security Settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("24")
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5")

  // Email Settings
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUser, setSmtpUser] = useState("")
  const [smtpFrom, setSmtpFrom] = useState("")

  // Payment Settings
  const [midtransServerKey, setMidtransServerKey] = useState("")
  const [midtransClientKey, setMidtransClientKey] = useState("")
  const [paymentEnabled, setPaymentEnabled] = useState(true)

  // Shipping Settings
  const [biteshipApiKey, setBiteshipApiKey] = useState("")
  const [defaultShippingProvider, setDefaultShippingProvider] = useState("jne")

  const handleSave = async (section: string) => {
    setIsSaving(true)
    try {
      // TODO: Implement save functionality
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Saving ${section} settings...`)
    } catch (error) {
      console.error(`Failed to save ${section} settings:`, error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell 
      title="Settings" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto bg-slate-50/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <TabsTrigger 
              value="general" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="email" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Payment
            </TabsTrigger>
            <TabsTrigger 
              value="shipping" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Shipping
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              System
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <Globe className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">General Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Platform configuration and preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Platform Name
                  </Label>
                  <Input
                    id="platformName"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter platform name"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Maintenance Mode
                    </Label>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      Temporarily disable platform access
                    </p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Allow Registration
                    </Label>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      Enable new user registration
                    </p>
                  </div>
                  <Switch
                    checked={allowRegistration}
                    onCheckedChange={setAllowRegistration}
                  />
                </div>

                <Button
                  onClick={() => handleSave("general")}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 px-6"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Security Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Authentication and security configuration
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Require Email Verification
                    </Label>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      Users must verify email before access
                    </p>
                  </div>
                  <Switch
                    checked={requireEmailVerification}
                    onCheckedChange={setRequireEmailVerification}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Session Timeout (hours)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Max Login Attempts
                  </Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="5"
                  />
                </div>

                <Button
                  onClick={() => handleSave("security")}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 px-6"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl border border-violet-100 dark:border-violet-900/30">
                    <Mail className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Email Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      SMTP configuration for email notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      SMTP Host
                    </Label>
                    <Input
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      SMTP Port
                    </Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    SMTP Username
                  </Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpFrom" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    From Email Address
                  </Label>
                  <Input
                    id="smtpFrom"
                    type="email"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="noreply@reluv.com"
                  />
                </div>

                <Button
                  onClick={() => handleSave("email")}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 px-6"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Payment Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Payment gateway configuration (Midtrans)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Enable Payments
                    </Label>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      Allow payment processing
                    </p>
                  </div>
                  <Switch
                    checked={paymentEnabled}
                    onCheckedChange={setPaymentEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="midtransServerKey" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Midtrans Server Key
                  </Label>
                  <Input
                    id="midtransServerKey"
                    type="password"
                    value={midtransServerKey}
                    onChange={(e) => setMidtransServerKey(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter server key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="midtransClientKey" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Midtrans Client Key
                  </Label>
                  <Input
                    id="midtransClientKey"
                    type="password"
                    value={midtransClientKey}
                    onChange={(e) => setMidtransClientKey(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter client key"
                  />
                </div>

                <Button
                  onClick={() => handleSave("payment")}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 px-6"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <Truck className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Shipping Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Shipping provider configuration (Biteship)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="biteshipApiKey" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Biteship API Key
                  </Label>
                  <Input
                    id="biteshipApiKey"
                    type="password"
                    value={biteshipApiKey}
                    onChange={(e) => setBiteshipApiKey(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter Biteship API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultShippingProvider" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Default Shipping Provider
                  </Label>
                  <select
                    id="defaultShippingProvider"
                    value={defaultShippingProvider}
                    onChange={(e) => setDefaultShippingProvider(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  >
                    <option value="jne">JNE</option>
                    <option value="jnt">JNT</option>
                    <option value="sicepat">SiCepat</option>
                    <option value="pos">POS Indonesia</option>
                    <option value="tiki">TIKI</option>
                  </select>
                </div>

                <Button
                  onClick={() => handleSave("shipping")}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 px-6"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">System Settings</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Database and system configuration
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">
                        Warning
                      </p>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        System settings are critical. Please ensure you understand the implications before making changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-20 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Database className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Backup Database
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Clear Cache
                      </span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

