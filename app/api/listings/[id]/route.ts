import { type NextRequest, NextResponse } from "next/server"
import { getListingById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listingId = Number.parseInt(params.id)
    const listing = await getListingById(listingId)

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 })
    }

    // Transform the data to match frontend expectations
    const transformedListing = {
      id: listing.id,
      title: listing.title,
      location: listing.location,
      price: listing.price_per_night,
      rating: Number.parseFloat(listing.rating) || 0,
      reviews: listing.review_count,
      images: listing.images || ["/placeholder.svg?height=400&width=600"],
      amenities: (listing.amenities || []).map((amenity: string) => ({
        name: amenity,
        icon: "Wifi", // You can map specific icons based on amenity names
      })),
      guests: listing.guests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      description: listing.description,
      host: {
        name: `${listing.host_first_name} ${listing.host_last_name}`,
        avatar: "/placeholder.svg?height=40&width=40",
        joinedDate: new Date(listing.host_joined).getFullYear().toString(),
        isSuperhost: listing.is_superhost,
      },
      rules: listing.house_rules || [],
    }

    return NextResponse.json({ listing: transformedListing })
  } catch (error) {
    console.error("Listing fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
