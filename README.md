# 🚚 Trip Dispatcher

A modern dark-mode logistics dashboard built for managing fleet trips efficiently.  
This SaaS-style admin interface allows dispatchers to track routes, vehicles, drivers, cargo status, and trip progress in real time.

---

PRESENTATION LINK
https://drive.google.com/file/d/18tWfy9ewdc1zmxez75hmtFIoJZRAex4B/view?usp=sharing

## ✨ Features

- 🌙 Modern Dark Mode UI
- 📋 Trip Management Table
- 🔄 Status Tracking (Draft, Dispatched, Completed, Cancelled)
- ➕ Create New Trips
- 🎯 Action Controls (Dispatch, Complete, Cancel)
- 📊 Clean SaaS-style Dashboard Layout
- 💡 Responsive & Production-Ready Design

---

## 🖥️ Dashboard Overview

The dashboard includes:

### Header
- **Trip Dispatcher** title
- Total trip count display
- "New Trip" action button

### Trips Table
Columns:
- Route
- Vehicle
- Driver
- Cargo (kg)
- Date
- Status (color-coded badges)
- Actions (icons for dispatch, complete, cancel)

### Status Indicators
| Status      | Color  |
|------------|--------|
| Draft      | Gray   |
| Dispatched | Blue   |
| Completed  | Green  |
| Cancelled  | Red    |

---

## 🎨 UI Design System

- **Theme:** Dark navy / charcoal gradient
- **Font:** Inter (or modern sans-serif)
- **Accent Color:** Electric blue
- **Badges:** Pill-shaped with subtle glow
- **Cards:** Rounded corners with soft shadow
- **Icons:** Minimal circular action icons

---

## 📁 Project Structure (Suggested)

```
trip-dispatcher/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TripsTable.jsx
│   │   ├── StatusBadge.jsx
│   │   └── ActionButtons.jsx
│   │
│   ├── pages/
│   │   └── Dashboard.jsx
│   │
│   ├── data/
│   │   └── trips.js
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── App.jsx
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trip-dispatcher.git
cd trip-dispatcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🛠️ Built With

- React (recommended)
- Tailwind CSS (recommended)
- Modern UI principles
- Component-based architecture

---

## 📈 Future Enhancements

- Authentication & Role Management
- Real-time status updates
- Backend API integration
- Trip filtering & search
- Analytics dashboard
- Export to CSV/PDF

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Built as a modern logistics SaaS dashboard concept.

---

⭐ If you like this project, consider giving it a star!

