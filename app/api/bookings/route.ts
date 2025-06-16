import { type NextRequest, NextResponse } from "next/server"
import { createBooking, getUserBookings, checkBookingAvailability } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

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

    const { listingId, checkIn, checkOut, guests, totalPrice } = await request.json()

    // Validate required fields
    if (!listingId || !checkIn || !checkOut || !guests || !totalPrice) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check availability
    const isAvailable = await checkBookingAvailability(listingId, checkIn, checkOut)
    if (!isAvailable) {
      return NextResponse.json({ message: "Property is not available for selected dates" }, { status: 400 })
    }

    const booking = await createBooking({
      listingId,
      guestId: decoded.userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    })

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const bookings = await getUserBookings(decoded.userId)

    return NextResponse.json({
      bookings,
      total: bookings.length,
    })
  } catch (error) {
    console.error("Bookings fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
