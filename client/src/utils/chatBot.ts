import { Broker, MarketInsight, QuickAction } from '../types';
import { Property } from '../types';
import { mockProperties, mockBrokers, mockMarketInsights, mockQuickActions } from '../data/mockData';

interface ChatContext {
  lastIntent?: string;
  searchFilters?: {
    type?: string;
    maxPrice?: number;
    minPrice?: number;
    location?: string;
    bedrooms?: number;
  };
  bookingData?: {
    step: number;
    data: Record<string, string>;
  };
}

interface ChatResponse {
  response: string;
  properties?: Property[];
  brokers?: Broker[];
  marketData?: MarketInsight;
  quickActions?: QuickAction[];
}
export class SimpleChatBot {
  private context: ChatContext = {};

  private responses = {
    greeting: [
      "Hello! I'm here to help you find your dream property or schedule a meeting with our brokers. What can I assist you with today?",
      "Hi there! I'm your real estate assistant. I can help you explore properties or book meetings with our expert brokers. How may I help?",
      "Welcome! I'm here to make your property search easy. Ask me about available properties or schedule a broker consultation."
    ],
    properties: [
      "I'd be happy to help you find properties! We have houses, apartments, and development plots available. What type of property are you looking for?",
      "Great! Let me help you explore our available properties. Are you interested in houses, apartments, or land plots?",
      "We have amazing properties available! What's your preferred location and budget range?"
    ],
    booking: [
      "I can help you schedule a meeting with one of our expert brokers. Let me collect some information from you.",
      "Perfect! Let's book you a consultation with our broker team. I'll need a few details to get started.",
      "Great choice! Our brokers are ready to help. Let me gather your preferences for the meeting."
    ],
    fallback: [
      "I'm here to help with property searches and broker meetings. Could you tell me more about what you're looking for?",
      "I can assist you with finding properties or scheduling broker consultations. What would you like to know?",
      "I'd love to help! I specialize in property inquiries and booking meetings with brokers. What can I do for you?"
    ]
  };

  private getRandomResponse(category: keyof typeof this.responses): string {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    
    if (lowerMessage.includes('property') || lowerMessage.includes('house') || 
        lowerMessage.includes('apartment') || lowerMessage.includes('plot') ||
        lowerMessage.includes('buy') || lowerMessage.includes('purchase') ||
        lowerMessage.includes('show') || lowerMessage.includes('find') ||
        lowerMessage.includes('search') || lowerMessage.includes('looking')) {
      return 'properties';
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('meeting') || 
        lowerMessage.includes('appointment') || lowerMessage.includes('broker') ||
        lowerMessage.includes('schedule') || lowerMessage.includes('consultation')) {
      return 'booking';
    }
    
    return 'fallback';
  }

  private handleBookingFlow(message: string): string {
    if (!this.context.bookingData) {
      this.context.bookingData = { step: 1, data: {} };
      return "Let's schedule your meeting! First, what's your full name?";
    }

    const { step, data } = this.context.bookingData;

    switch (step) {
      case 1:
        data.name = message;
        this.context.bookingData.step = 2;
        return `Nice to meet you, ${message}! What's your email address?`;
      
      case 2:
        data.email = message;
        this.context.bookingData.step = 3;
        return "Great! What's your phone number?";
      
      case 3:
        data.phone = message;
        this.context.bookingData.step = 4;
        return "What date would work best for you? (Please use format: YYYY-MM-DD)";
      
      case 4:
        data.date = message;
        this.context.bookingData.step = 5;
        return "What time would you prefer? (Please use format: HH:MM)";
      
      case 5:
        data.time = message;
        this.context.bookingData.step = 6;
        return "Where would you like to meet? (Our office, property location, or online)";
      
      case 6:
        data.location = message;
        this.context.bookingData = undefined;
        return `Perfect! I've scheduled your meeting for ${data.date} at ${data.time} at ${message}. Our broker will contact you at ${data.email} to confirm the details. Is there anything specific you'd like to discuss during the meeting?`;
      
      default:
        return "Thank you for providing all the details! Our team will be in touch soon.";
    }
  }

  private handlePropertySearch(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // Handle cheapest properties specifically
    if (lowerMessage.includes('cheapest') || lowerMessage.includes('lowest price') || lowerMessage.includes('most affordable')) {
      const sortedProperties = [...mockProperties].sort((a, b) => a.price - b.price);
      const cheapestProperties = sortedProperties.slice(0, 3);
      
      return {
        response: `Here are our most affordable properties:`,
        properties: cheapestProperties
      };
    }
    
    // Handle luxury properties
    if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
      const luxuryProperties = mockProperties.filter(property => property.price > 700000);
      
      return {
        response: `Here are our luxury properties:`,
        properties: luxuryProperties.length > 0 ? luxuryProperties : mockProperties.slice(0, 3)
      };
    }
    
    // Extract search criteria
    const filters: any = {};
    
    // Property type detection
    if (lowerMessage.includes('house') || lowerMessage.includes('villa')) {
      filters.type = 'house';
    } else if (lowerMessage.includes('apartment') || lowerMessage.includes('condo')) {
      filters.type = 'apartment';
    } else if (lowerMessage.includes('plot') || lowerMessage.includes('land')) {
      filters.type = 'plot';
    }
    
    // Price detection
    const priceMatch = lowerMessage.match(/\$?(\d+)k?/g);
    if (priceMatch) {
      const prices = priceMatch.map(p => {
        const num = parseInt(p.replace(/\$|k/g, ''));
        return p.includes('k') ? num * 1000 : num;
      });
      
      if (lowerMessage.includes('under') || lowerMessage.includes('below')) {
        filters.maxPrice = Math.max(...prices);
      } else if (lowerMessage.includes('over') || lowerMessage.includes('above')) {
        filters.minPrice = Math.min(...prices);
      } else if (prices.length === 2) {
        filters.minPrice = Math.min(...prices);
        filters.maxPrice = Math.max(...prices);
      } else {
        filters.maxPrice = prices[0];
      }
    }
    
    // Bedroom detection
    const bedroomMatch = lowerMessage.match(/(\d+)\s*(bed|bedroom)/);
    if (bedroomMatch) {
      filters.bedrooms = parseInt(bedroomMatch[1]);
    }
    
    // Location detection
    const locationKeywords = ['in', 'at', 'near', 'around'];
    for (const keyword of locationKeywords) {
      const locationMatch = lowerMessage.match(new RegExp(`${keyword}\\s+([a-zA-Z\\s,]+?)(?:\\s|$|,)`));
      if (locationMatch) {
        filters.location = locationMatch[1].trim();
        break;
      }
    }
    
    // Store filters in context
    this.context.searchFilters = filters;
    
    // Filter properties
    let filteredProperties = mockProperties.filter(property => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      return true;
    });
    
    if (filteredProperties.length > 0) {
      let response = `Great! I found ${filteredProperties.length} properties that match your criteria`;
      
      if (filters.type) {
        response += ` for ${filters.type}s`;
      }
      if (filters.maxPrice) {
        response += ` under $${filters.maxPrice.toLocaleString()}`;
      }
      if (filters.minPrice) {
        response += ` over $${filters.minPrice.toLocaleString()}`;
      }
      if (filters.bedrooms) {
        response += ` with ${filters.bedrooms} bedrooms`;
      }
      if (filters.location) {
        response += ` in ${filters.location}`;
      }
      
      response += '. Here are the properties:';
      
      return {
        response,
        properties: filteredProperties
      };
    }

    // Special message for very low budget searches
    let noMatchResponse = "I couldn't find any properties matching those exact criteria.";
    
    if (filters.maxPrice && filters.maxPrice < 50000) {
      noMatchResponse = `I understand you're looking for properties under $${filters.maxPrice.toLocaleString()}, but our current inventory starts at higher price points.`;
    }
    
    noMatchResponse += " However, here are some of our popular properties that might interest you. You can try searching with different criteria like 'houses under $600k' or 'apartments with 2 bedrooms'.";
    
    return {
      response: noMatchResponse,
      properties: mockProperties.slice(0, 3) // Show first 3 as examples
    };
  }

  public processMessage(message: string): ChatResponse {
    const intent = this.detectIntent(message);
    const lowerMessage = message.toLowerCase();

    // Handle ongoing booking flow
    if (this.context.bookingData) {
      return { response: this.handleBookingFlow(message) };
    }

    // Handle new intents
    switch (intent) {
      case 'greeting':
        // Show quick actions on greeting
        return { 
          response: this.getRandomResponse('greeting'),
          quickActions: mockQuickActions
        };
      
      case 'properties':
        this.context.lastIntent = 'properties';
        return this.handlePropertySearch(message);
      
      case 'booking':
        this.context.lastIntent = 'booking';
        // Show available brokers when booking is mentioned
        return { 
          response: this.handleBookingFlow(message),
          brokers: mockBrokers
        };
      
      default:
        // Context-aware responses and special keywords
        if (this.context.lastIntent === 'properties') {
          return this.handlePropertySearch(message);
        }
        
        // Check for broker-related keywords
        if (lowerMessage.includes('broker') || lowerMessage.includes('agent') || lowerMessage.includes('expert') || 
            lowerMessage.includes('contact') || lowerMessage.includes('janek') || lowerMessage.includes('krupička')) {
          return {
            response: "Here are our experienced real estate professionals who can help you:",
            brokers: mockBrokers
          };
        }
        
        // Check for market-related keywords
        if (lowerMessage.includes('market') || lowerMessage.includes('trend') || lowerMessage.includes('price') || lowerMessage.includes('analysis')) {
          return {
            response: "Here's the latest market insight for your area:",
            marketData: mockMarketInsights[0]
          };
        }
        
        // Check for help or options
        if (lowerMessage.includes('help') || lowerMessage.includes('option') || lowerMessage.includes('what can')) {
          return {
            response: "I can help you with various real estate needs. Here are some quick actions you can take:",
            quickActions: mockQuickActions
          };
        }
        
        return { response: this.getRandomResponse('fallback') };
    }
  }

  public reset(): void {
    this.context = {};
  }
}