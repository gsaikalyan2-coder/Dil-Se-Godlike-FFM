<<<<<<< HEAD
<div align="center">
  <img src="./public/players/GodL%20Logo.png" alt="GodLike Esports Logo" width="300" />
  
  # GodLike Free Fire Esports Hub
  
  **The Sovereign Arena: India's Golden Army**
</div>

---

A state-of-the-art, dynamic React web application designed exclusively for **GodLike Esports' Free Fire Roster**. This platform serves as a modern esports hub connecting fans with live tournament schedules, deep player analytics, historical results, and the monumental legacy of GodLike's Free Fire team.

Built around a premium **"UI/UX Pro Max"** design philosophy, the interface leverages glassmorphism, volumetric glows, and buttery-smooth interactions to match the prestige of the roster it represents.

## 🌟 Key Features

### 🏆 1. The Sovereign Schedule (Tournament Hub)
- **Live Event Awareness:** Automatically bumps live matches to a hero banner, complete with pulsing UI and active match indicators.
- **Dynamic Boto Grids:** Upcoming and Agenda fixtures are rendered in beautiful volumetric bento-box layouts.
- **Auto-Fallback to Results:** When no upcoming tournaments are scheduled, the grid instantly falls back to a seamless "**Recent Results**" showcase.
- **Deep Historical Stats:** Every completed tournament card expands smoothly to reveal aggregated squad kills, booyahs, and placement totals.

### 👑 2. Roster Showcase
- **Player Profiles:** Detailed cards for Yogi, Nancy, EcoEco, Nobita, and Marco.
- **Animated Compositions:** Cinematic "floating" player renders on the homepage simulating a virtual physical stage setup using Tiranga (Saffron, White, Green) accent lights. 

### ⚙️ 3. Intelligent Admin Control Panel
- **Frictionless Score Updates:** End-to-end match entry interface. Fill out placement points and total team kills to have the database magically compile final standings globally.
- **Data Persistence:** Relies on robust `localStorage` syncing, mocking a backend database using `useTournamentStoreSync`.
- **Match Iteration & Lifecycle:** From `Upcoming` -> `Live` -> `Completed`, allowing admins precise control over the timeline.

### 🕯️ 4. The Heartbreak Memorial
- A specialized community space to share support and "Light A Candle" during difficult tournament conclusions, capturing the emotional weight of esports fandom.

---

## 🎨 Design Philosophy: "UI/UX Pro Max"

Our frontend engineering heavily utilizes cutting-edge UI trends to elevate viewer immersion:
- **Brutalist-Luxury Layouts:** Mixing heavy, unyielding font weights with incredibly delicate, glassmorphic surface containers.
- **Volumetric Glowing Boundaries:** Component borders aren't just lines; they are carefully positioned gradient `blur-[80px]` orbs masked behind `overflow-hidden` tags.
- **Hardware-Accelerated Kinetics:** Deep integration of `translate-y-1`, scale transforms, and cascading animation delays on mounting objects.
- **Bespoke Typography:** Kerning control (e.g., `tracking-[0.2em]` for labels against `tracking-tighter` headlines) to enforce typographic hierarchy.

---

## 💻 Technology Stack

* **Frontend Framework:** `React.js` (React Router DOM)
* **Styling Engine:** `Tailwind CSS` (Customized extensions, custom keyframe overrides)
* **Charting / Analytics:** `Recharts` (D3.js integration for admin metrics)
* **State Management:** Reactive Custom Hooks (`useTournamentStoreSync`) wrapping `localStorage`.
* **Deployment Build:** `Create React App` pipeline.

---

## 🛠️ Project Setup & Installation

To run this application locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/godlike-ffm.git

# 2. Navigate to the directory
cd godlike-ffm

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The application will launch by default at **`http://localhost:3000`**.

> **Note on Admin Access:** The `/admin` routes are protected by a static client-side password mechanism (current lock: `Hush$6969`), enabling authorized users to manage live scores.

---

### Data Mocking Architecture 
*This repository operates without a remote database.* It uses a highly developed local JSON store index structured to simulate a NoSQL database hierarchy. Data is synced reactively via a custom polling hook that mimics real-time WebSocket connections purely within the client, making the repository completely portable and easy to demo without cloud setups.

---

<p align="center">
  <i>"We Are India's Golden Army." 🇮🇳</i>
</p>
=======
# GodLike_Live_Tracker
A high-performance React hub for GodLike Esports starring the Free Fire Roster. Showcases ultra-premium "UI/UX Pro Max" glassmorphic design, live-updating tournament schedulers, deep match analytics, beautiful bento grids, and an integrated Admin panel for real-time score tracking. The sovereign arena to honor India's Golden Army!
>>>>>>> c04945ac8bbc3dac3fe5a18de076fd678ea6ea40
