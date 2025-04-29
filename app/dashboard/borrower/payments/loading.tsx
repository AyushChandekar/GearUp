import { Skeleton } from "@/components/ui/skeleton"

export default function BorrowerPaymentsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Skeleton className="h-6 w-32" />
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-4 py-2">
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                </div>
              </div>
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid gap-6">
              <div className="border rounded-lg p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-6">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex gap-4">
                          <Skeleton className="h-10 w-28" />
                          <Skeleton className="h-10 w-36" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
