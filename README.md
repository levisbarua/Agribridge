# AgriBridge Africa 🌱

🔴 **Live Demo:** [https://agribridge-africa.vercel.app](https://agribridge-africa.vercel.app)

AgriBridge Africa is a full-stack web platform designed to connect agricultural stakeholders across the continent. It serves as a unified ecosystem for **Farmers**, **Buyers** (Retail/Wholesale), **Logistics Providers**, and **Warehouse Owners** — with real data persistence, AI-powered insights, and role-based access.

---

## 🌟 Key Features

The platform tailors the experience to each user's role:

| Role | Core Capabilities |
|---|---|
| 👨‍🌾 **Farmer** | List produce, track market prices, create transport & storage requests, view order history |
| 🛒 **Buyer / Retailer** | Browse marketplace, purchase directly from farmers, track delivery status |
| 🚚 **Logistics Provider** | View live job board, accept transport requests, manage fleet vehicles |
| 🏭 **Warehouse Partner** | Monitor facility capacity, accept storage requests, track temperature & utilization |

### 🤖 AI Features (Gemini API)
- **Market Insights** – AI-generated analysis of crop price trends
- **Profile Enhancer** – Auto-generates professional bios from user activity
- **Smart Assistant** – Interactive AI chat and live voice assistant for agricultural advice

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Recharts | Data charts & dashboards |
| Leaflet / React-Leaflet | Interactive maps |
| Lucide React | Icons |
| `@google/genai` | Gemini AI integration |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image / media uploads |
| Multer | File upload middleware |
| dotenv | Environment configuration |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A [Gemini API key](https://aistudio.google.com/)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/levisbarua/Agribridge.git
cd Agribridge
```

---

### 2. Configure & Run the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

Start the backend server:

```bash
# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

---

### 3. Configure & Run the Frontend

From the project root:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🗂️ Project Structure

```
agribridge-africa/
├── index.html              # App entry point
├── App.tsx                 # Root component & routing
├── types.ts                # TypeScript interfaces & data models
├── constants.ts            # Config & mock data
├── vite.config.ts
├── tailwind.config.js
│
├── components/             # Reusable UI components
│   ├── Layout.tsx          # Sidebar & navigation shell
│   ├── CartDrawer.tsx      # Shopping cart sidebar
│   ├── RouteMap.tsx        # Leaflet map component
│   └── Logo.tsx
│
├── pages/                  # Application views
│   ├── Landing.tsx         # Public landing / marketing page
│   ├── Auth.tsx            # Login & registration
│   ├── Dashboard.tsx       # Role-specific dashboard
│   ├── Marketplace.tsx     # Product listings & purchasing
│   ├── Logistics.tsx       # Transport job board & fleet
│   ├── Storage.tsx         # Warehouse facility management
│   ├── AiAssistant.tsx     # AI chat & voice assistant
│   ├── Profile.tsx         # User profile & AI bio generator
│   ├── Payment.tsx         # Order payment flow
│   ├── Settings.tsx        # Account settings
│   ├── AboutContact.tsx    # About & contact info
│   ├── PrivacyPolicy.tsx   # Privacy policy
│   └── TermsOfService.tsx  # Terms of service
│
├── services/               # External API integrations
│   ├── api.ts              # Backend REST API client
│   ├── geminiService.ts    # Gemini AI (market insights, bios, chat)
│   └── weatherService.ts   # Weather data integration
│
└── server/                 # Express.js backend
    └── src/
        ├── index.js        # Server entry point
        ├── config/         # Database connection (MongoDB)
        ├── models/         # Mongoose schemas
        │   ├── User.js
        │   ├── Product.js
        │   ├── Order.js
        │   ├── TransportRequest.js
        │   └── StorageFacility.js
        ├── controllers/    # Route handler logic
        ├── routes/         # API route definitions
        │   ├── userRoutes.js
        │   ├── productRoutes.js
        │   ├── orderRoutes.js
        │   ├── transportRequestRoutes.js
        │   └── storageFacilityRoutes.js
        ├── middleware/     # Auth & upload middleware
        └── utils/          # Helper utilities
```

---

## ☁️ Deployment

The application is deployed as two separate services:

| Service | Platform | URL |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | [agribridge-africa.vercel.app](https://agribridge-africa.vercel.app) |
| Backend API | [Render](https://render.com) | Configured via `render.yaml` |

### Backend (Render)

The `render.yaml` at the project root defines the backend service automatically. Set the following environment variables in your Render dashboard:

- `MONGO_URI` – MongoDB Atlas connection string
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NODE_ENV=production`

### Frontend (Vercel)

Set the following environment variable in your Vercel project settings:

- `VITE_GEMINI_API_KEY`
- `VITE_API_BASE_URL` – Your Render backend URL (e.g. `https://agribridge-api.onrender.com/api`)

---

## 🔒 Authentication & Data Isolation

- User accounts are stored in MongoDB with hashed passwords (bcryptjs).
- Protected routes require a valid JWT token passed via request headers.
- The UI enforces role-based data isolation — users only see their own products, orders, transport requests, and storage facilities.
- Logistics providers have an exclusive view of the pending job board and their authorized fleet.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
