export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  imageUrl: string; // Main image for backwards compatibility
  images?: string[]; // Additional images for gallery
  type: 'house' | 'plot' | 'apartment';
  status: 'available' | 'sold' | 'pending';
}

export interface Booking {
  id: string;
  propertyId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  preferredLocation: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'booking' | 'property' | 'broker' | 'market-insight' | 'quick-actions';
  embedData?: {
    properties?: Property[];
    brokers?: Broker[];
    marketData?: MarketInsight;
    actions?: QuickAction[];
  };
}

export interface Broker {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialties: string[];
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  imageUrl: string;
  availability: 'available' | 'busy' | 'offline';
}

export interface MarketInsight {
  id: string;
  title: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  timeframe: string;
  description: string;
  data: {
    label: string;
    value: number;
  }[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  variant: 'primary' | 'secondary' | 'outline';
}