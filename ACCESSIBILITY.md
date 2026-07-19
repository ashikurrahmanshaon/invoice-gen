# Accessibility (a11y) Guide

## Overview
Invoice-Gen.net is committed to providing an accessible experience for all users, including those who rely on assistive technologies such as screen readers, keyboard navigation, and custom browser settings. 

## WCAG Target
Our target compliance level is **WCAG 2.2 AA**. We actively maintain and audit the application to ensure it meets these standards without over-engineering for AAA, maintaining a balance between aesthetic UI and strict accessibility.

## Keyboard Support
All interactive elements in the application are designed to be fully usable with a keyboard:
- All interactive controls can be reached using `Tab` and `Shift+Tab`.
- No keyboard traps exist within the application.
- Modals, dialogs, and popups correctly trap focus while active and restore focus to the triggering element upon closing.
- Visible focus indicators (`:focus-visible` and `:focus-within`) clearly outline the currently active element.

## Screen Reader Support
- **Semantic HTML**: The application utilizes standard HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`) to aid structural navigation.
- **Form Controls**: All custom inputs (`Input`, `Select`) utilize `useId` to programmatically associate `<label>` with inputs, ensuring accurate announcements.
- **Error States**: Validation errors use `aria-invalid`, `aria-describedby`, and `aria-live` to dynamically announce errors. Errors also utilize icons so they do not rely on color alone.
- **Icons**: Decorative icons are explicitly hidden from screen readers using `aria-hidden="true"`, while interactive icons possess appropriate `aria-label`s.

## Browser & Zoom Support
The application features a responsive, flexbox-driven design that smoothly transitions layouts when zoomed in. 
- At 150% and 200% zoom, the layout adapts to stacked columns to prevent horizontal scrolling or clipped UI elements.

## Known Limitations
- *Lighthouse Accessibility scores* and formal testing with physical screen readers (NVDA, VoiceOver) will be finalized in upcoming production QA phases.
- Certain highly complex custom UI states may require ongoing specialized ARIA management.

## Future Improvements
- Formal Lighthouse audits.
- Expanded manual testing with disabled users.
- Continual refinement of custom components for ARIA compliance.
