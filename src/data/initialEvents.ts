import { EventItem, Booking, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'attendee',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'usr-admin',
    name: 'Sarah Connor',
    email: 'admin@eventforge.io',
    role: 'admin',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'usr-2',
    name: 'David Chen',
    email: 'david.chen@techmail.org',
    role: 'attendee',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    title: 'Global AI & Autonomous Systems Summit 2026',
    slug: 'global-ai-summit-2026',
    description: 'Join 1,200+ engineers, researchers, and tech founders exploring the forefront of foundation models, neural agent architectures, and embodied AI. Featuring keynote sessions from premier AI research labs and interactive workshop labs.',
    category: 'Tech',
    date: '2026-11-14',
    time: '09:00 AM - 06:00 PM',
    venue: 'Moscone Convention Center, Hall D',
    city: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'NextGen AI Institute',
    totalSeats: 350,
    availableSeats: 64,
    status: 'upcoming',
    featured: true,
    tiers: [
      {
        id: 'tier-101-standard',
        name: 'General Pass',
        price: 149,
        description: 'Access to all main stage keynotes, exhibition floor, and evening networking mixer.',
        perks: ['Main Stage Access', 'Exhibition Hall Badge', 'Coffee & Lunch Included', 'Digital Session Recordings'],
        available: 44,
        total: 250,
      },
      {
        id: 'tier-101-vip',
        name: 'VIP Executive Pass',
        price: 349,
        description: 'Priority front-row seating, private VIP lounge, speakers dinner, and hands-on lab access.',
        perks: ['VIP Reserved Seating', 'Private Speaker Dinner', 'Hands-on Labs Access', 'Priority Fast-Track Entry', 'Exclusive Swag Kit'],
        available: 20,
        total: 100,
      }
    ],
    agenda: [
      { time: '09:00 AM', activity: 'Registration & Welcome Breakfast' },
      { time: '10:00 AM', activity: 'Opening Keynote: The Frontier of Reasoning Agents' },
      { time: '11:30 AM', activity: 'Panel: Next-Gen Enterprise Microservices Architecture' },
      { time: '01:00 PM', activity: 'Networking Lunch & Startup Expo' },
      { time: '02:30 PM', activity: 'Deep Dive: Low Latency Streaming Systems' },
      { time: '04:30 PM', activity: 'Closing Keynote & Hackathon Award Ceremony' }
    ]
  },
  {
    id: 'evt-102',
    title: 'Echoes in the Park: Indie & Synthwave Music Night',
    slug: 'echoes-in-the-park-synthwave',
    description: 'An open-air dusk-to-midnight sonic journey featuring 6 headline electronic and synthwave acts with synchronized laser projection visual mapping under the city sky.',
    category: 'Music',
    date: '2026-11-20',
    time: '06:00 PM - 11:30 PM',
    venue: 'Skyline Amphitheater',
    city: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Neon Horizon Music Labs',
    totalSeats: 500,
    availableSeats: 180,
    status: 'upcoming',
    featured: true,
    tiers: [
      {
        id: 'tier-102-lawn',
        name: 'General Lawn Access',
        price: 45,
        description: 'Lawn standing and general picnic perimeter viewing with crisp line-array acoustics.',
        perks: ['Lawn Area Access', 'Food Truck Village Access', 'Free Glow Wristband'],
        available: 120,
        total: 350,
      },
      {
        id: 'tier-102-pit',
        name: 'Front Pit & Backstage Lounge',
        price: 110,
        description: 'Right in front of the artist stage with private bar access and sound-check access.',
        perks: ['Front Stage Pit Access', 'Express Bar Line', 'Soundcheck Pre-Show Pass', 'Commemorative Poster'],
        available: 60,
        total: 150,
      }
    ],
    agenda: [
      { time: '06:00 PM', activity: 'Gates Open & Ambient DJ Warmup' },
      { time: '07:30 PM', activity: 'Opening Act: Neon Pulse' },
      { time: '09:00 PM', activity: 'Co-Headliner: RetroWave Collective' },
      { time: '10:15 PM', activity: 'Midnight Climax: The Synthesizer Ensemble' }
    ]
  },
  {
    id: 'evt-103',
    title: 'Full-Stack Java Enterprise & Microservices Masterclass',
    slug: 'java-microservices-masterclass',
    description: 'Intensive 2-day hands-on workshop covering Java 21, Spring Boot 3, Jakarta Servlets, JDBC connection optimization, Dockerized deployments, and production SQL performance tuning.',
    category: 'Workshop',
    date: '2026-11-28',
    time: '10:00 AM - 04:00 PM',
    venue: 'TechHub Innovation Center, Suite 402',
    city: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    organizer: 'CloudCraft Academy',
    totalSeats: 80,
    availableSeats: 12,
    status: 'upcoming',
    featured: false,
    tiers: [
      {
        id: 'tier-103-seat',
        name: 'Workshop Seat + Code Repo Access',
        price: 89,
        description: 'In-person workstation desk, mentorship, complete GitHub repository and certificate of completion.',
        perks: ['2 Days In-person Mentorship', 'Live Code Reviews', 'Verified Completion Certificate', 'Lifetime GitHub Repo Access'],
        available: 12,
        total: 80,
      }
    ],
    agenda: [
      { time: '10:00 AM', activity: 'Servlet Lifecycle, Filters & Session Architecture' },
      { time: '11:45 AM', activity: 'Building High-Performance DAO & JDBC Pool with HikariCP' },
      { time: '01:30 PM', activity: 'Hands-on: Preventing Concurrency Collisions in Booking Engines' },
      { time: '03:15 PM', activity: 'Live Benchmarking & Profiling' }
    ]
  },
  {
    id: 'evt-104',
    title: 'VentureSprint: Annual Startup Pitch & Angel Demo Day',
    slug: 'venturesprint-demo-day-2026',
    description: 'Top 25 seed-stage tech ventures pitch live to over 150 accredited angels and Tier-1 venture capital partners. High-octane lightning pitches followed by structured investor breakouts.',
    category: 'Business',
    date: '2026-12-05',
    time: '01:00 PM - 07:30 PM',
    venue: 'Founders Tower, 18th Floor Grand Ballroom',
    city: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Apex Capital Ventures',
    totalSeats: 200,
    availableSeats: 48,
    status: 'upcoming',
    featured: true,
    tiers: [
      {
        id: 'tier-104-founder',
        name: 'Attendee / Founder Pass',
        price: 75,
        description: 'General audience gallery access and general networking cocktail hour.',
        perks: ['Pitch Session Audience Access', 'Founder Networking Lounge', 'Deal Book PDF'],
        available: 38,
        total: 150,
      },
      {
        id: 'tier-104-investor',
        name: 'Accredited Investor Pass',
        price: 250,
        description: 'Reserved front tables, direct founder pitch decks, and private 1:1 deal breakout tables.',
        perks: ['Front Table Reserved Seating', 'Private Deal Room Access', 'Direct Contact Matrix', 'Private Angel Dinner'],
        available: 10,
        total: 50,
      }
    ],
    agenda: [
      { time: '01:00 PM', activity: 'Welcome & State of Venture Capital 2026' },
      { time: '01:45 PM', activity: 'Batch 1: Enterprise SaaS & DeepTech Pitches' },
      { time: '03:30 PM', activity: 'Batch 2: FinTech & ClimateTech Pitches' },
      { time: '05:30 PM', activity: 'Networking Cocktail & Syndicate Breakouts' }
    ]
  },
  {
    id: 'evt-105',
    title: 'Inter-College Esports Clash & Gaming Championship',
    slug: 'inter-college-esports-championship',
    description: 'High-octane collegiate finals featuring CS2, Valorant, and Rocket League showdowns on massive 4K LED arrays with live shoutcasting, cosplay tournaments, and gaming gear giveaways.',
    category: 'Sports',
    date: '2026-12-12',
    time: '11:00 AM - 09:00 PM',
    venue: 'Metropolis Esports Arena',
    city: 'Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Campus Gaming League',
    totalSeats: 400,
    availableSeats: 115,
    status: 'upcoming',
    featured: false,
    tiers: [
      {
        id: 'tier-105-spectator',
        name: 'Day Spectator Pass',
        price: 25,
        description: 'Full day spectator entry to all arena stages and gaming exhibition booth zone.',
        perks: ['All Match Stages Access', 'Raffle Ticket for RTX 5080', 'Free Energy Drink & Snack Voucher'],
        available: 95,
        total: 320,
      },
      {
        id: 'tier-105-vip',
        name: 'VIP Front Row & Pro Meet',
        price: 65,
        description: 'Padded floor seats, pro-player signing session, and tournament commemorative jersey.',
        perks: ['Stage Front Row Seating', 'Official Team Jersey', 'Backstage Pro Meet & Greet', 'Fast-lane Entry'],
        available: 20,
        total: 80,
      }
    ],
    agenda: [
      { time: '11:00 AM', activity: 'Doors Open & Free Play LAN Expo' },
      { time: '01:00 PM', activity: 'Semifinals: Campus Valorant Clash' },
      { time: '04:30 PM', activity: 'Cosplay Showcase & Sponsor Giveaways' },
      { time: '06:00 PM', activity: 'Grand Finals: CS2 Championship Match' }
    ]
  },
  {
    id: 'evt-106',
    title: 'Kaleidoscope: International Contemporary Art & Film Expo',
    slug: 'kaleidoscope-art-and-film-expo',
    description: 'A 3-day immersive celebration of modern cinematography, digital installation arts, VR short films, and panel discussions with Sundance and Cannes indie creators.',
    category: 'Cultural',
    date: '2026-12-18',
    time: '10:00 AM - 08:00 PM',
    venue: 'Civic Arts Pavilion',
    city: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Civic Cultural Council',
    totalSeats: 250,
    availableSeats: 90,
    status: 'upcoming',
    featured: false,
    tiers: [
      {
        id: 'tier-106-day',
        name: 'Single Day Gallery Pass',
        price: 35,
        description: 'Access to all visual installations, film screening rooms, and outdoor sculpture terrace.',
        perks: ['All Gallery Rooms Access', '3 Screening Room Passes', 'Exhibition Guide Booklet'],
        available: 70,
        total: 200,
      },
      {
        id: 'tier-106-all',
        name: 'Full 3-Day All-Access Pass',
        price: 79,
        description: 'Unlimited access across all three exhibition days plus creator panel discussions.',
        perks: ['3-Day Unlimited Entry', 'Director Q&A Reserved Row', 'Closing Night Gala Entry'],
        available: 20,
        total: 50,
      }
    ],
    agenda: [
      { time: '10:00 AM', activity: 'Gallery Opening & Interactive VR Demonstrations' },
      { time: '02:00 PM', activity: 'Screening: Award-Winning Independent Shorts' },
      { time: '04:30 PM', activity: 'Panel: Storytelling Through Generative Media' },
      { time: '07:00 PM', activity: 'Evening Wine & Art Collector Reception' }
    ]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-1001',
    bookingRef: 'EVT-2026-8812',
    eventId: 'evt-101',
    eventTitle: 'Global AI & Autonomous Systems Summit 2026',
    eventDate: '2026-11-14',
    eventVenue: 'Moscone Convention Center, Hall D',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@example.com',
    userPhone: '+1 (555) 234-5678',
    tierId: 'tier-101-vip',
    tierName: 'VIP Executive Pass',
    quantity: 1,
    unitPrice: 349,
    discount: 0,
    totalAmount: 349,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    bookedAt: '2026-10-02 14:22:10',
    qrPayload: 'TICKET:EVT-2026-8812:USR-1:TIER-VIP:CONFIRMED'
  },
  {
    id: 'bkg-1002',
    bookingRef: 'EVT-2026-5541',
    eventId: 'evt-102',
    eventTitle: 'Echoes in the Park: Indie & Synthwave Music Night',
    eventDate: '2026-11-20',
    eventVenue: 'Skyline Amphitheater',
    userId: 'usr-1',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@example.com',
    userPhone: '+1 (555) 234-5678',
    tierId: 'tier-102-pit',
    tierName: 'Front Pit & Backstage Lounge',
    quantity: 2,
    unitPrice: 110,
    discount: 22, // 10% promo
    totalAmount: 198,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    bookedAt: '2026-10-04 19:10:45',
    qrPayload: 'TICKET:EVT-2026-5541:USR-1:TIER-PIT:CONFIRMED'
  },
  {
    id: 'bkg-1003',
    bookingRef: 'EVT-2026-3190',
    eventId: 'evt-104',
    eventTitle: 'VentureSprint: Annual Startup Pitch & Angel Demo Day',
    eventDate: '2026-12-05',
    eventVenue: 'Founders Tower, 18th Floor Grand Ballroom',
    userId: 'usr-2',
    userName: 'David Chen',
    userEmail: 'david.chen@techmail.org',
    userPhone: '+1 (555) 345-6789',
    tierId: 'tier-104-founder',
    tierName: 'Attendee / Founder Pass',
    quantity: 1,
    unitPrice: 75,
    discount: 0,
    totalAmount: 75,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    bookedAt: '2026-10-05 11:05:30',
    qrPayload: 'TICKET:EVT-2026-3190:USR-2:TIER-FOUNDER:CONFIRMED'
  }
];
