import { Property, Booking, Broker, MarketInsight, QuickAction } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    description: 'Beautiful 4-bedroom villa with stunning garden views and modern amenities. Perfect for families looking for comfort and elegance.',
    price: 750000,
    location: 'Beverly Hills, CA',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 3200,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1449729/pexels-photo-1449729.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'house',
    status: 'available'
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
    imageUrl: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'apartment',
    status: 'available'
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
    imageUrl: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'house',
    status: 'available'
  },
  {
    id: '4',
    title: 'Prime Development Plot',
    description: 'Excellent opportunity for development. Located in upcoming area with great potential for appreciation.',
    price: 320000,
    location: 'Phoenix, AZ',
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 8500,
    imageUrl: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'plot',
    status: 'available'
  },
  {
    id: '5',
    title: 'Beach House Paradise',
    description: 'Stunning beachfront property with direct ocean access. Perfect for vacation rental or primary residence.',
    price: 950000,
    location: 'Malibu, CA',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 3800,
    imageUrl: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2119755/pexels-photo-2119755.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'house',
    status: 'available'
  },
  {
    id: '6',
    title: 'Urban Loft',
    description: 'Industrial-style loft in trendy neighborhood. High ceilings, exposed brick, and modern amenities.',
    price: 625000,
    location: 'Portland, OR',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1800,
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    type: 'apartment',
    status: 'available'
  }
];

export const mockBrokers: Broker[] = [
  {
    id: '1',
    name: 'Janek Krupička',
    title: 'Senior Real Estate Specialist',
    experience: '10 years',
    specialties: ['Luxury Properties', 'Investment Consulting', 'Market Analysis'],
    rating: 4.9,
    reviews: 145,
    phone: '+420-777-123-456',
    email: 'janek.krupicka@eliteproperties.com',
    imageUrl: '/public/images/broker/broker.png',
    availability: 'available'
  }
];

export const mockMarketInsights: MarketInsight[] = [
  {
    id: '1',
    title: 'Housing Market Trends',
    trend: 'up',
    percentage: 12.5,
    timeframe: 'Last 6 months',
    description: 'Property values have shown steady growth with increased demand in suburban areas.',
    data: [
      { label: 'Jan', value: 450000 },
      { label: 'Feb', value: 465000 },
      { label: 'Mar', value: 478000 },
      { label: 'Apr', value: 485000 },
      { label: 'May', value: 492000 },
      { label: 'Jun', value: 506000 }
    ]
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
    ]
  }
];

export const mockQuickActions: QuickAction[] = [
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

export const mockBookings: Booking[] = [
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
    createdAt: '2025-01-15T10:30:00Z'
  }
];