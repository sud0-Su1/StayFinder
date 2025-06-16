import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Check if tables exist
export async function checkTablesExist() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'listings'
      )
    `
    return result[0].exists
  } catch (error) {
    console.error("Error checking tables:", error)
    return false
  }
}

// Mock data fallback
const mockListings = [
  {
    id: 1,
    title: "Cozy Mountain Cabin with Stunning Views",
    location: "Aspen, Colorado, United States",
    price_per_night: 180,
    rating: "4.9",
    review_count: 127,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Kitchen", "Parking", "Hot Tub", "Fireplace"],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    host_first_name: "Sarah",
    host_last_name: "Johnson",
    is_superhost: true,
  },
  {
    id: 2,
    title: "Modern Beach House",
    location: "Malibu, California, United States",
    price_per_night: 350,
    rating: "4.8",
    review_count: 89,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Pool", "Beach Access", "Kitchen", "Parking"],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    host_first_name: "Mike",
    host_last_name: "Wilson",
    is_superhost: false,
  },
  {
    id: 3,
    title: "Downtown Loft",
    location: "New York, NY, United States",
    price_per_night: 120,
    rating: "4.7",
    review_count: 203,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Kitchen", "Gym Access", "Rooftop Terrace"],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    host_first_name: "Sarah",
    host_last_name: "Johnson",
    is_superhost: true,
  },
  {
    id: 4,
    title: "Lakefront Cottage",
    location: "Lake Tahoe, California, United States",
    price_per_night: 220,
    rating: "4.9",
    review_count: 156,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Kitchen", "Fireplace", "Dock", "Kayaks"],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    host_first_name: "Mike",
    host_last_name: "Wilson",
    is_superhost: false,
  },
  {
    id: 5,
    title: "Urban Studio Apartment",
    location: "Seattle, Washington, United States",
    price_per_night: 95,
    rating: "4.6",
    review_count: 78,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Kitchen", "Gym Access", "Rooftop Access"],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    host_first_name: "Sarah",
    host_last_name: "Johnson",
    is_superhost: true,
  },
  {
    id: 6,
    title: "Desert Villa with Pool",
    location: "Scottsdale, Arizona, United States",
    price_per_night: 450,
    rating: "4.8",
    review_count: 92,
    images: ["/placeholder.svg?height=400&width=600"],
    amenities: ["Wifi", "Pool", "Spa", "Kitchen", "Parking", "BBQ Grill"],
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    host_first_name: "Mike",
    host_last_name: "Wilson",
    is_superhost: false,
  },
]

// Database helper functions
export async function createUser(userData: {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}) {
  const result = await sql`
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES (${userData.firstName}, ${userData.lastName}, ${userData.email}, ${userData.passwordHash})
    RETURNING id, first_name, last_name, email, created_at
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, first_name, last_name, email, password_hash, is_host, is_superhost
    FROM users 
    WHERE email = ${email}
  `
  return result[0]
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, first_name, last_name, email, is_host, is_superhost, created_at
    FROM users 
    WHERE id = ${id}
  `
  return result[0]
}

export async function getListings(
  filters: {
    location?: string
    minPrice?: number
    maxPrice?: number
    guests?: number
    limit?: number
    offset?: number
  } = {},
) {
  // Check if tables exist first
  const tablesExist = await checkTablesExist()

  if (!tablesExist) {
    // Return mock data with filtering applied
    let filteredListings = [...mockListings]

    if (filters.location) {
      filteredListings = filteredListings.filter((listing) =>
        listing.location.toLowerCase().includes(filters.location!.toLowerCase()),
      )
    }

    if (filters.minPrice) {
      filteredListings = filteredListings.filter((listing) => listing.price_per_night >= filters.minPrice!)
    }

    if (filters.maxPrice) {
      filteredListings = filteredListings.filter((listing) => listing.price_per_night <= filters.maxPrice!)
    }

    if (filters.guests) {
      filteredListings = filteredListings.filter((listing) => listing.guests >= filters.guests!)
    }

    if (filters.limit) {
      filteredListings = filteredListings.slice(0, filters.limit)
    }

    return filteredListings
  }

  // If tables exist, query the database
  if (filters.location && filters.minPrice && filters.maxPrice && filters.guests) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.location ILIKE ${"%" + filters.location + "%"}
        AND l.price_per_night >= ${filters.minPrice}
        AND l.price_per_night <= ${filters.maxPrice}
        AND l.guests >= ${filters.guests}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
      ${filters.offset ? sql`OFFSET ${filters.offset}` : sql``}
    `
  } else if (filters.location && filters.minPrice && filters.maxPrice) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.location ILIKE ${"%" + filters.location + "%"}
        AND l.price_per_night >= ${filters.minPrice}
        AND l.price_per_night <= ${filters.maxPrice}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  } else if (filters.location && filters.minPrice) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.location ILIKE ${"%" + filters.location + "%"}
        AND l.price_per_night >= ${filters.minPrice}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  } else if (filters.location) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.location ILIKE ${"%" + filters.location + "%"}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  } else if (filters.minPrice && filters.maxPrice) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.price_per_night >= ${filters.minPrice}
        AND l.price_per_night <= ${filters.maxPrice}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  } else if (filters.guests) {
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
        AND l.guests >= ${filters.guests}
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  } else {
    // No filters - return all listings
    return await sql`
      SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, u.is_superhost,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as review_count
      FROM listings l
      LEFT JOIN users u ON l.host_id = u.id
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.is_active = true
      GROUP BY l.id, u.first_name, u.last_name, u.is_superhost 
      ORDER BY l.created_at DESC
      ${filters.limit ? sql`LIMIT ${filters.limit}` : sql``}
    `
  }
}

export async function getListingById(id: number) {
  const tablesExist = await checkTablesExist()

  if (!tablesExist) {
    // Return mock data
    const listing = mockListings.find((l) => l.id === id)
    if (!listing) return null

    return {
      ...listing,
      description:
        "This is a sample listing. Set up your database to see real listings with full descriptions and features.",
      host_joined: "2019-01-01",
      house_rules: ["Check-in: 3:00 PM - 10:00 PM", "Checkout: 11:00 AM", "No smoking", "No pets allowed"],
    }
  }

  const result = await sql`
    SELECT l.*, u.first_name as host_first_name, u.last_name as host_last_name, 
           u.is_superhost, u.created_at as host_joined,
           COALESCE(AVG(r.rating), 0) as rating,
           COUNT(r.id) as review_count
    FROM listings l
    LEFT JOIN users u ON l.host_id = u.id
    LEFT JOIN reviews r ON l.id = r.listing_id
    WHERE l.id = ${id} AND l.is_active = true
    GROUP BY l.id, u.first_name, u.last_name, u.is_superhost, u.created_at
  `
  return result[0]
}

export async function createListing(listingData: {
  hostId: number
  title: string
  description: string
  location: string
  pricePerNight: number
  guests: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  amenities: string[]
  images: string[]
  houseRules: string[]
}) {
  const result = await sql`
    INSERT INTO listings (
      host_id, title, description, location, price_per_night, 
      guests, bedrooms, bathrooms, property_type, amenities, images, house_rules
    )
    VALUES (
      ${listingData.hostId}, ${listingData.title}, ${listingData.description}, 
      ${listingData.location}, ${listingData.pricePerNight}, ${listingData.guests}, 
      ${listingData.bedrooms}, ${listingData.bathrooms}, ${listingData.propertyType}, 
      ${listingData.amenities}, ${listingData.images}, ${listingData.houseRules}
    )
    RETURNING *
  `
  return result[0]
}

export async function createBooking(bookingData: {
  listingId: number
  guestId: number
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
}) {
  const result = await sql`
    INSERT INTO bookings (listing_id, guest_id, check_in, check_out, guests, total_price)
    VALUES (${bookingData.listingId}, ${bookingData.guestId}, ${bookingData.checkIn}, 
            ${bookingData.checkOut}, ${bookingData.guests}, ${bookingData.totalPrice})
    RETURNING *
  `
  return result[0]
}

export async function getUserBookings(userId: number) {
  const result = await sql`
    SELECT b.*, l.title as listing_title, l.location as listing_location,
           l.images[1] as listing_image
    FROM bookings b
    LEFT JOIN listings l ON b.listing_id = l.id
    WHERE b.guest_id = ${userId}
    ORDER BY b.created_at DESC
  `
  return result
}

export async function getHostBookings(hostId: number) {
  const result = await sql`
    SELECT b.*, l.title as listing_title, l.location as listing_location,
           u.first_name as guest_first_name, u.last_name as guest_last_name
    FROM bookings b
    LEFT JOIN listings l ON b.listing_id = l.id
    LEFT JOIN users u ON b.guest_id = u.id
    WHERE l.host_id = ${hostId}
    ORDER BY b.created_at DESC
  `
  return result
}

export async function checkBookingAvailability(listingId: number, checkIn: string, checkOut: string) {
  const result = await sql`
    SELECT COUNT(*) as conflict_count
    FROM bookings
    WHERE listing_id = ${listingId}
      AND status != 'cancelled'
      AND daterange(check_in, check_out, '[]') && daterange(${checkIn}, ${checkOut}, '[]')
  `
  return result[0].conflict_count === 0
}
