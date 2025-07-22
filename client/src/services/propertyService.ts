import { apiService } from './api';
import { Property } from '../types';

export interface PropertyFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  search?: string;
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// Map database property to frontend Property interface
const mapDbPropertyToFrontend = (dbProperty: any): Property => {
  return {
    id: dbProperty.uuid || dbProperty.id?.toString() || '',
    title: dbProperty.title || '',
    description: dbProperty.description || '',
    price: parseFloat(dbProperty.price) || 0,
    location: dbProperty.location || `${dbProperty.city || ''}, ${dbProperty.state || ''}`.trim().replace(/,$/, ''),
    bedrooms: parseInt(dbProperty.bedrooms) || 0,
    bathrooms: parseFloat(dbProperty.bathrooms) || 0,
    squareFootage: parseInt(dbProperty.square_footage) || 0,
    imageUrl: dbProperty.main_image_url || dbProperty.imageUrl || '',
    images: dbProperty.images || (dbProperty.main_image_url ? [dbProperty.main_image_url] : []),
    type: dbProperty.property_type || dbProperty.type || 'house',
    status: dbProperty.status || 'available'
  };
};

class PropertyService {
  // Get all properties with optional filters
  async getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
    try {
      console.log('PropertyService: Fetching properties with filters:', filters);
      
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;
      
      console.log('PropertyService: Making request to endpoint:', endpoint);
      
      const response = await apiService.get<any>(endpoint);
      
      console.log('PropertyService: Received response:', response);
      
      // Handle different response formats
      if (response.success && response.data) {
        // Handle nested data structure
        if (response.data.properties && Array.isArray(response.data.properties)) {
          const properties = response.data.properties.map(mapDbPropertyToFrontend);
          console.log('PropertyService: Parsed properties from nested structure:', properties.length, 'items');
          return properties;
        } else if (Array.isArray(response.data)) {
          const properties = response.data.map(mapDbPropertyToFrontend);
          console.log('PropertyService: Parsed properties from array data:', properties.length, 'items');
          return properties;
        }
      } else if (Array.isArray(response)) {
        const properties = response.map(mapDbPropertyToFrontend);
        console.log('PropertyService: Direct array response:', properties.length, 'items');
        return properties;
      }
      
      console.warn('PropertyService: Unexpected API response format:', response);
      return [];
    } catch (error) {
      console.error('PropertyService: Failed to fetch properties:', error);
      throw error;
    }
  }

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await apiService.get<any>(`/properties/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      } else if (response.id) {
        return response;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to fetch property ${id}:`, error);
      throw error;
    }
  }

  // Create a new property (for authenticated users)
  async createProperty(propertyData: Omit<Property, 'id'>): Promise<Property> {
    try {
      const response = await apiService.post<any>('/properties', propertyData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to create property');
    } catch (error) {
      console.error('Failed to create property:', error);
      throw error;
    }
  }

  // Update an existing property (for authenticated users)
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    try {
      const response = await apiService.put<any>(`/properties/${id}`, propertyData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update property');
    } catch (error) {
      console.error(`Failed to update property ${id}:`, error);
      throw error;
    }
  }

  // Delete a property (for authenticated users)
  async deleteProperty(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete<any>(`/properties/${id}`);
      return response.success || true;
    } catch (error) {
      console.error(`Failed to delete property ${id}:`, error);
      throw error;
    }
  }

  // Search properties
  async searchProperties(searchTerm: string): Promise<Property[]> {
    return this.getProperties({ search: searchTerm });
  }

  // Get properties by type
  async getPropertiesByType(type: string): Promise<Property[]> {
    return this.getProperties({ type });
  }

  // Get properties by price range
  async getPropertiesByPriceRange(minPrice?: number, maxPrice?: number): Promise<Property[]> {
    return this.getProperties({ minPrice, maxPrice });
  }
}

export const propertyService = new PropertyService();
