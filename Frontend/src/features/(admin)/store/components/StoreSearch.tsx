import { Input } from "@/shared/components/ui/input"

export function StoreSearch() {
  return (
    <div className="hidden sm:block">
      <Input
        type="search"
        placeholder="Search..."
        className="h-10 w-[200px] lg:w-[300px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
      />
    </div>
  )
}
