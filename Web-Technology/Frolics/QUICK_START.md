# Frolics React UI - Quick Start Guide

## CSS Files to Import

In your React components, import the CSS files in this order:

```jsx
// Global styles (usually in App.js or index.js)
import '../styles/index.css';      // Global variables
import '../styles/App.css';        // Common components

// Page-specific styles
import '../styles/home.css';
import '../styles/Auth/login.css';
import '../styles/Auth/signup.css';
```

For dashboard pages:
```jsx
import '../styles/Common/navbar.modern.css';
import '../styles/Common/footer.modern.css';
import '../styles/Admin/adminDashboard.modern.css';  // For admin
import '../styles/Users/userDashboard.modern.css';   // For users
```

For reusable components:
```jsx
import '../styles/Common/components.modern.css';
```

---

## Common Component Examples

### 1. Buttons

```jsx
// Primary CTA button
<button className="btn btn-primary">Get Started</button>

// Secondary button
<button className="btn btn-secondary">Learn More</button>

// Outline style
<button className="btn btn-outline">Cancel</button>

// Ghost/transparent
<button className="btn btn-ghost">Skip</button>

// Different sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>

// Disabled state
<button className="btn btn-primary" disabled>Disabled</button>
```

### 2. Cards

```jsx
// Basic card
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>

// Large card
<div className="card card-lg">
  <h2>Important Content</h2>
  <p>More content</p>
</div>

// Small card
<div className="card card-sm">
  <h4>Quick Info</h4>
</div>
```

### 3. Forms

```jsx
<form>
  {/* Form group wrapper */}
  <div className="form-group">
    <label className="form-label">Email Address</label>
    <input 
      type="email" 
      className="form-input"
      placeholder="Enter your email"
    />
  </div>

  {/* Multiple columns */}
  <div className="form-row">
    <div className="form-group">
      <label className="form-label">First Name</label>
      <input type="text" className="form-input" />
    </div>
    <div className="form-group">
      <label className="form-label">Last Name</label>
      <input type="text" className="form-input" />
    </div>
  </div>

  {/* Textarea */}
  <div className="form-group">
    <label className="form-label">Message</label>
    <textarea className="form-textarea" placeholder="Your message"></textarea>
  </div>

  <button className="btn btn-primary" type="submit">Submit</button>
</form>
```

### 4. Badges

```jsx
<span className="badge">Default</span>
<span className="badge badge-secondary">Secondary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
<span className="badge badge-light">Light</span>
```

### 5. Alerts

```jsx
{/* Info alert */}
<div className="alert alert-info">
  <div className="alert-icon">ℹ️</div>
  <div className="alert-content">
    <div className="alert-title">Information</div>
    <div className="alert-message">This is an informational message</div>
  </div>
</div>

{/* Success alert */}
<div className="alert alert-success">
  <div className="alert-icon">✓</div>
  <div className="alert-content">
    <div className="alert-message">Operation successful!</div>
  </div>
</div>

{/* Error alert */}
<div className="alert alert-danger">
  <div className="alert-icon">⚠️</div>
  <div className="alert-content">
    <div className="alert-message">An error occurred</div>
  </div>
</div>
```

### 6. Avatars

```jsx
<div className="avatar avatar-sm">JD</div>
<div className="avatar avatar-md">AB</div>
<div className="avatar avatar-lg">XY</div>
<div className="avatar avatar-xl">ZW</div>

{/* With image */}
<div className="avatar avatar-lg">
  <img src="path/to/image.jpg" alt="User" className="avatar-img" />
</div>
```

### 7. Tables

```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td><span className="table-status status-active">Active</span></td>
        <td>
          <button className="action-btn action-view">View</button>
          <button className="action-btn action-edit">Edit</button>
          <button className="action-btn action-delete">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 8. Grid Layouts

```jsx
{/* Two column grid */}
<div className="grid grid-cols-2">
  <div className="card">Column 1</div>
  <div className="card">Column 2</div>
</div>

{/* Three column grid */}
<div className="grid grid-cols-3">
  <div className="card">Col 1</div>
  <div className="card">Col 2</div>
  <div className="card">Col 3</div>
</div>

{/* Responsive grid */}
<div className="dashboard-grid">
  {/* Auto-responsive grid */}
</div>
```

### 9. Spacing Utilities

```jsx
{/* Margin top */}
<div className="mt-4">Spacing top</div>
<div className="mb-8">Spacing bottom</div>

{/* Padding */}
<div className="p-4">All padding</div>
<div className="px-4">Horizontal padding</div>
<div className="py-4">Vertical padding</div>

{/* Gap for flex/grid */}
<div className="gap-4">Items with spacing</div>
<div className="gap-6">Items with more spacing</div>
```

### 10. Text Utilities

```jsx
<h1 className="text-center">Centered heading</h1>
<p className="text-muted">Muted gray text</p>
<p className="text-xl font-semibold">Large, bold text</p>
```

---

## CSS Variable Usage

Access design tokens in custom CSS:

```css
/* Colors */
background: var(--primary);
color: var(--text-primary);
border: 1px solid var(--bg-tertiary);

/* Spacing */
padding: var(--spacing-4);
margin: var(--spacing-6);
gap: var(--spacing-8);

/* Typography */
font-family: var(--font-sans);
font-size: var(--text-base);
font-weight: var(--font-bold);

/* Shadows */
box-shadow: var(--shadow-md);

/* Radius */
border-radius: var(--radius-lg);

/* Transitions */
transition: all var(--transition-base);
```

---

## Live Theme Switching (Optional)

To enable light/dark theme switching:

```jsx
// In your App.js or theme provider
const toggleTheme = () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// On app load
useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}, []);
```

---

## Responsive Patterns

```jsx
{/* Container */}
<div className="container">
  {/* max-width: 1280px, auto margins, responsive padding */}
</div>

{/* Grid with auto-fit */}
<div className="grid grid-cols-auto-fit">
  {/* Automatically responsive columns */}
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>

{/* Flex utilities */}
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## Common Patterns

### Page with Hero
```jsx
<div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">Page Title</h1>
    <p className="hero-description">Description...</p>
    <div className="hero-buttons">
      <button className="btn btn-primary">CTA</button>
      <button className="btn btn-secondary">Secondary</button>
    </div>
  </div>
</div>
```

### Dashboard Header
```jsx
<div className="admin-header">
  <div className="header-title">
    <h1>Dashboard</h1>
    <p className="header-subtitle">Welcome back!</p>
  </div>
  <div className="header-actions">
    <button className="btn btn-primary">+ Add New</button>
  </div>
</div>
```

### Stats Grid
```jsx
<div className="dashboard-grid">
  <div className="stat-card">
    <div className="stat-icon">📊</div>
    <div className="stat-label">Total Events</div>
    <div className="stat-value">42</div>
    <div className="stat-change">+12% this month</div>
  </div>
  {/* More stat cards... */}
</div>
```

### Event Card
```jsx
<div className="event-card">
  <div className="event-image">📅</div>
  <div className="event-content">
    <div className="event-date">Mar 15, 2026</div>
    <h3 className="event-title">Event Name</h3>
    <p className="event-description">Event description...</p>
    <div className="event-footer">
      <span className="event-attendees">25 attending</span>
      <button className="event-action">Join Now</button>
    </div>
  </div>
</div>
```

---

## Troubleshooting

### Issue: Styles not applying
- ✓ Check CSS import order (globals first)
- ✓ Check CSS file path is correct
- ✓ Verify no typos in class names
- ✓ Check browser DevTools for applied styles

### Issue: Colors look wrong
- ✓ Check if dark/light theme is set
- ✓ Verify CSS variables are loaded
- ✓ Check browser cache (Ctrl+Shift+R)

### Issue: Spacing looks off
- ✓ Use spacing utilities consistently
- ✓ Don't mix hardcoded values with variables
- ✓ Check grid/flex gap settings

### Issue: Button/Form doesn't work
- ✓ Verify necessary event handlers are attached
- ✓ Check button type attribute
- ✓ Verify form validation logic

---

## Next Steps

1. **Review** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete specifications
2. **Import** CSS files in your components
3. **Use** component classes from the examples above
4. **Test** on mobile, tablet, and desktop
5. **Verify** theme switching works
6. **Check** accessibility with keyboard navigation

---

For more details, see **DESIGN_SYSTEM.md** in the project root.
