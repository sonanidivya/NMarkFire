import { Category } from "@/types";

export const PRODUCT_CATALOG: Category[] = [
  {
    id: "fire-extinguishers",
    name: "Fire Extinguishers",
    slug: "fire-extinguishers",
    image: "/images/products/Fire Extinguishers/A/Semiautomatic_Extinguisher.svg",
    description: "Wide range of extinguishers for all classes of fire.",
    subcategories: [
      {
        id: "clean-agent",
        name: "Clean Agent Fire Extinguishers",
        slug: "clean-agent-extinguishers",
        image: "/images/products/Fire Extinguishers/A/Semiautomatic_Extinguisher.svg", // Using subcat image as main
        description: "Advanced series clean agent protection for sensitive equipment.",
        subcategories: [
           {
             id: "semiautomatic-extinguisher",
             name: "Semiautomatic Extinguishers",
             slug: "semiautomatic-extinguishers",
             image: "/images/products/Fire Extinguishers/A/Semiautomatic_Extinguisher.svg",
             description: "Advanced semiautomatic fire extinguisher for critical protection.",
             products: [
               { 
                 id: "portable-extinguisher", 
                 name: "Portable Extinguisher", 
                 slug: "portable-extinguisher", 
                 image: "/images/products/Fire Extinguishers/A/Semiautomatic_Extinguisher.svg",
                 description: "High-performance portable unit for rapid response.",
                 features: ["Advanced Sensing Technology", "Residue-Free Clean Agent", "Rapid Discharge Valve", "Lightweight Design", "Pressure Gauge Included"],
                 applications: ["Server Rooms", "Control Rooms", "Laboratories", "Electronic Storage", "Museums"],
                 specifications: { "Capacity": "2kg, 4kg, 6kg", "Agent": "Clean Agent (HFC-236fa)", "Discharge Time": "8-10 Seconds", "Operating Temp": "-20°C to +55°C" }
               },
               { 
                 id: "portable-non-magnetic", 
                 name: "Portable Extinguisher (Non-Magnetic)", 
                 slug: "portable-non-magnetic", 
                 description: "Non-magnetic variant designed specifically for MRI rooms.",
                 features: ["MRI Safe Construction", "Non-Magnetic Body", "Certified Safety", "Clean Agent", "Corrosion Resistant"],
                 applications: ["MRI Rooms", "Medical Imaging Centers", "Hospital Sensitivity Zones"],
                 specifications: { "Capacity": "4.5kg", "Material": "Non-magnetic Alloy", "Certification": "MRI Safe Certified" }
               }
             ]
           },
           {
            id: "modular-extinguisher",
            name: "Modular Fire Extinguishers",
            slug: "modular-fire-extinguishers",
            image: "/images/products/Fire Extinguishers/A/Modular_Fire_Extinguisher.svg",
            description: "Automatic ceiling mounted modular extinguisher.",
            products: [
              {
                id: "modular-unit",
                name: "Modular Unit",
                slug: "modular-unit",
                image: "/images/products/Fire Extinguishers/A/Modular_Fire_Extinguisher.svg",
                description: "Automatic modular protection for server rooms and enclosed spaces.",
                features: ["Automatic Thermal Activation", "Ceiling Mounted", "24/7 Protection", "No Electricity Required", "Easy Installation"],
                applications: ["Unmanned Server Rooms", "Electrical Panels", "Storage Units", "Generator Rooms"],
                specifications: { "Activation Temp": "68°C / 79°C", "Coverage Area": "Up to 10 sq. meters", "Agent": "Clean Agent" }
              }
            ]
           },
           {
            id: "trolley-system",
            name: "Trolley-Based Systems",
            slug: "trolley-based-systems",
            image: "/images/products/Fire Extinguishers/A/Trolley_Based.svg",
            description: "Mobile trolley based clean agent system for industrial use.",
            products: [
              {
                id: "trolley-unit",
                name: "Trolley Unit",
                slug: "trolley-unit",
                image: "/images/products/Fire Extinguishers/A/Trolley_Based.svg",
                description: "High capacity mobile unit for large facilities.",
                features: ["Heavy Duty Wheels for Mobility", "High Volume Agent", "Rapid Deployment", "One-Person Operation", "Industrial Grade Hose"],
                applications: ["Large Warehouses", "Industrial Plants", "Data Centers", "Airport Hangars"],
                specifications: { "Capacity": "25kg, 50kg", "Range": "10-15 Meters", "Discharge Time": "40-60 Seconds" }
              }
            ]
           }
        ]
      },
      {
        id: "water-silicate",
        name: "Water & Silicate Based",
        slug: "water-silicate-extinguishers",
        image: "/images/products/Fire Extinguishers/B/Water_&_Silicate_Based_Fire_Extinguisher.svg",
        description: "Eco-friendly safety equipment effective for Class A fires.",
        products: [
          {
            id: "water-co2-type",
            name: "Water CO2 Type Extinguisher",
            slug: "water-co2-type",
            image: "/images/products/Fire Extinguishers/B/Water_&_Silicate_Based_Fire_Extinguisher.svg",
            description: "Traditional water expelling extinguisher for solid fires.",
            features: ["Effective on Class A Fires", "Deep Penetration", "Rapid Cooling", "Easy Refilling", "ISI Marked"],
            applications: ["Paper Mills", "Textile Warehouses", "Lumber Yards", "Coal Mines"],
            specifications: { "Capacity": "9 Liters", "Jet Range": "6 Meters", "Discharge Time": "60-120 Sec", "Test Pressure": "25 Bar" }
          },
          {
            id: "water-mist",
            name: "Water Mist Extinguisher",
            slug: "water-mist",
            image: "/images/products/Fire Extinguishers/B/Water_&_Silicate_Based_Fire_Extinguisher.svg",
            description: "Advanced fine mist technology for broad fire efficacy.",
            features: ["Electrically Safe (up to 1000V)", "No Thermal Shock", "Minimal Water Damage", "Class A & F Effective", "Environmentally Neutral"],
            applications: ["Historical Archives", "Museums", "Hospitals", "Clean Rooms", "Offices"],
            specifications: { "Droplet Size": "<1000 microns", "Capacity": "6L, 9L", "Discharge Time": ">15 Sec", "Throw": "3-5 Meters" }
          }
        ]
      },
      {
        id: "abc-extinguishers",
        name: "ABC Fire Extinguishers",
        slug: "abc-fire-extinguishers",
        image: "/images/products/Fire Extinguishers/C/Semiautomatic_Extinguisher.svg",
        description: "Multipurpose extinguishers for Class A, B, and C fires.",
        subcategories: [
          {
            id: "abc-semiauto",
            name: "Semiautomatic Extinguishers",
            slug: "abc-semiautomatic",
            image: "/images/products/Fire Extinguishers/C/Semiautomatic_Extinguisher.svg",
            products: [{ 
              id: "abc-semiauto-unit", 
              name: "Semiautomatic Unit", 
              slug: "abc-semiautomatic-unit", 
              image: "/images/products/Fire Extinguishers/C/Semiautomatic_Extinguisher.svg", 
              description: "Standard MAP-90 based unit for effective fire suppression.", 
              features: ["MAP-90 Powder", "ISI Marked", "Multipurpose Use (A, B, C)", "Easy Maintenance"],
              applications: ["Offices", "Industrial Floors", "Warehouses", "Residential Buildings"],
              specifications: { "Capacity": "4kg, 6kg, 9kg", "Agent": "Mono Ammonium Phosphate", "Burst Pressure": "50 Bar" }
            }]
          },
          {
             id: "abc-modular",
             name: "Modular Fire Extinguishers",
             slug: "abc-modular",
             image: "/images/products/Fire Extinguishers/C/Modular_Fire_Extinguisher.svg",
             products: [{ 
               id: "abc-modular-unit", 
               name: "Modular Unit", 
               slug: "abc-modular-unit", 
               image: "/images/products/Fire Extinguishers/C/Modular_Fire_Extinguisher.svg", 
               description: "Automatic ABC protection unit for unattended areas.", 
               features: ["Thermal Activation", "Unattended Safety", "Ceiling Mounted", "Wide Coverage"],
               applications: ["Storage Rooms", "Diesel Generators", "Transform Rooms"],
               specifications: { "Activation": "68 deg C", "Coverage": "6-8 sq meters" }
             }]
          },
          {
             id: "abc-trolley",
             name: "Trolley-Based Systems",
             slug: "abc-trolley",
             image: "/images/products/Fire Extinguishers/C/Trolley_Based.svg",
             products: [{ 
               id: "abc-trolley-unit", 
               name: "Trolley Unit", 
               slug: "abc-trolley-unit", 
               image: "/images/products/Fire Extinguishers/C/Trolley_Based.svg", 
               description: "Heavy duty ABC trolley for large industrial plants.", 
               features: ["Large Coverage", "Easy Mobility", "Rapid Action", "Industrial Grade"],
               applications: ["Factories", "Large Warehouses", "Construction Sites"],
               specifications: { "Capacity": "25kg, 50kg, 75kg", "Propellant": "Nitrogen" }
             }]
          }
        ]
      },
      {
        id: "foam-extinguishers",
        name: "Foam Fire Extinguishers",
        slug: "foam-fire-extinguishers",
        image: "/images/products/Fire Extinguishers/D/Semiautomatic_Extinguisher.svg",
        description: "Ideal for Class A and Class B fires, forming a sealing blanket.",
        subcategories: [
           { id: "foam-semiauto", name: "Semiautomatic Extinguishers", slug: "foam-semiauto", image: "/images/products/Fire Extinguishers/D/Semiautomatic_Extinguisher.svg", products: [{ 
             id: "foam-semiauto-unit", 
             name: "Semiautomatic Unit", 
             slug: "foam-semiauto-unit", 
             image: "/images/products/Fire Extinguishers/D/Semiautomatic_Extinguisher.svg", 
             description: "AFFF Foam based unit for liquid fires.", 
             features: ["AFFF Foam Technology", "Class A/B Effective", "Durable Coating", "Easy Operation"],
             applications: ["Petrochemical Plants", "Fuel Stations", "Paint Shops"],
             specifications: { "Capacity": "9 Liters", "Agent": "AFFF 3%", "Discharge Time": "30-45 Sec" }
           }] },
           { id: "foam-trolley", name: "Trolley-Based Systems", slug: "foam-trolley", image: "/images/products/Fire Extinguishers/D/Trolley_Based.svg", products: [{ 
             id: "foam-trolley-unit", 
             name: "Trolley Unit", 
             slug: "foam-trolley-unit", 
             image: "/images/products/Fire Extinguishers/D/Trolley_Based.svg", 
             description: "Mobile foam suppression unit for large spills.", 
             features: ["High Capacity Foam Generation", "Industrial Grade Chassis", "Long Range Nozzle", "Quick Response"],
             applications: ["Refineries", "Aviation Hangars", "Oil Depots"],
             specifications: { "Capacity": "50L, 100L", "Foam Expansion": "Low/Medium", "Hose Length": "15m" }
           }] }
        ]
      },
      { 
        id: "co2-extinguishers", 
        name: "CO₂ Fire Extinguishers", 
        slug: "co2-fire-extinguishers", 
        image: "/images/products/Fire Extinguishers/E/CO₂_Fire_Extinguishers.svg", 
        description: "Clean, non-conductive protection for electrical fires.",
        products: [
          {
            id: "co2-2kg",
            name: "CO2 Extinguisher 2kg (Aluminum)",
            slug: "co2-2kg",
            image: "/images/products/Fire Extinguishers/E/CO₂_Fire_Extinguishers.svg",
            description: "Lightweight aluminum CO2 extinguisher for electrical risks.",
            features: ["Non-Conductive Agent", "No Residue", "Lightweight Aluminum Body", "Squeeze Grip Operation", "Effective on Class B & E"],
            applications: ["Server Rooms", "Electrical Labs", "Offices with Computers", "Kitchens (Small)"],
            specifications: { "Capacity": "2kg", "Material": "Aluminum / Manganese Steel", "Discharge Time": "8-12 Sec", "Range": "1-2 Meters" }
          },
          {
            id: "co2-4-5kg",
            name: "CO2 Extinguisher 4.5kg",
            slug: "co2-4-5kg",
            image: "/images/products/Fire Extinguishers/E/CO₂_Fire_Extinguishers.svg",
            description: "Standard industrial size CO2 cylinder for higher risks.",
            features: ["High Pressure Suppression", "Industrial Grade Valve", "Harmless to Machinery", "Frost-Free Horn"],
            applications: ["Industrial Electrical Panels", "Generator Rooms", "Manufacturing Floors", "Machine Shops"],
            specifications: { "Capacity": "4.5kg", "Burst Pressure": "250 Bar", "Discharge Time": "10-15 Sec", "Purity": "99.9% CO2" }
          }
        ]
      },
      { 
        id: "li-ion-extinguishers", 
        name: "Lithium-Ion Fire Extinguishers", 
        slug: "lithium-ion-fire-extinguishers", 
        image: "/images/products/Fire Extinguishers/F/Lithium_Ion_Fire_Extinguisher.svg", 
        description: "Specialized for battery fires (Class D).",
        products: [
          {
            id: "li-ion-avd",
            name: "Lithium-Ion Fire Extinguisher (AVD)",
            slug: "li-ion-avd",
            image: "/images/products/Fire Extinguishers/F/Lithium_Ion_Fire_Extinguisher.svg",
            description: "Revolutionary Aqueous Vermiculite Dispersion agent for battery fires.",
            features: ["Encapsulates Fuel Source", "High Cooling Properties", "Prevents Thermal Runaway", "Non-Toxic", "Dielectric up to 35kV"],
            applications: ["EV Charging Stations", "Battery Storage Areas", "Laptop/Mobile Stores", "E-Bike Repair Shops"],
            specifications: { "Agent": "Aqueous Vermiculite Dispersion", "Capacity": "2L, 6L, 9L", "Temperature Range": "+5°C to +60°C", "Fire Rating": "Lithium Battery Fires" }
          }
        ] 
      },
      { 
        id: "f-class-extinguishers", 
        name: "Class F Fire Extinguishers", 
        slug: "f-class-fire-extinguishers", 
        image: "/images/products/Fire Extinguishers/G/F_Class_Fire_Extinguisher.svg", 
        description: "Kitchen safety for cooking oil fires.",
        products: [
          {
            id: "wet-chemical-6l",
            name: "Wet Chemical Extinguisher",
            slug: "wet-chemical-6l",
            image: "/images/products/Fire Extinguishers/G/F_Class_Fire_Extinguisher.svg",
            description: "Specialized wet chemical agent for high-temp cooking oil fires.",
            features: ["Saponification Effect", "Cools Burning Oil", "Prevents Re-Flash", "Lance Applicator for Safety", "Class A & F Capability"],
            applications: ["Commercial Kitchens", "Fryers", "Fast Food Outlets", "Bakeries"],
            specifications: { "Capacity": "3L, 6L", "Agent": "Wet Chemical (Potassium Salt)", "Working Pressure": "14 Bar", "Cylinder": "Stainless Steel / Coated" }
          }
        ]
      },
      { 
        id: "wet-agent-extinguishers", 
        name: "Wet Agent Fire Extinguishers", 
        slug: "wet-agent-fire-extinguishers",
        image: "/images/products/Fire Extinguishers/H/Wet_Agent_Fire_Extinguisher.svg",
        description: "Specifically designed for deep fat fryer fires.",
        products: [
          {
            id: "wet-agent-kitchen",
            name: "Professional Kitchen Fire Extinguisher",
            slug: "wet-agent-kitchen",
            image: "/images/products/Fire Extinguishers/H/Wet_Agent_Fire_Extinguisher.svg",
            description: "High-performance wet agent for industrial kitchen safety.",
            features: ["Rapid Knockdown", "Safe on Electrical Equipment (Low Voltage)", "User Friendly", "High Purity Agent"],
            applications: ["Industrial Food Processing", "Large Canteens", "Hotel Kitchens"],
            specifications: { "Capacity": "6L, 9L", "Rating": "75F", "Material": "Anti-Corrosive Lining", "Discharge": "Fine Mist Spray" }
          }
        ]
      },
    ],
  },
  {
    id: "fire-suppression",
    name: "Fire Suppression Systems",
    slug: "fire-suppression-system",
    image: "/images/products/Fire Suppression Systems/Total Flooding Systems/Clean Agent Flooding System/Clean_Agent_Flooding_System.svg",
    description: "Advanced automated systems for critical infrastructure.",
    subcategories: [
      {
        id: "heat-sensing-tube",
        name: "Heat Sensing Tube Systems",
        slug: "heat-sensing-tube-systems",
        image: "/images/products/Fire Suppression Systems/Heat Sensing Tube Systems/Heat_Sensing_Tube_System.svg",
        description: "Direct detection tubing for micro-environments.",
        products: [
             { 
               id: "clean-agent-tubing", 
               name: "Clean Agent Tubing System", 
               slug: "clean-agent-tubing", 
               description: "Direct low pressure DLP system for panels.", 
               image: "/images/products/Fire Suppression Systems/Heat Sensing Tube Systems/Heat_Sensing_Tube_System.svg", 
               features: ["DLP Technology", "Panel Protection", "Source Detection", "No External Power"],
               applications: ["Electrical Cabinets", "CNC Machines", "Fume Hoods"],
               specifications: { "Tube Material": "Polymer", "Burst Temp": "110°C", "Agent": "Novec 1230 / FM200" }
             },
             { 
               id: "co2-tubing", 
               name: "CO₂-Based Tubing System", 
               slug: "co2-tubing", 
               description: "CO2 based detection tube for electrical panels.", 
               image: "/images/products/Fire Suppression Systems/Heat Sensing Tube Systems/CO₂-Based Tubing System/CO₂-Based Tubing System_(Direct System).svg", 
               features: ["Rapid Cooling Effect", "Non-Conductive Agent", "Zero Residue", "Cost Effective"],
               applications: ["Transformer Panels", "Welding Machines", "Switchgears"],
               specifications: { "Agent": "CO2", "Cylinder": "Seamless Steel", "Valve": "Brass Direct Valve" }
             }
        ]
      },
      {
        id: "total-flooding",
        name: "Total Flooding Systems",
        slug: "total-flooding-systems",
        image: "/images/products/Fire Suppression Systems/Total Flooding Systems/Clean Agent Flooding System/Clean_Agent_Flooding_System.svg",
        description: "Complete room protection with rapid discharge.",
        products: [
            { 
              id: "clean-agent-flooding", 
              name: "Clean Agent Flooding System", 
              slug: "clean-agent-flooding", 
              description: "Whole-room protection without residue.", 
              image: "/images/products/Fire Suppression Systems/Total Flooding Systems/Clean Agent Flooding System/Clean_Agent_Flooding_System.svg", 
              features: ["FM200 / Novec Agent", "People Safe", "Environmentally Friendly", "Rapid Extinguishment (<10s)"],
              applications: ["Data Centers", "Archives", "Control Rooms", "Telecommunication Facilities"],
              specifications: { "Design Standard": "NFPA 2001", "Agent": "FK-5-1-12", "System Pressure": "25/42 Bar" }
            },
            { 
              id: "co2-flooding", 
              name: "CO₂ Flooding System", 
              slug: "co2-flooding", 
              description: "High pressure CO2 flooding for unoccupied spaces.", 
              image: "/images/products/Fire Suppression Systems/Total Flooding Systems/CO₂ Flooding System/CO₂_Flooding_System.svg", 
              features: ["High Pressure Suppression", "Industrial Compatible", "Deep Seated Fires", "Non-Conductive"],
              applications: ["Engine Rooms", "Paint Stores", "Quench Tanks", "Record Rooms (Unoccupied)"],
              specifications: { "Agent": "High Pressure CO2", "Activation": "Electric/Pneumatic/Manual", "Standard": "NFPA 12" }
            }
        ]
      },
      { 
        id: "kitchen-suppression", 
        name: "Kitchen Suppression Systems", 
        slug: "kitchen-suppression-systems", 
        image: "/images/products/Fire Suppression Systems/Kitchen Suppression Systems/Kitchen_Suppression_Systems.svg", 
        description: "Commercial kitchen hood protection.",
        products: [{
          id: "kitchen-system-unit",
          name: "Kitchen Suppression System",
          slug: "kitchen-system-unit",
          image: "/images/products/Fire Suppression Systems/Kitchen Suppression Systems/Kitchen_Suppression_Systems.svg",
          description: "Wet chemical suppression for grease and oil fires.",
          features: ["Rapid Flame Knockdown", "Cooling Effect", "Automatic Activation", "Stainless Steel Components"],
          applications: ["Commercial Kitchens", "Restaurants", "Food Courts", "Hotel Kitchens"],
          specifications: { "Agent": "Wet Chemical", "Actuation": "Automatic/Manual", "Cylinder": "Stainless Steel" }
        }]
      },
      { 
        id: "oil-quenching", 
        name: "Oil Quenching Suppression Systems", 
        slug: "oil-quenching-suppression-systems", 
        image: "/images/products/Fire Suppression Systems/Oil Quenching Suppression Systems/Oil_Quenching_Suppression_Systems.svg", 
        description: "Specialized for industrial oil quenching tanks.",
        products: [{
          id: "oil-quenching-unit",
          name: "Oil Quenching System",
          slug: "oil-quenching-unit",
          image: "/images/products/Fire Suppression Systems/Oil Quenching Suppression Systems/Oil_Quenching_Suppression_Systems.svg",
          description: "CO2 or Foam based protection for quench tanks.",
          features: ["Heat Detection", "Rapid CO2/Foam Discharge", "Prevents Re-ignition", "Industrial Build"],
          applications: ["Heat Treatment Plants", "Automotive Manufacturing", "Metal Works"],
          specifications: { "Agent": "CO2 / Foam", "Detection": "Heat Sensors", "Control": "Automatic Panel" }
        }]
      },
    ],
  },
  {
    id: "hydrant-sprinkler",
    name: "Hydrant & Sprinkler Systems",
    slug: "hydrant-sprinkler-systems",
    image: "/images/products/Hydrant_Sprinkler_Systems/Hydrant_&_Sprinkler_Systems.svg",
    description: "Conventional water-based building protection.",
    products: [
      {
        id: "hydrant-system",
        name: "Fire Hydrant System",
        slug: "hydrant-system",
        image: "/images/products/Hydrant_Sprinkler_Systems/Hydrant_&_Sprinkler_Systems.svg",
        description: "Complete hydrant network for external fire protection.",
        features: ["High Pressure Capability", "External Protection", "Durable Cast Iron/SS", "Multiple Outlets", "Weather Resistant"],
        applications: ["Commercial Complexes", "Residential Societies", "Industrial Parks", "Public Spaces"],
        specifications: { "Pressure": "7-10 Bar", "Material": "Cast Iron / SS", "Outlet": "Single/Double Sluice Valve" }
      },
      {
        id: "sprinkler-system",
        name: "Automatic Sprinkler System",
        slug: "sprinkler-system",
        image: "/images/products/Hydrant_Sprinkler_Systems/Hydrant_&_Sprinkler_Systems.svg",
        description: "Ceiling mounted sprinkler network for automatic suppression.",
        features: ["Heat Activated Bulb", "Wide Coverage Area", "Automatic Operation", "Various Temperature Ratings"],
        applications: ["Offices", "Malls", "Hotels", "Basement Parking", "Warehouses"],
        specifications: { "Bulb Temp": "68°C (Red)", "K-Factor": "5.6 / 8.0", "Type": "Pendant / Upright / Sidewall" }
      }
    ]
  },
  {
    id: "fall-protection",
    name: "Fall Protection Systems",
    slug: "fall-protection-systems",
    image: "/images/products/Fall Protection Systems/Fall_Protection.svg",
    description: "Safety harnesses and lifelines for working at heights.",
    products: [
      {
        id: "safety-harness",
        name: "Full Body Harness",
        slug: "safety-harness",
        image: "/images/products/Fall Protection Systems/Fall_Protection.svg",
        description: "Certified safety harness for industrial height safety.",
        features: ["ISI Marked", "Shock Absorber Lanyard", "Full Body Support", "Adjustable Straps", "High Visibility"],
        applications: ["Construction Sites", "Window Cleaning", "Roof Maintenance", "Tower Climbing"],
        specifications: { "Standard": "IS 3521:1999", "Webbing": "Polyester 44mm", "Capacity": "100kg" }
      }
    ]
  }
];
