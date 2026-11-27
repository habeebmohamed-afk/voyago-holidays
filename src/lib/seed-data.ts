import type {
  BookingRecord,
  CustomizationLead,
  HeatMapDeparture,
  HeatMapTier,
  IdVerificationItem,
  TravelPackage,
} from "@/types";

export const SEED_PACKAGES: TravelPackage[] = [
  {
    slug: "rishikesh-rafting-girls-escape",
    title: "Rishikesh Whitewater & Café Retreat",
    location: "Rishikesh, Uttarakhand",
    scope: "Domestic",
    cohort: "Girls-only",
    theme: "Adventurous",
    duration: "3N / 4D",
    priceInr: 14500,
    heatMapSummary: "Trending (12 booked)",
    bookedPreview: 12,
    summary:
      "Grade-III Ganga rafting, riverside yoga, Tapovan café hopping, and curated bonfire evenings with a verified girls-only cohort.",
    gradient: "from-[#1B8A8F] via-[#155E75] to-[#132352]",
    highlights: [
      "16 km Shivpuri to NIM Beach whitewater rafting",
      "Verified female trip captain & 24-hr ID-checked cohort",
      "Boutique Tapovan stay + curated sunset café trail",
      "Triveni Ghat Ganga Aarti & Neer Garh Waterfall hike",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Rishikesh & Tapovan Café Crawl",
        stay: "Boutique Riverside Retreat, Tapovan",
        meals: "Welcome Drink & Dinner",
        transport: "AC Tempo Traveller from Dehradun/Haridwar",
        activities: [
          "Check-in and cohort ice-breaker circle",
          "Guided walk across Laxman Jhula & sunset café hopping",
          "Acoustic bonfire evening at the retreat",
        ],
      },
      {
        day: 2,
        title: "Grade-III Ganga Rafting & Cliff Jump",
        stay: "Boutique Riverside Retreat, Tapovan",
        meals: "Breakfast & Dinner",
        transport: "Local Rafting Transfer",
        activities: [
          "Morning riverside yoga & breathwork",
          "16 km whitewater rafting expedition with certified safety kayakers",
          "Evening Triveni Ghat Ganga Aarti experience",
        ],
      },
      {
        day: 3,
        title: "Neer Garh Waterfall Trek & Beatles Ashram",
        stay: "Boutique Riverside Retreat, Tapovan",
        meals: "Breakfast & Farewell Dinner",
        transport: "AC Local Transfer",
        activities: [
          "Scenic forest trail to Neer Garh Waterfall",
          "Guided visit to Beatles Ashram & Parmarth Niketan",
          "Farewell cohort dinner overlooking the Ganga",
        ],
      },
      {
        day: 4,
        title: "Slow Morning & Departure",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Drop to Dehradun Airport / Haridwar Station",
        activities: [
          "Optional sunrise meditation & souvenir stroll",
          "Group transfer back for onward journeys",
        ],
      },
    ],
    inclusions: [
      "3 nights twin-sharing boutique stay in Tapovan",
      "Daily breakfast & 3 curated dinners",
      "16 km rafting with gear, guide & safety kayaker",
      "Dedicated verified female trip lead",
      "All local sightseeing transfers",
    ],
    exclusions: [
      "Flights or train tickets to Dehradun/Haridwar",
      "Personal café orders & optional bungee jumping",
      "5% GST (itemized transparently at checkout)",
    ],
  },
  {
    slug: "coorg-misty-coffee-staycation",
    title: "Coorg Private Pool & Coffee Estate Staycation",
    location: "Madikeri, Karnataka",
    scope: "Domestic",
    cohort: "Couple-friendly",
    theme: "Staycation",
    duration: "3N / 4D",
    priceInr: 28000,
    heatMapSummary: "Active (6 booked)",
    bookedPreview: 6,
    summary:
      "Unwind in a misty private coffee plantation villa with estate walks, Abbey Falls, Mandalpatti sunset jeep drive, and Kodava cuisine.",
    gradient: "from-[#134E4A] via-[#1B8A8F] to-[#132352]",
    highlights: [
      "Private balcony villa inside a 40-acre Arabica estate",
      "Guided bean-to-cup coffee tasting & spice trail",
      "4x4 Mandalpatti ridge sunset drive",
      "Candlelit Kodava dinner under the stars",
    ],
    itinerary: [
      {
        day: 1,
        title: "Estate Check-in & Misty Plantation Walk",
        stay: "Luxury Coffee Estate Villa, Madikeri",
        meals: "Hi-Tea & Candlelit Dinner",
        transport: "Private Sedan from Mysuru/Bengaluru",
        activities: [
          "Welcome Kodava filter coffee & villa check-in",
          "Guided dusk walk through pepper & Arabica trails",
        ],
      },
      {
        day: 2,
        title: "Abbey Falls & Mandalpatti 4x4 Sunset",
        stay: "Luxury Coffee Estate Villa, Madikeri",
        meals: "Breakfast & Dinner",
        transport: "Private 4x4 Jeep",
        activities: [
          "Morning visit to Abbey Falls & Raja's Seat",
          "Golden-hour 4x4 drive to Mandalpatti clouds",
        ],
      },
      {
        day: 3,
        title: "Slow Staycation & Spa / Coffee Roasting",
        stay: "Luxury Coffee Estate Villa, Madikeri",
        meals: "Breakfast, Estate Lunch & Dinner",
        transport: "At Leisure",
        activities: [
          "Hands-on artisanal coffee roasting session",
          "Private pool leisure & curated couples' dining",
        ],
      },
      {
        day: 4,
        title: "Breakfast & Scenic Drive Back",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Return Transfer",
        activities: ["Leisurely checkout & local spice market stop"],
      },
    ],
    inclusions: [
      "3 nights private coffee estate villa stay",
      "Daily breakfast, 1 estate lunch & 3 dinners",
      "Private 4x4 Mandalpatti sunset jeep excursion",
      "Guided coffee plantation & spice tour",
    ],
    exclusions: [
      "Intercity flights/trains",
      "Optional Ayurveda spa treatments",
      "5% GST (shown separately at checkout)",
    ],
  },
  {
    slug: "goa-beach-villa-bachelors",
    title: "North Goa Yacht, Surf & Villa Weekender",
    location: "Anjuna & Assagao, Goa",
    scope: "Domestic",
    cohort: "Bachelors-friendly",
    theme: "Adventurous",
    duration: "4N / 5D",
    priceInr: 22500,
    heatMapSummary: "Almost Full (16 booked)",
    bookedPreview: 16,
    summary:
      "High-energy coastal escape with a private Assagao pool villa, sunset yacht cruise, beginner surf lesson, and handpicked sundowner clubs.",
    gradient: "from-[#F26B4E] via-[#D9483B] to-[#132352]",
    highlights: [
      "Private pool villa in Assagao with dedicated host",
      "2-hour sunset yacht cruise on the Mandovi",
      "Beginner-friendly surf lesson at Ashwem Beach",
      "Curated sundowner & nightlife table reservations",
    ],
    itinerary: [
      {
        day: 1,
        title: "Assagao Villa Check-in & Chapora Sundowner",
        stay: "Private Pool Villa, Assagao",
        meals: "Welcome Snacks & Dinner",
        transport: "Airport / Station Transfer",
        activities: ["Poolside mixer with the cohort", "Sunset overlooking Vagator cliffs"],
      },
      {
        day: 2,
        title: "Ashwem Surf Session & Beach Club Afternoon",
        stay: "Private Pool Villa, Assagao",
        meals: "Breakfast",
        transport: "AC Coach",
        activities: ["2-hour certified beginner surf coaching", "Chill afternoon at Morjim/Ashwem"],
      },
      {
        day: 3,
        title: "Private Sunset Yacht Cruise & Night Out",
        stay: "Private Pool Villa, Assagao",
        meals: "Breakfast & Yacht Bites",
        transport: "AC Coach & Yacht",
        activities: ["Old Goa heritage stop", "Golden-hour yacht sail with music & snacks"],
      },
      {
        day: 4,
        title: "Island Kayaking & Farewell Pool BBQ",
        stay: "Private Pool Villa, Assagao",
        meals: "Breakfast & BBQ Dinner",
        transport: "AC Coach",
        activities: ["Backwater mangrove kayaking", "Private chef BBQ night at the villa"],
      },
      {
        day: 5,
        title: "Checkout & Airport Transfers",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Drop to Mopa / Dabolim Airport",
        activities: ["Late breakfast & group drop-off"],
      },
    ],
    inclusions: [
      "4 nights luxury Assagao pool villa stay",
      "Sunset yacht charter & surf lesson with board",
      "Daily breakfast & farewell BBQ dinner",
      "Airport transfers & cohort trip captain",
    ],
    exclusions: [
      "Flights to Goa",
      "Alcohol & personal club cover charges",
      "5% GST",
    ],
  },
  {
    slug: "spiti-valley-boys-expedition",
    title: "Spiti Valley High-Altitude Road Expedition",
    location: "Kaza & Chandratal, Himachal Pradesh",
    scope: "Domestic",
    cohort: "Boys-only",
    theme: "Adventurous",
    duration: "6N / 7D",
    priceInr: 38000,
    heatMapSummary: "Active (8 booked)",
    bookedPreview: 8,
    summary:
      "Conquer Atal Tunnel, Kunzum Pass, Key Monastery, Hikkim's highest post office, and Chandratal Lake with an ID-verified boys-only crew.",
    gradient: "from-[#1E293B] via-[#1E3A5F] to-[#132352]",
    highlights: [
      "Manali → Atal Tunnel → Kaza → Chandratal circuit",
      "Backup oxygen cylinders & acclimatization-first pacing",
      "Postcards from Hikkim & Langza fossil village",
      "Alpine camping under Milky Way skies at Chandratal",
    ],
    itinerary: [
      {
        day: 1,
        title: "Manali Arrival & Expedition Briefing",
        stay: "Mountain Lodge, Old Manali",
        meals: "Dinner",
        transport: "Volvo / SUV Meet-up",
        activities: ["Acclimatization walk & gear check", "Route briefing with expedition lead"],
      },
      {
        day: 2,
        title: "Atal Tunnel, Kunzum Pass & Drive to Kaza",
        stay: "Boutique Homestay, Kaza",
        meals: "Breakfast & Dinner",
        transport: "4x4 SUV / Tempo Traveller",
        activities: ["Cross Atal Tunnel & Batal", "Arrive in Kaza by evening"],
      },
      {
        day: 3,
        title: "Key Monastery, Kibber & Chicham Bridge",
        stay: "Boutique Homestay, Kaza",
        meals: "Breakfast & Dinner",
        transport: "Expedition Vehicle",
        activities: ["Explore 1,000-year-old Key Monastery", "Photo stop at Asia's highest suspension bridge"],
      },
      {
        day: 4,
        title: "Hikkim, Komic & Langza High-Altitude Circuit",
        stay: "Boutique Homestay, Kaza",
        meals: "Breakfast & Dinner",
        transport: "Expedition Vehicle",
        activities: ["Mail postcards from Hikkim", "Lunch at Komic & sunset at Langza Buddha"],
      },
      {
        day: 5,
        title: "Chandratal Crescent Lake & Alpine Camp",
        stay: "Swiss Tents near Chandratal",
        meals: "Breakfast & Dinner",
        transport: "Expedition Vehicle",
        activities: ["Short trek to turquoise Chandratal Lake", "Astrophotography & stargazing night"],
      },
      {
        day: 6,
        title: "Drive Back to Manali & Celebration Dinner",
        stay: "Mountain Lodge, Manali",
        meals: "Breakfast & Farewell Dinner",
        transport: "Expedition Vehicle",
        activities: ["Scenic return through Rohtang/Atal Tunnel", "Squad celebration dinner"],
      },
      {
        day: 7,
        title: "Departure from Manali",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Onward Journey",
        activities: ["Morning leisure & trip wrap-up"],
      },
    ],
    inclusions: [
      "6 nights comfortable mountain stays & Chandratal camp",
      "All overland transport from Manali to Manali",
      "Daily breakfast & dinner, permits & oxygen support",
      "Experienced Himalayan expedition captain",
    ],
    exclusions: [
      "Travel to/from Manali",
      "Lunches & personal winter gear rentals",
      "5% GST",
    ],
  },
  {
    slug: "varanasi-ayodhya-family-yatra",
    title: "Varanasi & Ayodhya Guided Heritage Yatra",
    location: "Varanasi & Ayodhya, Uttar Pradesh",
    scope: "Domestic",
    cohort: "Family-friendly",
    theme: "Religious",
    duration: "4N / 5D",
    priceInr: 45000,
    heatMapSummary: "Trending (14 booked)",
    bookedPreview: 14,
    summary:
      "Senior-friendly spiritual journey covering Kashi Vishwanath, private Ganga Aarti boat viewing, Sarnath, and Shri Ram Janmabhoomi in Ayodhya.",
    gradient: "from-[#B45309] via-[#92400E] to-[#132352]",
    highlights: [
      "Senior-friendly pacing with elevator-equipped 4-star hotels",
      "Reserved sunrise & evening Ganga Aarti boat experience",
      "Guided Kashi Vishwanath Corridor & Sarnath tour",
      "Comfortable AC transfer to Ayodhya with darshan planning",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Varanasi & Evening Ganga Aarti",
        stay: "4-Star Heritage Hotel, Varanasi",
        meals: "Dinner",
        transport: "Private AC Innova / Coach",
        activities: ["Airport/Station pickup", "Private boat viewing of Dashashwamedh Ghat Aarti"],
      },
      {
        day: 2,
        title: "Kashi Vishwanath Darshan & Sarnath",
        stay: "4-Star Heritage Hotel, Varanasi",
        meals: "Breakfast & Dinner",
        transport: "AC Vehicle + E-Rickshaw",
        activities: ["Morning Kashi Vishwanath & Annapurna temple visit", "Afternoon Sarnath Stupa & Museum"],
      },
      {
        day: 3,
        title: "Sunrise Boat Ride & Drive to Ayodhya",
        stay: "4-Star Hotel, Ayodhya",
        meals: "Breakfast & Dinner",
        transport: "AC Highway Coach",
        activities: ["Subah-e-Banaras boat ride", "Comfortable drive to Ayodhya & Saryu Aarti"],
      },
      {
        day: 4,
        title: "Shri Ram Janmabhoomi & Hanuman Garhi",
        stay: "4-Star Hotel, Ayodhya",
        meals: "Breakfast & Dinner",
        transport: "Local AC Transfers",
        activities: ["Assisted Shri Ram Mandir darshan", "Kanak Bhawan & Ram Ki Paidi evening walk"],
      },
      {
        day: 5,
        title: "Ayodhya Departure",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Drop to Ayodhya Airport / Station",
        activities: ["Relaxed breakfast & departure transfer"],
      },
    ],
    inclusions: [
      "4 nights 4-star family hotels with breakfast & pure veg dinner",
      "All AC intercity & local transfers",
      "Sunrise & evening Ganga boat rides",
      "Dedicated bilingual spiritual tour manager",
    ],
    exclusions: [
      "Flights or train tickets",
      "Special temple VIP pass fees (at actuals)",
      "5% GST",
    ],
  },
  {
    slug: "bali-ubud-nusapenida-couples",
    title: "Bali Cliffs, Ubud Villas & Nusa Penida Escape",
    location: "Ubud & Uluwatu, Indonesia",
    scope: "International",
    cohort: "Couple-friendly",
    theme: "Sightseeing",
    duration: "6N / 7D",
    priceInr: 115000,
    heatMapSummary: "Trending (10 booked)",
    bookedPreview: 10,
    summary:
      "Handpicked tropical getaway blending Ubud's jungle pool villas, Nusa Penida's dramatic cliffs, Uluwatu sunset dances, and seamless private transfers.",
    gradient: "from-[#0E7490] via-[#1B8A8F] to-[#132352]",
    highlights: [
      "3N Ubud private pool villa + 3N Uluwatu/Seminyak resort",
      "Nusa Penida West Island speedboat tour (Kelingking & Broken Beach)",
      "Floating breakfast & Balinese couple's spa session",
      "Uluwatu Temple sunset & Kecak Fire Dance tickets included",
    ],
    itinerary: [
      {
        day: 1,
        title: "Touchdown in Bali & Transfer to Ubud",
        stay: "Private Pool Villa, Ubud",
        meals: "Welcome Drink",
        transport: "Private AC Airport Transfer",
        activities: ["Meet-and-greet at Ngurah Rai Airport", "Check into lush jungle villa"],
      },
      {
        day: 2,
        title: "Tegalalang Rice Terraces & Kintamani Views",
        stay: "Private Pool Villa, Ubud",
        meals: "Floating Breakfast & Lunch",
        transport: "Private Car & Driver",
        activities: ["Tegenungan Waterfall & Tirta Empul", "Mt. Batur volcano viewpoint lunch"],
      },
      {
        day: 3,
        title: "Balinese Spa & Ubud Art Market",
        stay: "Private Pool Villa, Ubud",
        meals: "Breakfast",
        transport: "Private Transfers",
        activities: ["60-min traditional Balinese spa", "Leisurely afternoon in Ubud cafés"],
      },
      {
        day: 4,
        title: "Nusa Penida West Island Speedboat Excursion",
        stay: "4-Star Beachfront Resort, Seminyak",
        meals: "Breakfast & Island Lunch",
        transport: "Fast Boat + Island Car",
        activities: ["Kelingking Cliff, Angel's Billabong & Crystal Bay", "Transfer to South Bali"],
      },
      {
        day: 5,
        title: "Uluwatu Cliff Temple & Kecak Fire Dance",
        stay: "4-Star Beachfront Resort, Seminyak",
        meals: "Breakfast & Jimbaran Seafood Dinner",
        transport: "Private Car",
        activities: ["Melasti Beach visit", "Sunset Kecak dance & beachfront candlelight dinner"],
      },
      {
        day: 6,
        title: "Leisure Beach Day & Sunset Club",
        stay: "4-Star Beachfront Resort, Seminyak",
        meals: "Breakfast",
        transport: "At Leisure",
        activities: ["Optional water sports or café hopping in Canggu"],
      },
      {
        day: 7,
        title: "Departure from Denpasar",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Private Airport Drop",
        activities: ["Souvenir shopping & airport transfer"],
      },
    ],
    inclusions: [
      "6 nights handpicked 4-star villas & beach resort",
      "Daily breakfast, floating breakfast & 2 curated meals",
      "Nusa Penida fast boat + private island car",
      "All private AC transfers & English-speaking guide",
      "Indonesia Visa-on-Arrival documentation checklist",
    ],
    exclusions: [
      "International return flights",
      "Indonesia Visa-on-Arrival fee (~IDR 500,000, paid at airport)",
      "5% GST + applicable Overseas Tour TCS (PAN required)",
    ],
    visaNote:
      "Indian passport holders are eligible for Indonesia Visa-on-Arrival (VoA). Voyago Holidays provides full pre-departure documentation checklists; visa issuance remains at Indonesian Immigration discretion.",
  },
  {
    slug: "vietnam-highlights-girls-squad",
    title: "Hanoi, Ha Long Bay & Da Nang Girls-Only Tour",
    location: "Hanoi, Ha Long Bay & Da Nang, Vietnam",
    scope: "International",
    cohort: "Girls-only",
    theme: "Sightseeing",
    duration: "7N / 8D",
    priceInr: 92000,
    heatMapSummary: "Active (7 booked)",
    bookedPreview: 7,
    summary:
      "Safe, vibrant girls-only international adventure featuring an overnight Ha Long Bay balcony cruise, Hoi An lantern nights, and Ba Na Hills.",
    gradient: "from-[#1B8A8F] via-[#312E81] to-[#132352]",
    highlights: [
      "1-night 5-star Ha Long Bay cruise with kayaking",
      "Ba Na Hills cable car & iconic Golden Hands Bridge",
      "Hoi An Old Town lantern boat & basket boat ride",
      "Verified female tour manager + 24-hr ID-checked cohort",
    ],
    itinerary: [
      {
        day: 1,
        title: "Hanoi Arrival & Old Quarter Cyclo Tour",
        stay: "4-Star Boutique Hotel, Hanoi",
        meals: "Welcome Dinner",
        transport: "Private AC Coach",
        activities: ["Airport pickup & hotel check-in", "Hoan Kiem Lake & Train Street coffee stop"],
      },
      {
        day: 2,
        title: "Ninh Binh Trang An Boat & Mua Cave",
        stay: "4-Star Boutique Hotel, Hanoi",
        meals: "Breakfast & Lunch",
        transport: "Private AC Coach",
        activities: ["UNESCO Trang An limestone sampan ride", "Panoramic view from Mua Cave"],
      },
      {
        day: 3,
        title: "Board 5-Star Overnight Ha Long Bay Cruise",
        stay: "Balcony Cabin, Ha Long Bay Cruise",
        meals: "Breakfast, Lunch & Dinner",
        transport: "Luxury Limousine Bus",
        activities: ["Sung Sot Cave exploration", "Sunset deck party & evening squid fishing"],
      },
      {
        day: 4,
        title: "Ha Long Morning Tai Chi & Flight to Da Nang",
        stay: "Beachfront 4-Star Hotel, Da Nang",
        meals: "Brunch",
        transport: "Internal Flight (Included)",
        activities: ["Kayaking in Luon Cave", "Evening flight to coastal Da Nang"],
      },
      {
        day: 5,
        title: "Ba Na Hills & Golden Bridge Day Trip",
        stay: "Beachfront 4-Star Hotel, Da Nang",
        meals: "Breakfast & Buffet Lunch",
        transport: "Private Coach + Cable Car",
        activities: ["Walk the Golden Hands Bridge", "French Village & Fantasy Park"],
      },
      {
        day: 6,
        title: "Coconut Forest & Hoi An Lantern Evening",
        stay: "Beachfront 4-Star Hotel, Da Nang",
        meals: "Breakfast & Farewell Dinner",
        transport: "Private Coach",
        activities: ["Cam Thanh bamboo basket boat", "Hoi An tailor streets & glowing lantern river ride"],
      },
      {
        day: 7,
        title: "My Khe Beach & Marble Mountains",
        stay: "Beachfront 4-Star Hotel, Da Nang",
        meals: "Breakfast",
        transport: "Private Coach",
        activities: ["Morning beach leisure", "Dragon Bridge fire show on weekends"],
      },
      {
        day: 8,
        title: "Departure from Da Nang",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Airport Drop",
        activities: ["Group transfer to Da Nang International Airport"],
      },
    ],
    inclusions: [
      "6 nights 4-star hotels + 1 night 5-star Ha Long Bay cruise",
      "Internal Hanoi → Da Nang flight included",
      "Daily breakfast, 3 lunches & 3 dinners",
      "Vietnam e-Visa facilitation assistance & female trip captain",
    ],
    exclusions: [
      "International flights India ↔ Vietnam",
      "Vietnam e-Visa government fee (itemized separately)",
      "5% GST + applicable Overseas Tour TCS (PAN required)",
    ],
    visaNote:
      "Voyago Holidays facilitates the Vietnam e-Visa application process. Government e-Visa fees are billed separately and final approval rests solely with Vietnam Immigration.",
  },
  {
    slug: "switzerland-italy-grand-family",
    title: "Swiss Alps, Lake Como & Rome Grand Family Tour",
    location: "Lucerne, Lake Como & Rome, Europe",
    scope: "International",
    cohort: "Family-friendly",
    theme: "Sightseeing",
    duration: "10N / 11D",
    priceInr: 465000,
    heatMapSummary: "Spots Filling (4 booked)",
    bookedPreview: 4,
    summary:
      "Flagship European family holiday with scenic Swiss trains, Mt. Titlis snow thrills, Lake Como ferries, Florence art walks, and Rome's Colosseum.",
    gradient: "from-[#1E3A8A] via-[#1B8A8F] to-[#132352]",
    highlights: [
      "Swiss Travel Pass + Mt. Titlis Rotair revolving cable car",
      "Scenic Glacier/GoldenPass rail segment & Lake Lucerne cruise",
      "Lake Como Bellagio ferry + Milan Duomo",
      "Skip-the-line Colosseum & Vatican Museums guided family tour",
    ],
    itinerary: [
      {
        day: 1,
        title: "Zurich Arrival & Transfer to Lucerne",
        stay: "4-Star Lakeside Hotel, Lucerne",
        meals: "Welcome Dinner",
        transport: "Swiss Rail / Private Coach",
        activities: ["Chapel Bridge evening stroll", "Welcome dinner by Lake Lucerne"],
      },
      {
        day: 2,
        title: "Mt. Titlis Glacier Excursion & Ice Flyer",
        stay: "4-Star Lakeside Hotel, Lucerne",
        meals: "Breakfast & Indian/Continental Dinner",
        transport: "Swiss Rail + Rotair Cable Car",
        activities: ["Cliff Walk suspension bridge", "Snow tubing & glacier cave"],
      },
      {
        day: 3,
        title: "Interlaken & Jungfrau Region Scenic Day",
        stay: "4-Star Alpine Hotel, Interlaken",
        meals: "Breakfast",
        transport: "GoldenPass Panoramic Train",
        activities: ["Lauterbrunnen valley waterfalls", "Evening leisure in Interlaken"],
      },
      {
        day: 4,
        title: "Grindelwald First & Lake Brienz Cruise",
        stay: "4-Star Alpine Hotel, Interlaken",
        meals: "Breakfast & Dinner",
        transport: "Cable Car & Ferry",
        activities: ["First Cliff Walk", "Turquoise Lake Brienz boat ride"],
      },
      {
        day: 5,
        title: "Scenic Cross-Border Journey to Lake Como",
        stay: "4-Star Hotel, Como",
        meals: "Breakfast & Italian Dinner",
        transport: "EuroCity Train / Private Coach",
        activities: ["Cross the Alps into Northern Italy", "Lakefront gelato evening"],
      },
      {
        day: 6,
        title: "Bellagio Ferry & Milan Duomo",
        stay: "4-Star Hotel, Como",
        meals: "Breakfast",
        transport: "Lake Ferry & Coach",
        activities: ["Bellagio lakeside village", "Milan Galleria Vittorio Emanuele II"],
      },
      {
        day: 7,
        title: "High-Speed Train to Florence & Tuscany",
        stay: "4-Star Central Hotel, Florence",
        meals: "Breakfast & Dinner",
        transport: "Frecciarossa High-Speed Train",
        activities: ["Ponte Vecchio & Piazzale Michelangelo sunset"],
      },
      {
        day: 8,
        title: "Pisa Leaning Tower & Tuscan Countryside",
        stay: "4-Star Central Hotel, Florence",
        meals: "Breakfast & Farm Lunch",
        transport: "Private Coach",
        activities: ["Field of Miracles in Pisa", "Family pizza-making workshop"],
      },
      {
        day: 9,
        title: "High-Speed Train to Rome & Colosseum",
        stay: "4-Star Central Hotel, Rome",
        meals: "Breakfast",
        transport: "Frecciarossa Train",
        activities: ["Skip-the-line Colosseum & Roman Forum guided tour"],
      },
      {
        day: 10,
        title: "Vatican Museums, Trevi Fountain & Farewell",
        stay: "4-Star Central Hotel, Rome",
        meals: "Breakfast & Farewell Dinner",
        transport: "Private Coach",
        activities: ["Sistine Chapel & St. Peter's Basilica", "Grand family farewell feast"],
      },
      {
        day: 11,
        title: "Departure from Rome Fiumicino",
        stay: "Checkout",
        meals: "Breakfast",
        transport: "Private Airport Transfer",
        activities: ["Leisurely checkout & flight transfer"],
      },
    ],
    inclusions: [
      "10 nights 4-star family rooms across Switzerland & Italy",
      "Swiss Travel Pass + Italian high-speed rail tickets",
      "Mt. Titlis, Lake Como ferry, Colosseum & Vatican skip-the-line passes",
      "Daily breakfast & 6 curated family dinners",
      "Schengen visa documentation checklist & appointment guidance",
    ],
    exclusions: [
      "International airfare India ↔ Europe",
      "Schengen Visa embassy & VFS fees (itemized separately)",
      "Mandatory Schengen Travel Insurance",
      "5% GST + applicable Overseas Tour TCS (PAN required)",
    ],
    visaNote:
      "Requires a valid Schengen Tourist Visa. Voyago Holidays provides complete itinerary, hotel vouchers, and filing guidance; visa approval is solely at the respective Embassy/Consulate's discretion.",
  },
];

export function getHeatMapTier(booked: number): HeatMapTier {
  if (booked >= 15) return "Almost Full";
  if (booked >= 9) return "Trending";
  if (booked >= 4) return "Active";
  return "Low Demand";
}

/**
 * Generates deterministic, strictly zero-PII anonymized departure heat map data
 * for any package & month (YYYY-MM). Never exposes traveler names or emails.
 */
export function getSeedHeatMapForMonth(
  slug: string,
  year: number,
  monthZeroIndexed: number
): HeatMapDeparture[] {
  const pkg = SEED_PACKAGES.find((p) => p.slug === slug);
  const seedHash = slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
  const departures: HeatMapDeparture[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthZeroIndexed, day);
    const weekday = dateObj.getDay();
    // Departures typically on Fri (5), Sat (6), Sun (0), Wed (3)
    const isDepartureDay =
      weekday === 5 || weekday === 6 || weekday === 0 || (weekday === 3 && day % 2 === 1);
    if (!isDepartureDay) continue;

    const totalSeats = pkg?.scope === "International" ? 18 : 20;
    const raw = (seedHash + day * 7 + (monthZeroIndexed + 1) * 11) % 19;
    const bookedCount = Math.min(totalSeats - 1, Math.max(1, raw));
    const spotsLeft = Math.max(1, totalSeats - bookedCount);
    const tier = getHeatMapTier(bookedCount);
    const coldStartLabel =
      bookedCount <= 3
        ? "Available"
        : bookedCount <= 8
          ? "Spots Filling"
          : bookedCount <= 14
            ? "Trending"
            : "Last Spots";

    const yyyy = dateObj.getFullYear();
    const mm = String(monthZeroIndexed + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    departures.push({
      date: `${yyyy}-${mm}-${dd}`,
      bookedCount,
      totalSeats,
      spotsLeft,
      tier,
      coldStartLabel,
    });
  }

  return departures;
}

export const SEED_FAQS = [
  {
    q: "How does the Booking Heat Map work?",
    a: "The Booking Heat Map displays anonymized, date-wise booking counts and availability indicators for each package. It helps you choose lively group departures or quieter travel dates without ever exposing personal details of other travelers.",
  },
  {
    q: "How do you ensure safety on Girls-only and Boys-only trips?",
    a: "Every traveler booking a gender-restricted cohort must accept our Traveler Code of Conduct at checkout and complete mandatory government ID verification within 24 hours of booking. Bookings failing verification are reassigned or refunded per our policy.",
  },
  {
    q: "How fast will I get a callback after submitting a Customization Form?",
    a: "Our human Travel Desk reviews your request and calls you back within 2 business hours (Mon–Sat, 9 AM – 8 PM IST), followed by a custom itinerary PDF and direct payment link via WhatsApp and email.",
  },
  {
    q: "Why do you ask for my PAN card on international packages?",
    a: "Under Indian Income Tax regulations, Overseas Tour Program Packages require Tax Collected at Source (TCS). Your PAN ensures accurate TCS reporting and issuance of your Form 27D tax certificate.",
  },
  {
    q: "Can companies book via NEFT and receive GST invoices?",
    a: "Yes! Sign in via Company (B2B) Login, enter your 15-character GSTIN at checkout, and pay via Cards, NetBanking, or NEFT/RTGS. Custom corporate quotes also support 30%/70% milestone payment links.",
  },
  {
    q: "Are international visas guaranteed?",
    a: "We assist with complete visa documentation checklists and facilitation where mentioned in the itinerary, with visa fees transparently itemized. Final visa approval rests solely with the respective embassy or consulate.",
  },
  {
    q: "Why don't you have an AI chatbot?",
    a: "Travel decisions deserve real human judgment. Instead of scripted bots, Voyago Holidays gives you searchable FAQs, a direct support ticket desk, phone support, and human Travel Desk callbacks in under 2 business hours.",
  },
];

export const SEED_ADMIN_BOOKINGS: BookingRecord[] = [
  {
    bookingRef: "VH-2027-8841",
    customerType: "B2C",
    packageSlug: "rishikesh-rafting-girls-escape",
    packageTitle: "Rishikesh Whitewater & Café Retreat",
    scope: "Domestic",
    cohort: "Girls-only",
    departureDate: "2027-03-14",
    travelerCount: 2,
    travelers: [
      { name: "Ananya Sharma", age: 26, gender: "Female" },
      { name: "Meera Nair", age: 25, gender: "Female" },
    ],
    contactName: "Ananya Sharma",
    contactEmail: "ananya.demo@example.com",
    contactPhone: "+91 98765 00001",
    baseAmount: 29000,
    b2bDiscount: 0,
    gstAmount: 1450,
    tcsAmount: 0,
    grandTotal: 30450,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    bookingStatus: "ID Verification Pending",
    createdAt: "2027-02-21T09:15:00.000Z",
  },
  {
    bookingRef: "VH-2027-8842",
    customerType: "B2B",
    packageSlug: "coorg-misty-coffee-staycation",
    packageTitle: "Coorg Private Pool & Coffee Estate Staycation",
    scope: "Domestic",
    cohort: "Couple-friendly",
    departureDate: "2027-03-21",
    travelerCount: 16,
    travelers: [{ name: "Corporate Roster (16 pax)", age: 30, gender: "Other" }],
    contactName: "Rajesh Menon (HR Lead)",
    contactEmail: "hr.demo@acmetech.example",
    contactPhone: "+91 98765 00002",
    companyName: "Acme Cloud Systems Pvt Ltd",
    gstin: "33AABCA1234F1Z5",
    baseAmount: 448000,
    b2bDiscount: 22400,
    gstAmount: 21280,
    tcsAmount: 0,
    grandTotal: 446880,
    paymentMethod: "NEFT_RTGS",
    paymentStatus: "PENDING_NEFT",
    bookingStatus: "Reserved — Pending Bank Settlement",
    createdAt: "2027-02-22T11:30:00.000Z",
  },
  {
    bookingRef: "VH-2027-8843",
    customerType: "B2C",
    packageSlug: "bali-ubud-nusapenida-couples",
    packageTitle: "Bali Cliffs, Ubud Villas & Nusa Penida Escape",
    scope: "International",
    cohort: "Couple-friendly",
    departureDate: "2027-04-04",
    travelerCount: 2,
    travelers: [
      { name: "Karthik Subramanian", age: 29, gender: "Male" },
      { name: "Divya Karthik", age: 28, gender: "Female" },
    ],
    contactName: "Karthik Subramanian",
    contactEmail: "karthik.demo@example.com",
    contactPhone: "+91 98765 00003",
    panNumber: "ABCDE1234F",
    baseAmount: 230000,
    b2bDiscount: 0,
    gstAmount: 11500,
    tcsAmount: 12075,
    grandTotal: 253575,
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    bookingStatus: "Confirmed",
    createdAt: "2027-02-23T14:00:00.000Z",
  },
];

export const SEED_ADMIN_VERIFICATIONS: IdVerificationItem[] = [
  {
    id: "ver-101",
    bookingRef: "VH-2027-8841",
    travelerName: "Ananya Sharma",
    cohort: "Girls-only",
    docType: "Masked Aadhaar",
    docReference: "XXXX-XXXX-4821",
    status: "Pending Review",
    slaHoursLeft: 14,
    submittedAt: "2027-02-21T10:00:00.000Z",
  },
  {
    id: "ver-102",
    bookingRef: "VH-2027-8839",
    travelerName: "Siddharth Rao",
    cohort: "Boys-only",
    docType: "Driving License",
    docReference: "TN-65-2021004412",
    status: "Pending Review",
    slaHoursLeft: 6,
    submittedAt: "2027-02-21T02:15:00.000Z",
  },
];

export const SEED_ADMIN_LEADS: CustomizationLead[] = [
  {
    referenceCode: "VH-CUST-4012",
    travelerType: "B2B",
    fullName: "Priya Krishnan",
    phone: "+91 98765 00010",
    email: "priya.hr@fintechdemo.example",
    companyName: "SouthBridge FinTech Pvt Ltd",
    destinations: "Coorg or Goa (3N/4D Team Offsite)",
    travelDates: "Mid-April 2027 (Flexible)",
    travelerCount: 35,
    budgetRange: "₹3L–₹5L+",
    cohort: "Family-friendly",
    theme: "Staycation",
    notes: "Need conference hall for half-day townhall + outdoor team bonding.",
    status: "New Lead",
    slaMinutesLeft: 42,
    createdAt: "2027-02-24T08:10:00.000Z",
  },
  {
    referenceCode: "VH-CUST-4013",
    travelerType: "B2C",
    fullName: "Neha Verma",
    phone: "+91 98765 00011",
    email: "neha.demo@example.com",
    destinations: "Kashmir / Gulmarg (Not sure on dates)",
    travelDates: "May 2027",
    travelerCount: 4,
    budgetRange: "₹50K–₹1.5L",
    cohort: "Girls-only",
    theme: "Sightseeing",
    notes: "First-time travelers—want a relaxed itinerary with low crowds.",
    status: "New Lead",
    slaMinutesLeft: 95,
    createdAt: "2027-02-24T09:00:00.000Z",
  },
];
