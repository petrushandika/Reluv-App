import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield, CreditCard, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/features/(auth)/store/auth.store"
import { useRouter } from "next/navigation"

export function StoreUserNav() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Store Admin"
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "SA" : "SA"
  const avatar = user?.profile?.avatar || "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden ring-offset-2 ring-offset-white dark:ring-offset-slate-950 focus:ring-2 focus:ring-sky-500 transition-all">
          <Avatar className="h-full w-full">
            <AvatarImage src={avatar} alt={name} className="object-cover" />
            <AvatarFallback className="font-medium bg-sky-500 text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-2xl p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center border border-sky-400/20 shadow-lg shadow-sky-500/20">
                  <span className="text-white font-medium text-sm">{initials}</span>
               </div>
               <div className="flex flex-col">
                  <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{name}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{user?.email || "Administrator Access"}</p>
               </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild>
            <Link href="/store/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                 <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-medium text-slate-900 dark:text-white">Profile Overview</span>
                 <span className="text-[9px] text-slate-400 uppercase tracking-tight">Identity & Bio</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
               <Shield className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-medium text-slate-900 dark:text-white">Security Protocol</span>
               <span className="text-[9px] text-slate-400 uppercase tracking-tight">Access Control</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
               <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-medium text-slate-900 dark:text-white">Advanced Flows</span>
               <span className="text-[9px] text-slate-400 uppercase tracking-tight">System Synced</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 transition-colors group m-1">
           <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-500 group-hover:text-white transition-all">
              <LogOut className="h-4 w-4" />
           </div>
           <div className="flex flex-col">
              <span className="text-xs font-medium">Terminate Session</span>
              <span className="text-[9px] text-rose-400 uppercase tracking-tight">Sign out securely</span>
           </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
