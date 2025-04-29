import { supabase } from "@/lib/supabase"

// Categories we want to seed
const categories = ["Furniture", "Electronics", "Vehicles", "Photography", "Clothing", "Appliances", "Tools", "Sports"]

// Sample locations
const locations = [
  "Kothrud, Pune",
  "Baner, Pune",
  "Hinjewadi, Pune",
  "Aundh, Pune",
  "Viman Nagar, Pune",
  "Koregaon Park, Pune",
  "Shivaji Nagar, Pune",
  "Hadapsar, Pune",
]

// Sample periods
const periods = ["day", "week", "month"]

// Generate random features for each category
function getFeatures(category: string): string[] {
  const featuresByCategory: Record<string, string[]> = {
    Furniture: [
      "Solid wood construction",
      "Stain-resistant fabric",
      "Ergonomic design",
      "Easy assembly",
      "Adjustable height",
      "Foldable",
      "Water-resistant finish",
      "Cushioned seating",
      "Storage compartments",
      "Modular design",
    ],
    Electronics: [
      "4K resolution",
      "Wireless connectivity",
      "Bluetooth 5.0",
      "Fast charging",
      "Water-resistant",
      "Voice control",
      "Long battery life",
      "Noise cancellation",
      "Smart features",
      "Energy efficient",
    ],
    Vehicles: [
      "Fuel efficient",
      "GPS navigation",
      "Bluetooth connectivity",
      "Reverse camera",
      "Cruise control",
      "Leather seats",
      "Sunroof",
      "Alloy wheels",
      "ABS braking",
      "Climate control",
    ],
    Photography: [
      "4K video recording",
      "Image stabilization",
      "Interchangeable lenses",
      "Weather-sealed body",
      "Touchscreen display",
      "Wi-Fi connectivity",
      "High ISO performance",
      "Fast autofocus",
      "External flash support",
      "Time-lapse feature",
    ],
    Clothing: [
      "Premium fabric",
      "Water-resistant",
      "Breathable material",
      "Adjustable fit",
      "Machine washable",
      "UV protection",
      "Wrinkle-free",
      "Stain-resistant",
      "Quick-dry technology",
      "Eco-friendly material",
    ],
    Appliances: [
      "Energy efficient",
      "Smart controls",
      "Quiet operation",
      "Multiple settings",
      "Easy to clean",
      "Compact design",
      "Digital display",
      "Timer function",
      "Auto shut-off",
      "Child lock feature",
    ],
    Tools: [
      "Ergonomic grip",
      "Cordless operation",
      "Variable speed",
      "LED work light",
      "Battery included",
      "Carrying case",
      "Dust collection",
      "Quick-change system",
      "Brushless motor",
      "Impact resistant",
    ],
    Sports: [
      "Lightweight design",
      "Water-resistant",
      "Adjustable straps",
      "Shock absorption",
      "Anti-slip grip",
      "Breathable material",
      "Reflective elements",
      "Quick-release mechanism",
      "Padded protection",
      "All-weather use",
    ],
  }

  // Get features for the category or use generic features
  const availableFeatures = featuresByCategory[category] || [
    "High quality",
    "Durable construction",
    "Easy to use",
    "Compact design",
    "Versatile functionality",
  ]

  // Select 3-5 random features
  const numFeatures = Math.floor(Math.random() * 3) + 3 // 3 to 5 features
  const selectedFeatures: string[] = []

  while (selectedFeatures.length < numFeatures) {
    const randomIndex = Math.floor(Math.random() * availableFeatures.length)
    const feature = availableFeatures[randomIndex]
    if (!selectedFeatures.includes(feature)) {
      selectedFeatures.push(feature)
    }
  }

  return selectedFeatures
}

// Generate random policies
function getPolicies(): string[] {
  const allPolicies = [
    "24-hour cancellation policy",
    "Security deposit required",
    "ID verification required",
    "No smoking",
    "No pets",
    "Return in original condition",
    "Late return fees apply",
    "Damage fees may apply",
    "Delivery available for additional fee",
    "Minimum rental period: 1 day",
    "Maximum rental period: 30 days",
    "Insurance recommended",
  ]

  // Select 2-4 random policies
  const numPolicies = Math.floor(Math.random() * 3) + 2 // 2 to 4 policies
  const selectedPolicies: string[] = []

  while (selectedPolicies.length < numPolicies) {
    const randomIndex = Math.floor(Math.random() * allPolicies.length)
    const policy = allPolicies[randomIndex]
    if (!selectedPolicies.includes(policy)) {
      selectedPolicies.push(policy)
    }
  }

  return selectedPolicies
}

// Generate placeholder images for each category
function getImages(category: string): string[] {
  // In a real app, these would be actual image URLs
  // For now, we'll use placeholder images with category-specific text
  const numImages = Math.floor(Math.random() * 3) + 2 // 2 to 4 images
  const images: string[] = []

  for (let i = 0; i < numImages; i++) {
    images.push(`/placeholder.svg?height=300&width=300&text=${category}+${i + 1}`)
  }

  return images
}

// Generate listings for each category
function generateListings(ownerId: string) {
  const listings: any[] = []

  // Sample titles for each category
  const titlesByCategory: Record<string, string[]> = {
    Furniture: [
      "Modern Ergonomic Office Chair",
      "Scandinavian Design Sofa",
      "Solid Wood Dining Table",
      "Adjustable Standing Desk",
      "Minimalist Bookshelf",
      "Memory Foam Mattress",
      "Reclining Lounge Chair",
      "Glass Coffee Table",
      "Storage Ottoman",
      "Bunk Bed with Desk",
    ],
    Electronics: [
      "MacBook Pro 16-inch",
      "Sony 65-inch 4K Smart TV",
      "DJI Mavic Air 2 Drone",
      "PlayStation 5 Console",
      "Bose Noise Cancelling Headphones",
      "iPad Pro 12.9-inch",
      "Samsung Galaxy S22 Ultra",
      "Nintendo Switch OLED",
      "GoPro Hero 10 Black",
      "Dell XPS 15 Laptop",
    ],
    Vehicles: [
      "Royal Enfield Classic 350",
      "Honda Activa 6G",
      "Toyota Innova Crysta",
      "Maruti Suzuki Swift",
      "Hyundai Creta",
      "KTM Duke 390",
      "Bajaj Pulsar NS200",
      "Mahindra Thar",
      "Honda City",
      "Yamaha FZ-S",
    ],
    Photography: [
      "Canon EOS R5 Camera",
      "Sony Alpha A7 III",
      "DJI Ronin Gimbal Stabilizer",
      "Godox Studio Lighting Kit",
      "Nikon Z6 II Mirrorless Camera",
      "Canon 70-200mm f/2.8 Lens",
      "Manfrotto Tripod",
      "Profoto B10 Flash Kit",
      "DJI Osmo Pocket",
      "GoPro Max 360 Camera",
    ],
    Clothing: [
      "Designer Wedding Dress",
      "Men's Formal Suit",
      "Traditional Saree Collection",
      "Winter Jacket Set",
      "Branded Handbag Collection",
      "Luxury Watch Collection",
      "Formal Shoes Collection",
      "Designer Jewelry Set",
      "Premium Sunglasses Collection",
      "Ethnic Wear Collection",
    ],
    Appliances: [
      "Dyson V11 Vacuum Cleaner",
      "Instant Pot Pressure Cooker",
      "Samsung Double Door Refrigerator",
      "Bosch Front Load Washing Machine",
      "Philips Air Purifier",
      "Morphy Richards Oven",
      "Kaff Kitchen Chimney",
      "IFB Microwave Oven",
      "Kent RO Water Purifier",
      "Havells Air Conditioner",
    ],
    Tools: [
      "Bosch Professional Drill Set",
      "DeWalt Power Tool Combo Kit",
      "Honda Portable Generator",
      "Makita Circular Saw",
      "Stanley Tool Box Set",
      "Karcher Pressure Washer",
      "Hitachi Angle Grinder",
      "Black & Decker Jigsaw",
      "Craftsman Mechanics Tool Set",
      "Milwaukee Impact Driver",
    ],
    Sports: [
      "Trek Mountain Bike",
      "Yonex Badminton Set",
      "Wilson Tennis Racket",
      "Adidas Football Kit",
      "Camping Tent & Gear",
      "Golf Club Set",
      "Fitness Equipment Package",
      "Yoga & Pilates Set",
      "Cricket Kit with Bat & Pads",
      "Treadmill & Exercise Bike",
    ],
  }

  // Sample descriptions for each category
  const descriptionsByCategory: Record<string, string[]> = {
    Furniture: [
      "Ergonomic design with adjustable height and lumbar support. Perfect for work-from-home setups.",
      "Comfortable 3-seater sofa with premium fabric upholstery. Ideal for modern living rooms.",
      "Handcrafted solid wood dining table that seats 6 people comfortably. Elegant and durable.",
      "Electric standing desk with memory settings. Smooth height adjustment for ergonomic working.",
      "Minimalist bookshelf with 5 shelves. Perfect for organizing books and displaying decorative items.",
    ],
    Electronics: [
      "Latest model with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professionals and creatives.",
      "4K Ultra HD Smart TV with HDR and built-in streaming apps. Immersive viewing experience.",
      "4K camera drone with 3-axis gimbal, 48MP camera, and 34-minute flight time. Includes carrying case.",
      "Next-gen gaming console with ultra-high speed SSD, ray tracing, and 4K gaming support. Includes controller.",
      "Wireless noise cancelling headphones with 20-hour battery life and comfortable over-ear design.",
    ],
    Vehicles: [
      "Classic motorcycle with 350cc engine, perfect for weekend rides. Includes helmet and riding gloves.",
      "Popular scooter with excellent mileage. Easy to ride and perfect for city commuting.",
      "7-seater SUV with automatic transmission. Ideal for family trips and comfortable long drives.",
      "Compact hatchback with great fuel efficiency. Perfect for city driving and easy parking.",
      "Feature-packed SUV with panoramic sunroof and advanced safety features. Comfortable for long journeys.",
    ],
    Photography: [
      "Professional mirrorless camera with 45MP sensor, 8K video, and advanced autofocus. Includes 24-105mm lens.",
      "Full-frame mirrorless camera with excellent low-light performance. Includes 28-70mm kit lens.",
      "3-axis stabilizer for DSLRs and mirrorless cameras. Smooth footage for professional video production.",
      "Complete studio lighting setup with softboxes, stands, and wireless triggers. Perfect for portrait photography.",
      "Full-frame mirrorless camera with 24MP sensor and 5-axis stabilization. Great for photo and video.",
    ],
    Clothing: [
      "Designer wedding dress with intricate embroidery and beadwork. Perfect for your special day.",
      "Premium tailored suit in navy blue. Includes jacket, trousers, and waistcoat. Ideal for formal events.",
      "Collection of 5 designer sarees in different fabrics and styles. Perfect for weddings and special occasions.",
      "Set of winter jackets for different weather conditions. Includes waterproof and insulated options.",
      "Collection of 3 luxury handbags from top designers. Perfect accessories for special events.",
    ],
    Appliances: [
      "Cordless vacuum with powerful suction and up to 60 minutes of run time. Includes multiple attachments.",
      "Multi-functional electric pressure cooker with 9-in-1 functionality. Perfect for quick and easy meals.",
      "Energy-efficient refrigerator with 500L capacity and smart cooling technology.",
      "8kg capacity washing machine with multiple wash programs and energy-efficient operation.",
      "HEPA air purifier suitable for rooms up to 500 sq ft. Removes 99.97% of airborne particles.",
    ],
    Tools: [
      "Professional 18V cordless drill set with multiple drill bits and carrying case.",
      "5-piece power tool set including drill, circular saw, impact driver, reciprocating saw, and flashlight.",
      "Portable inverter generator with 2200W output. Quiet operation and fuel efficient.",
      "7-1/4 inch circular saw with laser guide and 5800 RPM motor. Includes carrying case.",
      "Comprehensive 210-piece tool set with ratchets, sockets, wrenches, and more in a durable case.",
    ],
    Sports: [
      "High-performance mountain bike with front suspension and disc brakes. Suitable for trails and off-road riding.",
      "Complete badminton set with 4 rackets, shuttlecocks, and carrying bag. Perfect for recreational play.",
      "Professional tennis racket with vibration dampening technology. Includes racket cover.",
      "Complete football kit including ball, pump, training cones, and portable goal. Great for practice.",
      "4-person camping tent with rainfly, groundsheet, and storage pockets. Easy setup and takedown.",
    ],
  }

  categories.forEach((category) => {
    const titles = titlesByCategory[category] || [`${category} Item`]
    const descriptions = descriptionsByCategory[category] || [`High-quality ${category.toLowerCase()} item for rent.`]

    for (let i = 0; i < 5; i++) {
      const titleIndex = i < titles.length ? i : i % titles.length
      const descIndex = i < descriptions.length ? i : i % descriptions.length

      const price = Math.floor(Math.random() * 9000) + 1000 // 1000 to 10000
      const deposit = Math.floor(price * 1.5) // 1.5x the price
      const periodIndex = Math.floor(Math.random() * periods.length)
      const locationIndex = Math.floor(Math.random() * locations.length)

      listings.push({
        title: titles[titleIndex],
        description: descriptions[descIndex],
        category,
        price,
        period: periods[periodIndex],
        deposit,
        owner_id: ownerId,
        location: locations[locationIndex],
        features: getFeatures(category),
        policies: getPolicies(),
        images: getImages(category),
        available: true,
      })
    }
  })

  return listings
}

// Seed the database with listings
export async function seedListings() {
  try {
    // First, check if we already have listings
    const { count, error: countError } = await supabase.from("products").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking existing listings:", countError)
      return { success: false, error: countError }
    }

    // If we already have a significant number of listings, don't seed
    if (count && count > 20) {
      console.log(`Database already has ${count} listings, skipping seed`)
      return { success: true, message: "Database already seeded" }
    }

    // Get a user to be the owner of the listings
    // First try to get a user with role 'renter'
    const { data: renters, error: renterError } = await supabase
      .from("users")
      .select("id")
      .eq("role", "renter")
      .limit(1)

    if (renterError) {
      console.error("Error fetching renters:", renterError)
      return { success: false, error: renterError }
    }

    // If no renters found, get any user
    let ownerId: string
    if (renters && renters.length > 0) {
      ownerId = renters[0].id
    } else {
      const { data: users, error: userError } = await supabase.from("users").select("id").limit(1)

      if (userError || !users || users.length === 0) {
        console.error("Error fetching users:", userError)
        return { success: false, error: userError || new Error("No users found") }
      }

      ownerId = users[0].id
    }

    // Generate listings
    const listings = generateListings(ownerId)

    // Insert listings in batches to avoid hitting request size limits
    const batchSize = 10
    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize)
      const { error: insertError } = await supabase.from("products").insert(batch)

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError)
        return { success: false, error: insertError }
      }
    }

    return { success: true, count: listings.length }
  } catch (error) {
    console.error("Error seeding listings:", error)
    return { success: false, error }
  }
}
