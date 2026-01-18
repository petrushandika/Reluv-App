import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"

export function SuperadminUserNav() {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden">
      <Avatar className="h-full w-full">
        <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="Administrator" className="object-cover" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </Button>
  )
}
