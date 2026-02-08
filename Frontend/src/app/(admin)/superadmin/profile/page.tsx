"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  User,
  Lock,
  Bell,
  Shield,
  Upload,
  Save
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState } from "react"

export default function SuperadminProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [firstName, setFirstName] = useState("Admin")
  const [lastName, setLastName] = useState("User")
  const [email, setEmail] = useState("admin@reluv.com")
  const [phone, setPhone] = useState("+62 812 3456 7890")
  const [bio, setBio] = useState("Platform Administrator")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  const handleSave = async (section: string) => {
    setIsSaving(true)
    try {
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
      title="Profile" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            onClick={() => handleSave(activeTab)}
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-10 px-4 transition-all"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-slate-50/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <TabsTrigger 
              value="profile" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 font-bold text-xs uppercase tracking-widest"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <User className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Profile Information</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Update your personal information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-slate-100 dark:border-slate-800">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback className="bg-sky-100 dark:bg-sky-900/20 text-sky-600 text-2xl font-bold">
                      {firstName.charAt(0)}{lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-[100px] rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <Lock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Change Password</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Update your password to keep your account secure
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">
                        Password Requirements
                      </p>
                      <ul className="text-xs font-medium text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Includes at least one number</li>
                        <li>• Has at least one special character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-xl border border-violet-100 dark:border-violet-900/30">
                    <Bell className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Notification Preferences</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Manage how you receive notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Notification settings are currently managed at the system level. Contact your system administrator for changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
              <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <Shield className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Recent Activity</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight mt-1">
                      Your recent account activity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Login from new device</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">2 hours ago • Chrome on Windows</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-sky-500 mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Password changed</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="h-2 w-2 rounded-full bg-violet-500 mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Profile updated</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
