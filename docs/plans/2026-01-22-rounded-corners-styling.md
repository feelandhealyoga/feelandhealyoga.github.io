# Rounded Corners Styling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply rounded-sm Tailwind class to all images and box-like elements (cards, containers) that currently have sharp corners for improved visual consistency.

**Architecture:** Systematically scan React components for <img> elements and container divs with backgrounds/borders. Add rounded-sm class to className where missing, ensuring no duplicates or conflicts with existing rounded classes.

**Tech Stack:** React, TypeScript, Tailwind CSS, Astro framework

### Task 1: Hero Section Image

**Files:**

- Modify: src/components/HeroSection.tsx:25-31

**Step 1: Update logo image className**

Add rounded-sm to the img className.

**Current:**

```tsx
<img
  src={poseImage}
  alt="Warrior Pose"
  width="256"
  height="256"
  loading="lazy"
  className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 drop-shadow-xl brightness-0 invert transition-all duration-300"
/>
```

**Updated:**

```tsx
className =
  "w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 drop-shadow-xl brightness-0 invert transition-all duration-300 rounded-sm";
```

**Step 2: Verify change**

Check the component renders with rounded image.

**Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "style: add rounded-sm to hero logo image"
```

### Task 2: Instructor Section Image

**Files:**

- Modify: src/components/InstructorSection.tsx:13-20

**Step 1: Update instructor image className**

Add rounded-sm to the img className.

**Current:**

```tsx
<img
  src={instructorImage}
  alt="Priyanka - Yoga Instructor"
  width="400"
  height="400"
  loading="lazy"
  className=" shadow-2xl w-full object-cover aspect-square"
/>
```

**Updated:**

```tsx
className = " shadow-2xl w-full object-cover aspect-square rounded-sm";
```

**Step 2: Verify change**

Check the component renders with rounded image.

**Step 3: Commit**

```bash
git add src/components/InstructorSection.tsx
git commit -m "style: add rounded-sm to instructor profile image"
```

### Task 3: Gallery Section Video Containers

**Files:**

- Modify: src/components/GallerySection.tsx:106-114

**Step 1: Update video container div className**

Add rounded-sm to the outer div.

**Current:**

```tsx
<div
  key={index}
  className="overflow-hidden  shadow-lg hover:shadow-2xl transition-shadow duration-300"
>
```

**Updated:**

```tsx
className =
  "overflow-hidden  shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-sm";
```

**Step 2: Verify change**

Check the gallery videos have rounded containers.

**Step 3: Commit**

```bash
git add src/components/GallerySection.tsx
git commit -m "style: add rounded-sm to gallery video containers"
```

### Task 4: Reviews Section Cards

**Files:**

- Modify: src/components/ReviewsSection.tsx:41

**Step 1: Update Card className**

Add rounded-sm to the Card className.

**Current:**

```tsx
<Card key={index} className="bg-card border-border hover:shadow-xl transition-shadow duration-300">
```

**Updated:**

```tsx
className =
  "bg-card border-border hover:shadow-xl transition-shadow duration-300 rounded-sm";
```

**Step 2: Verify change**

Check review cards have rounded corners.

**Step 3: Commit**

```bash
git add src/components/ReviewsSection.tsx
git commit -m "style: add rounded-sm to review cards"
```

### Task 5: Check Other Components for Images/Boxes

**Files:**

- Check: src/components/AboutSection.tsx, src/components/ExperienceSection.tsx, src/components/ScheduleSection.tsx, src/components/MapSection.tsx, src/components/ContactSection.tsx

**Step 1: Search for img elements and box containers**

Use grep to find any remaining img tags or divs with bg-/border classes without rounded-.

**Command:**

```bash
grep -r "<img" src/components/
grep -r "className.*bg-" src/components/
grep -r "className.*border" src/components/
```

**Step 2: Update any found elements**

If any found without rounded-sm, add it.

**Step 3: Commit if changes made**

```bash
git add [files]
git commit -m "style: add rounded-sm to remaining images and boxes"
```

### Task 6: Update UI Components (Card, Button)

**Files:**

- Modify: src/components/ui/card.tsx:11
- Modify: src/components/ui/button.tsx (if needed)

**Step 1: Add rounded-sm to base Card component**

Update the Card component to include rounded-sm by default.

**Current:**

```tsx
className={cn(" border bg-card text-card-foreground shadow-sm", className)}
```

**Updated:**

```tsx
className={cn(" border bg-card text-card-foreground shadow-sm rounded-sm", className)}
```

**Step 2: Check if Button needs rounding**

Buttons in ShadCN typically have default rounding via CSS variables, but verify.

**Step 3: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "style: add rounded-sm to base Card component"
```

### Task 7: Test Build and Lint

**Step 1: Run build**

```bash
npm run build
```

**Step 2: Run lint**

```bash
npm run lint
```

**Step 3: Fix any issues**

**Step 4: Commit fixes if needed**

````bash
git add [files]
git commit -m "fix: lint/build issues from rounding updates"
```</content>
<parameter name="filePath">docs/plans/2026-01-22-rounded-corners-styling.md
````
