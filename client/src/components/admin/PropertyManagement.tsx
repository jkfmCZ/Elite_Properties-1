import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
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
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5000/api/properties/dashboard/my-properties?published=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProperties(data.data || []);
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
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((property: Property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((property: Property) => property.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((property: Property) => property.property_type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async (property: Property) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/properties/${property.uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      if (response.ok) {
        setProperties(properties.filter((p: Property) => p.uuid !== property.uuid));
        toast({
          title: 'Success',
          description: 'Property deleted successfully',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete property');
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

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
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
    return colors[status as keyof typeof colors] || colors.available;
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
                <Button variant="outline">
                  <IconFilter size={16} className="mr-2" />
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  <IconChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All
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
                <Button variant="outline">
                  <IconFilter size={16} className="mr-2" />
                  Type: {typeFilter === 'all' ? 'All' : typeFilter}
                  <IconChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  All
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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <IconPlus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Get started by adding your first property'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Properties Grid */
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
                      src={`http://localhost:5000${property.main_image_url}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconMapPin size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={getStatusBadge(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(property)}>
                      <IconEdit size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => setDeleteProperty(property)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                </div>

                {/* Property Details */}
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <IconMapPin size={14} className="mr-1" />
                      {property.city}, {property.state}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center text-lg font-bold text-blue-600 dark:text-blue-400">
                      <IconCurrencyDollar size={18} />
                      {formatCurrency(property.price)}
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <IconBed size={14} className="mr-1" />
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center">
                      <IconBath size={14} className="mr-1" />
                      {property.bathrooms} bath
                    </div>
                    <div className="flex items-center">
                      <IconSquare size={14} className="mr-1" />
                      {property.square_footage.toLocaleString()} sqft
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(property.created_at).toLocaleDateString()}
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
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
