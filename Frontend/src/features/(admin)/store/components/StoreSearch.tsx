import { Input } from "@/shared/components/ui/input"

export function StoreSearch() {
  return (
    <div className="hidden sm:block">
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 w-[150px] md:w-[200px] lg:w-[300px] bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
      />
    </div>
  )
}
