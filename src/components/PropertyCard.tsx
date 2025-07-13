import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight, Heart } from 'lucide-react';
import { Property } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/use-toast';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const { toast } = useToast();
  
  // Check if current property is favorited
  const isFavorited = favorites.includes(property.id);

  // Handle favorite toggle
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    e.stopPropagation();
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== property.id));
      toast({
        title: "Removed from favorites",
        description: `${property.title} has been removed from your favorites.`,
      });
    } else {
      setFavorites([...favorites, property.id]);
      toast({
        title: "Added to favorites",
        description: `${property.title} has been added to your favorites.`,
      });
    }
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeColor = (type: Property['type']) => {
    switch (type) {
      case 'house':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'apartment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'plot':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getTypeColor(property.type)}>
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-10 w-12 flex items-center justify-center rounded-md"
              onClick={handleFavorite}
            >
              <Heart className={`h-10 w-10 transition-all duration-200 ${
                isFavorited 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-gray-700 hover:text-red-500 hover:scale-110'
              }`} />
            </Button>
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {property.status}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {property.description}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(property.price)}
            </div>
          </div>

          {property.type !== 'plot' && (
            <div className="flex items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 flex-wrap">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.squareFootage.toLocaleString()} sq ft</span>
              </div>
            </div>
          )}

          {property.type === 'plot' && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.squareFootage.toLocaleString()} sq ft lot</span>
            </div>
          )}

          <Button 
            className="w-full group/btn text-sm sm:text-base"
            asChild
          >
            <Link to={`/property/${property.id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}