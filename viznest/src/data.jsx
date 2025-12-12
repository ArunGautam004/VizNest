export const products = [
  {
    id: 1,
    name: "Minimalist Lounge Chair",
    price: 120,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
    // NEW: Gallery Images
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800", // Front
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800", // Side (Mock)
      "https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&q=80&w=800", // Lifestyle (Mock)
    ],
    mask: "/product111.png", 
    customizable: true,
    rating: 4.8,
    reviews: 124,
    description: "A perfect blend of modern minimalism and comfort. Built with an ergonomic frame and customizable upholstery options to match any living space.",
    details: [
      { label: "Dimensions", value: "H 32” x W 24” x D 24”" },
      { label: "Seat Height", value: "18 inches" },
      { label: "Frame Material", value: "Solid Kiln-Dried Ash Wood" },
      { label: "Upholstery", value: "Performance Fabric" },
      { label: "Weight Capacity", value: "300 lbs" },
      { label: "Assembly", value: "Minimal" }
    ]
  },
  {
    id: 2,
    name: "Ceramic Geometric Vase",
    price: 45,
    category: "Decor",
    image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1581783342308-f792ca43d5b1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800"
    ],
    customizable: true,
    rating: 4.5,
    reviews: 89,
    description: "Hand-crafted ceramic vase with distinct geometric lines. Perfect for dried flowers or as a standalone statement piece.",
    details: [
      { label: "Height", value: "12 inches" },
      { label: "Diameter", value: "6.5 inches" },
      { label: "Material", value: "Stoneware Ceramic" },
      { label: "Finish", value: "Matte Glaze" },
      { label: "Watertight", value: "Yes" }
    ]
  },
  {
    id: 3,
    name: "Abstract Wall Art",
    price: 80,
    category: "Art",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    images: [
       "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
       "https://images.unsplash.com/photo-1549887552-93f8efb871a5?auto=format&fit=crop&q=80&w=800"
    ],
    customizable: false,
    rating: 4.9,
    reviews: 215,
    description: "High-quality canvas print featuring abstract strokes. Adds a sophisticated touch to offices and living rooms.",
    details: [
      { label: "Dimensions", value: "24” x 36”" },
      { label: "Medium", value: "Giclée Print on Canvas" },
      { label: "Frame", value: "Floating Oak Frame" },
      { label: "Mounting", value: "Sawtooth hanger" }
    ]
  },
  {
    id: 4,
    name: "Velvet Accent Chair",
    price: 150,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800"
    ],
    customizable: true,
    rating: 4.7,
    reviews: 56,
    description: "Luxurious velvet texture meets mid-century design. The perfect reading chair for cozy corners.",
    details: [
      { label: "Dimensions", value: "H 34” x W 28” x D 29”" },
      { label: "Fabric", value: "100% Polyester Velvet" },
      { label: "Leg Material", value: "Brass-plated Steel" },
      { label: "Care", value: "Spot clean only" }
    ]
  }
];