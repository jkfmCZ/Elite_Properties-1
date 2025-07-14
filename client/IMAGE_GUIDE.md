# 📸 Static Images Guide

## 📁 Where to Put Images

### **1. Public Folder (Recommended)**
```
public/
├── images/
│   ├── broker/
│   │   ├── sarah-johnson.jpg
│   │   └── profile-placeholder.jpg
│   ├── properties/
│   │   ├── property-1.jpg
│   │   ├── property-2.jpg
│   │   └── placeholder.jpg
│   └── logos/
│       ├── logo.png
│       └── favicon.ico
```

**Usage in Components:**
```tsx
// Direct reference from public folder
<img src="/images/broker/sarah-johnson.jpg" alt="Sarah Johnson" />
<img src="/images/properties/property-1.jpg" alt="Modern Villa" />
```

**Advantages:**
- ✅ Simple URL references
- ✅ No build processing
- ✅ Good for large images
- ✅ SEO friendly URLs

### **2. Assets Folder (Alternative)**
```
src/
├── assets/
│   ├── images/
│   │   ├── broker/
│   │   ├── properties/
│   │   └── icons/
```

**Usage in Components:**
```tsx
// Import and use
import brokerImage from '@/assets/images/broker/sarah-johnson.jpg';
import propertyImage from '@/assets/images/properties/villa.jpg';

<img src={brokerImage} alt="Sarah Johnson" />
<img src={propertyImage} alt="Modern Villa" />
```

**Advantages:**
- ✅ Build-time optimization
- ✅ TypeScript support
- ✅ Automatic compression
- ✅ Cache busting

## 🎯 Recommendations

### **For Your Current Project:**

1. **Broker Profile Images** → `public/images/broker/`
2. **Property Images** → `public/images/properties/`
3. **Logo/Branding** → `public/images/logos/`
4. **Icons (custom)** → `src/assets/images/icons/`

### **Example File Structure:**
```
public/
├── images/
│   ├── broker/
│   │   ├── sarah-johnson.jpg        # Main broker photo
│   │   ├── sarah-johnson-about.jpg  # About section photo
│   │   └── team-photo.jpg           # Team photo
│   ├── properties/
│   │   ├── featured/
│   │   │   ├── villa-beverly-hills.jpg
│   │   │   ├── penthouse-manhattan.jpg
│   │   │   └── home-austin.jpg
│   │   ├── new/
│   │   │   ├── plot-phoenix.jpg
│   │   │   ├── beach-house-malibu.jpg
│   │   │   └── loft-portland.jpg
│   │   └── gallery/
│   │       ├── interior-1.jpg
│   │       ├── interior-2.jpg
│   │       └── exterior-1.jpg
│   └── logos/
│       ├── elite-properties-logo.png
│       ├── elite-properties-white.png
│       └── favicon.ico
```

## 🔧 How to Update Your Homepage

Replace the current Pexels URLs with local images:

```tsx
// Current (external URLs):
brokerInfo = {
  image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg'
}

// Updated (local images):
brokerInfo = {
  image: '/images/broker/sarah-johnson.jpg'
}

// For properties in mockData.ts:
imageUrl: '/images/properties/featured/villa-beverly-hills.jpg'
```

## 📸 Image Optimization Tips

1. **Recommended Formats:**
   - `.webp` for modern browsers
   - `.jpg` for photos
   - `.png` for logos/graphics
   - `.svg` for icons

2. **Recommended Sizes:**
   - Broker photos: 400x400px
   - Property cards: 800x600px
   - Hero images: 1920x1080px

3. **Compression:**
   - Use tools like TinyPNG or ImageOptim
   - Target 100-200KB for property images
   - Target 50KB for profile images

## 🚀 Next Steps

1. Create the folder structure above
2. Add your images to the appropriate folders
3. Update the image URLs in your components
4. Test that all images load correctly
5. Consider adding lazy loading for better performance
