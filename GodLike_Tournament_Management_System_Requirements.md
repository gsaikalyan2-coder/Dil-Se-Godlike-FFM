# GodLike Esports FFM — Tournament Management System Requirements

> **Document Type:** Technical Specification & Implementation Guide
> **Version:** 1.0
> **Last Updated:** March 21, 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Page Architecture & Navigation](#2-page-architecture--navigation)
3. [Tournament Lifecycle & States](#3-tournament-lifecycle--states)
4. [Admin Dashboard — Real-Time Management](#4-admin-dashboard--real-time-management)
5. [Schedule Section — Upcoming Tournaments](#5-schedule-section--upcoming-tournaments)
6. [Tournaments Section — Completed Tournaments](#6-tournaments-section--completed-tournaments)
7. [Home Page — Live & Upcoming Visibility](#7-home-page--live--upcoming-visibility)
8. [Data Model & Storage](#8-data-model--storage)
9. [Admin Panel Feature List](#9-admin-panel-feature-list)
10. [User Experience Guidelines](#10-user-experience-guidelines)

---

## 1. System Overview

The website requires a **real-time tournament management dashboard** where an admin can create, modify, and manage Free Fire tournaments across their entire lifecycle. The system connects multiple pages (Home, Schedule, Tournaments) through a shared data layer that updates in real time when the admin makes changes.

### Core Principle
> The admin panel acts as a **single source of truth**. Any change made in the admin dashboard instantly reflects across all public-facing pages — no page refresh needed by visitors.

### Key Roles

| Role | Access | Description |
|------|--------|-------------|
| **Admin** | Full CRUD | Can create, read, update, delete all tournament data. Can change tournament states. Can modify live match data in real time. |
| **Visitor** | Read-only | Can view all public pages (Home, Schedule, Tournaments, Roster, About). Cannot modify any data. |

---

## 2. Page Architecture & Navigation

### Public Pages (Visitor-Facing)

| Page | URL | Content |
|------|-----|---------|
| **Home** | `/` | Hero section, Live Tournament banner, Upcoming Tournaments preview, team highlights |
| **Schedule** | `/schedule` | All **Upcoming Tournaments** listed with dates, format, and countdown timers |
| **Tournaments** | `/tournaments` | All **Completed Tournaments** with widgets showing GodLike's journey, standings, and stats |
| **Roster** | `/roster` | Current & Previous roster widgets with player cards (clickable → player detail page) |
| **About** | `/about` | Organization info |
| **Player Detail** | `/roster/:playerId` | Individual player page (IGN, stats, details — to be provided in future sessions) |

### Admin Pages (Protected)

| Page | URL | Content |
|------|-----|---------|
| **Admin Dashboard** | `/admin` | Real-time control panel for all tournament management |
| **Admin Login** | `/admin/login` | Authentication gate |

---

## 3. Tournament Lifecycle & States

Every tournament exists in exactly **one of three states** at any given time. The admin controls state transitions.

```
┌──────────┐       ┌──────────┐       ┌──────────────┐
│ UPCOMING │──────▶│   LIVE   │──────▶│  COMPLETED   │
└──────────┘       └──────────┘       └──────────────┘
     │                                       ▲
     └───────────────────────────────────────┘
              (can skip LIVE if needed)
```

### State Definitions

| State | Where It Appears | Admin Can Do | Visitor Sees |
|-------|-----------------|--------------|--------------|
| **UPCOMING** | Schedule page + Home page (preview) | Edit all details, set dates, add matches, delete tournament | Tournament card with name, dates, format, countdown |
| **LIVE** | Home page (prominent banner) + Schedule page (highlighted) | Update match scores in real time, update kills per player per game, update standings, add/remove games | Live tournament banner with real-time scores, current match info, live standings |
| **COMPLETED** | Tournaments page (widget) | Edit final standings, correct data, add notes | Full tournament widget with GodLike's journey, standings, stats |

### State Transition Rules

| Transition | Trigger | What Happens |
|-----------|---------|--------------|
| Upcoming → Live | Admin clicks "Go Live" | Tournament moves from Schedule to Home page Live banner. Match management panel activates. |
| Live → Completed | Admin clicks "Mark Complete" | Tournament moves from Home/Schedule to Tournaments page. Final standings are locked (but editable by admin). Widget is generated. |
| Upcoming → Completed | Admin clicks "Mark Complete" (skip Live) | For tournaments that already happened and are being added retroactively. |

---

## 4. Admin Dashboard — Real-Time Management

The admin dashboard is the **central control panel**. It must function as a real-time dashboard where changes propagate instantly to the public-facing website.

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD — GodLike FFM Tournament Manager       │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  SIDEBAR    │   MAIN CONTENT AREA                       │
│             │                                           │
│  • Overview │   [Dynamic based on sidebar selection]    │
│  • Create   │                                           │
│  • Upcoming │                                           │
│  • Live     │                                           │
│  • Completed│                                           │
│  • Roster   │                                           │
│  • Settings │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

### 4.1 Create Tournament

Admin fills out a form to create a new tournament:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Tournament Name | Text | ✅ | e.g., "Rulebreakerz Regional Cup BR" |
| Organizer | Text | ✅ | e.g., "Rulebreakerz" |
| Game Mode | Dropdown | ✅ | Battle Royale / Clash Squad |
| Region | Text | ✅ | e.g., "India" |
| Tier | Dropdown | ✅ | S-Tier / A-Tier / B-Tier / C-Tier / D-Tier / Community |
| Start Date | Date Picker | ✅ | Tournament start |
| End Date | Date Picker | ✅ | Tournament end |
| Prize Pool (INR) | Number | ❌ | Optional |
| Prize Pool (USD) | Number | ❌ | Optional |
| Teams Count | Number | ✅ | Total teams |
| Liquipedia URL | URL | ❌ | Optional link |
| Status | Dropdown | ✅ | Upcoming / Live / Completed |
| VOD Links | Multiple URL fields | ❌ | YouTube VOD links per stage |
| Instagram Link | URL | ❌ | Optional |

### 4.2 Manage Tournament — Format & Stages

Once created, the admin can define the tournament structure:

**Add Stages (dynamic, unlimited):**

| Field | Type | Description |
|-------|------|-------------|
| Stage Name | Text | e.g., "Playoffs", "Semi Finals", "Grand Finals", "League Stage" |
| Stage Type | Dropdown | BR Points / Clash Squad Bracket / Round Robin / Swiss |
| Date Range | Date Picker | Stage dates |
| Teams in Stage | Number | How many teams participate |
| Qualification Rule | Text | e.g., "Top 12 advance", "Top 3 per group" |

**For BR Points Stages — Add Match Boxes:**

Each match box contains:

| Field | Type | Description |
|-------|------|-------------|
| Match Number | Auto | Game 1, Game 2, etc. |
| GodLike Placement | Number (1-12) | Placement in this match |
| GodLike Kills | Number | Total team kills this match |
| Per-Player Kills | 5 × Number fields | YOGI kills, MARCO kills, NOBITA kills, ECOECO kills, NANCY kills |
| Booyah | Toggle | Yes/No — did GodLike win this match? |

**For Clash Squad Stages — Add Match Boxes:**

| Field | Type | Description |
|-------|------|-------------|
| Round Name | Text | e.g., "Round 1", "Semi Finals", "Grand Finals" |
| Series Format | Dropdown | Bo1 / Bo3 / Bo5 |
| Opponent | Text | e.g., "NG Pros" |
| Game Scores | Multiple (GodL Score, Opponent Score) per game | e.g., Game 1: 7-4, Game 2: 7-2, Game 3: 7-3 |
| Series Result | Auto-calculated | e.g., "GodLike wins 3-0" |

### 4.3 Manage Standings

The admin can input the **full tournament standings** table:

| Field | Type | Description |
|-------|------|-------------|
| Rank | Number | 1, 2, 3... |
| Team Name | Text | e.g., "Reckoning Esports" |
| Booyahs | Number | Total Booyahs |
| Kills | Number | Total kills |
| Placement Points | Number | Total placement points |
| Total Points | Number | Overall total |
| Prize (INR) | Number | Prize won |
| Prize (USD) | Number | Prize won |

The admin can **add/remove rows** dynamically and **reorder** teams by dragging.

### 4.4 GodLike's Journey

For each tournament, the admin fills in GodLike's specific path:

| Field | Type | Description |
|-------|------|-------------|
| Stage Name | Text | e.g., "Playoffs" |
| GodLike Position | Text | e.g., "12th of 18" |
| Total Points | Number | Points scored |
| Outcome | Dropdown | Advanced / Eliminated / Champions / Runner-Up |
| Notes | Text | Any additional context |

### 4.5 Real-Time Live Match Updates

When a tournament is in **LIVE** state, the admin gets a special **Live Control Panel**:

- **Current Match Indicator** — shows which game is being played
- **Quick Score Entry** — enter GodLike's placement and kills as they happen
- **Per-Player Kill Tracker** — update individual player kills in real time
- **Standings Auto-Recalculate** — as scores are entered, overall standings update automatically
- **"Next Match" Button** — advances to the next game
- **"End Tournament" Button** — transitions to Completed state

---

## 5. Schedule Section — Upcoming Tournaments

### What Visitors See

The Schedule page displays all tournaments in **UPCOMING** state:

- Tournament name with logo/banner
- Dates with **countdown timer** (e.g., "Starts in 3 days 14 hours")
- Game mode (BR / CS)
- Tier badge
- Prize pool
- Teams count
- Format summary (stages overview)
- VOD links (if pre-tournament content exists)

### Sorting & Filtering
- Sort by: Date (nearest first), Prize Pool, Tier
- Filter by: Game Mode (BR/CS), Tier

### What Admin Controls
- Add new upcoming tournaments
- Edit any detail of existing upcoming tournaments
- Delete upcoming tournaments
- Change status to Live or Completed
- Reorder display priority

---

## 6. Tournaments Section — Completed Tournaments

### What Visitors See

The Tournaments page displays all tournaments in **COMPLETED** state as **widgets**:

Each widget contains:
- Tournament name & banner
- Dates, Organizer, Tier badge, Prize Pool
- **GodLike's Final Position** (prominently displayed, e.g., "🏆 CHAMPIONS" or "2nd Place" or "11th")
- **GodLike's Journey** — stage-by-stage progression table
- **Full Standings** — expandable table with all teams
- **Match-by-Match Performance** — expandable section with per-game stats
- **Per-Player Stats** — kills per player per game (if available)
- VOD links & social media links
- Roster used in this tournament

### Widget Display Rules
- Most recent tournaments appear first
- Widgets are collapsible/expandable
- "View Full Details" expands to show all data
- Color-coded position badges: Gold (1st), Silver (2nd), Bronze (3rd), Red (eliminated early), Grey (mid-table)

### What Admin Controls
- Edit any data within a completed tournament widget
- Reorder widgets
- Delete tournaments
- Move back to Upcoming or Live (if correction needed)

---

## 7. Home Page — Live & Upcoming Visibility

### Live Tournament Banner

When any tournament is in **LIVE** state, the Home page shows a **prominent live banner**:

- Pulsing "LIVE" indicator with red dot animation
- Tournament name
- Current match number (e.g., "Game 4 of 6")
- GodLike's current standings position
- Real-time points total
- Link to full live view

### Upcoming Tournaments Preview

Below the hero section, the Home page shows a **carousel/grid** of upcoming tournaments:

- Next 3-5 upcoming tournaments
- Countdown timers
- Quick info (name, date, mode, tier)
- "View Schedule →" link to full Schedule page

### Display Priority
1. Live tournament banner (if any) — always at top
2. Next upcoming tournament — featured card
3. Recent completed tournament highlight — small card

---

## 8. Data Model & Storage

### Tournament Object Structure

```
Tournament {
  id: string (unique)
  name: string
  organizer: string
  gameMode: "BR" | "CS"
  region: string
  tier: "S" | "A" | "B" | "C" | "D" | "Community"
  status: "upcoming" | "live" | "completed"
  startDate: date
  endDate: date
  prizePoolINR: number
  prizePoolUSD: number
  teamsCount: number
  liquipediaURL: string
  instagramURL: string
  vodLinks: [{ stage: string, url: string }]
  
  stages: [{
    name: string
    type: "br_points" | "cs_bracket" | "round_robin" | "swiss"
    dateRange: { start: date, end: date }
    teamsInStage: number
    qualificationRule: string
    
    // For BR stages
    matches: [{
      matchNumber: number
      godlikeePlacement: number
      godlikeKills: number
      playerKills: {
        YOGI: number
        MARCO: number
        NOBITA: number
        ECOECO: number
        NANCY: number
      }
      booyah: boolean
    }]
    
    // For CS stages
    csMatches: [{
      roundName: string
      seriesFormat: "Bo1" | "Bo3" | "Bo5"
      opponent: string
      games: [{ godlikeScore: number, opponentScore: number }]
      seriesResult: string  // auto-calculated
    }]
  }]
  
  standings: [{
    rank: number
    team: string
    booyahs: number
    kills: number
    placementPts: number
    totalPts: number
    prizeINR: number
    prizeUSD: number
  }]
  
  godlikeJourney: [{
    stage: string
    position: string
    totalPoints: number
    outcome: "advanced" | "eliminated" | "champions" | "runner_up"
    notes: string
  }]
  
  godlikeFinalPosition: string  // e.g., "2nd", "11th", "Champions"
  godlikePrizeINR: number
  godlikePrizeUSD: number
  
  roster: [string]  // Player IGNs used in this tournament
  
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Storage Approach

Use the **persistent storage API** (window.storage) for the React artifact:
- Key pattern: `tournament:{id}` for each tournament
- Key: `tournaments-index` for the master list of all tournament IDs with their status
- Key: `admin-auth` for admin authentication state

---

## 9. Admin Panel Feature List

### Tournament CRUD

| Feature | Description |
|---------|-------------|
| ✅ Create Tournament | Full form with all fields |
| ✅ Edit Tournament | Modify any field at any time |
| ✅ Delete Tournament | Remove tournament entirely (with confirmation) |
| ✅ Duplicate Tournament | Clone an existing tournament as a template |

### Status Management

| Feature | Description |
|---------|-------------|
| ✅ Change Status | Dropdown to switch between Upcoming / Live / Completed |
| ✅ Go Live | One-click transition from Upcoming to Live |
| ✅ Mark Complete | One-click transition from Live to Completed |
| ✅ Revert Status | Move back to previous state if correction needed |

### Match Management

| Feature | Description |
|---------|-------------|
| ✅ Add Match Box | Add a new match/game to any stage |
| ✅ Remove Match Box | Delete a match |
| ✅ Edit Match Data | Modify placement, kills, per-player kills |
| ✅ Auto-Calculate Totals | Standings auto-update when match data changes |
| ✅ Add Stage | Add a new tournament stage |
| ✅ Remove Stage | Delete a stage |

### Standings Management

| Feature | Description |
|---------|-------------|
| ✅ Add Team Row | Add a team to standings |
| ✅ Remove Team Row | Remove a team |
| ✅ Edit All Fields | Modify rank, team name, stats, prize |
| ✅ Drag-to-Reorder | Reorder standings by dragging rows |
| ✅ Import from Match Data | Auto-generate standings from match results |

### Live Dashboard

| Feature | Description |
|---------|-------------|
| ✅ Real-Time Score Entry | Enter scores as matches happen |
| ✅ Per-Player Kill Tracker | Track individual player kills live |
| ✅ Current Match Indicator | Show which game is active |
| ✅ Next Match Button | Advance match counter |
| ✅ Live Preview | See how the public page looks in real time |

### Schedule Management

| Feature | Description |
|---------|-------------|
| ✅ Add Tournament to Schedule | Create upcoming tournament |
| ✅ Modify Timings | Change dates and times |
| ✅ Set Match Schedule | Define when each match/stage happens |
| ✅ Add Play Day | Add matchday boxes with timing |

---

## 10. User Experience Guidelines

### For Visitors (Public Pages)

- **Mobile-first design** — most esports fans browse on mobile
- **Fast loading** — lazy load tournament widgets, paginate if many
- **Dark theme** — matches the esports/gaming aesthetic
- **Clear visual hierarchy** — tournament status (Live > Upcoming > Completed) always obvious
- **Countdown timers** — create anticipation for upcoming events
- **Live pulse animations** — make live tournaments feel urgent and exciting
- **Expandable widgets** — don't overwhelm with data; let users drill down
- **Consistent color coding** — Gold/Silver/Bronze for positions, Red for eliminations, Green for championships

### For Admin (Dashboard)

- **Clean, functional UI** — prioritize usability over flashiness
- **Inline editing** — click any field to edit it directly (no separate edit page)
- **Auto-save** — changes save automatically with a visual confirmation
- **Undo/Redo** — allow reverting recent changes
- **Drag-and-drop** — for reordering stages, matches, standings
- **Preview mode** — see how changes look on the public site before publishing
- **Keyboard shortcuts** — Tab through fields, Enter to save, Escape to cancel
- **Responsive** — admin panel works on tablet too (for updating during live events)
- **Confirmation dialogs** — for destructive actions (delete, status change)
- **Activity log** — show recent changes with timestamps

### Data Validation Rules

| Rule | Description |
|------|-------------|
| Placement must be 1-18 | Cannot enter invalid placement numbers |
| Kills must be ≥ 0 | No negative kills |
| Per-player kills must sum to team kills | Auto-validate or auto-calculate |
| Dates must be logical | End date ≥ Start date |
| Required fields enforced | Cannot save without tournament name, mode, dates |
| Duplicate prevention | Warn if tournament with same name already exists |

---

## Implementation Priority

### Phase 1 — Core (Must Have)
1. Admin authentication (simple password gate)
2. Tournament CRUD with all fields
3. Status management (Upcoming / Live / Completed)
4. Schedule page showing Upcoming tournaments
5. Tournaments page showing Completed widgets
6. Home page with Live banner and Upcoming preview

### Phase 2 — Enhanced (Should Have)
1. Real-time live match score entry
2. Per-player kill tracking
3. Auto-calculating standings
4. Drag-to-reorder functionality
5. Countdown timers on Schedule page

### Phase 3 — Polish (Nice to Have)
1. Activity log
2. Undo/Redo
3. Export tournament data as .md or .pdf
4. Tournament templates (duplicate & modify)
5. Analytics (win rate, average placement across tournaments)

---

## Existing Tournament Data to Pre-Load

The following completed tournaments already have .md files with full data and should be imported into the system:

| Tournament | .md File | GodL Position |
|-----------|----------|---------------|
| NG Asia Championship 2026 | `NG_Asia_Championship_Godlike_FFM.md` | 9th Playoffs / 11th Grand Finals |
| Lidoma Regional Wars: Ch. 3 | `GodLike_FFM_3_Additional_Tournaments.md` | 12th Playoffs / 10th Last Chance (Eliminated) |
| OneBlade Inferno League | `GodLike_FFM_3_Additional_Tournaments.md` | Eliminated in League Stage |
| Urbansky Gaming Series | `GodLike_FFM_3_Additional_Tournaments.md` | 8th |
| RBZ Regional Cup BR | `GodLike_FFM_RBZ_Regional_Cups.md` | 2nd |
| RBZ Regional Cup CS | `GodLike_FFM_RBZ_Regional_Cups.md` | 🏆 Champions |

---

> *This document serves as the technical specification for the tournament management system. All features described here should be implemented to create a fully functional, real-time admin dashboard connected to the public-facing GodLike Esports FFM website.*
