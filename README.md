# Meal Plan Nutrition Tracker

A comprehensive web application for analyzing and tracking a 7-day high-protein vegetarian meal plan with full nutritional traceability and optimization recommendations.

## Features

### 🎯 Core Functionality
- **Interactive Dashboard**: Overview of weekly nutrition with charts and metrics
- **Daily View**: Detailed breakdown of each day's meals with expandable cards
- **Nutrient Traceability**: Click-through drill-down from daily totals → meals → individual food items
- **Plan Comparison**: Toggle between original and optimized meal plans
- **Micronutrient Analysis**: B12, Iron, Zinc, and Iodine status assessment
- **Optimization Recommendations**: Health improvements based on research findings

### 📊 Data Visualization
- Weekly overview charts (calories, macros)
- Macro distribution pie charts
- Target achievement indicators
- Micronutrient risk assessment
- Before/after optimization comparisons

### 🔍 Traceability Features
- **3-Level Drill-Down**: Day → Meal → Food Item
- **Source Citations**: Every nutrition value links back to research sources
- **Real-time Calculations**: All values calculated from food reference data
- **Validation**: Cross-reference with Table 2 data from research document

## Technical Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data**: JSON files with structured nutrition data

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main dashboard
│   ├── day/[id]/page.tsx  # Daily detailed view
│   ├── micronutrients/    # Micronutrient analysis
│   ├── optimizations/     # Optimization recommendations
│   └── validation/        # Data validation tool
├── components/            # Reusable UI components
│   ├── NutrientAccordion.tsx
│   ├── MealCard.tsx
│   ├── UserProfileCard.tsx
│   ├── WeeklyOverview.tsx
│   └── PlanToggle.tsx
├── data/                  # JSON data files
│   ├── foodReferences.json
│   ├── meals.json
│   └── weeklyPlan.json
├── types/                 # TypeScript interfaces
│   └── nutrition.ts
└── utils/                 # Utility functions
    ├── nutritionCalculator.ts
    ├── dataAggregator.ts
    └── validation.ts
```

## Data Sources

All nutrition data is sourced from the research document with full traceability:

- **68 Food Reference Items**: Complete nutritional profiles with source citations
- **25 Meal Definitions**: Structured meal compositions
- **7-Day Plans**: Both original and optimized versions
- **Validation Data**: Table 2 values for accuracy verification

## Key Research Insights

### Protein Target Achievement
- Original plan averages 116.9g protein (below 120g target)
- Only achievable with 6+ eggs or whey supplementation
- Legumes alone insufficient for athletic-level protein needs

### Micronutrient Risks
- **B12**: Risk on days without eggs or fortified cereal
- **Iron**: Non-heme iron with absorption inhibitors
- **Zinc**: High phytate content reduces bioavailability
- **Iodine**: Requires iodized salt for adequate intake

### Optimization Benefits
- Reduced saturated fat (paneer → tofu)
- Increased protein density (chickpea pasta)
- Better fiber content (whole wheat bread)
- Heart-healthy fats (almonds vs grilled cheese)

## Usage

### Development
```bash
npm install
npm run dev
```

### Validation
The application includes a built-in validation tool that:
- Cross-references all calculations with Table 2 data
- Verifies food reference accuracy
- Ensures meal definition integrity
- Validates weekly averages match research values

### Navigation
- **Dashboard**: Overview and plan toggle
- **Daily View**: Click any day for detailed breakdown
- **Micronutrients**: Risk assessment and optimization tips
- **Optimizations**: Before/after comparisons
- **Validation**: Data accuracy verification

## Research Foundation

This application is built on comprehensive nutritional research analyzing a high-protein vegetarian diet for an active 27-year-old male (74kg, 185.4cm) with:
- BMR: 1,817 kcal/day
- TDEE: 2,816 kcal/day
- Protein target: 120-140g/day
- Training: Weight training + running 4x/week

All calculations, recommendations, and optimizations are based on peer-reviewed research and clinical guidelines for athletic nutrition.

## License

This project is for educational and research purposes, demonstrating comprehensive nutritional analysis and data visualization techniques.