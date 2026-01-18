import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"

export function StoreUserNav() {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="Administrator" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </Button>
  )
}
