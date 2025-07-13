import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { IconRefresh } from '@tabler/icons-react';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';
import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export function PropertiesPage() {
  const [properties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-asc');

  // Apply sorting and filtering whenever any filter changes
  useEffect(() => {
    filterProperties(searchTerm, propertyType, priceRange);
  }, [searchTerm, propertyType, priceRange, sortBy]);

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
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(term.toLowerCase()) ||
        property.location.toLowerCase().includes(term.toLowerCase()) ||
        property.description.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Type filter
    if (type !== 'all') {
      filtered = filtered.filter(property => property.type === type);
    }

    // Price filter
    if (range !== 'all') {
      console.log('Applying price filter:', range);
      if (range === '1000000') {
        // Above $1M case
        filtered = filtered.filter(property => property.price >= 1000000);
        console.log('Filtered for >$1M:', filtered.length, 'properties');
      } else {
        const [min, max] = range.split('-').map(Number);
        console.log('Price range:', min, 'to', max);
        filtered = filtered.filter(property => {
          if (max) {
            return property.price >= min && property.price <= max;
          }
          return property.price >= min;
        });
        console.log('Filtered for range:', filtered.length, 'properties');
      }
    }

    // Sort
    filtered.sort((a, b) => {
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

        {/* Filters */}
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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

        {/* Results Count */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </motion.div>

        {/* Properties Grid */}
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

        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
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