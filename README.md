# ⚡ Electricity Bill Splitter

A React mini-project for splitting electricity bills among roommates — with unique features that go beyond a basic equal-split calculator.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## ✨ Unique Features

1. **3 Split Modes** — Split equally, by days stayed, or by units consumed
2. **Appliance Tracker** — Enter each appliance's wattage and daily hours to estimate monthly consumption and cost
3. **Usage Breakdown** — Visual stacked bar + legend showing which appliances eat the most power
4. **Persistent State** — All data is saved to localStorage, so nothing is lost on refresh
5. **Live Calculations** — Every number updates instantly as you type

## 📁 Folder Structure

```
src/
├── components/         # UI components
│   ├── Navbar.jsx
│   ├── BillInput.jsx
│   ├── RoommateList.jsx
│   ├── RoommateCard.jsx
│   ├── SummaryCards.jsx
│   ├── ResultsPanel.jsx
│   ├── ApplianceTracker.jsx
│   ├── ApplianceRow.jsx
│   └── UsageBar.jsx
├── context/
│   └── BillContext.jsx  # Global state (React Context)
├── hooks/
│   └── useLocalStorage.js
├── utils/
│   ├── calculations.js  # Pure calculation functions
│   ├── colors.js        # Color palette constants
│   └── formatters.js    # Number/string formatters
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 🛠 Tech Stack

- React 18 (with Context API + Hooks)
- Vite (dev server)
- CSS Modules (custom dark theme)
- localStorage for persistence