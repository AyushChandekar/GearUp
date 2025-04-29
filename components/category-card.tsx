import { Sofa, Tv, Car, Shirt, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  title: string
  icon: string
  itemCount: number
  href: string
}

export default function CategoryCard({ title, icon, itemCount, href }: CategoryCardProps) {
  const getIcon = (): LucideIcon => {
    switch (icon) {
      case "sofa":
        return Sofa
      case "tv":
        return Tv
      case "car":
        return Car
      case "shirt":
        return Shirt
      default:
        return Sofa
    }
  }

  const Icon = getIcon()

  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{itemCount} items</p>
        </CardContent>
      </Card>
    </Link>
  )
}
