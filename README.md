# PitchVerdict ⚽

PitchVerdict is a premium, real-time football tactical match simulator and head-to-head lineup comparison dashboard. It blends modern light-mode glassmorphism layouts, procedural crowd acoustics synthesis, and interactive strategy chalkboard vectors to produce an immersive, broadcast-style football experience.

---

## 🌟 Key Features

### 1. 📋 Interactive Lineup & Tactics Board
- Map teams on a custom soccer field featuring alternating turf grass stripes and chalk-line markings.
- Tweak formations dynamically (**4-3-3**, **4-4-2**, **3-5-2**).
- Modify playstyles (**Tiki-Taka**, **Gegenpressing**, **Direct Counter**, **Long Ball**) and mentality (**Defensive**, **Balanced**, **Attacking**) to watch how it impacts simulation statistics.
- Automatically adjusts GK and outfield vertical coordinates inward to prevent name tag boundary clipping.

### 2. 📊 Head-to-Head Radar Analytics
- Click any player card on Pitch A and Pitch B to open a premium attribute comparison card.
- Compares player stats (**Pace**, **Shooting**, **Passing**, **Dribbling**, **Defending**, **Physical**) using an animated SVG radar hexagon.
- **Rating-Specific Cards**: Rendered with gold (rating $\geq$ 85), silver (rating 78–84), and bronze (rating $\leq$ 77) glass glows mimicking Ultimate Team badges.
- Clean slate-gray grids and deep indigo text ensure perfect light-theme readability.

### 3. 🔊 Synthesized Stadium Acoustics Engine
- Runs entirely locally via the browser's standard **Web Audio API** (100% offline-compatible, no CORS delays or bulky MP3 file assets):
  - **Ambient Murmur**: Programmatically generated pink/brown noise low-passed at 320Hz simulating a packed stadium.
  - **Singing Drones**: Low-pitch sawtooth and triangle waves synthesizing distant chanting.
  - **Referee Whistle Blasts**: detuned oscillators modulated with a 35Hz pea-vibration LFO scheduling kick-offs, card bookings, and goal validations.
  - **Crowd Celebrations**: Swelling scream volumes, randomized high-frequency crowd whistles, and detuned 4.2Hz amplitude-modulated stadium airhorns erupting on goals.
  - **Opponent Bookings & Cards**: Low-pitched (230Hz) crowd booing and whistling.
  - **Saves**: Disappointed spectator groans/gasps fading out over 2 seconds.
  - **Auto-Stop**: Crowd noise fades out smoothly and releases AudioContext resources upon full-time (90').

### 4. 📺 Broadcast Ticker & Live Stats
- View dynamic AI-generated commentary logs describing fouls, saves, and goals.
- Bouncing scoreboard number pops (`.score-pop`) highlight score increments.
- Follow real-time possession percentages, shots on target, and bookings inside transparent glass progress gauges.
- Calculated champions celebration card with canvas confetti particles loop.

### 5. 🪄 Interactive Parallax Light Theme
- High-blur frosted glass overlays (`backdrop-filter: blur(32px)`) with solid inset border shadows.
- Shifting background floodlight blobs (green, blue, and gold) that translate in response to mouse movement, bleeding color gradients behind setup panels.
- Low-opacity chalkboard vector diagrams (passing lanes, press blocks, build-up triangles) drifting slowly in the background.

---

## 🛠️ Tech Stack

- **Core Framework**: [Next.js 16](https://nextjs.org/) (Turbopack enabled)
- **State & Logic**: [React 19](https://react.dev/) (Hooks, Refs, Memos)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with CSS Modules
- **Audio Engine**: HTML5 Web Audio API
- **Animations**: CSS Keyframe Animations & Canvas API (Confetti)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saiyash07/PitchVerdict.git
   cd PitchVerdict
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Spin up the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

4. Run the production build compilation:
   ```bash
   npm run build
   ```

5. Run code linter:
   ```bash
   npm run lint
   ```
