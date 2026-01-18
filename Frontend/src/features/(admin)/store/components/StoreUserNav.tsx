import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"

export function StoreUserNav() {
  return (
    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 p-0 overflow-hidden">
      <Avatar className="h-full w-full">
        <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="Administrator" className="object-cover" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </Button>
  )
}
