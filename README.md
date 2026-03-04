# AgriBridge Africa

🔴 **Live Demo:** [https://agribridge-africa.vercel.app](https://agribridge-africa.vercel.app)

AgriBridge Africa is a comprehensive, modern web platform designed to connect agricultural stakeholders across the continent. It serves as a unified ecosystem connecting **Farmers**, **Buyers** (Retail/Wholesalers), **Logistics Providers**, and **Warehouse Owners**.



## 🌟 Key Features

The platform offers tailored experiences depending on the user's role:

*   👨‍🌾 **Farmers:**
    *   List farm produce (fruits, vegetables, grains) on the marketplace.
    *   Track real-time market prices across different regions.
    *   Create transport requests to move harvested crops to markets.
    *   View active order history and track revenue.

*   🛒 **Buyers / Retailers:**
    *   Discover and purchase fresh produce directly from local farmers.
    *   Track active orders and delivery status.
    *   Monitor market indices and price trends.

*   🚚 **Logistics Providers:**
    *   Access a live "Job Board" of pending transport requests.
    *   Accept and manage active trips.
    *   Manage fleet vehicles (add, edit, track status/location).

*   🏭 **Warehouse & Storage Partners:**
    *   Monitor cold-chain and dry-storage facility capacities.
    *   Accept incoming storage requests from farmers or buyers.
    *   Track temperature, utilization percentage, and revenue.

*   🤖 **AI Integration (Powered by Gemini):**
    *   **Market Insights:** Receive AI-generated analysis of crop price trends.
    *   **Profile Enhancer:** Automatically generate professional bios based on user activity.
    *   **Smart Assistant:** Includes an interactive AI chat and live voice assistant for agricultural advice.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 18 with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Routing:** React Router DOM
*   **Charts:** Recharts
*   **Maps:** Leaflet & React-Leaflet
*   **AI Integration:** `@google/genai` (Gemini API)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed on your system. You will also need a Gemini API key to enable the AI features.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/levisbarua/Agribridge.git
    cd Agribridge
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:3000` (or the port specified by Vite).

## 🗂️ Project Structure

*   `/src/components/`: Reusable UI components (Layout, CartDrawer, Auth).
*   `/src/pages/`: Main application views (Dashboard, Marketplace, Logistics, Profile, etc.).
*   `/src/services/`: External API integrations (Gemini AI, Weather).
*   `/src/types.ts`: TypeScript interfaces defining the core data models (UserRole, Product, TransportRequest, etc.).
*   `/src/constants.ts`: Initial mock data generation and configuration (Countries, Default Users).

## 🔒 Data Isolation

The application implements role-based data isolation. The UI dynamically adjusts to show only relevant data:
*   Users only see their own active orders, products, and transport requests.
*   Logistics providers have an exclusive view of pending marketplace requests and their authorized fleet.

## 📄 License

This project is licensed under the MIT License.
