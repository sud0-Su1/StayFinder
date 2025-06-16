import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Users, Bed, Bath, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getListings } from "@/lib/db"

interface SearchParams {
  location?: string
  minPrice?: string
  maxPrice?: string
  guests?: string
  checkIn?: string
  checkOut?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const filters = {
    location: searchParams.location,
    minPrice: searchParams.minPrice ? Number.parseInt(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice) : undefined,
    guests: searchParams.guests ? Number.parseInt(searchParams.guests) : undefined,
  }

  const listings = await getListings(filters)

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
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form method="GET" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input name="location" placeholder="Where to?" defaultValue={searchParams.location} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <Input name="checkIn" type="date" defaultValue={searchParams.checkIn} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <Input name="checkOut" type="date" defaultValue={searchParams.checkOut} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <Input name="guests" type="number" min="1" placeholder="Guests" defaultValue={searchParams.guests} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">&nbsp;</label>
                  <Button type="submit" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Price</label>
                  <Input name="minPrice" type="number" placeholder="$0" defaultValue={searchParams.minPrice} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Price</label>
                  <Input name="maxPrice" type="number" placeholder="$1000" defaultValue={searchParams.maxPrice} />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {listings.length} stays {searchParams.location && `in ${searchParams.location}`}
          </h1>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing: any) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={listing.images?.[0] || "/placeholder.svg?height=300&width=400"}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                  ${listing.price_per_night}/night
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{Number.parseFloat(listing.rating).toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm truncate">{listing.location}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {listing.guests}
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {listing.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {listing.bathrooms}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(listing.amenities || []).slice(0, 2).map((amenity: string) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <Link href={`/listings/${listing.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all listings</p>
            <Button asChild>
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
