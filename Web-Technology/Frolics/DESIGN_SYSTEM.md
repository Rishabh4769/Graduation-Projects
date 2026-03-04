# Frolics Modern UI Design System

## Overview
This document outlines the complete modern UI redesign for the Frolics event management platform. The design system provides a cohesive, modern, and professional aesthetic suitable for a university event platform.

---

## Color Palette

### Primary Colors
- **Primary**: #6366f1 (Indigo) - Main brand color for CTAs and accents
- **Primary Dark**: #4f46e5 - Darker variant for interactive states
- **Primary Light**: #818cf8 - Lighter variant for hover states
- **Secondary**: #ec4899 (Pink) - Complementary color for highlights
- **Accent**: #f97316 (Orange) - Call-to-action accent

### Semantic Colors
- **Success**: #10b981 (Green) - Positive actions/states
- **Warning**: #f59e0b (Amber) - Caution/pending states
- **Error**: #ef4444 (Red) - Errors/destructive actions
- **Danger**: #dc2626 (Dark Red) - Critical actions

### Neutrals
- **Neutral 50**: #f9fafb (Lightest)
- **Neutral 100**: #f3f4f6
- **Neutral 200**: #e5e7eb
- **Neutral 300**: #d1d5db
- **Neutral 400**: #9ca3af
- **Neutral 500**: #6b7280
- **Neutral 600**: #4b5563
- **Neutral 700**: #374151
- **Neutral 800**: #1f2937
- **Neutral 900**: #111827 (Darkest)

---

## Typography

### Font Family
- **Primary Font**: 'Segoe UI', 'Roboto', 'Inter', 'Poppins', system fonts
- **Monospace**: 'JetBrains Mono', 'Fira Code', monospace

### Font Sizes
- **XS**: 0.75rem (12px)
- **SM**: 0.875rem (14px)
- **Base**: 1rem (16px) - Default
- **LG**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

---

## Spacing System

Based on 4px base unit:
- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)

---

## Border Radius

- **None**: 0
- **SM**: 0.375rem (6px)
- **MD**: 0.5rem (8px)
- **LG**: 0.75rem (12px)
- **XL**: 1rem (16px)
- **2XL**: 1.25rem (20px)
- **3XL**: 1.5rem (24px)
- **Full**: 9999px (Circles/pills)

---

## Components

### Buttons
```css
.btn-primary    /* Gradient primary with shadow */
.btn-secondary  /* Elevated secondary */
.btn-outline    /* Border only */
.btn-ghost      /* Transparent */
.btn-danger     /* Red destructive action */
.btn-success    /* Green success action */
.btn-sm         /* Small variant */
.btn-lg         /* Large variant */
```

### Cards
```css
.card           /* Basic card with shadow */
.card-lg        /* Large padding variant */
.card-sm        /* Small padding variant */
```

### Badges
```css
.badge          /* Primary badge */
.badge-secondary /* Pink badge */
.badge-success  /* Green badge */
.badge-warning  /* Amber badge */
.badge-error    /* Red badge */
```

### Forms
```css
.form-input     /* Text input */
.form-textarea  /* Larger text area */
.form-select    /* Dropdown select */
.form-label     /* Label text */
.form-group     /* Spacing wrapper */
.form-row       /* Grid row wrapper */
```

### Alerts
```css
.alert-info     /* Blue info alert */
.alert-success  /* Green success alert */
.alert-warning  /* Amber warning alert */
.alert-error    /* Red error alert */
```

### Tables
```css
.table          /* Base table */
.table-status   /* Status badge in table */
.status-active  /* Green status */
.status-pending /* Amber status */
.status-completed /* Blue status */
```

---

## Semantic HTML & Accessibility

### Structure
- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Proper heading hierarchy: `<h1>` → `<h2>` → `<h3>`
- Use `<label>` with `for` attributes for form fields
- Include `aria-*` attributes where needed for accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual order
- Use focus states for all buttons and links
- Implement escape key handling for modals

### Color Contrast
- Minimum WCAG AA compliance (4.5:1 for text)
- Don't rely on color alone for information
- Use patterns/icons alongside colors

---

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1400px+

### Mobile-First Approach
1. Start with mobile styles
2. Add breakpoints for larger screens
3. Use `grid-template-columns: repeat(auto-fit, minmax(...))`

---

## Gradients

### Primary Gradient
```css
linear-gradient(135deg, #6366f1 0%, #ec4899 100%)
```

### Accent Gradient
```css
linear-gradient(135deg, #f97316 0%, #ec4899 100%)
```

### Subtle Gradient
```css
linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)
```

---

## Shadows

- **SM**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **MD**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **LG**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- **XL**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`
- **2XL**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

---

## Animations & Transitions

- **Fast**: 150ms (quick interactions)
- **Base**: 200ms (standard transitions)
- **Slow**: 300ms (subtle animations)

### Common Animations
- Hover: Slight scale/translateY up
- Focus: Shadow and border color change
- Loading: Spinning spinner
- Entry: Fade in or slide up

---

## Dark/Light Theme Support

### CSS Variables
```css
[data-theme="light"] { --bg-primary: #fff; --text-primary: #0f172a; }
[data-theme="dark"] { --bg-primary: #0f172a; --text-primary: #f1f5f9; }
```

All colors use CSS variables for easy theme switching.

---

## Page Layouts

### Home Page
- Modern hero with gradient text
- Feature grid (3-4 columns)
- Call-to-action sections
- Newsletter signup
- Footer with links

### Auth Pages (Login/Signup)
- Centered card (450px max-width)
- Form with proper spacing
- Error/success messages
- Link to alternative auth action

### Dashboard Pages
- Sticky navbar
- Sidebar or top navigation
- Main content area with grid
- Cards for data display
- Tables for lists

---

## File Structure

```
styles/
├── index.css              # Global variables and base styles
├── App.css               # Layout components and utilities
├── home.css              # Homepage design
├── Auth/
│   ├── login.css         # Login page
│   └── signup.css        # Signup page
├── Admin/
│   └── adminDashboard.modern.css  # Admin dashboard
├── Users/
│   └── userDashboard.modern.css   # User dashboard
└── Common/
    ├── navbar.modern.css      # Navigation bar
    ├── footer.modern.css      # Footer
    └── components.modern.css  # UI components
```

---

## Implementation Guide

### Step 1: Basic Setup
1. Import updated CSS files in order:
   - `index.css` (globals)
   - `App.css` (components)
   - Page-specific CSS

### Step 2: Update Components
Update React components to use new:
- Button classes: `.btn-primary`, `.btn-secondary`, etc.
- Card classes: `.card`, `.card-lg`
- Form classes: `.form-input`, `.form-label`, `.form-group`

### Step 3: Change Imports
Update imports in React components:
```jsx
import '../styles/Admin/adminDashboard.modern.css';
```

### Step 4: Test Responsiveness
- Test all pages on mobile (375px)
- Test on tablet (768px)
- Test on desktop (1440px+)
- Verify touch targets are 44px minimum

### Step 5: Theme Testing
- Verify light theme colors
- Verify dark theme colors
- Check contrast ratios

---

## Best Practices

### CSS
- Use CSS variables for colors/spacing
- Avoid hardcoding values
- Use semantic class names
- Group related styles
- Use mobile-first approach

### HTML
- Use semantic elements
- Include proper ARIA labels
- Use `<label>` for form fields
- Include alt text for images

### Accessibility
- Test with keyboard only
- Use color-blind simulator
- Check contrast ratios
- Test with screen readers

---

## Component Usage Examples

### Button
```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-outline">Outline Button</button>
```

### Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content here</p>
</div>
```

### Form
```jsx
<form className="form-card">
  <div className="form-group">
    <label className="form-label">Email</label>
    <input type="email" className="form-input" placeholder="email@example.com" />
  </div>
  <button className="btn btn-primary">Submit</button>
</form>
```

### Alert
```jsx
<div className="alert alert-success">
  <div className="alert-content">
    <div className="alert-title">Success</div>
    <div className="alert-message">Operation completed successfully</div>
  </div>
</div>
```

---

## Migration Checklist

- [ ] Update `index.css` with global variables
- [ ] Update `App.css` with component classes
- [ ] Redesign home page (home.css)
- [ ] Update auth pages (login.css, signup.css)
- [ ] Update admin dashboard
- [ ] Update user dashboards
- [ ] Update navigation bar
- [ ] Update footer
- [ ] Test all pages on mobile
- [ ] Test all pages on desktop
- [ ] Verify theme switching works
- [ ] Accessibility audit
- [ ] Performance check
- [ ] Browser compatibility test

---

## Support & Maintenance

For questions or improvements to the design system:
1. Check this documentation first
2. Review component examples above
3. Ensure consistency with color palette
4. Test on multiple devices
5. Update this document for new components

---

**Last Updated**: March 2026
**Design Version**: 1.0 - Modern Pro
