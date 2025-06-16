import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          avatar_url TEXT,
          is_host BOOLEAN DEFAULT FALSE,
          is_superhost BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create listings table
    await sql`
      CREATE TABLE IF NOT EXISTS listings (
          id SERIAL PRIMARY KEY,
          host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          location VARCHAR(255) NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          price_per_night DECIMAL(10, 2) NOT NULL,
          guests INTEGER NOT NULL,
          bedrooms INTEGER NOT NULL,
          bathrooms INTEGER NOT NULL,
          property_type VARCHAR(50) NOT NULL DEFAULT 'House',
          amenities TEXT[],
          images TEXT[],
          house_rules TEXT[],
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
          guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          check_in DATE NOT NULL,
          check_out DATE NOT NULL,
          guests INTEGER NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          payment_status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
          reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS favorites (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, listing_id)
      )
    `

    // Create messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
          sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert sample users (password is 'password123' hashed with bcrypt)
    await sql`
      INSERT INTO users (first_name, last_name, email, password_hash, is_host, is_superhost) VALUES
      ('John', 'Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', false, false),
      ('Sarah', 'Johnson', 'sarah@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', true, true),
      ('Mike', 'Wilson', 'mike@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', true, false),
      ('Emma', 'Davis', 'emma@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', false, false)
      ON CONFLICT (email) DO NOTHING
    `

    // Insert sample listings
    await sql`
      INSERT INTO listings (host_id, title, description, location, price_per_night, guests, bedrooms, bathrooms, property_type, amenities, images, house_rules) VALUES
      (2, 'Cozy Mountain Cabin with Stunning Views', 'Escape to this charming mountain cabin nestled in the heart of Aspen. Perfect for a romantic getaway or small family vacation, this cozy retreat offers breathtaking mountain views and easy access to hiking trails.', 'Aspen, Colorado, United States', 180.00, 4, 2, 1, 'Cabin', 
       ARRAY['Wifi', 'Kitchen', 'Parking', 'Hot Tub', 'Fireplace'], 
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 3:00 PM - 10:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No pets allowed']),
      
      (3, 'Modern Beach House', 'Wake up to ocean views in this stunning modern beach house. Features include a private pool, direct beach access, and spacious outdoor deck perfect for entertaining.', 'Malibu, California, United States', 350.00, 8, 4, 3, 'House',
       ARRAY['Wifi', 'Pool', 'Beach Access', 'Kitchen', 'Parking', 'Air Conditioning'],
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 4:00 PM - 9:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No parties']),
      
      (2, 'Downtown Loft', 'Stylish loft in the heart of the city. Walking distance to restaurants, shops, and attractions. Perfect for business travelers or couples exploring the city.', 'New York, NY, United States', 120.00, 2, 1, 1, 'Loft',
       ARRAY['Wifi', 'Kitchen', 'Gym Access', 'Rooftop Terrace'],
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 3:00 PM - 11:00 PM', 'Checkout: 11:00 AM', 'No smoking']),
      
      (3, 'Lakefront Cottage', 'Peaceful lakefront cottage surrounded by nature. Perfect for fishing, kayaking, and relaxing by the water. The cottage features a private dock and outdoor fire pit.', 'Lake Tahoe, California, United States', 220.00, 6, 3, 2, 'Cottage',
       ARRAY['Wifi', 'Kitchen', 'Fireplace', 'Dock', 'Kayaks', 'Fire Pit'],
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 3:00 PM - 8:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No loud music after 10 PM']),
      
      (2, 'Urban Studio Apartment', 'Modern studio apartment in the trendy downtown district. Perfect for solo travelers or couples. Features a murphy bed and full kitchen.', 'Seattle, Washington, United States', 95.00, 2, 1, 1, 'Apartment',
       ARRAY['Wifi', 'Kitchen', 'Gym Access', 'Rooftop Access', 'Laundry'],
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 3:00 PM - 10:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'Quiet hours after 10 PM']),
      
      (3, 'Desert Villa with Pool', 'Luxurious desert villa with private pool and spa. Stunning mountain views and modern architecture. Perfect for groups looking for a high-end desert experience.', 'Scottsdale, Arizona, United States', 450.00, 10, 5, 4, 'Villa',
       ARRAY['Wifi', 'Pool', 'Spa', 'Kitchen', 'Parking', 'Air Conditioning', 'BBQ Grill'],
       ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
       ARRAY['Check-in: 4:00 PM - 8:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No parties without permission'])
      ON CONFLICT DO NOTHING
    `

    // Insert sample reviews
    await sql`
      INSERT INTO reviews (reviewer_id, listing_id, rating, comment) VALUES
      (1, 1, 5, 'Amazing cabin with incredible views! Sarah was a wonderful host and the place was exactly as described.'),
      (1, 3, 4, 'Great location in downtown. The loft was clean and well-equipped. Would stay again!'),
      (4, 2, 5, 'Perfect beach house for our family vacation. The pool and beach access were fantastic!'),
      (4, 4, 5, 'Beautiful lakefront cottage. We loved the kayaks and the peaceful setting.')
      ON CONFLICT DO NOTHING
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location)`
    await sql`CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price_per_night)`
    await sql`CREATE INDEX IF NOT EXISTS idx_listings_host ON listings(host_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_guest ON bookings(guest_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id)`

    return NextResponse.json({ message: "Database setup completed successfully!" })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ message: "Database setup failed", error: error }, { status: 500 })
  }
}
