"use server"

import { createClient } from "@/lib/supabase/server"

// Sample user IDs - in a real application, you would query for actual user IDs
const RENTER_USER_IDS = [
  "123e4567-e89b-12d3-a456-426614174000",
  "223e4567-e89b-12d3-a456-426614174001",
  "323e4567-e89b-12d3-a456-426614174002",
  "423e4567-e89b-12d3-a456-426614174003",
  "523e4567-e89b-12d3-a456-426614174004",
]

// Categories
const CATEGORIES = ["Furniture", "Electronics", "Vehicles", "Photography", "Clothing", "Appliances", "Tools", "Sports"]

// Locations
const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
]

// Rental periods
const PERIODS = ["day", "week", "month"]

// Generate listings for each category
export async function seedListings() {
  const supabase = createClient()

  try {
    // First, check if we already have listings
    const { count } = await supabase.from("listings").select("*", { count: "exact", head: true })

    // If we already have a significant number of listings, don't seed
    if (count && count > 20) {
      return { success: false, message: `Database already has ${count} listings. Seeding skipped.` }
    }

    const listings = []

    // Generate 5 listings for each category
    for (const category of CATEGORIES) {
      for (let i = 1; i <= 5; i++) {
        const renterId = RENTER_USER_IDS[Math.floor(Math.random() * RENTER_USER_IDS.length)]
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
        const period = PERIODS[Math.floor(Math.random() * PERIODS.length)]
        const basePrice = Math.floor(Math.random() * 100) + 10 // $10 to $110

        const listing = generateListing(category, i, renterId, location, period, basePrice)
        listings.push(listing)
      }
    }

    // Insert all listings
    const { error } = await supabase.from("listings").insert(listings)

    if (error) {
      console.error("Error seeding listings:", error)
      return { success: false, message: `Error seeding listings: ${error.message}` }
    }

    return {
      success: true,
      message: `Successfully seeded ${listings.length} listings across ${CATEGORIES.length} categories.`,
    }
  } catch (error) {
    console.error("Error in seedListings:", error)
    return { success: false, message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

function generateListing(
  category: string,
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  // Generate listing based on category
  switch (category) {
    case "Furniture":
      return generateFurnitureListing(index, renterId, location, period, basePrice)
    case "Electronics":
      return generateElectronicsListing(index, renterId, location, period, basePrice)
    case "Vehicles":
      return generateVehicleListing(index, renterId, location, period, basePrice)
    case "Photography":
      return generatePhotographyListing(index, renterId, location, period, basePrice)
    case "Clothing":
      return generateClothingListing(index, renterId, location, period, basePrice)
    case "Appliances":
      return generateApplianceListing(index, renterId, location, period, basePrice)
    case "Tools":
      return generateToolListing(index, renterId, location, period, basePrice)
    case "Sports":
      return generateSportsListing(index, renterId, location, period, basePrice)
    default:
      return generateDefaultListing(category, index, renterId, location, period, basePrice)
  }
}

function generateFurnitureListing(
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  const furnitureTypes = ["Sofa", "Dining Table", "Bed Frame", "Office Desk", "Bookshelf"]
  const title = `${furnitureTypes[index - 1]} - Premium Quality for Rent`

  return {
    title,
    description: `Beautiful ${furnitureTypes[index - 1].toLowerCase()} available for rent. Perfect for temporary home setups, staging, or events. This high-quality piece will enhance any space.`,
    category: "Furniture",
    price: basePrice,
    period,
    deposit: basePrice * 2,
    location,
    features: JSON.stringify([
      "Premium materials",
      "Easy assembly",
      "Modern design",
      "Excellent condition",
      "Delivery available",
    ]),
    policies: JSON.stringify({
      cancellation: "48-hour notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear and tear",
      delivery: "Delivery and pickup available for additional fee",
    }),
    images: JSON.stringify([
      `/images/modern-sofa-${index}.jpg`,
      `/images/furniture-${index}-1.jpg`,
      `/images/furniture-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateElectronicsListing(
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  const electronicTypes = ["Laptop", "Smartphone", "Tablet", "Gaming Console", "Smart TV"]
  const title = `${electronicTypes[index - 1]} - Latest Model for Rent`

  return {
    title,
    description: `Latest model ${electronicTypes[index - 1].toLowerCase()} available for rent. Perfect for temporary use, testing before buying, or for events. Comes with all necessary accessories.`,
    category: "Electronics",
    price: basePrice * 2, // Electronics are typically more expensive
    period,
    deposit: basePrice * 3,
    location,
    features: JSON.stringify([
      "Latest model",
      "All accessories included",
      "Perfect working condition",
      "Technical support available",
      "Insurance option available",
    ]),
    policies: JSON.stringify({
      cancellation: "72-hour notice required for full refund",
      damage: "Full insurance coverage required",
      return: "Must be returned in original packaging",
    }),
    images: JSON.stringify([
      `/images/macbook-pro-${index}.jpg`,
      `/images/electronics-${index}-1.jpg`,
      `/images/electronics-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateVehicleListing(index: number, renterId: string, location: string, period: string, basePrice: number) {
  const vehicleTypes = ["Car", "Motorcycle", "Bicycle", "Scooter", "Van"]
  const title = `${vehicleTypes[index - 1]} - Well-Maintained for Rent`

  return {
    title,
    description: `Reliable ${vehicleTypes[index - 1].toLowerCase()} available for rent. Perfect for weekend trips, moving, or temporary transportation needs. Well-maintained and ready to go.`,
    category: "Vehicles",
    price: basePrice * 3, // Vehicles are typically more expensive
    period,
    deposit: basePrice * 5,
    location,
    features: JSON.stringify([
      "Well-maintained",
      "Full tank of gas/Fully charged",
      "Insurance included",
      "Roadside assistance",
      "Flexible pickup and return",
    ]),
    policies: JSON.stringify({
      cancellation: "7-day notice required for full refund",
      damage: "Comprehensive insurance required",
      mileage: "Limited to 100 miles per day",
    }),
    images: JSON.stringify([
      `/images/royal-enfield-${index}.jpg`,
      `/images/vehicle-${index}-1.jpg`,
      `/images/vehicle-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generatePhotographyListing(
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  const photographyTypes = ["DSLR Camera", "Mirrorless Camera", "Lens Kit", "Lighting Equipment", "Drone"]
  const title = `${photographyTypes[index - 1]} - Professional Grade for Rent`

  return {
    title,
    description: `Professional grade ${photographyTypes[index - 1].toLowerCase()} available for rent. Perfect for photoshoots, events, or trying before buying. Comes with all necessary accessories.`,
    category: "Photography",
    price: basePrice * 2.5,
    period,
    deposit: basePrice * 4,
    location,
    features: JSON.stringify([
      "Professional grade",
      "All accessories included",
      "Recently serviced",
      "Technical support available",
      "Insurance option available",
    ]),
    policies: JSON.stringify({
      cancellation: "72-hour notice required for full refund",
      damage: "Full insurance coverage required",
      return: "Equipment must be cleaned before return",
    }),
    images: JSON.stringify([
      `/images/dslr-camera-${index}.jpg`,
      `/images/photography-${index}-1.jpg`,
      `/images/photography-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateClothingListing(index: number, renterId: string, location: string, period: string, basePrice: number) {
  const clothingTypes = ["Formal Suit", "Designer Dress", "Wedding Attire", "Costume", "Winter Gear"]
  const title = `${clothingTypes[index - 1]} - High Quality for Rent`

  return {
    title,
    description: `High-quality ${clothingTypes[index - 1].toLowerCase()} available for rent. Perfect for special occasions, photoshoots, or one-time events. Professionally cleaned and in excellent condition.`,
    category: "Clothing",
    price: basePrice * 1.5,
    period,
    deposit: basePrice * 2,
    location,
    features: JSON.stringify([
      "Designer brand",
      "Multiple sizes available",
      "Professionally cleaned",
      "Alterations available",
      "Accessories included",
    ]),
    policies: JSON.stringify({
      cancellation: "48-hour notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear",
      cleaning: "Must be returned cleaned or cleaning fee applies",
    }),
    images: JSON.stringify([
      `/images/clothing-${index}.jpg`,
      `/images/clothing-${index}-1.jpg`,
      `/images/clothing-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateApplianceListing(
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  const applianceTypes = ["Refrigerator", "Washing Machine", "Microwave", "Air Conditioner", "Coffee Machine"]
  const title = `${applianceTypes[index - 1]} - Like New for Rent`

  return {
    title,
    description: `Like-new ${applianceTypes[index - 1].toLowerCase()} available for rent. Perfect for temporary housing, events, or trying before buying. Energy efficient and in excellent working condition.`,
    category: "Appliances",
    price: basePrice * 2,
    period,
    deposit: basePrice * 3,
    location,
    features: JSON.stringify([
      "Energy efficient",
      "Like-new condition",
      "Delivery and installation available",
      "Technical support included",
      "All accessories included",
    ]),
    policies: JSON.stringify({
      cancellation: "7-day notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear",
      installation: "Professional installation required",
    }),
    images: JSON.stringify([
      `/images/appliance-${index}.jpg`,
      `/images/appliance-${index}-1.jpg`,
      `/images/appliance-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateToolListing(index: number, renterId: string, location: string, period: string, basePrice: number) {
  const toolTypes = ["Power Drill", "Lawn Mower", "Pressure Washer", "Table Saw", "Ladder"]
  const title = `${toolTypes[index - 1]} - Professional Grade for Rent`

  return {
    title,
    description: `Professional grade ${toolTypes[index - 1].toLowerCase()} available for rent. Perfect for home projects, renovations, or one-time use. Well-maintained and in excellent working condition.`,
    category: "Tools",
    price: basePrice * 1.5,
    period,
    deposit: basePrice * 2,
    location,
    features: JSON.stringify([
      "Professional grade",
      "Recently serviced",
      "All accessories included",
      "Safety equipment included",
      "Instruction manual provided",
    ]),
    policies: JSON.stringify({
      cancellation: "48-hour notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear",
      safety: "Safety training video must be watched before use",
    }),
    images: JSON.stringify([`/images/tool-${index}.jpg`, `/images/tool-${index}-1.jpg`, `/images/tool-${index}-2.jpg`]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateSportsListing(index: number, renterId: string, location: string, period: string, basePrice: number) {
  const sportsTypes = ["Snowboard", "Kayak", "Golf Clubs", "Tennis Racket", "Camping Gear"]
  const title = `${sportsTypes[index - 1]} - High Quality for Rent`

  return {
    title,
    description: `High-quality ${sportsTypes[index - 1].toLowerCase()} available for rent. Perfect for weekend trips, trying a new sport, or occasional use. Well-maintained and ready for your next adventure.`,
    category: "Sports",
    price: basePrice * 1.8,
    period,
    deposit: basePrice * 2.5,
    location,
    features: JSON.stringify([
      "High-quality brand",
      "Well-maintained",
      "All necessary accessories included",
      "Size options available",
      "Cleaning kit included",
    ]),
    policies: JSON.stringify({
      cancellation: "72-hour notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear",
      cleaning: "Must be returned cleaned or cleaning fee applies",
    }),
    images: JSON.stringify([
      `/images/sports-${index}.jpg`,
      `/images/sports-${index}-1.jpg`,
      `/images/sports-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}

function generateDefaultListing(
  category: string,
  index: number,
  renterId: string,
  location: string,
  period: string,
  basePrice: number,
) {
  return {
    title: `${category} Item ${index} for Rent`,
    description: `Quality ${category.toLowerCase()} item available for rent. Perfect for temporary use or trying before buying.`,
    category,
    price: basePrice,
    period,
    deposit: basePrice * 2,
    location,
    features: JSON.stringify([
      "High quality",
      "Well-maintained",
      "All accessories included",
      "Delivery available",
      "Flexible rental terms",
    ]),
    policies: JSON.stringify({
      cancellation: "48-hour notice required for full refund",
      damage: "Renter responsible for damages beyond normal wear",
      delivery: "Delivery and pickup available for additional fee",
    }),
    images: JSON.stringify([
      `/images/placeholder-${index}.jpg`,
      `/images/placeholder-${index}-1.jpg`,
      `/images/placeholder-${index}-2.jpg`,
    ]),
    owner_id: renterId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "available",
  }
}
