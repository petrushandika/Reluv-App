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
        <Avatar className="h-9 w-9">
          <AvatarFallback>LS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Luxury Store A</p>
          <p className="text-xs text-muted-foreground">New store registered</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">Pending</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">User #8821</p>
          <p className="text-xs text-muted-foreground">Reported a suspicious product</p>
        </div>
        <div className="ml-auto">
          <Badge variant="destructive">Urgent</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
          $
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium">Withdrawal Request</p>
          <p className="text-xs text-muted-foreground">Store B requested $1,200.00</p>
        </div>
        <div className="ml-auto font-medium text-sm">2m ago</div>
      </div>
    </div>
  )
}
