import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconSearch, IconFilter, IconRefresh, IconWifi, IconWifiOff, IconDatabase, IconFileText } from '@tabler/icons-react';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';
import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { propertyService } from '../services/propertyService';
import { toast } from '@/hooks/use-toast';

/**
 * PropertiesPage Component
 * 
 * Features:
 * - Toggle between mock data and live database data
 * - Client-side filtering and sorting for both data sources
 * - Server-side filtering support for database queries
 * - Real-time data refresh functionality
 * - Loading states and error handling
 */
export function PropertiesPage() {
  // State for data source and properties
  const [useDbData, setUseDbData] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [loading, setLoading] = useState(false);
  
  // Computed values
  const isUsingMockData = !useDbData;

  // Fetch properties from database
  const fetchDbProperties = async (currentFilters?: { type?: string; search?: string; minPrice?: number; maxPrice?: number }) => {
    setLoading(true);
    try {
      const filters: any = {};
      
      // Apply current filters when fetching from DB
      if (currentFilters?.type && currentFilters.type !== 'all') {
        filters.type = currentFilters.type;
      }
      if (currentFilters?.search) {
        filters.search = currentFilters.search;
      }
      if (currentFilters?.minPrice) {
        filters.minPrice = currentFilters.minPrice;
      }
      if (currentFilters?.maxPrice) {
        filters.maxPrice = currentFilters.maxPrice;
      }
      
      const dbProperties = await propertyService.getProperties(filters);
      setProperties(dbProperties);
      toast({
        title: "Success",
        description: `Loaded ${dbProperties.length} properties from database`,
      });
    } catch (error) {
      console.error('Failed to fetch properties from database:', error);
      toast({
        title: "Error",
        description: "Failed to connect to database. Using mock data instead.",
        variant: "destructive",
      });
      // Fall back to mock data on error
      setUseDbData(false);
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  // Handle data source toggle
  const handleDataSourceToggle = async () => {
    if (!useDbData) {
      // Switching to database data - pass current filters
      const currentFilters = {
        type: propertyType,
        search: searchTerm,
        ...(priceRange !== 'all' && priceRange.includes('-') ? {
          minPrice: parseInt(priceRange.split('-')[0]),
          maxPrice: parseInt(priceRange.split('-')[1])
        } : {}),
        ...(priceRange === '1000000' ? { minPrice: 1000000 } : {})
      };
      await fetchDbProperties(currentFilters);
      setUseDbData(true);
    } else {
      // Switching to mock data
      setUseDbData(false);
      setProperties(mockProperties);
      toast({
        title: "Switched to Mock Data",
        description: "Now using demo data for offline browsing",
      });
    }
  };

  // Apply sorting and filtering whenever any filter changes or data loads
  useEffect(() => {
    filterProperties(searchTerm, propertyType, priceRange);
  }, [searchTerm, propertyType, priceRange, sortBy, properties]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (type: string) => {
    setPropertyType(type);
  };

  const handlePriceFilter = (range: string) => {
    setPriceRange(range);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPropertyType('all');
    setPriceRange('all');
    setSortBy('price-asc');
  };

  const filterProperties = (term: string, type: string, range: string) => {
    console.log('Filtering with:', { term, type, range });
    let filtered = properties;

    // Search filter
    if (term) {
      filtered = filtered.filter((property: Property) =>
        property.title.toLowerCase().includes(term.toLowerCase()) ||
        property.location.toLowerCase().includes(term.toLowerCase()) ||
        property.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Type filter
    if (type !== 'all') {
      filtered = filtered.filter((property: Property) => property.type === type);
    }

    // Price filter
    if (range !== 'all') {
      console.log('Applying price filter:', range);
      if (range === '1000000') {
        // Above $1M case
        filtered = filtered.filter((property: Property) => property.price >= 1000000);
        console.log('Filtered for >$1M:', filtered.length, 'properties');
      } else {
        const [min, max] = range.split('-').map(Number);
        console.log('Price range:', min, 'to', max);
        filtered = filtered.filter((property: Property) => {
          if (max) {
            return property.price >= min && property.price <= max;
          }
          return property.price >= min;
        });
        console.log('Filtered for range:', filtered.length, 'properties');
      }
    }

    // Sort
    filtered.sort((a: Property, b: Property) => {
      switch (sortBy) {
        case 'price-asc':
          return b.price - a.price; // Low to High (reversed to fix issue)
        case 'price-desc':
          return a.price - b.price; // High to Low (reversed to fix issue)
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    console.log('Final filtered properties:', filtered.length);
    setFilteredProperties(filtered);
  };

  // Handle data refresh
  const handleRefresh = async () => {
    if (useDbData) {
      const currentFilters = {
        type: propertyType,
        search: searchTerm,
        ...(priceRange !== 'all' && priceRange.includes('-') ? {
          minPrice: parseInt(priceRange.split('-')[0]),
          maxPrice: parseInt(priceRange.split('-')[1])
        } : {}),
        ...(priceRange === '1000000' ? { minPrice: 1000000 } : {})
      };
      await fetchDbProperties(currentFilters);
    } else {
      window.location.reload();
    }
  };

  const handleViewDetails = (property: Property) => {
    // In a real app, this would navigate to a detail page
    alert(`Viewing details for: ${property.title}\nPrice: $${property.price.toLocaleString()}\nLocation: ${property.location}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 px-4">
            Discover Premium Properties
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Explore our curated collection of homes, apartments, and investment opportunities 
            in prime locations.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-blue-500 mb-4">
              <IconRefresh className="h-16 w-16 mx-auto animate-spin" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Properties
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
              Fetching properties from database...
            </p>
          </motion.div>
        )}

        {/* Connection Status Indicator */}
        {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                {isUsingMockData ? (
                  <>
                    <IconWifiOff className="h-3 w-3 mr-1 text-orange-500" />
                    <span>Using mock data - API integration coming soon</span>
                  </>
                ) : (
                  <>
                    <IconWifi className="h-3 w-3 mr-1 text-green-500" />
                    <span>Connected to database</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDataSourceToggle}
                  className="h-6 px-2 text-xs"
                  disabled={loading}
                >
                  {isUsingMockData ? (
                    <>
                      <IconDatabase className="h-3 w-3 mr-1" />
                      Use DB Data
                    </>
                  ) : (
                    <>
                      <IconFileText className="h-3 w-3 mr-1" />
                      Use Mock Data
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="h-6 px-2 text-xs"
                  disabled={loading}
                >
                  <IconRefresh className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="relative sm:col-span-2 lg:col-span-2">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search properties..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Property Type */}
                  <Select value={propertyType} onValueChange={handleTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">Houses</SelectItem>
                      <SelectItem value="apartment">Apartments</SelectItem>
                      <SelectItem value="plot">Plots</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Price Range */}
                  <Select value={priceRange} onValueChange={handlePriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500000">Under $500K</SelectItem>
                      <SelectItem value="500000-750000">$500K - $750K</SelectItem>
                      <SelectItem value="750000-1000000">$750K - $1M</SelectItem>
                      <SelectItem value="1000000">Above $1M</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="title">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Reset Filters Button */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full"
                    >
                      <IconRefresh className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Showing {filteredProperties.length} of {properties.length} properties
              {isUsingMockData && (
                <span className="ml-2 text-orange-600 dark:text-orange-400">
                  (offline mode)
                </span>
              )}
              {!isUsingMockData && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  (live data)
                </span>
              )}
            </p>
          </motion.div>
        )}

        {/* Properties Grid */}
        {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <PropertyCard
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProperties.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <IconFilter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 px-4">
              Try adjusting your filters or search terms to find more properties.
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}