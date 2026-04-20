# Theme System

Centralized color system for **buildbusinesslk** to ensure consistency and maintainability.

## 📁 Structure

```
src/theme/
├── colors.js           # All color constants and utilities
├── index.js            # Easy imports
├── README.md           # This file
└── MIGRATION_GUIDE.js  # Examples for converting existing components
```

## 🎨 Usage

### Import Colors

```javascript
// Import specific colors
import { brand, gradients, dark, light, alpha } from '../theme';

// Or import everything
import * as colors from '../theme/colors';
```

### Brand Colors

Use brand colors for primary UI elements:

```javascript
import { brand, gradients } from '../theme';

// Solid colors
sx={{ color: brand.orange.primary }}
sx={{ background: brand.green.primary }}

// Gradients
sx={{ background: gradients.primary }}
sx={{ background: gradients.green }}
```

### Theme-Aware Colors

Use `getThemeColors()` or access `dark`/`light` directly with mode:

```javascript
import { getThemeColors } from '../theme';
import { useThemeMode } from '../contexts/ThemeContext';

function MyComponent() {
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  
  return (
    <Box sx={{ 
      background: colors.background.primary,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`
    }}>
      Content
    </Box>
  );
}
```

### Alpha/Opacity Colors

Use pre-defined opacity values:

```javascript
import { alpha } from '../theme';

sx={{ 
  background: alpha.orange[10],  // rgba(255,107,53,0.1)
  border: `1px solid ${alpha.green[25]}`
}}
```

### Shadows

```javascript
import { shadows, getThemeShadows } from '../theme';

const { mode } = useThemeMode();
const themeShadows = getThemeShadows(mode);

sx={{ 
  boxShadow: themeShadows.lg,  // Adapts to theme
  '&:hover': { boxShadow: shadows.colored.orange }
}}
```

## 🎯 Available Constants

### `brand`
- `orange`: primary, light, dark
- `amber`: primary, light, dark
- `green`: primary, light, lighter, dark, darker
- `blue`: primary, light, dark
- `purple`: primary, light, dark

### `gradients`
- `primary`, `primaryAlt`
- `green`, `greenLight`, `greenAlt`
- `blue`, `purple`, `warm`

### `dark` (Dark Mode)
- `background`: primary, secondary, tertiary, paper, hover
- `text`: primary, secondary, tertiary, muted, disabled
- `border`: primary, secondary, hover
- `overlay`: light, medium, heavy

### `light` (Light Mode)
Same structure as `dark` but with light theme colors

### `alpha`
Opacity variants for:
- `orange`: 10, 15, 18, 25, 35
- `amber`: 10, 15, 18, 25, 30
- `green`: 06, 07, 08, 10, 15, 18, 25, 30, 35
- `blue`: 10, 25
- `purple`: 10, 25

### `shadows`
- `light`: sm, md, lg, xl
- `dark`: sm, md, lg, xl
- `colored`: orange, orangeHover, amber, amberHover, green, greenHover

## 💡 Examples

### Button with Brand Colors

```javascript
import { gradients, shadows } from '../theme';

<Button sx={{
  background: gradients.primary,
  boxShadow: shadows.colored.orange,
  '&:hover': {
    background: gradients.green,
    boxShadow: shadows.colored.orangeHover
  }
}}>
  Get Started
</Button>
```

### Theme-Aware Card

```javascript
import { getThemeColors, getThemeShadows } from '../theme';
import { useThemeMode } from '../contexts/ThemeContext';

function Card() {
  const { mode } = useThemeMode();
  const colors = getThemeColors(mode);
  const shadows = getThemeShadows(mode);
  
  return (
    <Box sx={{
      background: colors.background.paper,
      color: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
      boxShadow: shadows.md,
      '&:hover': {
        background: colors.background.hover,
        boxShadow: shadows.lg
      }
    }}>
      Card Content
    </Box>
  );
}
```

### Chip with Brand Colors

```javascript
import { alpha, brand } from '../theme';

<Chip 
  label="Featured"
  sx={{
    background: alpha.orange[10],
    border: `1px solid ${alpha.orange[25]}`,
    color: brand.orange.primary
  }}
/>
```

## ✅ Best Practices

1. **Always use theme constants** instead of hardcoded colors
2. **Use `getThemeColors(mode)`** for theme-aware components
3. **Prefer `alpha` constants** over writing rgba manually
4. **Use `gradients`** for consistent gradient styles
5. **Import only what you need** for better tree-shaking

## 🚫 Don't Do This

```javascript
// ❌ Bad - hardcoded colors
sx={{ color: '#FF6B35' }}
sx={{ background: 'rgba(255,107,53,0.1)' }}

// ✅ Good - use theme constants
sx={{ color: brand.orange.primary }}
sx={{ background: alpha.orange[10] }}
```

## 📝 Adding New Colors

1. Add to `colors.js` in appropriate section
2. Update this README with the new colors
3. Test in both light and dark modes
4. Update TypeScript types if using TS

## 🔄 Migrating Existing Components

See [`MIGRATION_GUIDE.js`](./MIGRATION_GUIDE.js) for detailed before/after examples of:
- Converting hardcoded colors to theme constants
- Making components theme-aware
- Using gradients and shadows from the theme
- Quick reference table for common replacements

---

**Need help?** Check the migration guide or ask the team!
