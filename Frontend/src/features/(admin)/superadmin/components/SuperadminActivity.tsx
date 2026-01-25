import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"

export function SuperadminActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
          <AvatarFallback className="bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">LS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Luxury Store A</p>
          <p className="text-xs text-muted-foreground">New store registered</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-900/30">Pending</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">UN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">User #8821</p>
          <p className="text-xs text-muted-foreground">Reported suspicious product</p>
        </div>
        <div className="ml-auto">
          <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600">Urgent</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-900/30 text-xs">
          Rp
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Withdrawal Request</p>
          <p className="text-xs text-muted-foreground">Store B: Rp. 1.200.000</p>
        </div>
        <div className="ml-auto font-medium text-[10px] text-slate-400 uppercase tracking-wider">2m ago</div>
      </div>
    </div>
  )
}
