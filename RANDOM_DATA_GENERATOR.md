# Random Property Data Generator - Usage Guide

## Overview
The PropertyForm now includes a **"Generate Sample Data"** button that automatically fills the form with realistic random property data for testing purposes.

## How to Use

### 1. Access the Random Data Generator
- Navigate to Admin Dashboard → Properties tab
- Click "Add Property" to open the property form
- Look for the **"Generate Sample Data"** button in the top-right corner of the form
- The button only appears when adding new properties (not when editing existing ones)

### 2. Generate Random Data
Click the "Generate Sample Data" button to automatically populate:

#### Basic Information
- **Title**: Random property titles like "Modern Family Home", "Luxury Downtown Apartment"
- **Description**: Contextual descriptions based on property type and features
- **Property Type**: House, Apartment, Plot, Commercial, or Land
- **Status**: Available, Pending, or Sold

#### Location Details
- **Address**: Random street addresses with realistic street names
- **City**: Major Texas cities (Austin, Houston, Dallas, San Antonio, Fort Worth, El Paso)
- **State**: Random US states (TX, CA, NY, FL, IL, PA)
- **ZIP Code**: 5-digit ZIP codes

#### Property Specifications
- **Price**: Random prices between $200,000 - $1,200,000
- **Bedrooms**: 1-5 bedrooms
- **Bathrooms**: 1-4 bathrooms
- **Square Footage**: 800-3,800 sq ft
- **Lot Size**: 2,000-10,000 sq ft
- **Year Built**: 1995-2024

#### Features & Amenities
- **Features**: 2-5 random features like "hardwood floors", "granite countertops", "fireplace"
- **Amenities**: 1-4 random amenities like "swimming pool", "fitness center", "parking garage"

#### Images
- **Main Image**: High-quality property images from Unsplash
- **Image Preview**: Automatically displays the selected random image

## Sample Generated Data

Here's an example of what the generator might create:

```
Title: "Elegant Estate"
Description: "Beautiful house featuring hardwood floors, granite countertops, fireplace. Perfect for large families. Located in the heart of Dallas with easy access to shopping, dining, and entertainment."
Price: $750,000
Location: "4567 Oak Ave"
City: "Dallas"
State: "TX"
ZIP: "75201"
Property Type: "House"
Status: "Available"
Bedrooms: 4
Bathrooms: 3
Square Footage: 2,850
Lot Size: 6,500
Year Built: 2018
Features: ["hardwood floors", "granite countertops", "fireplace", "walk-in closet"]
Amenities: ["swimming pool", "garden", "parking garage"]
Published: true
```

## Benefits for Testing

### 1. **Quick Property Creation**
- No need to manually enter data for testing
- Creates realistic, varied property listings
- Saves time during development and testing

### 2. **Realistic Test Data**
- Properties have logical relationships (price vs. size, features vs. type)
- Descriptions match the property specifications
- Images are professional real estate photos

### 3. **Variety in Data**
- Different property types and statuses
- Range of prices and sizes
- Diverse locations and features

### 4. **Form Validation Testing**
- All required fields are populated
- Data types are correct (numbers for prices, etc.)
- Optional fields are sometimes filled, sometimes left empty

## Technical Details

### Data Sources
The generator uses predefined arrays of realistic data:
- **Property Titles**: 10 professional property names
- **Cities**: 6 major Texas cities
- **Features**: 11 common property features
- **Amenities**: 12 popular amenities
- **Images**: 5 high-quality Unsplash property images

### Randomization Logic
- Uses `Math.random()` for true randomness
- Weighted selections for realistic combinations
- Contextual descriptions based on generated data
- Ensures all required fields are populated

### Integration
- Seamlessly integrates with existing form validation
- Uses the same form submission process
- Maintains all existing form functionality
- Toast notification confirms data generation

## Usage Tips

1. **For Quick Testing**: Use the generator when you need to quickly create multiple properties for testing the admin panel
2. **For Demo Purposes**: Great for creating sample data for demonstrations or screenshots
3. **For Development**: Helps developers test various edge cases and data combinations
4. **For Form Testing**: Ensures the form handles all field types correctly

## Customization

The random data can be easily customized by modifying the arrays in `generateRandomData()`:
- Add more cities, property types, or features
- Adjust price ranges or property sizes
- Include additional image URLs
- Modify the description templates

The generator is designed to be both functional for testing and realistic enough for demos!
