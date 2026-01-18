"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Ticket,
  MessageSquare,
  Settings,
  Store as StoreIcon,
  Globe,
  Clock,
  Camera,
  ShieldCheck,
  Bell,
  Trash2,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { toast } from "sonner"
import { getMyStore, updateStore, updateStoreProfile, uploadImage, Store } from "@/features/(admin)/store/api/storeApi"

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/store/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/store/orders",
    icon: ShoppingCart,
  },
  {
    label: "Vouchers",
    href: "/store/vouchers",
    icon: Ticket,
  },
  {
    label: "Reviews",
    href: "/store/reviews",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
]

export default function StoreSettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [bio, setBio] = useState("")
  const [operational, setOperational] = useState("")

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getMyStore()
        setStore(data)
        setName(data.name)
        setSlug(data.slug)
        setBio(data.profile?.bio || "")
        setOperational(data.profile?.operational || "")
      } catch (error) {
        toast.error("Failed to load store settings")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStore()
  }, [])

  const handleSaveGeneral = async () => {
    setIsSaving(true)
    try {
      await updateStore({ name, slug })
      toast.success("General settings updated")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update general settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await updateStoreProfile({ bio, operational })
      toast.success("Store profile updated")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update store profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!store) return
    const newStatus = !store.isActive
    if (!confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} your store?`)) return
    
    setIsSaving(true)
    try {
      const updated = await updateStore({ isActive: newStatus })
      setStore(updated)
      toast.success(`Store ${newStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update store status")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)")
      return
    }

    setIsSaving(true)
    try {
      const { url } = await uploadImage(file)
      await updateStoreProfile({ [type]: url })
      
      await updateStoreProfile({ [type]: url })
      
      if (store) {
        setStore({
            ...store,
            profile: {
                ...store.profile,
                [type]: url
            }
        })
      }
      
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`)
    } catch (error: any) {
      toast.error("Failed to upload image")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return null 
  }

  return (
    <DashboardShell
      title="Store Settings"
      type="store"
      sidebarItems={sidebarItems}
    >
      <div className="max-w-4xl space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl w-fit flex h-12">
            <TabsTrigger 
              value="general" 
              className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
            >
              General
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
            >
              Security
            </TabsTrigger>
          </TabsList>

          </div >

          <TabsContent value="general" className="space-y-6 focus-visible:outline-none mt-4 md:mt-0">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <StoreIcon className="w-4 h-4 text-sky-600" />
                  Store Identity
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">Manage your store's basic identification and accessibility.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Name</Label>
                    <Input 
                      id="store-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Awesome Store" 
                      className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Slug (Custom URL)</Label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        id="store-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="my-awesome-store" 
                        className="pl-11 h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 dark:bg-sky-500/5 rounded-xl border border-sky-100 dark:border-sky-900/30 flex items-start gap-4">
                  <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-sky-700 dark:text-sky-300 font-medium leading-relaxed">
                    Changing your store slug will update your public URL. Any existing links using your old slug will break.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    onClick={handleSaveGeneral}
                    disabled={isSaving}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                  >
                    {isSaving ? "Saving..." : "Save Identity"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Operational Hours
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">Define when your store is open for orders and inquiries.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="operational" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Operational description</Label>
                  <Textarea 
                    id="operational"
                    value={operational}
                    onChange={(e) => setOperational(e.target.value)}
                    placeholder="E.g., Senin - Jumat: 09:00 - 18:00" 
                    className="min-h-[100px] rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                  >
                    Save Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-600" />
                  Visual Identity
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">Customize how your store looks to the public.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-8 space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Banner</Label>
                  <div className="relative group rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 h-32 md:h-48 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden flex flex-col items-center justify-center transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      disabled={isSaving}
                    />
                    {store?.profile?.banner ? (
                       <img src={store.profile.banner} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : (
                      <>
                        <div className="p-3 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 mb-3 group-hover:scale-110 transition-transform shadow-none">
                          <Camera className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Click to upload banner</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Recommended: 1200 x 400px</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 rounded-3xl">
                      <AvatarImage src={store?.profile?.avatar} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-sky-50 text-sky-600 dark:bg-sky-500/10 uppercase">{store?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 p-2.5 bg-sky-600 text-white rounded-xl border-4 border-white dark:border-slate-950 hover:bg-sky-700 transition-colors shadow-none cursor-pointer overflow-hidden">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, 'avatar')}
                        disabled={isSaving}
                      />
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store Bio</Label>
                      <Textarea 
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell the world about your preloved treasures..." 
                        className="min-h-[100px] rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full sm:w-auto h-11 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                  >
                    Save Appearance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-600" />
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">Configure when and how you receive store updates.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-8 space-y-6">
                <div className="space-y-6">
                  {[
                    { title: "New Order", desc: "Get notified when someone makes a purchase." },
                    { title: "New Review", desc: "Receive an alert when a customer leaves feedback." },
                    { title: "Stock Alert", desc: "Notification when products are running low (under 3 items)." }
                  ].map((item, id) => (
                    <div key={id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-11 bg-sky-600 rounded-full relative cursor-pointer border border-sky-400">
                            <div className="absolute right-1 top-1 h-3.5 w-3.5 bg-white rounded-full" />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  Store Security
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500">Protect your store from unauthorized access or accidental deletion.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 md:p-8 space-y-6">
                 <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                    <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">Store Status</h4>
                    <p className="text-xs text-rose-500 font-medium mb-6 leading-relaxed">
                      {store?.isActive 
                        ? "Deactivating your store will hide all your products and make your store unavailable to customers." 
                        : "Your store is currently inactive. Activate it to start selling again."}
                    </p>
                    <Button 
                      onClick={handleToggleActive}
                      disabled={isSaving}
                      variant="outline" 
                      className="w-full sm:w-auto h-10 px-6 rounded-xl border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900 font-bold text-[10px] uppercase tracking-widest transition-all border"
                    >
                      {store?.isActive ? "Deactivate Store" : "Activate Store"}
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
