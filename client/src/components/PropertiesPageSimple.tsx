import { useState } from 'react';
import { mockProperties } from '../data/mockData';
import { Property } from '../types';

export function PropertiesPageSimple() {
  const [properties] = useState<Property[]>(mockProperties);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Properties ({properties.length})
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {property.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {property.location}
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ${property.price.toLocaleString()}
              </p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.squareFootage} sq ft</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
