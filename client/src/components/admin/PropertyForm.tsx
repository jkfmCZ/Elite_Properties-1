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
  IconDice,
  IconUpload,
  IconBuildingSkyscraper,
  IconGripVertical,
  IconStar,
  IconStarFilled
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
  virtual_tour_url?: string;
  features?: string[];
  amenities?: string[];
}

interface PropertyImage {
  id?: number;
  property_id?: number;
  image_url: string;
  alt_text: string;
  is_main: boolean;
  sort_order: number;
  file?: File; // Pro nové soubory
  isNew?: boolean; // Flag pro rozlišení nových vs existujících
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
    main_image_url: '',
    virtual_tour_url: '',
    features: [],
    amenities: []
  });

  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [tourFile, setTourFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
      
      // Načtení existujících obrázků vlastnosti
      fetchPropertyImages(property.uuid!);
    }
  }, [property]);

  const fetchPropertyImages = async (propertyUuid: string) => {
    // Pro teď načteme jen hlavní obrázek z properties tabulky
    // Dokud neimplementujeme property_images API
    if (property?.main_image_url) {
      const mainImage: PropertyImage = {
        image_url: property.main_image_url,
        alt_text: 'Main property image',
        is_main: true,
        sort_order: 1,
        isNew: false
      };
      setPropertyImages([mainImage]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList) => {
    const newImages: PropertyImage[] = [];
    const maxSortOrder = Math.max(...propertyImages.map(img => img.sort_order), 0);

    Array.from(files).forEach((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      const newImage: PropertyImage = {
        image_url: imageUrl,
        alt_text: `Obrázek ${propertyImages.length + newImages.length + 1}`,
        is_main: propertyImages.length === 0 && newImages.length === 0, // První obrázek bude hlavní
        sort_order: maxSortOrder + index + 1,
        file: file,
        isNew: true
      };
      newImages.push(newImage);
    });

    setPropertyImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = propertyImages[index];
    
    // Pokud odstraňujeme hlavní obrázek, nastavíme jako hlavní další obrázek
    if (imageToRemove.is_main && propertyImages.length > 1) {
      const remainingImages = propertyImages.filter((_, i) => i !== index);
      remainingImages[0].is_main = true;
      setPropertyImages(remainingImages);
    } else {
      setPropertyImages(prev => prev.filter((_, i) => i !== index));
    }

    // Pokud byl URL vytvořen pomocí createObjectURL, uvolníme ho
    if (imageToRemove.isNew && imageToRemove.image_url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.image_url);
    }
  };

  const handleSetMainImage = (index: number) => {
    setPropertyImages(prev => prev.map((img, i) => ({
      ...img,
      is_main: i === index
    })));
  };

  const handleUpdateAltText = (index: number, altText: string) => {
    setPropertyImages(prev => prev.map((img, i) => 
      i === index ? { ...img, alt_text: altText } : img
    ));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...propertyImages];
    const draggedImage = newImages[draggedIndex];
    
    // Odstranit přetahuný obrázek z původní pozice
    newImages.splice(draggedIndex, 1);
    
    // Vložit na novou pozici
    const actualDropIndex = dropIndex > draggedIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(actualDropIndex, 0, draggedImage);
    
    // Aktualizovat sort_order
    newImages.forEach((img, index) => {
      img.sort_order = index + 1;
    });

    setPropertyImages(newImages);
    setDraggedIndex(null);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features?.filter((_, i) => i !== index) || [] }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({ ...prev, amenities: [...(prev.amenities || []), newAmenity.trim()] }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities?.filter((_, i) => i !== index) || [] }));
  };

  const generateRandomData = () => {
    const titles = ['Luxusní vila s bazénem', 'Moderní byt v centru', 'Rodinný dům se zahradou', 'Stylový loft'];
    const descriptions = [
      'Krásná nemovitost s výhledem na město a moderním vybavením.',
      'Prostorný a světlý byt ideální pro rodinu nebo mladé páry.',
      'Úžasná vila s velkým pozemkem a spoustou soukromí.'
    ];
    
    setFormData(prev => ({
      ...prev,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price: Math.floor(Math.random() * 500000) + 200000,
      location: `${Math.floor(Math.random() * 999) + 1} Main Street`,
      city: 'Praha',
      state: 'Praha',
      zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      square_footage: Math.floor(Math.random() * 150) + 50,
      lot_size: Math.floor(Math.random() * 500) + 200,
      year_built: Math.floor(Math.random() * 30) + 1990
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Nejprve uložit/aktualizovat nemovitost
      const url = property
        ? `http://localhost:5000/api/properties/${property.uuid}`
        : 'http://localhost:5000/api/properties';
      
      const method = property ? 'PUT' : 'POST';

      let uploadedTourUrl = property?.virtual_tour_url || null;

      // Upload tour file pokud existuje
      if (tourFile) {
        const fileUploadData = new FormData();
        fileUploadData.append('tourFile', tourFile);

        const uploadResponse = await fetch('http://localhost:5000/api/properties/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fileUploadData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          if (uploadResult.tourUrl) {
            uploadedTourUrl = uploadResult.tourUrl;
          }
        }
      }

      const sanitizeValue = (value: any) => value === undefined ? null : value;

      // Najít hlavní obrázek pro main_image_url
      const mainImage = propertyImages.find(img => img.is_main);
      
      const submitData = {
        title: sanitizeValue(formData.title),
        description: sanitizeValue(formData.description),
        price: Number(formData.price),
        location: sanitizeValue(formData.location),
        address: sanitizeValue(formData.location),
        city: sanitizeValue(formData.city),
        state: sanitizeValue(formData.state),
        zipCode: sanitizeValue(formData.zip_code),
        country: 'CZ',
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFootage: Number(formData.square_footage),
        propertyType: formData.property_type,
        status: formData.status,
        yearBuilt: sanitizeValue(formData.year_built),
        lotSize: sanitizeValue(formData.lot_size),
        mainImageUrl: mainImage && !mainImage.isNew ? mainImage.image_url : null,
        main_image_url: mainImage && !mainImage.isNew ? mainImage.image_url : null,
        virtualTourUrl: uploadedTourUrl,
        virtual_tour_url: uploadedTourUrl,
        features: formData.features || [],
        amenities: formData.amenities || [],
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save property');
      }

      const result = await response.json();
      const propertyUuid = property?.uuid || result.data?.uuid;

      // Nyní zpracovat obrázky - použijeme stávající /upload endpoint
      if (propertyUuid && propertyImages.length > 0) {
        const newImages = propertyImages.filter(img => img.isNew);
        
        if (newImages.length > 0) {
          // Upload obrázků jeden po druhém pomocí stávajícího API
          const uploadedImages = [];
          
          for (let i = 0; i < newImages.length; i++) {
            const img = newImages[i];
            if (img.file) {
              try {
                const fileFormData = new FormData();
                fileFormData.append('mainImage', img.file);

                const uploadResponse = await fetch('http://localhost:5000/api/properties/upload', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` },
                  body: fileFormData,
                });

                if (uploadResponse.ok) {
                  const uploadResult = await uploadResponse.json();
                  if (uploadResult.imageUrl) {
                    uploadedImages.push({
                      ...img,
                      image_url: uploadResult.imageUrl
                    });
                  }
                }
              } catch (error) {
                console.error(`Failed to upload image ${i + 1}:`, error);
              }
            }
          }

          // Najít hlavní obrázek a aktualizovat main_image_url
          const allImages = [
            ...propertyImages.filter(img => !img.isNew),
            ...uploadedImages
          ];
          
          const mainImage = allImages.find(img => img.is_main);
          if (mainImage && mainImage.image_url) {
            // Aktualizovat main_image_url v properties tabulce
            try {
              await fetch(`http://localhost:5000/api/properties/${propertyUuid}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...submitData,
                  mainImageUrl: mainImage.image_url,
                  main_image_url: mainImage.image_url
                }),
              });
            } catch (error) {
              console.error('Failed to update main image:', error);
            }
          }

          // TODO: Zde bychom později implementovali ukládání do property_images tabulky
          // Pro teď jen logujeme co by se mělo uložit
          console.log('Images to save to property_images table:', allImages.map(img => ({
            property_id: property?.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            is_main: img.is_main ? 1 : 0,
            sort_order: img.sort_order
          })));
        }
      }

      toast({
        title: 'Success',
        description: `Property ${property ? 'updated' : 'created'} successfully`,
      });
      onSave();

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

  const getImageUrl = (image: PropertyImage) => {
    if (image.isNew) {
      return image.image_url; // Blob URL
    }
    return `http://localhost:5000${image.image_url}`;
  };

  return (
    <div className="space-y-6">
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
          <Button type="button" variant="outline" onClick={generateRandomData} className="flex items-center space-x-2">
            <IconDice size={16} />
            <span>Generate Sample Data</span>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
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
                placeholder="Describe the property..." 
                rows={4} 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'available' | 'pending' | 'sold')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Label htmlFor="published">Published</Label>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader><CardTitle>Location</CardTitle></CardHeader>
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
                  placeholder="Prague" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input 
                  id="state" 
                  value={formData.state} 
                  onChange={(e) => handleInputChange('state', e.target.value)} 
                  placeholder="Praha" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input 
                  id="zip_code" 
                  value={formData.zip_code || ''} 
                  onChange={(e) => handleInputChange('zip_code', e.target.value)} 
                  placeholder="11000" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Price (CZK) *</Label>
              <div className="relative">
                <IconCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  id="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => handleInputChange('price', Number(e.target.value))} 
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
                    value={formData.bathrooms} 
                    onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))} 
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
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lot_size">Lot Size (sq m)</Label>
                <Input 
                  id="lot_size" 
                  type="number" 
                  value={formData.lot_size || ''} 
                  onChange={(e) => handleInputChange('lot_size', Number(e.target.value))} 
                />
              </div>
              <div>
                <Label htmlFor="year_built">Year Built</Label>
                <Input 
                  id="year_built" 
                  type="number" 
                  value={formData.year_built || ''} 
                  onChange={(e) => handleInputChange('year_built', Number(e.target.value))} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Property Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload multiple images for your property. Drag to reorder, click star to set main image.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <IconUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="mb-4">
                  <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <IconPlus size={16} className="mr-2" />
                    Choose Images
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files);
                      }
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  PNG, JPG up to 10MB each. You can select multiple images at once.
                </p>
              </div>
            </div>

            {/* Image Grid */}
            {propertyImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyImages.map((image, index) => (
                  <div
                    key={`${image.id || 'new'}-${index}`}
                    className="relative bg-white dark:bg-gray-800 border rounded-lg overflow-hidden shadow-sm"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-2 left-2 z-10 cursor-move bg-black/20 rounded p-1">
                      <IconGripVertical size={16} className="text-white" />
                    </div>

                    {/* Main Image Indicator */}
                    <button
                      type="button"
                      className="absolute top-2 right-2 z-10 bg-black/20 rounded p-1"
                      onClick={() => handleSetMainImage(index)}
                    >
                      {image.is_main ? (
                        <IconStarFilled size={16} className="text-yellow-400" />
                      ) : (
                        <IconStar size={16} className="text-white" />
                      )}
                    </button>

                    {/* Remove Button */}
                    <button
                      type="button"
                      className="absolute top-2 right-10 z-10 bg-red-500/80 hover:bg-red-600 rounded p-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <IconX size={16} className="text-white" />
                    </button>

                    {/* Image */}
                    <img
                      src={getImageUrl(image)}
                      alt={image.alt_text}
                      className="w-full h-32 object-cover"
                    />

                    {/* Image Info */}
                    <div className="p-3">
                      <Input
                        value={image.alt_text}
                        onChange={(e) => handleUpdateAltText(index, e.target.value)}
                        placeholder="Image description..."
                        className="text-sm"
                      />
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Order: {image.sort_order}</span>
                        {image.is_main && (
                          <Badge variant="secondary" className="text-xs">
                            Main Image
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Virtual Tour */}
        <Card>
          <CardHeader><CardTitle>Virtual Tour</CardTitle></CardHeader>
          <CardContent>
            <div className="mt-2 flex justify-center p-6 border-2 border-dashed rounded-md">
              <div className="text-center">
                <IconBuildingSkyscraper className="mx-auto h-12 w-12 text-gray-400" />
                <label htmlFor="tour_file" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload Tour File</span>
                  <Input 
                    id="tour_file" 
                    type="file" 
                    className="sr-only" 
                    onChange={(e) => { 
                      if (e.target.files?.[0]) setTourFile(e.target.files[0]); 
                    }} 
                  />
                </label>
                <p className="text-xs text-gray-500">
                  {tourFile ? tourFile.name : 'File for 3D tour'}
                </p>
              </div>
            </div>
            {property?.virtual_tour_url && !tourFile && (
              <div className="mt-4 text-sm text-gray-600">
                Current tour: 
                <a 
                  href={`http://localhost:5000${property.virtual_tour_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 ml-1"
                >
                  View Link
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader><CardTitle>Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={newFeature} 
                onChange={(e) => setNewFeature(e.target.value)} 
                placeholder="Add a feature..." 
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())} 
              />
              <Button type="button" onClick={handleAddFeature}>
                <IconPlus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center space-x-1"
                >
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
          <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={newAmenity} 
                onChange={(e) => setNewAmenity(e.target.value)} 
                placeholder="Add an amenity..." 
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())} 
              />
              <Button type="button" onClick={handleAddAmenity}>
                <IconPlus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center space-x-1"
                >
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