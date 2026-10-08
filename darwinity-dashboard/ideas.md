# Darwinity Dashboard — Ground-Truth Reference Spec

This is a screenshot-replication task. The supplied dashboard screenshot is the source of truth; fidelity to its layout, hierarchy, spacing, colors, typography, border treatment, and responsive behavior overrides exploratory design variations.

## Chosen Direction: Calm Study Workspace

### Design Movement
Contemporary editorial productivity UI: quiet Swiss-like structure softened by warm paper tones, rounded cards, and forest-green action surfaces.

### Core Principles
1. **Quiet hierarchy:** large black display copy, restrained gray supporting text, and one dark-green action color.
2. **Soft utility:** cards are spacious and tactile, with thin gray outlines, pale icon tiles, and almost-flat shadows.
3. **Asymmetric dashboard composition:** persistent left rail, wide content canvas, and a split onboarding panel that favors the learning content on the left and outcomes on the right.
4. **Human study cues:** archival Darwin portrait, small hand-drawn-feeling icon accents, and copy that treats study as a craft rather than a transaction.

### Color Philosophy
Use a warm near-white canvas (#f3f2ee) rather than stark white, white cards with gentle gray borders, charcoal ink text, pale sage utility tiles, and deep forest green as the ownable conversion color. The palette should feel intelligent, calm, and lightly academic.

### Layout Paradigm
A fixed desktop sidebar around 260px wide; a content frame with generous 44px horizontal padding; a compact top utility bar; a hero row with headline left and CTA right; a three-card source intake row; and a large split card below with a 58/42 left-right split. At mobile widths, the sidebar collapses into a compact top rail, cards stack, and the split panel becomes vertical.

### Signature Elements
- A compact dark-green Darwinity mark with a rounded lowercase `d` silhouette.
- Rounded, pale icon tiles preceding each primary action.
- The “Feed once. Unlock the whole toolkit.” onboarding card with a 3-step trail and a colorful 3×3 study-output grid.

### Interaction Philosophy
Interactions should be quiet and immediate: cards lift by 1–2px, primary buttons darken slightly, icon tiles remain stable, and navigation changes the active rail item without visual noise. All structural controls are functional demos and should show a concise toast or inline feedback when activated.

### Animation
Use short 160–220ms ease-out transitions for hover, active, and card elevation. Stagger the initial main-content reveal by 40–60ms. Respect reduced-motion preferences and avoid animated layout shifts.

### Typography System
Use `Plus Jakarta Sans` for display and interface text with a strong 700–800 weight for headings and 500–600 for labels. Use the same family at lighter weights for supporting copy so the dashboard preserves the screenshot’s rounded, friendly, highly legible tone. Headline size is approximately 34px desktop; card titles 16–17px; supporting copy 14–15px.

### Brand Essence
A calm all-in-one study workspace for students who want one source to become every useful study mode. Personality: **curious, capable, warm**.

### Brand Voice
Headlines are direct and conversational. CTAs are short, active, and outcome-oriented. Microcopy is specific and reassuring.

Example lines:
- “Feed it once. Unlock the whole toolkit.”
- “One source becomes notes, a mind map, cards, quizzes, podcast, and Ask AI.”

### Wordmark & Logo
Use a custom symbol-first mark: a rounded lowercase `d` with a leaf-like notch, paired with a compact “Darwinity” wordmark in semibold rounded sans. Keep the mark visible in the sidebar and use a favicon-sized version for browser identity.

### Signature Brand Color
Deep forest green: `#123d2d` for high-emphasis actions, with a lighter support green `#4c8f6b` for filled onboarding actions.

## Implementation Reminder
Every CSS or component file added for this page should begin with a short comment reminding contributors that this is a screenshot-faithful, calm study workspace: warm near-white canvas, white rounded cards, charcoal ink, forest-green actions, asymmetric fixed rail, and restrained motion.
