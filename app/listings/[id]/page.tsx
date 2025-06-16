import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Waves,
  Shield,
  Heart,
  Share,
  ChevronLeft,
  CalendarDays,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - replace with database query
const listing = {
  id: 1,
  title: "Cozy Mountain Cabin with Stunning Views",
  location: "Aspen, Colorado, United States",
  price: 180,
  rating: 4.9,
  reviews: 127,
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ],
  amenities: [
    { name: "Wifi", icon: Wifi },
    { name: "Kitchen", icon: Coffee },
    { name: "Parking", icon: Car },
    { name: "Hot Tub", icon: Waves },
  ],
  guests: 4,
  bedrooms: 2,
  bathrooms: 1,
  description:
    "Escape to this charming mountain cabin nestled in the heart of Aspen. Perfect for a romantic getaway or small family vacation, this cozy retreat offers breathtaking mountain views and easy access to hiking trails. The cabin features a fully equipped kitchen, comfortable living area with fireplace, and a private hot tub on the deck.",
  host: {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedDate: "2019",
    isSuperhost: true,
  },
  rules: [
    "Check-in: 3:00 PM - 10:00 PM",
    "Checkout: 11:00 AM",
    "No smoking",
    "No pets allowed",
    "No parties or events",
  ],
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            StayFinder
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to listings
          </Link>
        </Button>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{listing.rating}</span>
                <span className="mx-1">·</span>
                <span className="underline">{listing.reviews} reviews</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2">
            <Image
              src={listing.images[0] || "/placeholder.svg"}
              alt={listing.title}
              width={600}
              height={400}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          {listing.images.slice(1, 5).map((image, index) => (
            <div key={index}>
              <Image
                src={image || "/placeholder.svg"}
                alt={`${listing.title} ${index + 2}`}
                width={400}
                height={300}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Entire cabin hosted by {listing.host.name}</h2>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {listing.guests} guests
                    </div>
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {listing.bedrooms} bedrooms
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {listing.bathrooms} bathroom
                    </div>
                  </div>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={listing.host.avatar || "/placeholder.svg"} alt={listing.host.name} />
                  <AvatarFallback>
                    {listing.host.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Separator />
            </div>

            {/* Host Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Superhost</span>
              </div>
              <span className="text-muted-foreground">Joined in {listing.host.joinedDate}</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center space-x-3">
                    <amenity.icon className="h-5 w-5" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div>
              <h3 className="text-lg font-semibold mb-4">House rules</h3>
              <ul className="space-y-2">
                {listing.rules.map((rule, index) => (
                  <li key={index} className="text-muted-foreground">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl">
                    ${listing.price} <span className="text-base font-normal text-muted-foreground">night</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{listing.rating}</span>
                    <span className="text-sm text-muted-foreground">({listing.reviews})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Check-in
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Check-out
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  {listing.guests} guests
                </Button>

                <Button className="w-full" size="lg">
                  Reserve
                </Button>

                <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${listing.price} × 5 nights</span>
                    <span>${listing.price * 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>$67</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${listing.price * 5 + 50 + 67}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
