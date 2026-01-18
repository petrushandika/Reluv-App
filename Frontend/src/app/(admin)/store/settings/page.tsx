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
  Info
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { toast } from "sonner"
import { getMyStore, updateStore, updateStoreProfile, uploadImage, Store } from "@/features/(admin)/store/api/storeApi"

const sidebarItems = [
  { label: "Dashboard", href: "/store", icon: LayoutDashboard },
  { label: "Products", href: "/store/products", icon: Package },
  { label: "Orders", href: "/store/orders", icon: ShoppingCart },
  { label: "Vouchers", href: "/store/vouchers", icon: Ticket },
  { label: "Reviews", href: "/store/reviews", icon: MessageSquare },
  { label: "Settings", href: "/store/settings", icon: Settings },
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)")
      return
    }

    setIsSaving(true)
    try {
      const { url } = await uploadImage(file)
      await updateStoreProfile({ [type]: url })
      if (store) {
        setStore({
            ...store,
            profile: { ...store.profile, [type]: url }
        })
      }
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} updated successfully`)
    } catch (error: any) {
      toast.error("Failed to upload image")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return null

  return (
    <DashboardShell title="Store Ecosystem" type="store" sidebarItems={sidebarItems}>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl w-full flex overflow-x-auto no-scrollbar justify-start md:justify-center mb-8 h-auto gap-1">
            {[
              { id: "general", label: "Core Identity" },
              { id: "profile", label: "Visual Aesthetics" },
              { id: "notifications", label: "System Sync" },
              { id: "security", label: "Safety Hub" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all border border-transparent data-[state=active]:border-sky-400"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="space-y-6 outline-none">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 h-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                      <StoreIcon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">Global Identity</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Your primary store pointers</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Official Name</Label>
                      <Input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Persistent Slug</Label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="pl-11 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveGeneral} disabled={isSaving} className="w-full h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white border-none font-black text-[10px] uppercase tracking-widest shadow-none">
                    {isSaving ? "Synchronizing..." : "Propagate Identity"}
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 h-full">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                      <Clock className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">Efficiency Flow</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Active operating schedule</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Operational Protocol</Label>
                      <Textarea 
                        value={operational}
                        onChange={(e) => setOperational(e.target.value)}
                        placeholder="E.g., Mon - Fri: 09:00 - 18:00"
                        className="min-h-[148px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest">
                    Save Operating Hours
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 outline-none">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
               <div className="relative h-48 md:h-64 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 group cursor-pointer overflow-hidden">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleImageUpload(e, 'banner')} disabled={isSaving} />
                  {store?.profile?.banner ? (
                    <img src={store.profile.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <Camera className="w-8 h-8 text-slate-300 mb-2" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload System Banner</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      Edit Banner
                    </div>
                  </div>
               </div>
               
               <div className="p-8 -mt-20 relative z-30 flex flex-col md:flex-row gap-8 items-end">
                  <div className="relative group">
                    <div className="h-40 w-40 rounded-[2.5rem] bg-white dark:bg-slate-900 border-[6px] border-white dark:border-slate-900 shadow-xl overflow-hidden relative">
                       <Avatar className="h-full w-full rounded-none">
                          <AvatarImage src={store?.profile?.avatar} className="object-cover" />
                          <AvatarFallback className="text-3xl font-black bg-sky-500 text-white rounded-none">{store?.name[0]}</AvatarFallback>
                       </Avatar>
                       <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleImageUpload(e, 'avatar')} disabled={isSaving} />
                          <Camera className="w-6 h-6 text-white" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2 pb-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Meta Description / Bio</Label>
                    <Textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="High-level store summary..."
                      className="min-h-[100px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-sm"
                    />
                  </div>
               </div>
               
               <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                 <Button onClick={handleSaveProfile} disabled={isSaving} className="h-12 px-10 rounded-2xl bg-sky-500 hover:bg-sky-600 font-black text-[10px] uppercase tracking-widest">
                   Propagate Appearance Changes
                 </Button>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 outline-none">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                  <Bell className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">System Notification Hub</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Manage event triggers and alerts</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: "Incoming Orders", desc: "Real-time purchase alerts" },
                  { label: "New Product Feedback", title: "Customer Reviews", desc: "Response requirement alerts" },
                  { title: "Critical Stock", desc: "Inventory depletion warnings" }
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between hover:border-sky-500/50 transition-colors group">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-sky-500 transition-colors">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{item.desc}</p>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                       <span className="text-[9px] font-black text-sky-500 uppercase tracking-[0.2em]">Active</span>
                       <div className="h-6 w-10 bg-sky-500 rounded-full relative cursor-pointer border border-sky-400">
                          <div className="absolute right-1 top-1 h-3.5 w-3.5 bg-white rounded-full" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 outline-none">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
               <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  <ShieldCheck className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">Security Protocol</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">Data integrity and access control</p>
                </div>
              </div>

              <div className="p-8 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-900/20 max-w-2xl">
                 <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-2">Store Hibernation / Activation</h4>
                      <p className="text-xs text-rose-500 font-bold leading-relaxed">
                        {store?.isActive 
                          ? "Hibernating your store will hide all public listings instantly. You can restore access at any time." 
                          : "Activate your store infrastructure to resume public sales and visibility."}
                      </p>
                    </div>
                    <Button 
                      onClick={handleToggleActive} 
                      disabled={isSaving}
                      variant="outline" 
                      className="w-full md:w-fit h-12 px-10 rounded-2xl border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      {store?.isActive ? "Execute Deactivation" : "Restore Store Access"}
                    </Button>
                 </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
