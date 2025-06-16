import { type NextRequest, NextResponse } from "next/server"
import { getListings, createListing } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const guests = searchParams.get("guests")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    const filters = {
      location: location || undefined,
      minPrice: minPrice ? Number.parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseInt(maxPrice) : undefined,
      guests: guests ? Number.parseInt(guests) : undefined,
      limit: limit ? Number.parseInt(limit) : undefined,
      offset: offset ? Number.parseInt(offset) : undefined,
    }

    const listings = await getListings(filters)

    // Transform the data to match frontend expectations
    const transformedListings = listings.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      price: listing.price_per_night,
      rating: Number.parseFloat(listing.rating) || 0,
      reviews: listing.review_count,
      image: listing.images?.[0] || "/placeholder.svg?height=300&width=400",
      amenities: listing.amenities || [],
      guests: listing.guests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      host: {
        name: `${listing.host_first_name} ${listing.host_last_name}`,
        isSuperhost: listing.is_superhost,
      },
    }))

    return NextResponse.json({
      listings: transformedListings,
      total: transformedListings.length,
    })
  } catch (error) {
    console.error("Listings fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const listingData = await request.json()

    const newListing = await createListing({
      hostId: decoded.userId,
      title: listingData.title,
      description: listingData.description,
      location: listingData.location,
      pricePerNight: listingData.pricePerNight,
      guests: listingData.guests,
      bedrooms: listingData.bedrooms,
      bathrooms: listingData.bathrooms,
      propertyType: listingData.propertyType,
      amenities: listingData.amenities || [],
      images: listingData.images || [],
      houseRules: listingData.houseRules || [],
    })

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: newListing,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Listing creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
