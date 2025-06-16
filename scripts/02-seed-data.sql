-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password_hash, is_host, is_superhost) VALUES
('John', 'Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', false, false),
('Sarah', 'Johnson', 'sarah@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', true, true),
('Mike', 'Wilson', 'mike@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', true, false),
('Emma', 'Davis', 'emma@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrUPW', false, false)
ON CONFLICT (email) DO NOTHING;

-- Insert sample listings
INSERT INTO listings (host_id, title, description, location, price_per_night, guests, bedrooms, bathrooms, property_type, amenities, images, house_rules) VALUES
(2, 'Cozy Mountain Cabin with Stunning Views', 'Escape to this charming mountain cabin nestled in the heart of Aspen. Perfect for a romantic getaway or small family vacation, this cozy retreat offers breathtaking mountain views and easy access to hiking trails. The cabin features a fully equipped kitchen, comfortable living area with fireplace, and a private hot tub on the deck.', 'Aspen, Colorado, United States', 180.00, 4, 2, 1, 'Cabin', 
 ARRAY['Wifi', 'Kitchen', 'Parking', 'Hot Tub', 'Fireplace'], 
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 3:00 PM - 10:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No pets allowed']),

(3, 'Modern Beach House', 'Wake up to ocean views in this stunning modern beach house. Features include a private pool, direct beach access, and spacious outdoor deck perfect for entertaining. The house has been recently renovated with high-end finishes and modern amenities throughout.', 'Malibu, California, United States', 350.00, 8, 4, 3, 'House',
 ARRAY['Wifi', 'Pool', 'Beach Access', 'Kitchen', 'Parking', 'Air Conditioning'],
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 4:00 PM - 9:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No parties']),

(2, 'Downtown Loft', 'Stylish loft in the heart of the city. Walking distance to restaurants, shops, and attractions. Perfect for business travelers or couples exploring the city. Features exposed brick walls, high ceilings, and modern furnishings.', 'New York, NY, United States', 120.00, 2, 1, 1, 'Loft',
 ARRAY['Wifi', 'Kitchen', 'Gym Access', 'Rooftop Terrace'],
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 3:00 PM - 11:00 PM', 'Checkout: 11:00 AM', 'No smoking']),

(3, 'Lakefront Cottage', 'Peaceful lakefront cottage surrounded by nature. Perfect for fishing, kayaking, and relaxing by the water. The cottage features a private dock, outdoor fire pit, and panoramic lake views from every room.', 'Lake Tahoe, California, United States', 220.00, 6, 3, 2, 'Cottage',
 ARRAY['Wifi', 'Kitchen', 'Fireplace', 'Dock', 'Kayaks', 'Fire Pit'],
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 3:00 PM - 8:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No loud music after 10 PM']),

(2, 'Urban Studio Apartment', 'Modern studio apartment in the trendy downtown district. Perfect for solo travelers or couples. Features a murphy bed, full kitchen, and access to building amenities including rooftop terrace and fitness center.', 'Seattle, Washington, United States', 95.00, 2, 1, 1, 'Apartment',
 ARRAY['Wifi', 'Kitchen', 'Gym Access', 'Rooftop Access', 'Laundry'],
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 3:00 PM - 10:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'Quiet hours after 10 PM']),

(3, 'Desert Villa with Pool', 'Luxurious desert villa with private pool and spa. Stunning mountain views and modern architecture. Perfect for groups looking for a high-end desert experience with all the amenities.', 'Scottsdale, Arizona, United States', 450.00, 10, 5, 4, 'Villa',
 ARRAY['Wifi', 'Pool', 'Spa', 'Kitchen', 'Parking', 'Air Conditioning', 'BBQ Grill'],
 ARRAY['/placeholder.svg?height=400&width=600', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=300&width=400'],
 ARRAY['Check-in: 4:00 PM - 8:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No parties without permission'])
ON CONFLICT DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (listing_id, guest_id, check_in, check_out, guests, total_price, status, payment_status) VALUES
(1, 1, '2024-07-15', '2024-07-20', 2, 900.00, 'confirmed', 'paid'),
(2, 4, '2024-08-01', '2024-08-05', 6, 1400.00, 'pending', 'pending'),
(3, 1, '2024-06-10', '2024-06-12', 2, 240.00, 'completed', 'paid')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (booking_id, reviewer_id, listing_id, rating, comment) VALUES
(1, 1, 1, 5, 'Amazing cabin with incredible views! Sarah was a wonderful host and the place was exactly as described. The hot tub was perfect after a day of hiking.'),
(3, 1, 3, 4, 'Great location in downtown. The loft was clean and well-equipped. Would stay again! Only minor issue was some street noise at night.')
ON CONFLICT DO NOTHING;

-- Insert sample favorites
INSERT INTO favorites (user_id, listing_id) VALUES
(1, 2),
(4, 1),
(4, 3)
ON CONFLICT (user_id, listing_id) DO NOTHING;
