import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconHome, IconMapPin, IconPhone,
  IconStar, IconTrendingUp, IconAward, IconPin, IconClock,
  IconBed, IconBath, IconSquare, IconArrowRight, IconMessageCircle,
  IconChevronRight, IconCertificate, IconCalendar, IconHeart
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockProperties } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/use-toast';

export function HomePage() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const { toast } = useToast();

  // Handle favorite toggle
  const handleFavorite = (propertyId: string, propertyTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorited = favorites.includes(propertyId);
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav !== propertyId));
      toast({
        title: "Removed from favorites",
        description: `${propertyTitle} has been removed from your favorites.`,
      });
    } else {
      setFavorites([...favorites, propertyId]);
      toast({
        title: "Added to favorites",
        description: `${propertyTitle} has been added to your favorites.`,
      });
    }
  };

  // Sample broker data
  const brokerInfo = {
    name: 'Janek Krupička',
    title: 'Senior Real Estate Broker',
    experience: '12+ Years Experience',
    rating: 4.9,
    reviews: 150,
    phone: '+1 123 456 7890',
    email: 'janek.krupicka@eliteproperties.com',
    linkedin: 'linkedin.com/in/janekkrupicka-realtor',
    image: "/images/broker/broker.png",
    specialties: ['Luxury Homes', 'Investment Properties', 'First-Time Buyers'],
    achievements: [
      'Top 5% Broker Nationwide',
      '$69B+ in Sales (2024)',
      'Certified Luxury Specialist'
    ]
  };

  // Get pinned properties (first 3)
  const pinnedProperties = mockProperties.slice(0, 3);
  
  // Get new properties (last 3)
  const newProperties = mockProperties.slice(3, 6);

  const stats = [
    { number: '9999+', label: 'Properties Sold', icon: IconHome },
    { number: '$690B+', label: 'Total Sales Volume', icon: IconTrendingUp },
    { number: '4.9', label: 'Client Rating', icon: IconStar },
    { number: '98%', label: 'Client Satisfaction', icon: IconAward }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Your Trusted Partner in
              <span className="block text-emerald-600 dark:text-emerald-400">
                Elite Real Estate
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              With over 12 years of experience in luxury real estate, we specialize in helping clients 
              find their perfect property. From first-time buyers to seasoned investors, we provide 
              personalized service and expert market insights.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {brokerInfo.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {specialty}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/properties">
                  <IconHome className="mr-2 h-5 w-5" />
                  View All Properties
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/chat">
                  <IconMessageCircle className="mr-2 h-5 w-5" />
                  Chat with AI Assistant
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-emerald-600 dark:bg-emerald-700">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="h-8 w-8 text-white mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-emerald-100">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pinned Properties Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <IconPin className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Featured Properties
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hand-picked premium properties that offer exceptional value and investment potential.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pinnedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-600 text-white flex items-center gap-1">
                        <IconHeart className="h-3 w-3" />
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0  h-8 w-8 p-0 flex items-center justify-center rounded-md"
                        onClick={(e) => handleFavorite(property.id, property.title, e)}
                      >
                        <IconHeart className={`h-3 w-3 transition-all duration-200 ${
                          favorites.includes(property.id)
                            ? 'text-red-500 fill-red-500 scale-110' 
                            : 'text-gray-700 hover:text-red-500 hover:scale-110'
                        }`} />
                      </Button>
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        ${property.price.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-3">
                      <IconMapPin className="h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <IconBed className="h-4 w-4" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBath className="h-4 w-4" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconSquare className="h-4 w-4" />
                        {property.squareFootage} sq ft
                      </span>
                    </div>
                    <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Link to={`/property/${property.id}`}>
                        View Details
                        <IconChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Properties Section */}
      <section className="w-full py-24 bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <IconClock className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Just Listed
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fresh on the market - these newly listed properties won't last long.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white flex items-center gap-1">
                        <IconClock className="h-3 w-3" />
                        New
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-10 w-12 flex items-center justify-center rounded-md"
                        onClick={(e) => handleFavorite(property.id, property.title, e)}
                      >
                        <IconHeart className={`h-3 w-3 transition-all duration-200 ${
                          favorites.includes(property.id)
                            ? 'text-red-500 fill-red-500 scale-110' 
                            : 'text-gray-700 hover:text-red-500 hover:scale-110'
                        }`} />
                      </Button>
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        ${property.price.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-3">
                      <IconMapPin className="h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <IconBed className="h-4 w-4" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBath className="h-4 w-4" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconSquare className="h-4 w-4" />
                        {property.squareFootage} sq ft
                      </span>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/property/${property.id}`}>
                        View Details
                        <IconChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" variant="outline">
              <Link to="/properties">
                View All Properties
                <IconArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-gray-900 dark:bg-gray-950">
        <div className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 px-4">
              Let's work together to find the property that matches your dreams and budget. 
              Contact me today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/chat">
                  <IconMessageCircle className="mr-2 h-5 w-5" />
                  Start with AI Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Link to="/properties">
                  <IconArrowRight className="mr-2 h-5 w-5" />
                  Browse All Properties
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-5 w-5" />
                  <span>Available 7 Days a Week</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="h-5 w-5" />
                  <span>Quick Response Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCertificate className="h-5 w-5" />
                  <span>Licensed & Insured</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}