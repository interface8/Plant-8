# Dynamic Theming System

## Overview
The FAM 8 platform now supports dynamic theming based on product types. Each product, blog, and investment can have its own color scheme that automatically applies to its detail pages.

## Theme Structure
Theme colors are stored in the `cssThemeProperty` JSON field with the following structure:

```json
{
  "primary": "#FFD700",
  "secondary": "#228B22",
  "accent": "#FFA500",
  "gradient": "from-yellow-400 to-green-600"
}
```

## Theme Examples

### Crops
- **Maize**: Yellow & Green (`from-yellow-400 to-green-600`)
- **Rice**: Wheat & Green (`from-amber-100 to-green-600`)
- **Cassava**: Beige & Brown (`from-yellow-200 to-amber-700`)
- **Tomato**: Red & Green (`from-red-500 to-green-600`)
- **Orange**: Orange & Green (`from-orange-400 to-green-500`)

### Livestock
- **Cattle**: White & Gray (`from-gray-100 to-gray-300`)
- **Chicken**: Yellow & Orange (`from-yellow-300 to-orange-400`)
- **Goat**: Brown & Tan (`from-stone-600 to-orange-700`)

## Using Theme Utilities

### Import Theme Functions
```typescript
import { 
  getThemeGradient, 
  getThemePrimary, 
  getThemeSecondary,
  getThemeAccent,
  applyProductTheme 
} from "@/lib/utils/theme";
```

### Get Theme Colors
```typescript
const product = await getProduct(id);

// Get gradient classes for Tailwind
const gradient = getThemeGradient(product.cssThemeProperty);
// Returns: "from-yellow-400 to-green-600"

// Get color hex values
const primary = getThemePrimary(product.cssThemeProperty);
const secondary = getThemeSecondary(product.cssThemeProperty);
const accent = getThemeAccent(product.cssThemeProperty);
```

### Apply to Components

#### Method 1: Using Tailwind Classes
```tsx
<div className={`bg-gradient-to-r ${gradient}`}>
  <h1 className="text-white">{product.name}</h1>
</div>
```

#### Method 2: Using Inline Styles
```tsx
<div style={{ backgroundColor: primary }}>
  <p style={{ color: secondary }}>Details</p>
</div>
```

#### Method 3: Using CSS Custom Properties
```tsx
<div style={applyProductTheme(product.cssThemeProperty)}>
  {/* Access via var(--theme-primary) in CSS */}
</div>
```

## Examples from Codebase

### Investment Detail Page Header
```tsx
const themeGradient = getThemeGradient(product.cssThemeProperty);
const themePrimary = getThemePrimary(product.cssThemeProperty);

return (
  <div className={`py-6 px-4 bg-gradient-to-r ${themeGradient}`}>
    <h1 className="text-white">{product.name}</h1>
    <Badge style={{ 
      backgroundColor: `${themePrimary}20`,
      color: themePrimary
    }}>
      Low Risk
    </Badge>
  </div>
);
```

### Blog Card with Theme
```tsx
const themePrimary = getThemePrimary(blog.cssThemeProperty);

<Card className="hover:shadow-lg transition-shadow">
  <div 
    className="h-2" 
    style={{ backgroundColor: themePrimary }}
  />
  <CardContent>
    <h3>{blog.title}</h3>
  </CardContent>
</Card>
```

## Default Fallback
If `cssThemeProperty` is not set, the system defaults to the green theme:
- Primary: `#10b981` (emerald-500)
- Secondary: `#059669` (emerald-600)
- Gradient: `from-green-500 to-teal-500`

## Seeding Theme Data
Run the migration and seed script to populate products with themes:

```bash
# Run migration
npx prisma migrate dev --name add_css_theme_property

# Generate Prisma client
npx prisma generate

# Run seed (includes theme data)
npm run seed
```

## Best Practices

1. **Always provide fallbacks** for null theme properties
2. **Use Tailwind classes** for gradients when possible (better performance)
3. **Use inline styles** for dynamic colors that aren't in Tailwind config
4. **Test contrast** - ensure text is readable on themed backgrounds
5. **Be consistent** - use the same theme utility functions throughout

## Adding New Themes

To add a theme for a new product:

```typescript
await prisma.product.update({
  where: { id: productId },
  data: {
    cssThemeProperty: {
      primary: "#6B4423",
      secondary: "#8B5A3C",
      accent: "#A0522D",
      gradient: "from-amber-900 to-yellow-800"
    }
  }
});
```

## Components Using Dynamic Theming

✅ **Updated:**
- `components/investment/InvestmentDetail.tsx` - Header with gradient and badges
- `components/home/heroSection.tsx` - Uses `bg-primary` pattern
- `app/(root)/blogs/page.tsx` - Already using `bg-primary`

🔄 **Todo:**
- Product marketplace cards
- Blog detail pages
- Investment summary cards
- Dashboard widgets

## Testing Themes

1. Visit a product detail page (e.g., `/investments/product/{id}`)
2. Check header background matches product theme
3. Verify badges use theme colors
4. Ensure text contrast is readable
5. Test with different products (Maize=yellow, Cattle=white, Cocoa=brown)
