import { Skeleton } from "@/components/ui/skeleton"
import MainNav from "@/components/main-nav"

export default function ListingLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
                <div className="col-span-2 row-span-2">
                  <Skeleton className="w-full h-[400px]" />
                </div>
                <Skeleton className="w-full h-[196px]" />
                <Skeleton className="w-full h-[196px]" />
                <Skeleton className="w-full h-[196px]" />
                <Skeleton className="w-full h-[196px]" />
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-0.5 w-full my-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </div>
                <div>
                  <Skeleton className="h-8 w-32 mb-3" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-64 w-full mb-4" />
              </div>
            </div>

            <div>
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
