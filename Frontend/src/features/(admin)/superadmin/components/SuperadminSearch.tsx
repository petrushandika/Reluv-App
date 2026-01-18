import { Input } from "@/shared/components/ui/input"

export function SuperadminSearch() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search platform..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
