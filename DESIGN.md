# GodLike Esports FFM — Design System

> Generated from project config + Stitch integration guide.
> Update via Stitch MCP: `Use the Stitch MCP to fetch the 'GodLike Esports FFM' project and regenerate DESIGN.md`

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `dark` | `#0a0a0a` | Page background, primary dark |
| `dark-card` | `#111111` | Card / panel backgrounds |
| `dark-border` | `#1a1a1a` | Subtle borders |
| `accent` | `#FF6B00` | Primary accent (orange, legacy) |
| `accent-dark` | `#cc5500` | Accent hover / pressed |
| `grey` | `#888888` | Secondary text |
| `grey-light` | `#aaaaaa` | Tertiary text |
| `gold` | `#c9a84c` | GodLike gold — brand primary |
| `gold-dark` | `#a68a3e` | Gold hover / pressed |
| `gold-light` | `#e0c872` | Gold highlights |
| `brown` | `#8b6914` | Deep gold / trophy tint |
| `brown-light` | `#b8860b` | Secondary trophy tint |
| `win` | `#22c55e` | Victory / success states |
| `loss` | `#ef4444` | Defeat / error states |
| `upcoming-blue` | `#3b82f6` | Upcoming tournament badges |
| `roster-bg` | `#0d0d0f` | Roster page background |
| `roster-card` | `#141416` | Roster card background |
| `roster-border` | `#2a2520` | Roster card border |
| `navbar-bg` | `#FFB800` | Navbar golden background |
| `navbar-border` | `#E6A600` | Navbar bottom border |
| `tab-active` | `#FFB800` | Active tab in pill bar |
| `tab-pill-bg` | `#111111` | Pill bar background |

### Heartbreak Memorial Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `hb-bg` | `#0a0a0a` | Memorial page background |
| `hb-gold` | `#c9a84c` | Memorial gold accent |
| `hb-text` | `#e8e0d0` | Warm off-white text |
| `hb-glow` | `rgba(201, 168, 76, 0.15)` | Subtle golden glow |

---

## Typography

| Role | Font Family | Weight | Usage |
|------|-------------|--------|-------|
| **Headings** | `Rajdhani`, sans-serif | 600–700 | All h1–h6, section titles, nav tabs |
| **Body** | `Inter`, sans-serif | 400–500 | Paragraph text, descriptions, stats |
| **Tab Labels** | `Rajdhani`, sans-serif | 700 | Navbar pill tabs — `text-sm uppercase tracking-wider` |

---

## Spacing Tokens

| Size | Value | Usage |
|------|-------|-------|
| `xs` | `4px` | Inline gaps, icon margins |
| `sm` | `8px` | Compact padding (badges, pills) |
| `md` | `16px` | Card padding, section gaps |
| `lg` | `24px` | Section padding |
| `xl` | `32px` | Major section spacing |
| `2xl` | `48px` | Page-level vertical rhythm |

---

## Component Patterns

### Navbar (Pill Tab Bar)
- Outer container: `bg-[#FFB800]`, `fixed top-0`, `z-50`
- Pill bar: `bg-[#111111] rounded-full p-1`
- Active tab: `bg-[#FFB800] text-black rounded-full`
- Inactive tab: `text-[#888] hover:text-white`
- Tabs: OVERVIEW | SCHEDULE | TEAMS | HISTORY | HEARTBREAK | ADMIN

### Cards
- Background: `bg-[#111111]` or `bg-dark-card`
- Border: `border border-[#1a1a1a]` or `border-dark-border`
- Radius: `rounded-xl` (standard) or `rounded-2xl` (featured)
- Hover: `hover:border-gold/25 transition-colors`

### Live Indicator
- Pulsing red dot: `w-2 h-2 bg-red-500 rounded-full animate-pulse-live`
- Live glow: `box-shadow: 0 0 15px rgba(255, 107, 0, 0.3)`

### Stat Box
- Gradient: `linear-gradient(135deg, #1a1a1a 0%, #111111 100%)`
- Border: `1px solid #2a2a2a`

---

## Animations

| Name | Duration | Usage |
|------|----------|-------|
| `pulse-live` | `2s infinite` | Live tournament indicator |
| `pulse-slow` | `3s infinite` | Heartbreak halo ring |
| `glow` | `2s alternate` | Tournament highlight border |
| `slideUp` | `0.5s ease-out` | Page section entrance |
| `fadeIn` | `0.5s` | Element appearance |
| `candleFlicker` | `2s infinite` | Heartbreak candle icon |

---

## Layout

- Max content width: `max-w-7xl` (1280px)
- Navbar height: `h-16` (64px)
- Content top padding: `pt-24` (accounts for fixed navbar)
- Mobile breakpoint: `md:` (768px+)
- Grid: 1 col mobile → 2 col tablet → 3–4 col desktop

---

## Pages

| Route | Page | Design Mood |
|-------|------|-------------|
| `/` | Overview (Home) | Aggressive esports energy |
| `/schedule` | Schedule | Clean data grid |
| `/roster` | Teams | Dark, player-focused |
| `/tournaments` | History | Stats-heavy, achievement-oriented |
| `/heartbreak` | Memorial Tribute | Somber, warm, respectful |
| `/admin` | Admin Dashboard | Functional, control-panel |
| `/live` | Live Scores | Real-time, high-energy |

---

## File Structure

```
src/
├── components/
│   ├── Navbar.js          — Pill tab navigation
│   ├── Footer.js          — Site footer
│   └── DynamicCompletedTournaments.js
├── pages/
│   ├── Home.js            — Overview
│   ├── Schedule.js        — Tournament schedule
│   ├── Roster.js          — Team roster
│   ├── Tournaments.js     — Completed tournaments
│   ├── Heartbreak.js      — Tahir memorial
│   ├── LiveScores.js      — Live match tracking
│   ├── Admin.js           — Admin panel
│   └── PlayerProfile.js   — Individual player
├── data/
│   ├── store.js           — localStorage CRUD
│   └── tournamentStore.js — Tournament data
├── hooks/
│   └── useTournamentStoreSync.js — Reactive hooks
└── index.css              — Global styles + animations
```
