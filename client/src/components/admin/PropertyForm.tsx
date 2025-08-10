import { useState, useEffect } from 'react';
import { 
  IconArrowLeft, 
  IconDeviceFloppy, 
  IconX,
  IconBed,
  IconBath,
  IconSquare,
  IconCurrencyDollar,
  IconPlus,
  IconDice
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id?: string;
  uuid?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  zip_code?: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  lot_size?: number;
  year_built?: number;
  property_type: string;
  status: 'available' | 'pending' | 'sold';
  published: boolean;
  main_image_url?: string;
  features?: string[];
  amenities?: string[];
}

interface PropertyFormProps {
  property?: Property | null;
  onSave: () => void;
  onCancel: () => void;
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState<Property>({
    title: '',
    description: '',
    price: 0,
    location: '',
    city: '',
    state: '',
    zip_code: '',
    bedrooms: 1,
    bathrooms: 1,
    square_footage: 0,
    lot_size: 0,
    year_built: new Date().getFullYear(),
    property_type: 'house',
    status: 'available',
    published: true,
    features: [],
    amenities: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        features: property.features || [],
        amenities: property.amenities || []
      });
      setImageUrl(property.main_image_url || '');
    }
  }, [property]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }));
  };

  const generateRandomData = () => {
    const propertyTypes = ['house', 'apartment', 'plot', 'commercial', 'land'];
    const statuses = ['available', 'pending', 'sold'];
    const cities = ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso'];
    const states = ['TX', 'CA', 'NY', 'FL', 'IL', 'PA'];
    const propertyTitles = [
      'Modern Family Home',
      'Luxury Downtown Apartment',
      'Charming Victorian House',
      'Contemporary Condo',
      'Spacious Ranch Home',
      'Urban Loft',
      'Suburban Paradise',
      'Elegant Estate',
      'Cozy Cottage',
      'Executive Townhome'
    ];
    const features = [
      'hardwood floors', 'granite countertops', 'stainless steel appliances', 
      'walk-in closet', 'fireplace', 'updated kitchen', 'crown molding',
      'tile flooring', 'vaulted ceilings', 'bay windows', 'french doors'
    ];
    const amenities = [
      'swimming pool', 'fitness center', 'parking garage', 'garden',
      'balcony', 'patio', 'rooftop access', 'concierge', 'security system',
      'central air', 'laundry room', 'storage unit'
    ];
    const images = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
    ];

    const randomTitle = propertyTitles[Math.floor(Math.random() * propertyTitles.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as 'available' | 'pending' | 'sold';
    const randomPrice = Math.floor(Math.random() * 1000000) + 200000; // $200K - $1.2M
    const randomBedrooms = Math.floor(Math.random() * 5) + 1; // 1-5 bedrooms
    const randomBathrooms = Math.floor(Math.random() * 4) + 1; // 1-4 bathrooms
    const randomSqft = Math.floor(Math.random() * 3000) + 800; // 800-3800 sqft
    const randomLotSize = Math.floor(Math.random() * 8000) + 2000; // 2000-10000 sqft
    const randomYearBuilt = Math.floor(Math.random() * 30) + 1995; // 1995-2024
    
    // Random features (2-5)
    const shuffledFeatures = [...features].sort(() => 0.5 - Math.random());
    const randomFeatures = shuffledFeatures.slice(0, Math.floor(Math.random() * 4) + 2);
    
    // Random amenities (1-4)
    const shuffledAmenities = [...amenities].sort(() => 0.5 - Math.random());
    const randomAmenities = shuffledAmenities.slice(0, Math.floor(Math.random() * 4) + 1);
    
    const randomImage = images[Math.floor(Math.random() * images.length)];

    setFormData({
      title: randomTitle,
      description: `Beautiful ${randomType} featuring ${randomFeatures.slice(0, 3).join(', ')}. Perfect for ${randomBedrooms > 3 ? 'large families' : 'professionals and small families'}. Located in the heart of ${randomCity} with easy access to shopping, dining, and entertainment.`,
      price: randomPrice,
      location: `${Math.floor(Math.random() * 9999) + 1000} ${['Main St', 'Oak Ave', 'Pine Dr', 'Elm Way', 'Cedar Ln'][Math.floor(Math.random() * 5)]}`,
      city: randomCity,
      state: randomState,
      zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
      bedrooms: randomBedrooms,
      bathrooms: randomBathrooms,
      square_footage: randomSqft,
      lot_size: randomLotSize,
      year_built: randomYearBuilt,
      property_type: randomType,
      status: randomStatus,
      published: true,
      features: randomFeatures,
      amenities: randomAmenities
    });

    setImageUrl(randomImage);

    toast({
      title: 'Random Data Generated',
      description: 'Property form filled with random sample data',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for required fields
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Property title is required',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Property description is required',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Property price must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Property location is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.property_type.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Property type is required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to continue',
          variant: 'destructive',
        });
        window.location.href = '/login';
        return;
      }

      const url = property 
        ? `http://localhost:5000/api/properties/${property.uuid}`
        : 'http://localhost:5000/api/properties';
      
      const method = property ? 'PUT' : 'POST';

      const submitData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location, // This maps to the backend 'location' field
        address: formData.location, // Also map to address for consistency
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip_code,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFootage: Number(formData.square_footage), // Backend expects camelCase
        lotSize: formData.lot_size ? Number(formData.lot_size) : undefined,
        yearBuilt: formData.year_built ? Number(formData.year_built) : undefined,
        propertyType: formData.property_type, // Backend expects camelCase
        status: formData.status,
        features: formData.features || [],
        amenities: formData.amenities || [],
        mainImageUrl: imageUrl || undefined,
        published: formData.published
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.status === 401 || response.status === 403) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('broker');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: 'Success',
            description: `Property ${property ? 'updated' : 'created'} successfully`,
          });
          onSave();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <IconArrowLeft size={16} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {property ? 'Edit Property' : 'Add New Property'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {property ? 'Update property details' : 'Fill in the property information'}
            </p>
          </div>
        </div>
        {!property && (
          <Button
            type="button"
            variant="outline"
            onClick={generateRandomData}
            className="flex items-center space-x-2"
          >
            <IconDice size={16} />
            <span>Generate Sample Data</span>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Beautiful 3-bedroom family home"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property features, location benefits, etc."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => handleInputChange('property_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value as 'available' | 'pending' | 'sold')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => handleInputChange('published', checked)}
              />
              <Label htmlFor="published">Published (visible to public)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Address *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                  required
                />
              </div>

              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code || ''}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <div className="relative">
                <IconCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  placeholder="500000"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <div className="relative">
                  <IconBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                    min="0"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <div className="relative">
                  <IconBath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                    min="0"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="square_footage">Square Footage *</Label>
                <div className="relative">
                  <IconSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="square_footage"
                    type="number"
                    value={formData.square_footage}
                    onChange={(e) => handleInputChange('square_footage', Number(e.target.value))}
                    placeholder="2000"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lot_size">Lot Size (sq ft)</Label>
                <Input
                  id="lot_size"
                  type="number"
                  value={formData.lot_size || ''}
                  onChange={(e) => handleInputChange('lot_size', Number(e.target.value) || undefined)}
                  placeholder="5000"
                />
              </div>

              <div>
                <Label htmlFor="year_built">Year Built</Label>
                <Input
                  id="year_built"
                  type="number"
                  value={formData.year_built || ''}
                  onChange={(e) => handleInputChange('year_built', Number(e.target.value) || undefined)}
                  placeholder="2020"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="main_image_url">Main Image URL</Label>
              <Input
                id="main_image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imageUrl && (
              <div className="mt-4">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                  onError={() => setImageUrl('')}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., Hardwood floors)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <Button type="button" onClick={handleAddFeature}>
                <IconPlus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <IconX size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add an amenity (e.g., Swimming pool)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <Button type="button" onClick={handleAddAmenity}>
                <IconPlus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <IconX size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <IconDeviceFloppy size={16} className="mr-2" />
            )}
            {property ? 'Update Property' : 'Create Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
