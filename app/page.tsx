import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MapPin, Star, Users, Bed, Bath, Database } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getListings, checkTablesExist } from "@/lib/db"
import { DatabaseSetup } from "@/components/database-setup"

export default async function HomePage() {
  let featuredListings = []
  let usingMockData = false

  try {
    // Check if database is set up
    const tablesExist = await checkTablesExist()
    usingMockData = !tablesExist

    // Fetch featured listings (will use mock data if tables don't exist)
    featuredListings = await getListings({ limit: 6 })
  } catch (error) {
    console.error("Error fetching listings:", error)
    featuredListings = []
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            StayFinder
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/listings" className="text-muted-foreground hover:text-foreground">
              Browse
            </Link>
            <Link href="/host" className="text-muted-foreground hover:text-foreground">
              Become a Host
            </Link>
          </nav>
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

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Stay</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique accommodations around the world, from cozy cabins to luxury villas
          </p>

          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <form action="/listings" method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Where</label>
                  <Input name="location" placeholder="Search destinations" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <Input name="checkIn" type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <Input name="checkOut" type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="flex items-center">
                    <Input name="guests" type="number" min="1" placeholder="Add guests" />
                    <Button type="submit" className="ml-2" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mock Data Notice */}
      {usingMockData && (
        <section className="py-4 px-4 bg-blue-50 border-b">
          <div className="container mx-auto">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                You're viewing sample data.{" "}
                <Link href="#setup" className="underline font-medium">
                  Set up your database
                </Link>{" "}
                to enable full functionality including user accounts, bookings, and real listings.
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Stays</h2>

          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing: any) => (
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
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{Number.parseFloat(listing.rating || 0).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {listing.guests} guests
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {listing.bedrooms} bed
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {listing.bathrooms} bath
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(listing.amenities || []).slice(0, 3).map((amenity: string) => (
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No listings available</h3>
              <p className="text-muted-foreground">Something went wrong loading the listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Database Setup Section */}
      {usingMockData && (
        <section id="setup" className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Set up your database to unlock the full StayFinder experience with user accounts, real bookings, and host
              management.
            </p>
            <DatabaseSetup />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StayFinder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Find the perfect accommodation with our advanced search and filtering options
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-muted-foreground">
                Read authentic reviews from real guests to make informed decisions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Get help whenever you need it with our round-the-clock customer support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">StayFinder</h3>
              <p className="text-muted-foreground text-sm">
                Your trusted platform for finding unique accommodations worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/safety">Safety Information</Link>
                </li>
                <li>
                  <Link href="/cancellation">Cancellation Options</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/host">Become a Host</Link>
                </li>
                <li>
                  <Link href="/referrals">Referrals</Link>
                </li>
                <li>
                  <Link href="/community">Community Forum</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/press">Press</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StayFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
