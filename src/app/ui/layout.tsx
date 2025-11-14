import { ModeToggle } from "@/components/mode-toggle"

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center py-20 max-w-3xl mx-auto px-4">
      <ModeToggle className="absolute top-4 right-4" />
      {children}
    </div>
  )
}
