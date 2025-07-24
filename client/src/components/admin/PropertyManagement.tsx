import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconSearch,
  IconFilter,
  IconChevronDown,
  IconMapPin,
  IconBed,
  IconBath,
  IconSquare,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PropertyForm } from './PropertyForm';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  uuid: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  property_type: string;
  status: 'available' | 'pending' | 'sold';
  published: boolean;
  main_image_url?: string;
  created_at: string;
  updated_at: string;
  booking_count?: number;
  image_count?: number;
}

export function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteProperty, setDeleteProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/properties/dashboard/my-properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProperties(data.data);
        }
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.property_type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async (property: Property) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/properties/${property.uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== property.id));
        toast({
          title: 'Success',
          description: 'Property deleted successfully',
        });
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    }
    setDeleteProperty(null);
  };

  const handlePropertySaved = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      sold: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty}
        onSave={handlePropertySaved}
        onCancel={() => {
          setShowForm(false);
          setEditingProperty(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Property Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your property listings
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <IconPlus size={20} />
          <span>Add Property</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <IconFilter size={16} />
                  <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                  <IconChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('available')}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('sold')}>
                  Sold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <IconFilter size={16} />
                  <span>Type: {typeFilter === 'all' ? 'All' : typeFilter}</span>
                  <IconChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('house')}>
                  House
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('apartment')}>
                  Apartment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('plot')}>
                  Plot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('commercial')}>
                  Commercial
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <IconMapPin size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters to see more properties.'
                : 'Get started by adding your first property.'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {property.main_image_url ? (
                    <img
                      src={property.main_image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconMapPin size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={getStatusBadge(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                  {!property.published && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <IconMapPin size={14} className="mr-1" />
                        <span className="line-clamp-1">{property.location}, {property.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <IconBed size={14} className="mr-1 text-gray-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <IconBath size={14} className="mr-1 text-gray-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <IconSquare size={14} className="mr-1 text-gray-400" />
                          <span>{property.square_footage?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconCurrencyDollar size={16} className="text-green-600 dark:text-green-400" />
                        <span className="font-bold text-lg text-green-600 dark:text-green-400">
                          {formatCurrency(property.price)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.booking_count || 0} bookings
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/property/${property.uuid}`, '_blank')}
                        className="flex-1"
                      >
                        <IconEye size={14} className="mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProperty(property);
                          setShowForm(true);
                        }}
                        className="flex-1"
                      >
                        <IconEdit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteProperty(property)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <IconTrash size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProperty} onOpenChange={() => setDeleteProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProperty?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProperty && handleDelete(deleteProperty)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
