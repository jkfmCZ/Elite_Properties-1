import { useState, useEffect, useCallback } from 'react';
import { Property } from '../types';
import { propertyService, PropertyFilters } from '../services/propertyService';
import { ApiError } from '../services/api';
import { mockProperties } from '../data/mockData';

interface UsePropertiesOptions {
  useMockData?: boolean;
  filters?: PropertyFilters;
  autoFetch?: boolean;
}

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isUsingMockData: boolean;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
  const { 
    useMockData = false, 
    filters = {}, 
    autoFetch = true 
  } = options;

  const [properties, setProperties] = useState<Property[]>(useMockData ? mockProperties : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(useMockData);

  const fetchProperties = useCallback(async () => {
    console.log('useProperties: Starting fetch with options:', { useMockData, filters });
    
    if (useMockData) {
      // Use mock data immediately
      console.log('useProperties: Using mock data');
      setProperties(mockProperties);
      setIsUsingMockData(true);
      setError(null);
      return;
    }

    console.log('useProperties: Fetching from API');
    setLoading(true);
    setError(null);

    try {
      const data = await propertyService.getProperties(filters);
      console.log('useProperties: API data received:', data.length, 'properties');
      setProperties(data);
      setIsUsingMockData(false);
    } catch (err) {
      console.error('useProperties: Failed to fetch properties from API, falling back to mock data:', err);
      
      let errorMessage = 'Failed to load properties from server';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Fall back to mock data if API fails
      console.log('useProperties: Falling back to mock data');
      setProperties(mockProperties);
      setIsUsingMockData(true);
      setError(`${errorMessage}. Using offline data.`);
    } finally {
      setLoading(false);
    }
  }, [useMockData, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchProperties();
    }
  }, [fetchProperties, autoFetch]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    isUsingMockData,
  };
}

// Hook for fetching a single property
interface UsePropertyOptions {
  useMockData?: boolean;
  autoFetch?: boolean;
}

interface UsePropertyReturn {
  property: Property | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isUsingMockData: boolean;
}

export function useProperty(id: string, options: UsePropertyOptions = {}): UsePropertyReturn {
  const { useMockData = false, autoFetch = true } = options;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(useMockData);

  const fetchProperty = useCallback(async () => {
    if (useMockData) {
      const mockProperty = mockProperties.find(p => p.id === id);
      setProperty(mockProperty || null);
      setIsUsingMockData(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await propertyService.getPropertyById(id);
      setProperty(data);
      setIsUsingMockData(false);
    } catch (err) {
      console.error(`Failed to fetch property ${id} from API, falling back to mock data:`, err);
      
      let errorMessage = 'Failed to load property from server';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Fall back to mock data if API fails
      const mockProperty = mockProperties.find(p => p.id === id);
      setProperty(mockProperty || null);
      setIsUsingMockData(true);
      setError(`${errorMessage}. Using offline data.`);
    } finally {
      setLoading(false);
    }
  }, [id, useMockData]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchProperty();
    }
  }, [fetchProperty, autoFetch, id]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
    isUsingMockData,
  };
}
