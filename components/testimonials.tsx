import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Renter",
    content:
      "RentWise has been a game-changer for me. I needed furniture for a short-term apartment and found exactly what I needed at a fraction of the cost of buying new.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Lender",
    content:
      "I've been able to make extra income from items I rarely use. The platform is easy to use and the secure payment system gives me peace of mind.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Renter",
    content:
      "I rented a high-end camera for a weekend trip instead of buying one. The process was smooth and the item was exactly as described. Will definitely use again!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Don't just take our word for it - hear from our community
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
