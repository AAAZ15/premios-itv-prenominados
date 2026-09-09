---
name: Gala Broadcast Luminance
colors:
  surface: '#0e131f'
  surface-dim: '#0e131f'
  surface-bright: '#343946'
  surface-container-lowest: '#090e19'
  surface-container-low: '#171b27'
  surface-container: '#1b1f2b'
  surface-container-high: '#252a36'
  surface-container-highest: '#303541'
  on-surface: '#dee2f3'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dee2f3'
  inverse-on-surface: '#2c303d'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#c7cdd5'
  on-tertiary: '#2b3137'
  tertiary-container: '#acb2ba'
  on-tertiary-container: '#3e454b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#0e131f'
  on-background: '#dee2f3'
  surface-variant: '#303541'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 54px
    letterSpacing: 0.08em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 38px
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.03em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.15em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter-xs: 0.25rem
  gutter-sm: 0.5rem
  gutter-md: 1rem
  gutter-lg: 1.5rem
  gutter-xl: 2rem
  container-pad-sm: 1rem
  container-pad-md: 1.5rem
  container-pad-lg: 2.5rem
  section-gap: 4rem
  search-bar-height: 3.5rem
---

## Brand & Style

The design system establishes a premium, televised awards gala atmosphere celebrating a 30-year legacy in broadcast and digital media. The digital experience captures the electric, high-stakes spectacle of a live primetime ceremony: deep midnight tones, precision metallic silver framing, and atmospheric cyan-violet neon streaks reminiscent of stage spotlights and lens flares.

Targeted toward nominees, industry professionals, cultural journalists, and public audiences, the aesthetic combines cinematic grandeur with effortless digital utility. Rather than treating nominees as competitive candidates with gamified ranking systems or vote tallies, this design system treats every nominee as an honored peer within an archival celebration. 

The aesthetic is rooted in **Broadcast Glassmorphism**:
- Deep void gradients layered beneath soft-edged, frosted glass surfaces.
- Specular lighting and horizontal streak highlights across section headers.
- Bold uppercase typography commanding immediate focus like television lower-thirds.
- Non-distractive, elegant micro-interactions with glowing outlines instead of heavy physical drop-shadows.

## Colors

The palette derives from the darkness of a grand theater illuminated by electric production spotlights and metallic silver trophies.

- **Primary (`#38BDF8`):** Electric cyan spotlight. Serves as the primary focal point, active selection aura, and luminous title glow.
- **Secondary (`#818CF8`):** Indigo bloom. Blended into linear gradients with primary cyan to reproduce stage lighting diffusion across key surfaces.
- **Tertiary (`#E2E8F0`):** Polished chrome/silver. Applied to delicate container strokes, subtle icons, and category subtitles to evoke engraved silver statuettes.
- **Neutral Surface Canvas (`#050914` to `#02040A`):** Deep midnight void. Replaces flat black with rich, atmospheric depth.
- **Surfaces & Cards (`rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`):** Dark frosted glass overlays with low-contrast metallic edge borders (`rgba(255, 255, 255, 0.12)`).
- **Text Tiers:** Pristine pure white (`#FFFFFF`) for primary titles and nominee names; Cool Gray (`#94A3B8`) for metadata, edition markers, and secondary labels.

## Typography

The typography pairs the architectural punch of **Montserrat** for broadcast headers with the crystalline legibility of **Inter** for directory exploration.

- **Gala Headlines (`Montserrat`):** Always styled in bold or heavy uppercase (`text-transform: uppercase`) with wide letter spacing. Major category titles incorporate subtle radial text shadows (`text-shadow: 0 0 20px rgba(56, 189, 248, 0.45)`) echoing televised on-screen stage graphics.
- **Editorial Sub-headers:** Use high-contrast weights, pairing bold category labels (`CATEGORÍA`) with glowing nominal titles (`MEJOR INSTAGRAM SENIOR`).
- **Body & Metadata (`Inter`):** Unobtrusive and clean. Nominee bios, category descriptions, and metadata maintain generous line heights for clear reading against high-contrast deep backdrops.

## Layout & Spacing

The layout is built around an immersive **12-column responsive fluid grid** with generous macro-spacing to simulate theatrical breathing room.

- **Desktop (12 Columns, max 1360px):** 24px gutters, 40px outer margins. Content groups (such as nominee rosters) arrange in 4-column balanced card grids or horizontal filmstrip showcases.
- **Tablet (8 Columns, 768px - 1024px):** 16px gutters, 24px outer margins. Adapts nominee showcases into a 2x2 grid structure.
- **Mobile (4 Columns, <768px):** 12px gutters, 16px outer margins. Converts nominee clusters into a high-density vertical stack or full-bleed horizontal swipe with snap pagination.

Rhythm relies on contrasting dense card contents with expansive section gaps (`4rem` / `64px`), centering focus on category milestones and search exploration.

## Elevation & Depth

Visual hierarchy does not rely on conventional dark drop-shadows, which dissolve into the pitch-black stage canvas. Instead, depth is articulated through **luminous translucency and back-lit borders**:

1. **Stage Canvas (Floor 0):** Gradient spanning `#050914` through `#02040A`, accented by fixed ambient blurs (`radial-gradient(ellipse at 50% 10%, rgba(56, 189, 248, 0.15), transparent 70%)`).
2. **Glassmorphic Paneling (Level 1):** Backing cards and directory filters use `background: rgba(255, 255, 255, 0.03)`, `backdrop-filter: blur(16px)`, and a subtle hairline border `1px solid rgba(255, 255, 255, 0.1)`.
3. **Nominee Card Elevated State (Level 2):** On focus or hover, cards activate a multi-layered rim light:
   - Border transitions to `rgba(56, 189, 248, 0.4)`.
   - Box shadow emits an electric cyan halo: `0 0 24px -4px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)`.
4. **Modal / Spotlight Overlay (Level 3):** Frosted glass drawer/modal with `backdrop-filter: blur(28px)`, surrounded by subtle silver perimeter reflections.

## Shapes

The design system adopts **Roundedness Level 2 (Rounded)**:
- Standard elements (inputs, badges, chips) utilize `rounded-md` (`0.5rem` / `8px`).
- Nominee portraits and directory cards use `rounded-lg` (`1rem` / `16px`) and `rounded-xl` (`1.5rem` / `24px`), echoing the soft rectangular broadcast framing visible in stage monitor graphics.
- Filter pills and status indicators leverage full pill geometry (`9999px`) to maintain fluid contrast against rectangular broadcast cards.

## Components

### Directory Search & Instant Filters
- **Gala Search Input:** High-visibility translucent bar (`height: 3.5rem`), inset with an electric cyan search icon, silver placeholder text (`#94A3B8`), and an active cyan inner-border flare.
- **Filter Chips:** Pill-shaped glass buttons (`rounded-full`, `px-4 py-2`). Unselected state features `rgba(255, 255, 255, 0.05)` with `rgba(255, 255, 255, 0.1)` border. Selected state glows with `background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.2))` and a bright `#38BDF8` border.
- **Category Accordion / Carousel:** Rapidly segments nominees by broadcast disciplines (e.g., Televisión, Radio, Digital / Redes) without page reloads.

### Nominee Showcase Cards
- **Card Framing:** Frosted dark surface (`rgba(255, 255, 255, 0.04)`), featuring vertical proportions with rounded inner picture frames (`rounded-lg`).
- **Portrait Framing:** Integrated portrait photo styled with an inner edge vignette and silver specular highlights across the top edge.
- **Nominee Title:** Montserrat uppercase bold name centered directly beneath the photograph, accented by a cool-gray category label.
- **No Competitive Indicators:** Strictly devoid of voting buttons, score rings, vote counts, rank badges, or ordinal numbers to preserve celebratory equity.

### Action Controls
- **Buttons (Primary):** Solid cyan-to-indigo luminous fill (`linear-gradient(135deg, #38BDF8, #818CF8)`), high-contrast black or dark-navy text (`#02040A`), bold Montserrat uppercase typography, and subtle ambient hover bloom.
- **Buttons (Secondary / Outlined):** Frosted glass base with a silver hairline border (`rgba(226, 232, 240, 0.3)`), pure white text, and cyan glow upon hover.
- **Inputs & Dropdowns:** Frosted slate surfaces with subtle silver focus rings and backdrop blur.

### Broadcast Accents
- **Metallic Stage Separators:** Thin horizontal dividers with radial gradient masks (`linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)`).
- **Watermark Badge:** An elegant 30th Anniversary emblem or monogram rendered in polished chrome and frosted glass anchored in persistent navigation.