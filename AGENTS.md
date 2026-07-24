# AGENTS.md - Development Guidelines

## Build & Development Commands

```bash
# Development
npm run dev                 # Start dev server on port 8080
npm run build              # Production build
npm run build:dev          # Development build
npm run preview            # Preview production build
npm run lint               # Run ESLint

# Note: No test framework is currently set up in this project
```

## Tech Stack

- **Framework**: Astro 5.16.4 with React integration
- **Language**: TypeScript with relaxed settings
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables
- **State Management**: Local React state + TanStack Query available
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── [feature].tsx   # Feature-specific components
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
└── assets/              # Static assets
```

## Code Style Guidelines

### Imports
```typescript
// External libraries first (alphabetical)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// Internal imports second
import { cn } from "@/lib/utils";
```

### Component Structure
```typescript
// Constants at top
const logoImage = "/assets/logo.svg";

// Component export
export const ComponentName = () => {
  // State hooks first
  const [isOpen, setIsOpen] = useState(false);
  
  // Event handlers
  const handleClick = () => setIsOpen(!isOpen);
  
  // Render logic
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### TypeScript Guidelines
- `noImplicitAny: false` - More permissive for rapid development
- Interfaces preferred over types for component props
- Use `React.ButtonHTMLAttributes` for extending HTML element props
- Forward refs with `React.forwardRef` for UI components

### Naming Conventions
- **Components**: PascalCase with descriptive names (`HeroSection`, `Navigation`)
- **Files**: PascalCase matching component name (`HeroSection.tsx`)
- **Variables**: camelCase (`logoImage`, `isOpen`)
- **Constants**: UPPER_SNAKE_CASE for global constants, camelCase for local
- **CSS Classes**: kebab-case for custom classes, but prefer Tailwind utilities

### Tailwind CSS Patterns
```typescript
// Use cn() utility for conditional classes
import { cn } from "@/lib/utils";

className={cn(
  "base-classes",
  isActive && "active-classes",
  props.className
)}

// Follow responsive mobile-first approach
className="w-full md:w-auto lg:w-1/2"

// Use design tokens from config
className="bg-primary text-primary-foreground"
```

### Error Handling
- No specific error boundaries currently implemented
- Use try-catch for async operations
- Validate environment variables with fallbacks

### Component Props
```typescript
interface ComponentProps {
  // Required props first
  title: string;
  // Optional props with defaults
  variant?: "default" | "secondary";
  className?: string;
  children?: React.ReactNode;
}
```

### shadcn/ui Patterns
- All UI components in `/src/components/ui/`
- Use `cva` (class-variance-authority) for component variants
- Extend HTML element props for better type safety
- Use `asChild` pattern with Radix Slot for composition

### Styling Guidelines
- Prefer Tailwind utility classes over custom CSS
- Use semantic color tokens (primary, secondary, muted, etc.)
- Maintain consistent spacing using Tailwind's scale
- Custom colors: nature-green, warm-sand, soft-gold for theme
- Border radius controlled via CSS variable `--radius`

### State Management
- Local React state for component-specific state
- TanStack Query available for server state (not heavily used)
- Avoid prop drilling - lift state when needed

### Performance Considerations
- Use `loading="lazy"` for images
- Implement React.memo for expensive components when needed
- Use appropriate React key props for lists

### File Organization
- Keep components under 200 lines when possible
- Extract complex logic into custom hooks
- Group related components in folders
- Index files for cleaner imports when beneficial

### Environment Variables
```typescript
// Access via import.meta.env
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919920155875";
```

### SEO & Accessibility
- Use semantic HTML5 elements
- Add proper ARIA labels for interactive elements
- Implement alt text for all images
- Use heading hierarchy correctly

### Build Configuration
- Astro static site generation
- Vite for bundling and dev server
- Path alias: `@/` points to `src/`
- Server runs on port 8080, host "::"

## Development Workflow

1. Always run `npm run lint` before committing
2. Check responsive design at mobile, tablet, desktop breakpoints
3. Test with both light and dark themes if applicable
4. Ensure images load properly with lazy loading
5. Verify all interactive elements have proper hover/focus states

## Common Patterns

### Data fetching (when needed)
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['key'],
  queryFn: async () => {
    const response = await fetch('/api/endpoint');
    return response.json();
  }
});
```

### Form handling
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email(),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
});
```