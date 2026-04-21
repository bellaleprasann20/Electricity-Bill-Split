# ⚡ Bill Splitter App

A React mini-project to split **Electricity**, **Water**, and **WiFi** bills among roommates — with smart splitting logic, monthly history tracking, and WhatsApp reminders.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Install recharts (for bill history charts)
npm install recharts

# Start the app
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

### ⚡ Electricity Bill Splitter
- Enter total bill amount from your electricity bill paper
- 3 split modes:
  - **⚖️ Equal** — everyone pays the same
  - **📅 Days Stayed** — less days = less pay
  - **🚪 Room Size** — small / medium / large room
- Summary cards showing highest, lowest, and average share
- WhatsApp reminder button to send bill to roommates
- Budget alert with progress bar

### 💧 Water Bill Splitter
- 4 split modes:
  - **⚖️ Equal** — same amount for all
  - **📅 Days Stayed** — away for 7 days? pay less!
  - **💧 Usage Level** — Low / Medium / High water habit
  - **🧠 Smart Split** — Days × Usage combined (most fair!)
- Smart split score shown per person
- Water saving tips

### 📶 WiFi Bill Splitter
- Choose from real internet plans (₹399 / ₹599 / ₹799 / ₹1099) or custom
- 3 split modes:
  - **⚖️ Equal** — same for all
  - **📱 No. of Devices** — more devices = more pay
  - **📊 Usage Level** — Light / Medium / Heavy user
- WiFi usage tips

### 📈 Bill History
- Tracks last **5 months** for all 3 bills separately
- Bar chart showing monthly trend
- Spike detector — alerts if bill jumps more than 10%
- Highest / Lowest / Average stats per bill type
- ▲▼ vs average shown per month
- Save each month with one click

---

## 📐 Formulas Used

### Equal Split
```
Each person pays = Total Bill ÷ Number of people
```

### Days Stayed Split
```
Share = (Person's days ÷ Total days of all) × Total Bill
```

### Usage Level Split
```
Weight → Low = 1, Medium = 2, High = 3
Share  = (Person's weight ÷ Total weight) × Total Bill
```

### Smart Split (Water only)
```
Score  = Days stayed × Usage weight
Share  = (Person's score ÷ Total score) × Total Bill
```

### WiFi — By Devices
```
Share = (Person's devices ÷ Total devices) × Total Bill
```

### Monthly kWh (Appliances)
```
kWh = (Watts × Hours per day × 30) ÷ 1000
```

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx          → top navigation with 4 tabs
│   ├── BillInput.jsx       → electricity bill amount + split mode
│   ├── RoommateList.jsx    → list of roommates
│   ├── RoommateCard.jsx    → individual roommate card
│   ├── SummaryCards.jsx    → total, average, highest, lowest
│   ├── ResultsPanel.jsx    → final amount each person pays
│   ├── BudgetAlert.jsx     → budget progress bar with warning
│   ├── WhatsAppShare.jsx   → send bill reminders via WhatsApp
│   ├── WaterBill.jsx       → water bill splitter
│   ├── WifiBill.jsx        → wifi bill splitter
│   └── BillHistory.jsx     → 5-month history for all 3 bills
├── context/
│   └── BillContext.jsx     → global state using React Context
├── hooks/
│   └── useLocalStorage.js  → persist data across sessions
├── utils/
│   ├── calculations.js     → all math / formula functions
│   ├── colors.js           → color palette per person
│   └── formatters.js       → currency, units, initials
├── App.jsx                 → main layout + tab routing
├── App.css                 → all component styles
├── main.jsx                → React entry point
└── index.css               → global styles + CSS variables
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Context API | Global state management |
| localStorage | Persist data across sessions |
| Recharts | Bar charts in bill history |
| CSS Variables | Dark theme + consistent styling |

---

## 💡 Unique Features vs Basic Bill Splitter

| Basic App | This App |
|---|---|
| Only equal split | 4 different split modes |
| Only electricity | Electricity + Water + WiFi |
| No history | 5-month history with charts |
| No reminders | WhatsApp reminder button |
| No budget tracking | Budget alert with progress bar |
| No smart logic | Smart Split = Days × Usage |
| Data lost on refresh | localStorage saves everything |

---

## 📱 How to Use

1. **Electricity tab** → Enter your bill amount → Choose split mode → See each person's share
2. **Water tab** → Enter water bill → Pick how fairly to split → Smart Split for best results
3. **WiFi tab** → Select your internet plan → Split by devices or usage level
4. **History tab** → Click "+ Save" each month → Track 5-month trend for all bills

---

## 👨‍💻 Made with React for College Mini Project