
# Total Wireless Sales Calculator 📱

A modern web application designed for Total Wireless sales representatives to quickly calculate monthly service costs, device promotions, due-today totals, and customer eligibility based on current Total Wireless pricing and promotional rules.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square\&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square\&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue?style=flat-square\&logo=tailwindcss)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?style=flat-square)

---

## Overview

The Total Wireless Sales Calculator helps retail sales representatives instantly determine:

* Monthly service cost
* Due today amount
* Device promotion eligibility
* Required upfront service payments
* Home Internet and Tablet add-ons
* Autopay discounts
* Port-in and Veriff ID qualification requirements

Instead of manually checking sell sheets, reps can enter customer information and receive an accurate quote in seconds.

---

## Features

### Plan Pricing Calculator

Supports all current Total Wireless plans:

* Total STARTER
* Total MAX 5G
* Total ALL ACCESS
* Total MAX 5G BYO

Automatically applies multi-line pricing rules and discounts.

### Device Promotion Engine

Checks eligibility based on:

* Port-In status
* Veriff ID verification
* Selected plan
* Number of upfront service months required
* Device-specific promotional requirements

Examples:

* Free iPhone promotions
* Samsung promotional pricing
* Motorola promotional pricing
* Tablet promotions

### Due Today Calculation

Calculates:

* Service payment requirements
* Device costs
* Promotional discounts
* Add-on services
* Estimated taxes and fees

### Home Internet & Tablet Support

Supports:

* Home Internet Add-On
* Home Internet Standalone
* Tablet Base Plans
* Tablet 5G Plans

### Validation Rules

Built-in safeguards:

* Prevent BYO plan/device conflicts
* Prevent invalid plan combinations
* Verify promotion requirements
* Ensure accurate qualification checks

### Mobile Friendly

Designed specifically for retail environments:

* Mobile-first layout
* Tablet compatible
* Fast loading
* Responsive design

---

## Pricing Rules

### Smartphone Plans

| Plan             | Single Line |
| ---------------- | ----------- |
| Total MAX 5G BYO | $30         |
| Total STARTER    | $40         |
| Total MAX 5G     | $55         |
| Total ALL ACCESS | $65         |

### Multi-Line Pricing

| Lines | STARTER   | MAX       | ALL ACCESS |
| ----- | --------- | --------- | ---------- |
| 1     | $40       | $55       | $65        |
| 2     | $65       | $85       | $95        |
| 3     | $90       | $100      | $110       |
| 4     | $100      | $110      | $120       |
| 5+    | +$30/line | +$30/line | +$30/line  |

### Add-On Services

| Service       | Add-On | Standalone |
| ------------- | ------ | ---------- |
| Home Internet | $35    | $60        |
| Tablet Base   | $10    | $50        |
| Tablet 5G     | $20    | $60        |

### Autopay

* $5 discount per account

---

## Technology Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Lucide React Icons

### Deployment

* GitHub Pages

### Data Management

* JSON-based pricing engine
* JSON-based device database
* JSON-based promotional rules

No backend required.

---

## Project Structure

```text
src/

components/
├── PlanSelector.tsx
├── LineCounter.tsx
├── DeviceSelector.tsx
├── AddOns.tsx
├── SummaryCard.tsx
└── PromoCard.tsx

data/
├── plans.ts
├── devices.ts
└── promos.ts

engine/
├── pricingEngine.ts
├── promoEngine.ts
└── validationEngine.ts

types/
├── Device.ts
└── Promo.ts

pages/
└── Calculator.tsx

App.tsx
main.tsx
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/wolflegend1998/TW-Price-Calculator.git
cd TW-Price-Calculator
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Deployment

### GitHub Pages

Install:

```bash
npm install gh-pages --save-dev
```

Deploy:

```bash
npm run deploy
```

Application will be available at:

```text
https://wolflegend1998.github.io/TW-Price-Calculator
```

---

## Future Enhancements

### Admin Dashboard

Allow managers to:

* Add devices
* Update promotions
* Modify pricing
* Disable expired promotions

### Firebase Integration

Store:

* Device catalog
* Promotional offers
* Pricing updates

without requiring code changes.

### Analytics

Track:

* Most quoted devices
* Most selected plans
* Average deal size
* Promotion usage

---

## Disclaimer

This application is an independent sales-assistance tool intended for internal use by Total Wireless sales representatives. Pricing, promotions, rebates, taxes, and eligibility requirements are subject to change. Representatives should always verify final pricing and promotional eligibility against the latest official Total Wireless dealer documentation.

---

Built with React, TypeScript, and Tailwind CSS for Total Wireless retail sales teams.

**Made with ❤️ for wireless sales representatives**

[Visit the App](https://wolflegend1998.github.io/TW-Price-Calcalutor) | [GitHub Repo](https://github.com/wolflegend1998/TW-Price-Calcalutor)
