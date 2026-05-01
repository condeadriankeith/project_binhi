# 🌱 Project Binhi: The Floating Archipelago

### **Empowering Communities. Restoring Ecosystems. One Seedling at a Time.**

**🔗 Live Platform:** [https://project-binhi.vercel.app/](https://project-binhi.vercel.app/)

---

## 🍃 Overview
**Project Binhi** (Tagalog for "Seed") is a state-of-the-art environmental restoration platform that transforms abstract ecological data into a vibrant, interactive 3D simulation. By bridging the gap between individual donors ("Architects") and local conservation organizations, Binhi creates a tangible, gamified landscape where every donation physically expands a digital archipelago that mirrors real-world reforestation efforts.

---

## 🚀 Key Features & System Capabilities

### 1. **Cinematic 3D Archipelagic Ecosystem**
The core of Binhi is a procedural 3D world built with **React Three Fiber** and **Three.js**.
*   **Autonomous Island Spawning**: As an organization's forest reaches capacity, the system dynamically generates new islands in the 3D void.
*   **Smart Collision Avoidance**: New islands are placed using a sophisticated proximity algorithm that ensures no overlap while maintaining a natural, organic "archipelago" clustering.
*   **Cinematic Navigation**: Features a custom camera controller that utilizes **Cubic Easing** and **Arc Trajectories** for smooth, high-speed travel between different organization hubs.
*   **Dynamic Bedrock Architecture**: Every island features procedurally generated bedrock and terrain decorations, ensuring no two landmasses look identical.

### 2. **The Botanist's Toolkit (Individual Architect)**
Designed for deep engagement and long-term retention.
*   **Smart Watering & Ownership**: A proprietary locking mechanism ensures you only care for the trees *you* planted. 
*   **Visual Status Outlines**: In Watering Mode, trees glow with high-fidelity outlines:
    *   🟢 **Emerald Green**: Needs hydration for the day.
    *   🔵 **Sky Blue**: Successfully watered and flourishing.
*   **Botanist's Journal**: A premium, expanding UI component that tracks:
    *   **Daily Progress**: "X/Y Trees Watered" status.
    *   **Weekly Consistency**: A calendar-based history of your care protocol.
    *   **Growth Streaks**: Rewards for consecutive days of ecosystem maintenance.
*   **Profile & Progression**: Track your Rank (from Seedling to Forest Guardian), earn badges (like "Island Pioneer"), and monitor your personal CO2 offset.

### 3. **Organization Command Center**
A high-level administrative dashboard for partner organizations (e.g., BAKURAN, EarthGuards).
*   **Live Topology Monitoring**: A real-time visualization of the archipelago's density and utilization (e.g., "26 / 50 Tiles Occupied").
*   **Real-time Telemetry Stream**: A glassmorphic activity feed showing every planting and watering event as it occurs across the network.
*   **Impact Broadcasts**: Organizations can publish "Impact Updates" to their supporters, verified by a simulated blockchain node protocol.
*   **Advanced Analytics**: Track project funding, total biomass, and community engagement metrics in a premium, dark-mode interface.

### 4. **Global Synchronization & UX**
*   **Cross-Tab Real-time Sync**: Utilizing the `BroadcastChannel API`, Binhi ensures that all statistics and island growth are updated instantly across all open browser instances and user roles.
*   **Multi-lingual Engine**: Full support for **English**, **Tagalog**, and **Hiligaynon**, making the platform accessible to local Philippine communities.
*   **Premium Aesthetics**: A design language based on **Glassmorphism**, featuring ambient background glows, scanline effects, and fluid micro-animations powered by **Framer Motion**.

---

## 👥 User Roles & Access

### **Individual Architects**
*   **Objective**: Fund and maintain your personal forest within a community hub.
*   **Tools**: Botanist Kit (Seed Vault), Watering Journal, Local Impact Map.

### **Conservation Organizations**
*   **Objective**: Manage the restoration site and communicate impact to donors.
*   **Tools**: Command Center Dashboard, Impact Feed, Topology Monitoring.
*   **Login Access**: Organizations are automatically recognized via email domains (e.g., `admin@bcc.org` for BAKURAN).

---

## 💻 Technical Architecture

*   **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **3D Engine**: [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
*   **Physics & Math**: Custom vector-based collision avoidance and cubic spline interpolation for camera paths.
*   **State Management**: React Context + LocalStorage Persistence + BroadcastChannel API for multi-tab sync.
*   **Styling**: Vanilla CSS + Tailwind CSS (for layout) with a focus on Glassmorphism.
*   **Animations**: Framer Motion (UI) + GSAP/Three-Damp (3D).

---

## 🛠️ Local Development

### Prerequisites
*   Node.js (v16.0 or higher)
*   npm or yarn

### Installation
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/condeadriankeith/project_binhi.git
    cd project_binhi
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **Production Build:**
    ```bash
    npm run build
    ```

---

## 🌏 Mission Statement
Project Binhi is built on the belief that environmental action should be accessible, rewarding, and deeply connected to the communities driving the change. By turning digital seeds into real-world forests, we aim to make ecological restoration a standard part of our digital lives.

---
*Created with ❤️ for the Global Restoration Movement.*
