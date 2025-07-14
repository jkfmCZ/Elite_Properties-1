const mockProperties = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    description: 'Beautiful 4-bedroom villa with stunning garden views and modern amenities. Perfect for families looking for comfort and elegance.',
    price: 750000,
    location: 'Beverly Hills, CA',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 3200,
    imageUrl: '/images/properties/villa-1.jpg',
    images: [
      '/images/properties/villa-1.jpg',
      '/images/properties/villa-1-2.jpg',
      '/images/properties/villa-1-3.jpg',
      '/images/properties/villa-1-4.jpg',
      '/images/properties/villa-1-5.jpg'
    ],
    type: 'house',
    status: 'available',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Downtown Penthouse',
    description: 'Spectacular penthouse with panoramic city views. Modern design with premium finishes throughout.',
    price: 1200000,
    location: 'Manhattan, NY',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 2800,
    imageUrl: '/images/properties/penthouse-1.jpg',
    images: [
      '/images/properties/penthouse-1.jpg',
      '/images/properties/penthouse-1-2.jpg',
      '/images/properties/penthouse-1-3.jpg',
      '/images/properties/penthouse-1-4.jpg'
    ],
    type: 'apartment',
    status: 'available',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Cozy Suburban Home',
    description: 'Charming family home in quiet neighborhood. Recently renovated with modern kitchen and bathrooms.',
    price: 485000,
    location: 'Austin, TX',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 2100,
    imageUrl: '/images/properties/suburban-1.jpg',
    images: [
      '/images/properties/suburban-1.jpg',
      '/images/properties/suburban-1-2.jpg',
      '/images/properties/suburban-1-3.jpg'
    ],
    type: 'house',
    status: 'pending',
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Prime Development Plot',
    description: 'Excellent opportunity for development. Located in rapidly growing area with great potential.',
    price: 320000,
    location: 'Phoenix, AZ',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 8000,
    imageUrl: '/images/properties/plot-1.jpg',
    images: [
      '/images/properties/plot-1.jpg',
      '/images/properties/plot-1-2.jpg'
    ],
    type: 'plot',
    status: 'available',
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z'
  },
  {
    id: '5',
    title: 'Beach House Paradise',
    description: 'Stunning oceanfront property with direct beach access. Perfect for vacation home or investment.',
    price: 1850000,
    location: 'Malibu, CA',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 4200,
    imageUrl: '/images/properties/beach-1.jpg',
    images: [
      '/images/properties/beach-1.jpg',
      '/images/properties/beach-1-2.jpg',
      '/images/properties/beach-1-3.jpg',
      '/images/properties/beach-1-4.jpg',
      '/images/properties/beach-1-5.jpg',
      '/images/properties/beach-1-6.jpg'
    ],
    type: 'house',
    status: 'available',
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  {
    id: '6',
    title: 'Urban Loft',
    description: 'Industrial-style loft in trendy neighborhood. Open floor plan with exposed brick and high ceilings.',
    price: 625000,
    location: 'Portland, OR',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1800,
    imageUrl: '/images/properties/loft-1.jpg',
    images: [
      '/images/properties/loft-1.jpg',
      '/images/properties/loft-1-2.jpg',
      '/images/properties/loft-1-3.jpg'
    ],
    type: 'apartment',
    status: 'sold',
    createdAt: '2025-01-06T00:00:00Z',
    updatedAt: '2025-01-06T00:00:00Z'
  }
];

const mockBrokers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Real Estate Agent',
    experience: '8+ years',
    specialties: ['Luxury Properties', 'First-time Buyers', 'Investment Properties'],
    rating: 4.9,
    reviews: 127,
    phone: '+1-555-0123',
    email: 'sarah.johnson@eliteproperties.com',
    imageUrl: '/images/broker/sarah-johnson.jpg',
    availability: 'available',
    bio: 'Sarah has been helping clients find their dream homes for over 8 years. Specializing in luxury properties and first-time buyers, she brings expertise and dedication to every transaction.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Real Estate Specialist',
    experience: '6+ years',
    specialties: ['Commercial Properties', 'Land Development', 'Market Analysis'],
    rating: 4.8,
    reviews: 89,
    phone: '+1-555-0124',
    email: 'michael.chen@eliteproperties.com',
    imageUrl: '/images/broker/michael-chen.jpg',
    availability: 'busy',
    bio: 'Michael specializes in commercial real estate and land development projects. His analytical approach and market knowledge help clients make informed investment decisions.',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

const mockMarketInsights = [
  {
    id: '1',
    title: 'Housing Market Trends',
    trend: 'up',
    percentage: 5.2,
    timeframe: 'Last 6 months',
    description: 'Property values continue to rise steadily across major metropolitan areas.',
    data: [
      { label: 'Jan', value: 478000 },
      { label: 'Feb', value: 482000 },
      { label: 'Mar', value: 485000 },
      { label: 'Apr', value: 489000 },
      { label: 'May', value: 492000 },
      { label: 'Jun', value: 506000 }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Rental Market Analysis',
    trend: 'stable',
    percentage: 2.1,
    timeframe: 'This quarter',
    description: 'Rental prices remain stable with slight increases in premium locations.',
    data: [
      { label: 'Q1', value: 2800 },
      { label: 'Q2', value: 2850 },
      { label: 'Q3', value: 2860 },
      { label: 'Q4', value: 2900 }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  }
];

const mockQuickActions = [
  {
    id: '1',
    title: 'Schedule Property Tour',
    description: 'Book a guided tour of available properties',
    icon: 'calendar',
    action: 'schedule_tour',
    variant: 'primary'
  },
  {
    id: '2',
    title: 'Get Market Report',
    description: 'Download latest market analysis',
    icon: 'trending-up',
    action: 'market_report',
    variant: 'secondary'
  },
  {
    id: '3',
    title: 'Mortgage Calculator',
    description: 'Calculate your monthly payments',
    icon: 'calculator',
    action: 'mortgage_calc',
    variant: 'outline'
  },
  {
    id: '4',
    title: 'Contact Expert',
    description: 'Speak with a real estate professional',
    icon: 'phone',
    action: 'contact_expert',
    variant: 'secondary'
  }
];

const mockBookings = [
  {
    id: '1',
    propertyId: '1',
    clientName: 'John Smith',
    clientEmail: 'john.smith@email.com',
    clientPhone: '+1-555-0123',
    preferredDate: '2025-01-20',
    preferredTime: '14:00',
    preferredLocation: 'Property Location',
    message: 'Interested in viewing this beautiful villa.',
    status: 'confirmed',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    propertyId: '2',
    clientName: 'Emily Davis',
    clientEmail: 'emily.davis@email.com',
    clientPhone: '+1-555-0124',
    preferredDate: '2025-01-22',
    preferredTime: '10:00',
    preferredLocation: 'Property Location',
    message: 'Would like to schedule a viewing for this penthouse.',
    status: 'pending',
    createdAt: '2025-01-16T14:20:00Z',
    updatedAt: '2025-01-16T14:20:00Z'
  }
];

module.exports = {
  mockProperties,
  mockBrokers,
  mockMarketInsights,
  mockQuickActions,
  mockBookings
};
