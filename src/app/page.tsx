'use client';

import { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  CheckCircle,
  Target,
  Activity,
  Zap,
  Users,
  BarChart3,
  PieChart,
  Clock,
  Utensils,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

// TypeScript interfaces for micronutrient sources
interface NutrientSource {
  meal: string;
  value: number;
}

interface MicronutrientValue {
  value: number;
  percentage: number;
  sources?: NutrientSource[];
}

// Micronutrient Card with Dropdown Component
const MicronutrientCard = ({ 
  name, 
  value, 
  unit, 
  percentage, 
  sources,
  colorClasses 
}: { 
  name: string; 
  value: number; 
  unit: string; 
  percentage: number; 
  sources?: NutrientSource[];
  colorClasses: { bg: string; border: string; text: string };
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <div className={`relative p-3 sm:p-4 rounded-xl border ${colorClasses.bg} ${colorClasses.border} transition-all duration-200 ${showDropdown ? 'z-40' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs sm:text-sm text-white/70 mb-1">{name}</div>
          <div className="text-base sm:text-lg font-bold text-white">{value}{unit}</div>
          <div className={`text-xs ${colorClasses.text}`}>{percentage}%</div>
        </div>
        
        {/* Dropdown Arrow Button */}
        {sources && sources.length > 0 && (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="ml-2 p-1 text-white/70 hover:text-white transition-colors duration-200"
            aria-label={`Toggle ${name} sources`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Dropdown Content - Overlay */}
      {showDropdown && sources && sources.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-40 mt-2 bg-black border-2 border-emerald-500/50 rounded-xl shadow-2xl p-4">
          <div className="text-sm font-bold text-white mb-3 border-b border-emerald-500/30 pb-2">
            {name} Sources
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sources.map((source, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs gap-2">
                <span className="text-gray-300 flex-1">{source.meal}</span>
                <span className="font-bold text-white whitespace-nowrap">{source.value.toFixed(1)}{unit}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-500/30 flex justify-between text-xs">
            <span className="text-gray-400 font-bold">Total:</span>
            <span className="font-bold text-emerald-400">{value}{unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Day-specific meal data
const mealsByDay = {
  bulking: {
    1: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Tomato Dal + Rice", ingredients: ["2 cups Tomato Dal", "3.5 cups Brown Rice", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to enhance iron." },
      snack1: { name: "Yogurt + Banana + PB", ingredients: ["1 cup Greek Yogurt", "1 medium Banana", "1 tbsp Peanut Butter"], note: "Primary B12 source. Wait 2+ hours after lunch." },
      dinner: { name: "Air-Fried Potatoes + Kale", ingredients: ["2 large potatoes (cubed)", "1 cup Kale", "1 cup Okra", "1/2 tbsp olive oil"], note: null },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: { name: "Greek Yogurt", ingredients: ["1 cup 2% Greek Yogurt"], note: "Add 1 tbsp nutritional yeast for B12" }
    },
    2: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1 tbsp olive oil"], note: "Primary B12/Vitamin D source." },
      lunch: { name: "Chickpea Curry + Chapati", ingredients: ["2 cups Chickpea Curry", "3 plain Chapati", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Yogurt + Pomegranate + PB", ingredients: ["1 cup Greek Yogurt", "1 cup Pomegranate arils", "1 tbsp Peanut Butter"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Chickpea Pasta + Veg Curry", ingredients: ["2.5 cups Chickpea Pasta", "1.5 cups Mixed Veg Curry", "1 tbsp olive oil"], note: null },
      snack2: { name: "Whey + Milk", ingredients: ["1 scoop whey protein", "1 cup 2% Milk"], note: null },
      snack3: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null }
    },
    3: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Black Bean Curry + Rice", ingredients: ["2 cups Black Bean Curry", "2 cups Brown Rice", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Apple + PB", ingredients: ["1 medium Apple", "1 tbsp Peanut Butter"], note: null },
      dinner: { name: "Tofu Curry + Rice + Broccoli", ingredients: ["1.5 cups Tofu Curry", "2 cups Brown Rice", "1.5 cups Broccoli", "1 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: null
    },
    4: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1 tbsp olive oil"], note: null },
      lunch: { name: "Spinach Dal + Rice", ingredients: ["2 cups Spinach Dal", "3.5 cups Brown Rice", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to boost iron." },
      snack1: { name: "Loaded Yogurt", ingredients: ["1 cup Greek Yogurt", "1 medium Banana", "1/4c Almonds", "1 tbsp Peanut Butter"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Veg Fried Rice", ingredients: ["3 cups Veg Fried Rice", "1 tbsp olive oil"], note: null },
      snack2: { name: "Whey + Milk", ingredients: ["1 scoop whey protein", "1 cup 2% Milk"], note: null },
      snack3: null
    },
    5: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Tomato Dal + Rice", ingredients: ["2 cups Tomato Dal", "3.5 cups Brown Rice", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to boost iron." },
      snack1: { name: "Apple + Walnuts + PB", ingredients: ["1 medium Apple", "1/4 cup Walnuts", "1 tbsp Peanut Butter"], note: null },
      dinner: { name: "Chickpea Pasta + Veg Curry + Kale", ingredients: ["2 cups Chickpea Pasta", "1.5 cups Mixed Veg Curry", "1 cup Kale", "1 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Greek Yogurt", ingredients: ["1 cup 2% Greek Yogurt"], note: null },
      snack3: null
    },
    6: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1 tbsp olive oil"], note: null },
      lunch: { name: "Chickpea Curry + Chapati", ingredients: ["2 cups Chickpea Curry", "3 plain Chapati", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Yogurt + Pomegranate", ingredients: ["1 cup Greek Yogurt", "1 cup Pomegranate arils"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Tofu Curry + Rice", ingredients: ["1.5 cups Tofu Curry", "2.5 cups Brown Rice", "1 tbsp olive oil"], note: null },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: null
    },
    7: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Black Bean Curry + Rice", ingredients: ["2 cups Black Bean Curry", "2 cups Brown Rice", "1 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Apple + PB", ingredients: ["1 medium Apple", "1 tbsp Peanut Butter"], note: null },
      dinner: { name: "Veg Fried Rice + Broccoli", ingredients: ["2.5 cups Veg Fried Rice", "1.5 cups Broccoli", "1 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: null
    }
  },
  cutting: {
    1: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1/2c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Tomato Dal + Rice", ingredients: ["2 cups Tomato Dal", "2 cups Brown Rice", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to enhance iron." },
      snack1: { name: "Yogurt + Banana + PB", ingredients: ["1 cup Greek Yogurt", "1 medium Banana", "1 tbsp Peanut Butter"], note: "Primary B12 source. Wait 2+ hours after lunch." },
      dinner: { name: "Air-Fried Potatoes + Kale", ingredients: ["2 large potatoes (cubed)", "1 cup Kale", "1 cup Okra", "1/2 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: null
    },
    2: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1/2 tbsp olive oil"], note: "Primary B12/Vitamin D source." },
      lunch: { name: "Chickpea Curry + Chapati", ingredients: ["2 cups Chickpea Curry", "2 plain Chapati", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Yogurt + Pomegranate", ingredients: ["1 cup Greek Yogurt", "1 cup Pomegranate arils"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Chickpea Pasta + Veg Curry", ingredients: ["1.5 cups Chickpea Pasta", "1.5 cups Mixed Veg Curry", "1/2 tbsp olive oil"], note: null },
      snack2: { name: "Whey + Milk", ingredients: ["1 scoop whey protein", "1 cup 2% Milk"], note: null },
      snack3: null
    },
    3: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1/2c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Black Bean Curry + Rice", ingredients: ["2 cups Black Bean Curry", "1.5 cups Brown Rice", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Apple + PB", ingredients: ["1 medium Apple", "1 tbsp Peanut Butter"], note: null },
      dinner: { name: "Tofu Curry + Rice + Broccoli", ingredients: ["1.5 cups Tofu Curry", "1 cup Brown Rice", "1.5 cups Broccoli", "1/2 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Almonds", ingredients: ["1/8 cup Raw Almonds"], note: "Calcium/Magnesium supplement recommended" },
      snack3: null
    },
    4: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1/2 tbsp olive oil"], note: null },
      lunch: { name: "Spinach Dal + Rice", ingredients: ["2 cups Spinach Dal", "1.5 cups Brown Rice", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to boost iron." },
      snack1: { name: "Yogurt + Banana + PB", ingredients: ["1 cup Greek Yogurt", "1 medium Banana", "1 tbsp Peanut Butter"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Veg Fried Rice", ingredients: ["2.5 cups Veg Fried Rice", "1/2 tbsp olive oil"], note: null },
      snack2: { name: "Whey + Milk", ingredients: ["1 scoop whey protein", "1 cup 2% Milk"], note: null },
      snack3: null
    },
    5: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1/2c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Tomato Dal + Rice", ingredients: ["2 cups Tomato Dal", "2 cups Brown Rice", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on dal to boost iron." },
      snack1: { name: "Apple + Walnuts", ingredients: ["1 medium Apple", "1/4 cup Walnuts"], note: null },
      dinner: { name: "Chickpea Pasta + Veg Curry + Kale", ingredients: ["2 cups Chickpea Pasta", "1.5 cups Mixed Veg Curry", "1 cup Kale", "1/2 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Greek Yogurt", ingredients: ["1 cup 2% Greek Yogurt"], note: null },
      snack3: null
    },
    6: {
      breakfast: { name: "6-Egg Omelette", ingredients: ["6 large eggs", "2c spinach", "1c mushrooms", "1/2 tbsp olive oil"], note: null },
      lunch: { name: "Chickpea Curry + Chapati", ingredients: ["2 cups Chickpea Curry", "2 plain Chapati", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Yogurt + Pomegranate", ingredients: ["1 cup Greek Yogurt", "1 cup Pomegranate arils"], note: "Consume 2+ hours after high-iron lunch." },
      dinner: { name: "Tofu Curry + Rice", ingredients: ["1.5 cups Tofu Curry", "1.5 cups Brown Rice", "1/2 tbsp olive oil"], note: null },
      snack2: null,
      snack3: null
    },
    7: {
      breakfast: { name: "Protein Oatmeal", ingredients: ["1/2c dry rolled oats", "1 scoop whey protein", "1 tbsp chia seeds", "1/4c walnuts"], note: "High-iron meal. Wait 2 hours before dairy." },
      lunch: { name: "Black Bean Curry + Rice", ingredients: ["2 cups Black Bean Curry", "1.5 cups Brown Rice", "1/2 tbsp olive oil", "Fresh lemon wedge"], note: "Squeeze lemon juice on curry to boost iron." },
      snack1: { name: "Apple + PB", ingredients: ["1 medium Apple", "1 tbsp Peanut Butter"], note: null },
      dinner: { name: "Veg Fried Rice + Broccoli", ingredients: ["2.5 cups Veg Fried Rice", "1.5 cups Broccoli", "1/2 tbsp olive oil"], note: "Add 1 tbsp nutritional yeast for B12" },
      snack2: { name: "Almonds", ingredients: ["1/4 cup Raw Almonds"], note: null },
      snack3: null
    }
  }
};

// Comprehensive micronutrient data from research document (with supplement adjustments
const micronutrientData = {
  "bulking": {
    "1": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 17.9,
        "percentage": 119,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.8
          },
          {
            "meal": "Lunch",
            "value": 3.3
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 2.5
          },
          {
            "meal": "Snack 2",
            "value": 9.2
          },
          {
            "meal": "Snack 3",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 331.4,
        "percentage": 276,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.4
          },
          {
            "meal": "Lunch",
            "value": 22.1
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 304.8
          },
          {
            "meal": "Snack 3",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 201.8,
        "percentage": 224,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.6
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 10.4
          },
          {
            "meal": "Dinner",
            "value": 182.2
          }
        ]
      },
      "folate": {
        "value": 1616.2,
        "percentage": 404,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 79.1
          },
          {
            "meal": "Lunch",
            "value": 981.1
          },
          {
            "meal": "Snack 1",
            "value": 53.6
          },
          {
            "meal": "Dinner",
            "value": 218.5
          },
          {
            "meal": "Snack 2",
            "value": 18.0
          },
          {
            "meal": "Snack 3",
            "value": 265.9
          }
        ]
      },
      "vitaminB12": {
        "value": 13.8,
        "percentage": 576,
        "sources": [
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Snack 3",
            "value": 12.9
          }
        ]
      },
      "calcium": {
        "value": 1206.3,
        "percentage": 93,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 235.4
          },
          {
            "meal": "Lunch",
            "value": 175.9
          },
          {
            "meal": "Snack 1",
            "value": 240.8
          },
          {
            "meal": "Dinner",
            "value": 230.6
          },
          {
            "meal": "Snack 2",
            "value": 95.0
          },
          {
            "meal": "Snack 3",
            "value": 228.6
          }
        ]
      },
      "iron": {
        "value": 30.8,
        "percentage": 171,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 17.9
          },
          {
            "meal": "Snack 1",
            "value": 0.7
          },
          {
            "meal": "Dinner",
            "value": 4.8
          },
          {
            "meal": "Snack 2",
            "value": 1.3
          },
          {
            "meal": "Snack 3",
            "value": 0.5
          }
        ]
      },
      "zinc": {
        "value": 26.6,
        "percentage": 241,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.7
          },
          {
            "meal": "Lunch",
            "value": 14.6
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 2.2
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          },
          {
            "meal": "Snack 3",
            "value": 2.1
          }
        ]
      },
      "magnesium": {
        "value": 1145.8,
        "percentage": 273,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 232.4
          },
          {
            "meal": "Lunch",
            "value": 527.7
          },
          {
            "meal": "Snack 1",
            "value": 82.1
          },
          {
            "meal": "Dinner",
            "value": 180.5
          },
          {
            "meal": "Snack 2",
            "value": 97.2
          },
          {
            "meal": "Snack 3",
            "value": 25.9
          }
        ]
      },
      "potassium": {
        "value": 6738.4,
        "percentage": 143,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 551.6
          },
          {
            "meal": "Lunch",
            "value": 2372.9
          },
          {
            "meal": "Snack 1",
            "value": 839.9
          },
          {
            "meal": "Dinner",
            "value": 2328.0
          },
          {
            "meal": "Snack 2",
            "value": 253.8
          },
          {
            "meal": "Snack 3",
            "value": 392.1
          }
        ]
      }
    },
    "2": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 30.7,
        "percentage": 205,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 6.5
          },
          {
            "meal": "Lunch",
            "value": 3.6
          },
          {
            "meal": "Snack 1",
            "value": 2.7
          },
          {
            "meal": "Dinner",
            "value": 8.4
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          },
          {
            "meal": "Snack 3",
            "value": 9.2
          }
        ]
      },
      "vitaminK": {
        "value": 406.4,
        "percentage": 339,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 299.8
          },
          {
            "meal": "Lunch",
            "value": 28.2
          },
          {
            "meal": "Snack 1",
            "value": 29.3
          },
          {
            "meal": "Dinner",
            "value": 48.4
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 66.6,
        "percentage": 74,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.0
          },
          {
            "meal": "Snack 1",
            "value": 17.7
          },
          {
            "meal": "Dinner",
            "value": 22.5
          }
        ]
      },
      "folate": {
        "value": 1946.8,
        "percentage": 487,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 1204.0
          },
          {
            "meal": "Snack 1",
            "value": 95.8
          },
          {
            "meal": "Dinner",
            "value": 347.5
          },
          {
            "meal": "Snack 2",
            "value": 12.2
          },
          {
            "meal": "Snack 3",
            "value": 18.0
          }
        ]
      },
      "vitaminB12": {
        "value": 5.1,
        "percentage": 214,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Snack 2",
            "value": 1.2
          }
        ]
      },
      "calcium": {
        "value": 1376.4,
        "percentage": 106,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 237.1
          },
          {
            "meal": "Snack 1",
            "value": 252.2
          },
          {
            "meal": "Dinner",
            "value": 160.1
          },
          {
            "meal": "Snack 2",
            "value": 402.2
          },
          {
            "meal": "Snack 3",
            "value": 95.0
          }
        ]
      },
      "iron": {
        "value": 39.4,
        "percentage": 219,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 17.3
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Dinner",
            "value": 12.3
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          },
          {
            "meal": "Snack 3",
            "value": 1.3
          }
        ]
      },
      "zinc": {
        "value": 23.4,
        "percentage": 213,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 8.5
          },
          {
            "meal": "Snack 1",
            "value": 2.2
          },
          {
            "meal": "Dinner",
            "value": 5.9
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          },
          {
            "meal": "Snack 3",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 794.7,
        "percentage": 189,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 280.4
          },
          {
            "meal": "Snack 1",
            "value": 70.6
          },
          {
            "meal": "Dinner",
            "value": 220.0
          },
          {
            "meal": "Snack 2",
            "value": 36.7
          },
          {
            "meal": "Snack 3",
            "value": 97.2
          }
        ]
      },
      "potassium": {
        "value": 5539.6,
        "percentage": 118,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 1966.1
          },
          {
            "meal": "Snack 1",
            "value": 821.0
          },
          {
            "meal": "Dinner",
            "value": 1150.1
          },
          {
            "meal": "Snack 2",
            "value": 377.0
          },
          {
            "meal": "Snack 3",
            "value": 253.8
          }
        ]
      }
    },
    "3": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 19.0,
        "percentage": 127,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.8
          },
          {
            "meal": "Lunch",
            "value": 3.9
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 3.3
          },
          {
            "meal": "Snack 2",
            "value": 9.2
          }
        ]
      },
      "vitaminK": {
        "value": 181.3,
        "percentage": 151,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.4
          },
          {
            "meal": "Lunch",
            "value": 21.6
          },
          {
            "meal": "Snack 1",
            "value": 4.0
          },
          {
            "meal": "Dinner",
            "value": 153.3
          }
        ]
      },
      "vitaminC": {
        "value": 129.2,
        "percentage": 144,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.6
          },
          {
            "meal": "Snack 1",
            "value": 8.3
          },
          {
            "meal": "Dinner",
            "value": 120.4
          }
        ]
      },
      "folate": {
        "value": 1412.9,
        "percentage": 353,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 79.1
          },
          {
            "meal": "Lunch",
            "value": 896.5
          },
          {
            "meal": "Snack 1",
            "value": 19.2
          },
          {
            "meal": "Dinner",
            "value": 400.1
          },
          {
            "meal": "Snack 2",
            "value": 18.0
          }
        ]
      },
      "vitaminB12": {
        "value": 12.0,
        "percentage": 500,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          }
        ]
      },
      "calcium": {
        "value": 1431.0,
        "percentage": 110,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 235.4
          },
          {
            "meal": "Lunch",
            "value": 277.8
          },
          {
            "meal": "Snack 1",
            "value": 18.6
          },
          {
            "meal": "Dinner",
            "value": 804.2
          },
          {
            "meal": "Snack 2",
            "value": 95.0
          }
        ]
      },
      "iron": {
        "value": 27.7,
        "percentage": 154,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 11.7
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 8.7
          },
          {
            "meal": "Snack 2",
            "value": 1.3
          }
        ]
      },
      "zinc": {
        "value": 23.1,
        "percentage": 210,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.7
          },
          {
            "meal": "Lunch",
            "value": 10.2
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 6.7
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 1190.3,
        "percentage": 283,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 232.4
          },
          {
            "meal": "Lunch",
            "value": 499.4
          },
          {
            "meal": "Snack 1",
            "value": 36.0
          },
          {
            "meal": "Dinner",
            "value": 325.2
          },
          {
            "meal": "Snack 2",
            "value": 97.2
          }
        ]
      },
      "potassium": {
        "value": 5322.4,
        "percentage": 113,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 551.6
          },
          {
            "meal": "Lunch",
            "value": 3185.3
          },
          {
            "meal": "Snack 1",
            "value": 282.8
          },
          {
            "meal": "Dinner",
            "value": 1048.8
          },
          {
            "meal": "Snack 2",
            "value": 253.8
          }
        ]
      }
    },
    "4": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 29.9,
        "percentage": 199,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 6.5
          },
          {
            "meal": "Lunch",
            "value": 3.2
          },
          {
            "meal": "Snack 1",
            "value": 11.0
          },
          {
            "meal": "Dinner",
            "value": 8.9
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 481.8,
        "percentage": 402,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 299.8
          },
          {
            "meal": "Lunch",
            "value": 21.0
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 159.0
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 52.4,
        "percentage": 58,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 10.4
          },
          {
            "meal": "Dinner",
            "value": 15.0
          }
        ]
      },
      "folate": {
        "value": 1448.7,
        "percentage": 362,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 963.6
          },
          {
            "meal": "Snack 1",
            "value": 71.7
          },
          {
            "meal": "Dinner",
            "value": 132.0
          },
          {
            "meal": "Snack 2",
            "value": 12.2
          }
        ]
      },
      "vitaminB12": {
        "value": 5.1,
        "percentage": 214,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Snack 2",
            "value": 1.2
          }
        ]
      },
      "calcium": {
        "value": 1256.3,
        "percentage": 97,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 156.4
          },
          {
            "meal": "Snack 1",
            "value": 335.9
          },
          {
            "meal": "Dinner",
            "value": 132.1
          },
          {
            "meal": "Snack 2",
            "value": 402.2
          }
        ]
      },
      "iron": {
        "value": 30.6,
        "percentage": 170,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 16.9
          },
          {
            "meal": "Snack 1",
            "value": 2.1
          },
          {
            "meal": "Dinner",
            "value": 4.1
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          }
        ]
      },
      "zinc": {
        "value": 24.5,
        "percentage": 223,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 13.1
          },
          {
            "meal": "Snack 1",
            "value": 2.9
          },
          {
            "meal": "Dinner",
            "value": 2.9
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 845.6,
        "percentage": 201,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 443.9
          },
          {
            "meal": "Snack 1",
            "value": 179.3
          },
          {
            "meal": "Dinner",
            "value": 96.0
          },
          {
            "meal": "Snack 2",
            "value": 36.7
          }
        ]
      },
      "potassium": {
        "value": 5327.3,
        "percentage": 113,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 2218.9
          },
          {
            "meal": "Snack 1",
            "value": 1093.7
          },
          {
            "meal": "Dinner",
            "value": 666.1
          },
          {
            "meal": "Snack 2",
            "value": 377.0
          }
        ]
      }
    },
    "5": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 14.8,
        "percentage": 98,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.8
          },
          {
            "meal": "Lunch",
            "value": 3.3
          },
          {
            "meal": "Snack 1",
            "value": 2.0
          },
          {
            "meal": "Dinner",
            "value": 8.4
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 336.3,
        "percentage": 280,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.4
          },
          {
            "meal": "Lunch",
            "value": 22.1
          },
          {
            "meal": "Snack 1",
            "value": 4.8
          },
          {
            "meal": "Dinner",
            "value": 306.2
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 120.8,
        "percentage": 134,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.6
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 8.7
          },
          {
            "meal": "Dinner",
            "value": 102.9
          }
        ]
      },
      "folate": {
        "value": 1760.6,
        "percentage": 440,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 79.1
          },
          {
            "meal": "Lunch",
            "value": 981.1
          },
          {
            "meal": "Snack 1",
            "value": 48.6
          },
          {
            "meal": "Dinner",
            "value": 636.0
          },
          {
            "meal": "Snack 2",
            "value": 15.9
          }
        ]
      },
      "vitaminB12": {
        "value": 12.9,
        "percentage": 538,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          },
          {
            "meal": "Snack 2",
            "value": 0.9
          }
        ]
      },
      "calcium": {
        "value": 934.5,
        "percentage": 72,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 235.4
          },
          {
            "meal": "Lunch",
            "value": 175.9
          },
          {
            "meal": "Snack 1",
            "value": 48.0
          },
          {
            "meal": "Dinner",
            "value": 248.2
          },
          {
            "meal": "Snack 2",
            "value": 227.0
          }
        ]
      },
      "iron": {
        "value": 36.5,
        "percentage": 203,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 17.9
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 11.6
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          }
        ]
      },
      "zinc": {
        "value": 28.1,
        "percentage": 256,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.7
          },
          {
            "meal": "Lunch",
            "value": 14.6
          },
          {
            "meal": "Snack 1",
            "value": 1.4
          },
          {
            "meal": "Dinner",
            "value": 6.3
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 1085.9,
        "percentage": 259,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 232.4
          },
          {
            "meal": "Lunch",
            "value": 527.7
          },
          {
            "meal": "Snack 1",
            "value": 83.4
          },
          {
            "meal": "Dinner",
            "value": 219.7
          },
          {
            "meal": "Snack 2",
            "value": 22.7
          }
        ]
      },
      "potassium": {
        "value": 5070.9,
        "percentage": 108,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 551.6
          },
          {
            "meal": "Lunch",
            "value": 2372.9
          },
          {
            "meal": "Snack 1",
            "value": 415.1
          },
          {
            "meal": "Dinner",
            "value": 1411.1
          },
          {
            "meal": "Snack 2",
            "value": 320.1
          }
        ]
      }
    },
    "6": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 22.9,
        "percentage": 153,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 6.5
          },
          {
            "meal": "Lunch",
            "value": 3.6
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 2.3
          },
          {
            "meal": "Snack 2",
            "value": 9.2
          }
        ]
      },
      "vitaminK": {
        "value": 373.4,
        "percentage": 311,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 299.8
          },
          {
            "meal": "Lunch",
            "value": 28.2
          },
          {
            "meal": "Snack 1",
            "value": 29.2
          },
          {
            "meal": "Dinner",
            "value": 16.2
          }
        ]
      },
      "vitaminC": {
        "value": 44.1,
        "percentage": 49,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.0
          },
          {
            "meal": "Snack 1",
            "value": 17.7
          }
        ]
      },
      "folate": {
        "value": 1647.2,
        "percentage": 412,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 1204.0
          },
          {
            "meal": "Snack 1",
            "value": 82.0
          },
          {
            "meal": "Dinner",
            "value": 73.9
          },
          {
            "meal": "Snack 2",
            "value": 18.0
          }
        ]
      },
      "vitaminB12": {
        "value": 3.9,
        "percentage": 163,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          }
        ]
      },
      "calcium": {
        "value": 1555.1,
        "percentage": 120,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 237.1
          },
          {
            "meal": "Snack 1",
            "value": 244.4
          },
          {
            "meal": "Dinner",
            "value": 748.9
          },
          {
            "meal": "Snack 2",
            "value": 95.0
          }
        ]
      },
      "iron": {
        "value": 34.5,
        "percentage": 192,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 17.3
          },
          {
            "meal": "Snack 1",
            "value": 0.6
          },
          {
            "meal": "Dinner",
            "value": 7.8
          },
          {
            "meal": "Snack 2",
            "value": 1.3
          }
        ]
      },
      "zinc": {
        "value": 21.9,
        "percentage": 199,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 8.5
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 5.9
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 846.5,
        "percentage": 202,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 280.4
          },
          {
            "meal": "Snack 1",
            "value": 43.6
          },
          {
            "meal": "Dinner",
            "value": 335.6
          },
          {
            "meal": "Snack 2",
            "value": 97.2
          }
        ]
      },
      "potassium": {
        "value": 4549.5,
        "percentage": 97,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 1966.1
          },
          {
            "meal": "Snack 1",
            "value": 730.7
          },
          {
            "meal": "Dinner",
            "value": 627.3
          },
          {
            "meal": "Snack 2",
            "value": 253.8
          }
        ]
      }
    },
    "7": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 24.5,
        "percentage": 164,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.8
          },
          {
            "meal": "Lunch",
            "value": 3.9
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 8.8
          },
          {
            "meal": "Snack 2",
            "value": 9.2
          }
        ]
      },
      "vitaminK": {
        "value": 299.7,
        "percentage": 250,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.4
          },
          {
            "meal": "Lunch",
            "value": 21.6
          },
          {
            "meal": "Snack 1",
            "value": 4.0
          },
          {
            "meal": "Dinner",
            "value": 271.6
          }
        ]
      },
      "vitaminC": {
        "value": 141.8,
        "percentage": 158,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.6
          },
          {
            "meal": "Snack 1",
            "value": 8.3
          },
          {
            "meal": "Dinner",
            "value": 132.9
          }
        ]
      },
      "folate": {
        "value": 1457.8,
        "percentage": 364,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 79.1
          },
          {
            "meal": "Lunch",
            "value": 896.5
          },
          {
            "meal": "Snack 1",
            "value": 19.2
          },
          {
            "meal": "Dinner",
            "value": 445.1
          },
          {
            "meal": "Snack 2",
            "value": 18.0
          }
        ]
      },
      "vitaminB12": {
        "value": 12.0,
        "percentage": 500,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          }
        ]
      },
      "calcium": {
        "value": 802.0,
        "percentage": 62,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 235.4
          },
          {
            "meal": "Lunch",
            "value": 277.8
          },
          {
            "meal": "Snack 1",
            "value": 18.6
          },
          {
            "meal": "Dinner",
            "value": 175.2
          },
          {
            "meal": "Snack 2",
            "value": 95.0
          }
        ]
      },
      "iron": {
        "value": 23.8,
        "percentage": 132,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 11.7
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 4.8
          },
          {
            "meal": "Snack 2",
            "value": 1.3
          }
        ]
      },
      "zinc": {
        "value": 20.5,
        "percentage": 186,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.7
          },
          {
            "meal": "Lunch",
            "value": 10.2
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 4.0
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 976.6,
        "percentage": 233,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 232.4
          },
          {
            "meal": "Lunch",
            "value": 499.4
          },
          {
            "meal": "Snack 1",
            "value": 36.0
          },
          {
            "meal": "Dinner",
            "value": 111.5
          },
          {
            "meal": "Snack 2",
            "value": 97.2
          }
        ]
      },
      "potassium": {
        "value": 5327.3,
        "percentage": 113,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 551.6
          },
          {
            "meal": "Lunch",
            "value": 3185.3
          },
          {
            "meal": "Snack 1",
            "value": 282.8
          },
          {
            "meal": "Dinner",
            "value": 1053.7
          },
          {
            "meal": "Snack 2",
            "value": 253.8
          }
        ]
      }
    }
  },
  "cutting": {
    "1": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 25.8,
        "percentage": 172,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 2.2
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 2.5
          },
          {
            "meal": "Snack 2",
            "value": 18.4
          }
        ]
      },
      "vitaminK": {
        "value": 325.1,
        "percentage": 271,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.8
          },
          {
            "meal": "Lunch",
            "value": 16.2
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 304.8
          }
        ]
      },
      "vitaminC": {
        "value": 202.2,
        "percentage": 225,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 10.4
          },
          {
            "meal": "Dinner",
            "value": 182.2
          }
        ]
      },
      "folate": {
        "value": 1610.2,
        "percentage": 403,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 97.3
          },
          {
            "meal": "Lunch",
            "value": 954.8
          },
          {
            "meal": "Snack 1",
            "value": 53.6
          },
          {
            "meal": "Dinner",
            "value": 468.5
          },
          {
            "meal": "Snack 2",
            "value": 36.0
          }
        ]
      },
      "vitaminB12": {
        "value": 12.9,
        "percentage": 538,
        "sources": [
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Dinner",
            "value": 12.0
          }
        ]
      },
      "calcium": {
        "value": 1063.6,
        "percentage": 82,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 254.0
          },
          {
            "meal": "Lunch",
            "value": 146.6
          },
          {
            "meal": "Snack 1",
            "value": 240.8
          },
          {
            "meal": "Dinner",
            "value": 232.2
          },
          {
            "meal": "Snack 2",
            "value": 190.1
          }
        ]
      },
      "iron": {
        "value": 30.5,
        "percentage": 169,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 16.4
          },
          {
            "meal": "Snack 1",
            "value": 0.7
          },
          {
            "meal": "Dinner",
            "value": 5.2
          },
          {
            "meal": "Snack 2",
            "value": 2.7
          }
        ]
      },
      "zinc": {
        "value": 24.3,
        "percentage": 221,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.8
          },
          {
            "meal": "Lunch",
            "value": 12.3
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 3.2
          },
          {
            "meal": "Snack 2",
            "value": 2.2
          }
        ]
      },
      "magnesium": {
        "value": 1106.6,
        "percentage": 263,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 244.4
          },
          {
            "meal": "Lunch",
            "value": 401.9
          },
          {
            "meal": "Snack 1",
            "value": 82.1
          },
          {
            "meal": "Dinner",
            "value": 183.7
          },
          {
            "meal": "Snack 2",
            "value": 194.4
          }
        ]
      },
      "potassium": {
        "value": 6487.4,
        "percentage": 138,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 598.1
          },
          {
            "meal": "Lunch",
            "value": 2141.8
          },
          {
            "meal": "Snack 1",
            "value": 839.9
          },
          {
            "meal": "Dinner",
            "value": 2400.0
          },
          {
            "meal": "Snack 2",
            "value": 507.6
          }
        ]
      }
    },
    "2": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 14.6,
        "percentage": 97,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 2.3
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 5.3
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 386.1,
        "percentage": 322,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 295.6
          },
          {
            "meal": "Lunch",
            "value": 23.4
          },
          {
            "meal": "Snack 1",
            "value": 29.2
          },
          {
            "meal": "Dinner",
            "value": 37.2
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 66.6,
        "percentage": 74,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.0
          },
          {
            "meal": "Snack 1",
            "value": 17.7
          },
          {
            "meal": "Dinner",
            "value": 22.5
          }
        ]
      },
      "folate": {
        "value": 1773.0,
        "percentage": 443,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 1174.0
          },
          {
            "meal": "Snack 1",
            "value": 82.0
          },
          {
            "meal": "Dinner",
            "value": 235.5
          },
          {
            "meal": "Snack 2",
            "value": 12.2
          }
        ]
      },
      "vitaminB12": {
        "value": 5.1,
        "percentage": 214,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Snack 2",
            "value": 1.2
          }
        ]
      },
      "calcium": {
        "value": 1236.3,
        "percentage": 95,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 228.1
          },
          {
            "meal": "Snack 1",
            "value": 244.4
          },
          {
            "meal": "Dinner",
            "value": 132.1
          },
          {
            "meal": "Snack 2",
            "value": 402.2
          }
        ]
      },
      "iron": {
        "value": 31.9,
        "percentage": 177,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 15.7
          },
          {
            "meal": "Snack 1",
            "value": 0.6
          },
          {
            "meal": "Dinner",
            "value": 8.1
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          }
        ]
      },
      "zinc": {
        "value": 19.2,
        "percentage": 175,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 7.9
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 3.8
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 583.6,
        "percentage": 139,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 263.6
          },
          {
            "meal": "Snack 1",
            "value": 43.6
          },
          {
            "meal": "Dinner",
            "value": 150.0
          },
          {
            "meal": "Snack 2",
            "value": 36.7
          }
        ]
      },
      "potassium": {
        "value": 4843.3,
        "percentage": 103,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 1894.1
          },
          {
            "meal": "Snack 1",
            "value": 730.7
          },
          {
            "meal": "Dinner",
            "value": 870.1
          },
          {
            "meal": "Snack 2",
            "value": 377.0
          }
        ]
      }
    },
    "3": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 26.2,
        "percentage": 174,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 2.8
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 2.2
          },
          {
            "meal": "Snack 2",
            "value": 18.4
          }
        ]
      },
      "vitaminK": {
        "value": 171.5,
        "percentage": 143,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.8
          },
          {
            "meal": "Lunch",
            "value": 16.8
          },
          {
            "meal": "Snack 1",
            "value": 4.0
          },
          {
            "meal": "Dinner",
            "value": 147.9
          }
        ]
      },
      "vitaminC": {
        "value": 129.6,
        "percentage": 144,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Snack 1",
            "value": 8.3
          },
          {
            "meal": "Dinner",
            "value": 120.4
          }
        ]
      },
      "folate": {
        "value": 1422.7,
        "percentage": 356,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 97.3
          },
          {
            "meal": "Lunch",
            "value": 887.7
          },
          {
            "meal": "Snack 1",
            "value": 19.2
          },
          {
            "meal": "Dinner",
            "value": 382.6
          },
          {
            "meal": "Snack 2",
            "value": 36.0
          }
        ]
      },
      "vitaminB12": {
        "value": 12.0,
        "percentage": 500,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          }
        ]
      },
      "calcium": {
        "value": 1515.2,
        "percentage": 117,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 254.0
          },
          {
            "meal": "Lunch",
            "value": 267.9
          },
          {
            "meal": "Snack 1",
            "value": 18.6
          },
          {
            "meal": "Dinner",
            "value": 784.6
          },
          {
            "meal": "Snack 2",
            "value": 190.1
          }
        ]
      },
      "iron": {
        "value": 27.5,
        "percentage": 153,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 11.2
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 7.7
          },
          {
            "meal": "Snack 2",
            "value": 2.7
          }
        ]
      },
      "zinc": {
        "value": 22.0,
        "percentage": 200,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.8
          },
          {
            "meal": "Lunch",
            "value": 9.4
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 5.1
          },
          {
            "meal": "Snack 2",
            "value": 2.2
          }
        ]
      },
      "magnesium": {
        "value": 1173.8,
        "percentage": 279,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 244.4
          },
          {
            "meal": "Lunch",
            "value": 457.5
          },
          {
            "meal": "Snack 1",
            "value": 36.0
          },
          {
            "meal": "Dinner",
            "value": 241.4
          },
          {
            "meal": "Snack 2",
            "value": 194.4
          }
        ]
      },
      "potassium": {
        "value": 5391.4,
        "percentage": 115,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 598.1
          },
          {
            "meal": "Lunch",
            "value": 3108.2
          },
          {
            "meal": "Snack 1",
            "value": 282.8
          },
          {
            "meal": "Dinner",
            "value": 894.7
          },
          {
            "meal": "Snack 2",
            "value": 507.6
          }
        ]
      }
    },
    "4": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 16.4,
        "percentage": 109,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 2.1
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 6.7
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 442.9,
        "percentage": 369,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 295.6
          },
          {
            "meal": "Lunch",
            "value": 15.6
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 129.7
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 49.9,
        "percentage": 55,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 10.4
          },
          {
            "meal": "Dinner",
            "value": 12.5
          }
        ]
      },
      "folate": {
        "value": 1391.2,
        "percentage": 348,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 946.0
          },
          {
            "meal": "Snack 1",
            "value": 53.6
          },
          {
            "meal": "Dinner",
            "value": 110.0
          },
          {
            "meal": "Snack 2",
            "value": 12.2
          }
        ]
      },
      "vitaminB12": {
        "value": 5.1,
        "percentage": 214,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          },
          {
            "meal": "Snack 2",
            "value": 1.2
          }
        ]
      },
      "calcium": {
        "value": 1119.5,
        "percentage": 86,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 136.8
          },
          {
            "meal": "Snack 1",
            "value": 240.8
          },
          {
            "meal": "Dinner",
            "value": 110.1
          },
          {
            "meal": "Snack 2",
            "value": 402.2
          }
        ]
      },
      "iron": {
        "value": 27.6,
        "percentage": 153,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 15.9
          },
          {
            "meal": "Snack 1",
            "value": 0.7
          },
          {
            "meal": "Dinner",
            "value": 3.5
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          }
        ]
      },
      "zinc": {
        "value": 21.4,
        "percentage": 194,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 11.5
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 2.5
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 648.6,
        "percentage": 154,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 360.0
          },
          {
            "meal": "Snack 1",
            "value": 82.1
          },
          {
            "meal": "Dinner",
            "value": 80.0
          },
          {
            "meal": "Snack 2",
            "value": 36.7
          }
        ]
      },
      "potassium": {
        "value": 4808.2,
        "percentage": 102,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 2064.7
          },
          {
            "meal": "Snack 1",
            "value": 839.9
          },
          {
            "meal": "Dinner",
            "value": 555.1
          },
          {
            "meal": "Snack 2",
            "value": 377.0
          }
        ]
      }
    },
    "5": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 11.2,
        "percentage": 75,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 2.2
          },
          {
            "meal": "Snack 1",
            "value": 0.6
          },
          {
            "meal": "Dinner",
            "value": 7.4
          },
          {
            "meal": "Snack 2",
            "value": 0.2
          }
        ]
      },
      "vitaminK": {
        "value": 326.4,
        "percentage": 272,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.8
          },
          {
            "meal": "Lunch",
            "value": 16.2
          },
          {
            "meal": "Snack 1",
            "value": 4.8
          },
          {
            "meal": "Dinner",
            "value": 302.0
          },
          {
            "meal": "Snack 2",
            "value": 0.7
          }
        ]
      },
      "vitaminC": {
        "value": 121.2,
        "percentage": 135,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 8.6
          },
          {
            "meal": "Snack 1",
            "value": 8.7
          },
          {
            "meal": "Dinner",
            "value": 102.9
          }
        ]
      },
      "folate": {
        "value": 1738.7,
        "percentage": 435,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 97.3
          },
          {
            "meal": "Lunch",
            "value": 954.8
          },
          {
            "meal": "Snack 1",
            "value": 34.8
          },
          {
            "meal": "Dinner",
            "value": 636.0
          },
          {
            "meal": "Snack 2",
            "value": 15.9
          }
        ]
      },
      "vitaminB12": {
        "value": 12.9,
        "percentage": 538,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          },
          {
            "meal": "Snack 2",
            "value": 0.9
          }
        ]
      },
      "calcium": {
        "value": 915.9,
        "percentage": 70,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 254.0
          },
          {
            "meal": "Lunch",
            "value": 146.6
          },
          {
            "meal": "Snack 1",
            "value": 40.2
          },
          {
            "meal": "Dinner",
            "value": 248.2
          },
          {
            "meal": "Snack 2",
            "value": 227.0
          }
        ]
      },
      "iron": {
        "value": 34.7,
        "percentage": 193,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 16.4
          },
          {
            "meal": "Snack 1",
            "value": 1.1
          },
          {
            "meal": "Dinner",
            "value": 11.6
          },
          {
            "meal": "Snack 2",
            "value": 0.1
          }
        ]
      },
      "zinc": {
        "value": 25.5,
        "percentage": 232,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.8
          },
          {
            "meal": "Lunch",
            "value": 12.3
          },
          {
            "meal": "Snack 1",
            "value": 1.0
          },
          {
            "meal": "Dinner",
            "value": 6.3
          },
          {
            "meal": "Snack 2",
            "value": 1.1
          }
        ]
      },
      "magnesium": {
        "value": 945.1,
        "percentage": 225,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 244.4
          },
          {
            "meal": "Lunch",
            "value": 401.9
          },
          {
            "meal": "Snack 1",
            "value": 56.4
          },
          {
            "meal": "Dinner",
            "value": 219.7
          },
          {
            "meal": "Snack 2",
            "value": 22.7
          }
        ]
      },
      "potassium": {
        "value": 4795.9,
        "percentage": 102,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 598.1
          },
          {
            "meal": "Lunch",
            "value": 2141.8
          },
          {
            "meal": "Snack 1",
            "value": 324.9
          },
          {
            "meal": "Dinner",
            "value": 1411.0
          },
          {
            "meal": "Snack 2",
            "value": 320.1
          }
        ]
      }
    },
    "6": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 10.2,
        "percentage": 68,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 2.3
          },
          {
            "meal": "Snack 1",
            "value": 1.3
          },
          {
            "meal": "Dinner",
            "value": 1.2
          }
        ]
      },
      "vitaminK": {
        "value": 359.0,
        "percentage": 299,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 295.6
          },
          {
            "meal": "Lunch",
            "value": 23.4
          },
          {
            "meal": "Snack 1",
            "value": 29.2
          },
          {
            "meal": "Dinner",
            "value": 10.8
          }
        ]
      },
      "vitaminC": {
        "value": 44.1,
        "percentage": 49,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 18.3
          },
          {
            "meal": "Lunch",
            "value": 8.0
          },
          {
            "meal": "Snack 1",
            "value": 17.7
          }
        ]
      },
      "folate": {
        "value": 1581.6,
        "percentage": 395,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 269.3
          },
          {
            "meal": "Lunch",
            "value": 1174.0
          },
          {
            "meal": "Snack 1",
            "value": 82.0
          },
          {
            "meal": "Dinner",
            "value": 56.3
          }
        ]
      },
      "vitaminB12": {
        "value": 3.9,
        "percentage": 163,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 3.0
          },
          {
            "meal": "Snack 1",
            "value": 0.9
          }
        ]
      },
      "calcium": {
        "value": 1431.4,
        "percentage": 110,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 229.6
          },
          {
            "meal": "Lunch",
            "value": 228.1
          },
          {
            "meal": "Snack 1",
            "value": 244.4
          },
          {
            "meal": "Dinner",
            "value": 729.3
          }
        ]
      },
      "iron": {
        "value": 30.6,
        "percentage": 170,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 7.4
          },
          {
            "meal": "Lunch",
            "value": 15.7
          },
          {
            "meal": "Snack 1",
            "value": 0.6
          },
          {
            "meal": "Dinner",
            "value": 6.9
          }
        ]
      },
      "zinc": {
        "value": 18.7,
        "percentage": 170,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.5
          },
          {
            "meal": "Lunch",
            "value": 7.9
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 4.3
          }
        ]
      },
      "magnesium": {
        "value": 648.7,
        "percentage": 154,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 89.7
          },
          {
            "meal": "Lunch",
            "value": 263.6
          },
          {
            "meal": "Snack 1",
            "value": 43.6
          },
          {
            "meal": "Dinner",
            "value": 251.8
          }
        ]
      },
      "potassium": {
        "value": 4069.4,
        "percentage": 87,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 971.5
          },
          {
            "meal": "Lunch",
            "value": 1894.1
          },
          {
            "meal": "Snack 1",
            "value": 730.7
          },
          {
            "meal": "Dinner",
            "value": 473.1
          }
        ]
      }
    },
    "7": {
      "vitaminD": {
        "value": 20.0,
        "percentage": 100,
        "sources": [
          {
            "meal": "Supplement",
            "value": 20.0
          }
        ]
      },
      "vitaminE": {
        "value": 30.6,
        "percentage": 204,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Lunch",
            "value": 2.8
          },
          {
            "meal": "Snack 1",
            "value": 1.8
          },
          {
            "meal": "Dinner",
            "value": 6.6
          },
          {
            "meal": "Snack 2",
            "value": 18.4
          }
        ]
      },
      "vitaminK": {
        "value": 266.0,
        "percentage": 222,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 2.8
          },
          {
            "meal": "Lunch",
            "value": 16.8
          },
          {
            "meal": "Snack 1",
            "value": 4.0
          },
          {
            "meal": "Dinner",
            "value": 242.3
          }
        ]
      },
      "vitaminC": {
        "value": 139.6,
        "percentage": 155,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 0.9
          },
          {
            "meal": "Snack 1",
            "value": 8.3
          },
          {
            "meal": "Dinner",
            "value": 130.4
          }
        ]
      },
      "folate": {
        "value": 1463.2,
        "percentage": 366,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 97.3
          },
          {
            "meal": "Lunch",
            "value": 887.7
          },
          {
            "meal": "Snack 1",
            "value": 19.2
          },
          {
            "meal": "Dinner",
            "value": 423.1
          },
          {
            "meal": "Snack 2",
            "value": 36.0
          }
        ]
      },
      "vitaminB12": {
        "value": 12.0,
        "percentage": 500,
        "sources": [
          {
            "meal": "Dinner",
            "value": 12.0
          }
        ]
      },
      "calcium": {
        "value": 883.7,
        "percentage": 68,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 254.0
          },
          {
            "meal": "Lunch",
            "value": 267.9
          },
          {
            "meal": "Snack 1",
            "value": 18.6
          },
          {
            "meal": "Dinner",
            "value": 153.1
          },
          {
            "meal": "Snack 2",
            "value": 190.1
          }
        ]
      },
      "iron": {
        "value": 23.9,
        "percentage": 133,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 5.5
          },
          {
            "meal": "Lunch",
            "value": 11.2
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 4.1
          },
          {
            "meal": "Snack 2",
            "value": 2.7
          }
        ]
      },
      "zinc": {
        "value": 20.4,
        "percentage": 186,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 4.8
          },
          {
            "meal": "Lunch",
            "value": 9.4
          },
          {
            "meal": "Snack 1",
            "value": 0.5
          },
          {
            "meal": "Dinner",
            "value": 3.5
          },
          {
            "meal": "Snack 2",
            "value": 2.2
          }
        ]
      },
      "magnesium": {
        "value": 1027.9,
        "percentage": 245,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 244.4
          },
          {
            "meal": "Lunch",
            "value": 457.5
          },
          {
            "meal": "Snack 1",
            "value": 36.0
          },
          {
            "meal": "Dinner",
            "value": 95.5
          },
          {
            "meal": "Snack 2",
            "value": 194.4
          }
        ]
      },
      "potassium": {
        "value": 5439.4,
        "percentage": 116,
        "sources": [
          {
            "meal": "Breakfast",
            "value": 598.1
          },
          {
            "meal": "Lunch",
            "value": 3108.2
          },
          {
            "meal": "Snack 1",
            "value": 282.8
          },
          {
            "meal": "Dinner",
            "value": 942.7
          },
          {
            "meal": "Snack 2",
            "value": 507.6
          }
        ]
      }
    }
  }
};


// Data from your research documents (UPDATED with modifications)
const bulkingData = [
  // Day 1: -19g fat (walnuts 1/4c), -8g fat (PB 1tbsp), -18g fat (almonds 1/4c), +45g carbs (rice 3.5c) = -295 kcal + 216 kcal = -79 kcal
  { day: 1, calories: 3140, protein: 155.8, fat: 78.2, carbs: 436.4 },
  // Day 2: -8g fat (PB 1tbsp), -18g fat (almonds 1/4c) = -265 kcal
  { day: 2, calories: 3035, protein: 175.0, fat: 113.0, carbs: 339.8 },
  // Day 3: -19g fat (walnuts 1/4c), -18g fat (almonds 1/4c) = -295 kcal
  { day: 3, calories: 2928, protein: 142.8, fat: 107.8, carbs: 355.6 },
  // Day 4: -8g fat (PB 1tbsp) = -100 kcal
  { day: 4, calories: 3247, protein: 170.2, fat: 139.7, carbs: 335.3 },
  // Day 5: -19g fat (walnuts 1/4c), +45g carbs (rice 3.5c) = -130 kcal + 216 kcal = +86 kcal
  { day: 5, calories: 3417, protein: 152.1, fat: 127.5, carbs: 412.4 },
  // Day 6: -18g fat (almonds 1/4c) = -165 kcal
  { day: 6, calories: 3138, protein: 159.0, fat: 131.6, carbs: 323.0 },
  // Day 7: -19g fat (walnuts 1/4c), -18g fat (almonds 1/4c) = -295 kcal
  { day: 7, calories: 2926, protein: 129.3, fat: 90.4, carbs: 412.0 }
];

const cuttingData = [
  { day: 1, calories: 2316, protein: 107.3, fat: 66.9, carbs: 338.4 },
  { day: 2, calories: 2422, protein: 158.9, fat: 84.5, carbs: 267.8 },
  { day: 3, calories: 2368, protein: 132.5, fat: 83.8, carbs: 269.8 },
  { day: 4, calories: 2378, protein: 148.4, fat: 81.9, carbs: 258.2 },
  { day: 5, calories: 2474, protein: 129.6, fat: 65.7, carbs: 358.4 },
  { day: 6, calories: 2375, protein: 136.2, fat: 87.9, carbs: 268.1 },
  { day: 7, calories: 2428, protein: 103.5, fat: 68.4, carbs: 361.0 }
];

const bulkingAverages = {
  calories: 3119,
  protein: 154.9,
  fat: 112.6,
  carbs: 373.5
};

const cuttingAverages = {
  calories: 2394,
  protein: 130.9,
  fat: 77.0,
  carbs: 311.7
};

const COLORS = {
  protein: '#60A5FA',
  fat: '#FBBF24',
  carbs: '#34D399',
  calories: '#A78BFA'
};

export default function ComprehensiveMealPlanDashboard() {
  const [activePhase, setActivePhase] = useState<'bulking' | 'cutting'>('bulking');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'nutritional-analysis', 'daily-meals']));

  // Helper function for micronutrient color coding (90%+ = green)
  const getMicronutrientColor = (percentage: number) => {
    if (percentage >= 90) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
    if (percentage >= 50) return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const currentData = activePhase === 'bulking' ? bulkingData : cuttingData;
  const currentAverages = activePhase === 'bulking' ? bulkingAverages : cuttingAverages;
  const targetCalories = activePhase === 'bulking' ? 3200 : 2600;
  const selectedDayData = currentData.find(day => day.day === activeDay) || currentData[0];

  const macroData = [
    { name: 'Protein', value: currentAverages.protein, color: COLORS.protein },
    { name: 'Fat', value: currentAverages.fat, color: COLORS.fat },
    { name: 'Carbs', value: currentAverages.carbs, color: COLORS.carbs }
  ];

  const currentMicroData = micronutrientData[activePhase]?.[String(activeDay) as keyof typeof micronutrientData.bulking];
  const currentMeals = mealsByDay[activePhase]?.[activeDay as keyof typeof mealsByDay.bulking];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 font-['Inter']">
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActivePhase('bulking')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activePhase === 'bulking'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-white/5 text-white/70'
              }`}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              Bulk
            </button>
            <button
              onClick={() => setActivePhase('cutting')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activePhase === 'cutting'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                  : 'bg-white/5 text-white/70'
              }`}
            >
              <Target className="w-3 h-3 inline mr-1" />
              Cut
            </button>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-7 h-7 rounded text-[10px] font-bold ${
                  activeDay === day
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-white/60'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden md:flex w-16 backdrop-blur-xl bg-black/40 border-r border-white/10 flex-col items-center py-4 sticky top-0 h-screen shrink-0">
          <div className="mb-4">
            <div className="backdrop-blur-xl bg-black/30 rounded-lg p-1 border border-white/10 flex flex-col gap-1">
              <button
                onClick={() => setActivePhase('bulking')}
                className={`px-2 py-2 rounded-md text-xs font-bold transition-all duration-300 ${
                  activePhase === 'bulking'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                title="Bulking Phase"
              >
                <Zap className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setActivePhase('cutting')}
                className={`px-2 py-2 rounded-md text-xs font-bold transition-all duration-300 ${
                  activePhase === 'cutting'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                title="Cutting Phase"
              >
                <Target className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1.5 overflow-y-auto py-2">
            <div className="text-[10px] text-white/40 mb-2 font-semibold">DAYS</div>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 ${
                  activeDay === day
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg border border-white/30'
                    : 'bg-black/30 text-white/60 hover:text-white hover:bg-black/40 border border-white/10'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-2 sm:p-3 md:p-4 lg:p-6 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Header */}
            <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-white/10">
              <div className="text-center">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 sm:mb-2 tracking-tight">Comprehensive Meal Plan Analysis</h1>
                <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium">Complete nutritional breakdown with traceability for Bulking & Cutting phases</p>
              </div>
            </div>

            {/* Phase Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-3 md:p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30 shrink-0">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white/90 truncate">Avg Calories</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-black text-white">{currentAverages.calories.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-white/70">Target: {targetCalories.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-3 md:p-4 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-emerald-600/20 rounded-xl backdrop-blur-sm border border-emerald-500/30 shrink-0">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white/90 truncate">Avg Protein</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-black text-white">{currentAverages.protein}g</p>
                    <p className="text-[10px] sm:text-xs text-white/70">High protein</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-3 md:p-4 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-amber-600/20 rounded-xl backdrop-blur-sm border border-amber-500/30 shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white/90 truncate">Avg Fat</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-black text-white">{currentAverages.fat}g</p>
                    <p className="text-[10px] sm:text-xs text-white/70">{activePhase === 'bulking' ? 'For bulking' : 'For cutting'}</p>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-3 md:p-4 border border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-2.5 bg-slate-600/20 rounded-xl backdrop-blur-sm border border-slate-500/30 shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-white/90 truncate">Avg Carbs</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-black text-white">{currentAverages.carbs}g</p>
                    <p className="text-[10px] sm:text-xs text-white/70">{activePhase === 'bulking' ? 'High carb' : 'Mod carb'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Micronutrient Status for Selected Day */}
            {currentMicroData && (
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10 relative z-40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Day {activeDay} Micronutrient Analysis</h2>
                  <div className="text-xs sm:text-sm text-white/60">
                    Values shown as % of Daily Value (DV)
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Vitamin D */}
                  <MicronutrientCard 
                    name="Vitamin D ✓"
                    value={currentMicroData.vitaminD.value}
                    unit="mcg"
                    percentage={currentMicroData.vitaminD.percentage}
                    sources={(currentMicroData.vitaminD as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.vitaminD.percentage)}
                  />

                  {/* Vitamin B12 */}
                  <MicronutrientCard 
                    name="Vitamin B12"
                    value={currentMicroData.vitaminB12.value}
                    unit="mcg"
                    percentage={currentMicroData.vitaminB12.percentage}
                    sources={(currentMicroData.vitaminB12 as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.vitaminB12.percentage)}
                  />

                  {/* Iron */}
                  <MicronutrientCard 
                    name="Iron"
                    value={currentMicroData.iron.value}
                    unit="mg"
                    percentage={currentMicroData.iron.percentage}
                    sources={(currentMicroData.iron as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.iron.percentage)}
                  />

                  {/* Calcium */}
                  <MicronutrientCard 
                    name="Calcium"
                    value={currentMicroData.calcium.value}
                    unit="mg"
                    percentage={currentMicroData.calcium.percentage}
                    sources={(currentMicroData.calcium as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.calcium.percentage)}
                  />

                  {/* Vitamin C */}
                  <MicronutrientCard 
                    name="Vitamin C"
                    value={currentMicroData.vitaminC.value}
                    unit="mg"
                    percentage={currentMicroData.vitaminC.percentage}
                    sources={(currentMicroData.vitaminC as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.vitaminC.percentage)}
                  />

                  {/* Folate */}
                  <MicronutrientCard 
                    name="Folate"
                    value={currentMicroData.folate.value}
                    unit="mcg"
                    percentage={currentMicroData.folate.percentage}
                    sources={(currentMicroData.folate as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.folate.percentage)}
                  />

                  {/* Magnesium */}
                  <MicronutrientCard 
                    name="Magnesium"
                    value={currentMicroData.magnesium.value}
                    unit="mg"
                    percentage={currentMicroData.magnesium.percentage}
                    sources={(currentMicroData.magnesium as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.magnesium.percentage)}
                  />

                  {/* Zinc */}
                  <MicronutrientCard 
                    name="Zinc"
                    value={currentMicroData.zinc.value}
                    unit="mg"
                    percentage={currentMicroData.zinc.percentage}
                    sources={(currentMicroData.zinc as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.zinc.percentage)}
                  />

                  {/* Potassium */}
                  <MicronutrientCard 
                    name="Potassium"
                    value={currentMicroData.potassium.value}
                    unit="mg"
                    percentage={currentMicroData.potassium.percentage}
                    sources={(currentMicroData.potassium as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.potassium.percentage)}
                  />

                  {/* Vitamin E */}
                  <MicronutrientCard 
                    name="Vitamin E"
                    value={currentMicroData.vitaminE.value}
                    unit="mg"
                    percentage={currentMicroData.vitaminE.percentage}
                    sources={(currentMicroData.vitaminE as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.vitaminE.percentage)}
                  />

                  {/* Vitamin K */}
                  <MicronutrientCard 
                    name="Vitamin K"
                    value={currentMicroData.vitaminK.value}
                    unit="mcg"
                    percentage={currentMicroData.vitaminK.percentage}
                    sources={(currentMicroData.vitaminK as any).sources}
                    colorClasses={getMicronutrientColor(currentMicroData.vitaminK.percentage)}
                  />
                </div>
              </div>
            )}

            {/* Selected Day Overview */}
            <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Day {activeDay} - {activePhase === 'bulking' ? 'Bulking' : 'Cutting'} Phase</h2>
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">{selectedDayData.calories.toLocaleString()} cal</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70">{selectedDayData.protein}g pro • {selectedDayData.fat}g fat • {selectedDayData.carbs}g carb</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {/* Breakfast */}
                {currentMeals?.breakfast && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">8:00 AM - Breakfast</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.breakfast.name}</p>
                      {currentMeals.breakfast.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.breakfast.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-blue-300">{currentMeals.breakfast.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Lunch */}
                {currentMeals?.lunch && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">12:30 PM - Lunch</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.lunch.name}</p>
                      {currentMeals.lunch.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.lunch.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-300">{currentMeals.lunch.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Snack 1 */}
                {currentMeals?.snack1 && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">3:30 PM - Snack 1</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.snack1.name}</p>
                      {currentMeals.snack1.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.snack1.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-yellow-300">{currentMeals.snack1.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dinner */}
                {currentMeals?.dinner && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">7:00 PM - Dinner</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.dinner.name}</p>
                      {currentMeals.dinner.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.dinner.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300">{currentMeals.dinner.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Snack 2 */}
                {currentMeals?.snack2 && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">9:00 PM - Snack 2</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.snack2.name}</p>
                      {currentMeals.snack2.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.snack2.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-orange-300">{currentMeals.snack2.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Snack 3 (Bulking only) */}
                {currentMeals?.snack3 && (
                  <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-400 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">10:00 PM - Snack 3</span>
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      <p className="font-bold text-base sm:text-lg text-white mb-2">{currentMeals.snack3.name}</p>
                      {currentMeals.snack3.ingredients.map((ingredient: string, idx: number) => (
                        <p key={idx} className="text-xs sm:text-sm md:text-base">• {ingredient}</p>
                      ))}
                      {currentMeals.snack3.note && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-pink-300">{currentMeals.snack3.note}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Calorie Chart */}
            <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Daily Calorie Intake</h2>
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm md:text-base">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80">Actual</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white/30 rounded-full"></div>
                    <span className="text-white/80">Target: {targetCalories}</span>
                  </div>
                </div>
              </div>
              <div className="h-64 sm:h-72 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="day" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip
                      formatter={(value, name) => [value.toLocaleString(), name]}
                      labelFormatter={(label) => `Day ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="calories" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macro Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Macro Distribution</h3>
                <div className="h-64 sm:h-72 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}g`, '']}
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Weekly Macro Trends</h3>
                <div className="h-64 sm:h-72 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="day" stroke="#ffffff60" />
                      <YAxis stroke="#ffffff60" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '12px',
                          color: 'white'
                        }}
                      />
                      <Line type="monotone" dataKey="protein" stroke={COLORS.protein} strokeWidth={3} />
                      <Line type="monotone" dataKey="fat" stroke={COLORS.fat} strokeWidth={3} />
                      <Line type="monotone" dataKey="carbs" stroke={COLORS.carbs} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Nutritional Analysis */}
            <div className="backdrop-blur-xl bg-black/40 rounded-xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Nutritional Analysis & Recommendations</h2>
                <button
                  onClick={() => toggleSection('nutritional-analysis')}
                  className="flex items-center text-sm sm:text-base md:text-lg text-white/70 hover:text-white transition-colors"
                >
                  {expandedSections.has('nutritional-analysis') ? (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2" />
                  )}
                  <span className="text-xs sm:text-sm md:text-base">{expandedSections.has('nutritional-analysis') ? 'Hide' : 'Show'} Analysis</span>
                </button>
              </div>

              {expandedSections.has('nutritional-analysis') && (
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Phase-specific insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {activePhase === 'bulking' ? 'Bulking Phase Insights' : 'Cutting Phase Insights'}
                  </h3>
                  {activePhase === 'bulking' ? (
                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-white/90">
                      <li>• Average 3,278 calories - exceeds 3,200 target</li>
                      <li>• High protein intake (155g) for muscle growth</li>
                      <li>• High carb intake (361g) for energy and recovery</li>
                      <li>• Higher fat intake (140g) for calorie density</li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-white/90">
                      <li>• Average 2,394 calories - below 2,600 target</li>
                      <li>• High protein intake (131g) to preserve muscle</li>
                      <li>• Reduced carb intake (312g) for fat loss</li>
                      <li>• Lower fat intake (77g) for calorie reduction</li>
                    </ul>
                  )}
                </div>

                <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Critical Micronutrient Timing</h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-white/90">
                    <li>• <strong>Iron & Calcium:</strong> Wait 2+ hours between high-iron meals and dairy</li>
                    <li>• <strong>Vitamin C:</strong> Add lemon juice to dal/bean curries</li>
                    <li>• <strong>B12:</strong> Add nutritional yeast on non-egg days</li>
                    <li>• <strong>Iodine:</strong> Use iodized salt for all cooking</li>
                  </ul>
                </div>
              </div>

              {/* Optimization recommendations */}
              <div className="backdrop-blur-xl bg-black/30 rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Optimization Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">For Bulking Phase:</h4>
                    <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-white/90">
                      <li>• Increase portion sizes if below 3,200 calories</li>
                      <li>• Add healthy fats (nuts, olive oil) for extra calories</li>
                      <li>• Consider post-workout carb timing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">For Cutting Phase:</h4>
                    <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg text-white/90">
                      <li>• Add 1/2 tbsp olive oil to cooking for extra calories</li>
                      <li>• Restore removed snacks to reach 2,600 target</li>
                      <li>• Monitor protein intake to preserve muscle mass</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>

            {/* Footer */}
            <div className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl p-8 border border-white/10">
              <div className="text-center space-y-4">
                <p className="text-xl text-white/80">

                  {activePhase === 'bulking' ? 'Bulking' : 'Cutting'} phase optimization
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-lg text-emerald-400 font-semibold">💊 Supplement Note</p>
                  <p className="text-base text-white/70 mt-2">
                    Vitamin D & Omega-3 fatty acids are satisfied through daily supplementation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}