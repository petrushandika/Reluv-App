import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar"

export function StoreRecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-sm text-muted-foreground">
            john.doe@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$250.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="Alice Smith" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Alice Smith</p>
          <p className="text-sm text-muted-foreground">alice@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$120.50</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" alt="Bob Knight" />
          <AvatarFallback>BK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Bob Knight</p>
          <p className="text-sm text-muted-foreground">bob.k@gmail.com</p>
        </div>
        <div className="ml-auto font-medium">+$340.00</div>
      </div>
    </div>
  )
}
