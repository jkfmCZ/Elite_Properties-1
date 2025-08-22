import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconSquare, 
  IconCalendar, 
  IconPhone, 
  IconMail, 
  IconHeart, 
  IconShare, 
  IconChevronLeft, 
  IconChevronRight,
  IconLoader,
  IconAlertCircle
} from '@tabler/icons-react';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/use-toast';
import { propertyService } from '../services/propertyService';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const { toast } = useToast();

  // Check if current property is favorited
  const isFavorited = property ? favorites.includes(property.id) : false;

  // Function to get image URL with proper handling for database images
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder-property.jpg';
    
    // If it's already a full URL, use it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path starting with /uploads, construct full URL
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:5000${imageUrl}`;
    }
    
    // If it's just a filename or path without /uploads, construct full path
    if (!imageUrl.startsWith('/')) {
      return `http://localhost:5000/uploads/images/${imageUrl}`;
    }
    
    // Default case
    return `http://localhost:5000${imageUrl}`;
  };

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('No property ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching property with ID:', id);
        
        // First try to find in mock data
        const mockProperty = mockProperties.find(p => p.id === id);
        if (mockProperty) {
          console.log('Found property in mock data:', mockProperty);
          setProperty(mockProperty);
          setLoading(false);
          return;
        }

        // If not found in mock data, try database
        console.log('Property not found in mock data, trying database...');
        const dbProperty = await propertyService.getPropertyById(id);
        
        if (dbProperty) {
          console.log('Found property in database:', dbProperty);
          setProperty(dbProperty);
        } else {
          console.log('Property not found in database either');
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Scroll to top when component mounts or property changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <IconLoader className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Property
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please wait while we fetch the property details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <IconAlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Property Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error === 'Property not found' 
              ? "The property you're looking for doesn't exist or may have been removed." 
              : "There was an error loading the property. Please try again or contact support if the problem persists."
            }
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/properties">Back to Properties</Link>
            </Button>
            {error !== 'Property not found' && (
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            )}
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Debug Info:</strong> Property ID: {id}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get all images for the property (use images array if available, fallback to single imageUrl)
  const allImages = property.images && property.images.length > 0 
    ? property.images.map(img => getImageUrl(img))
    : [getImageUrl(property.imageUrl)];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Handle favorite toggle
  const handleFavorite = () => {
    if (!property) return;
    
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

  // Handle share functionality
  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: property.title,
      text: `Check out this amazing property: ${property.title} in ${property.location}`,
      url: window.location.href,
    };

    try {
      // Try using native Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Property details have been shared.",
        });
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Property link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      // If all else fails, show the URL in a toast
      toast({
        title: "Share this property",
        description: window.location.href,
        duration: 5000,
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

  const getTypeColor = (type: string) => {
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
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/properties" className="flex items-center">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-2xl transition-all duration-300"
                  onError={(e) => {
                    // Fallback image if the image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-property.jpg';
                  }}
                />
                
                {/* Overlay gradient for better icon visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 rounded-xl pointer-events-none" />
                
                <div className="absolute top-6 left-6">
                  <Badge className={getTypeColor(property.type)} variant="secondary">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </Badge>
                </div>
                
                <div className="absolute top-6 right-6 flex gap-3">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-10 w-12 flex items-center justify-center"
                      onClick={handleFavorite}
                    >
                      <IconHeart className={`h-5 w-5 transition-colors duration-200 ${
                        isFavorited 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-600 hover:text-red-500'
                      }`} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-10 w-12 flex items-center justify-center"
                      onClick={handleShare}
                    >
                      <IconShare className="h-5 w-5 text-blue-500 hover:text-blue-600 transition-colors duration-200" />
                    </Button>
                </div>
                
                {/* Navigation arrows for multiple images */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-0 h-10 w-14 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                      onClick={prevImage}
                    >
                      <IconChevronLeft className="h-10 w-10 text-gray-800" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-0 h-10 w-14 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                      onClick={nextImage}
                    >
                      <IconChevronRight className="h-10 w-10 text-gray-800" />
                    </Button>
                  </>
                )}
                
                {/* Image counter */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-6 right-6">
                    <Badge variant="secondary" className="bg-black/70 backdrop-blur-sm text-white border-0 px-3 py-1">
                      {currentImageIndex + 1} / {allImages.length}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Gallery ({allImages.length} photos)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {allImages.map((image: string, index: number) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                          currentImageIndex === index
                            ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 hover:shadow-md hover:scale-102'
                        }`}
                        whileHover={{ scale: currentImageIndex === index ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-property.jpg';
                          }}
                        />
                        {currentImageIndex === index && (
                          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg" />
                          </div>
                        )}
                        {/* Thumbnail number overlay */}
                        <div className="absolute top-1 left-1">
                          <div className="bg-black/60 text-white text-xs px-1.5 py-0.5 rounded text-center min-w-[20px]">
                            {index + 1}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {property.title}
                      </CardTitle>
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                        <IconMapPin className="h-5 w-5 mr-2" />
                        <span className="text-lg">{property.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(property.price)}
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {property.type !== 'plot' && (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <IconBed className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Bedrooms</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <IconBath className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Bathrooms</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <IconSquare className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.squareFootage.toLocaleString()}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Sq Ft</div>
                        </div>
                      </div>
                      <Separator className="my-6" />
                    </>
                  )}

                  {property.type === 'plot' && (
                    <>
                      <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                        <IconSquare className="h-12 w-12 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {property.squareFootage.toLocaleString()} sq ft
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-300">Total Lot Size</div>
                      </div>
                      <Separator className="my-6" />
                    </>
                  )}

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Property Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Modern Kitchen</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Hardwood Floors</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Central Air Conditioning</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Garage Parking</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Garden/Yard</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Security System</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Agent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">JD</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">John Doe</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Senior Real Estate Agent</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <IconPhone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <IconMail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <Link to="/calendar">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mortgage Calculator */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Down Payment (20%)
                      </label>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(property.price * 0.2)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Estimated Monthly Payment
                      </label>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice((property.price * 0.8 * 0.005) + (property.price * 0.001))}
                      </div>
                      <p className="text-xs text-gray-500">*Estimated at 5% interest rate</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Get Pre-Approved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Similar Properties */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Similar Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      Similar properties feature coming soon...
                    </p>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/properties">View All Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}