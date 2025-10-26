import { FoodItem, Meal, WeeklyPlan, NutritionFacts } from '@/types/nutrition';
import { calculateDayNutrition, calculateWeeklyAverage } from './nutritionCalculator';

// Table 2 data from the research document
const expectedTable2Data = [
  { day: 1, calories: 2829, protein: 106, fat: 114.7, saturatedFat: 25.1, carbs: 350.2, fiber: 47.9, sodium: 2130, cholesterol: 111 },
  { day: 2, calories: 2821, protein: 138.8, fat: 86.6, saturatedFat: 21.9, carbs: 368.5, fiber: 45.4, sodium: 2236, cholesterol: 1003 },
  { day: 3, calories: 2851, protein: 101.4, fat: 118.8, saturatedFat: 32.7, carbs: 348.6, fiber: 45.3, sodium: 2684, cholesterol: 100 },
  { day: 4, calories: 2841, protein: 140.2, fat: 94.6, saturatedFat: 19.8, carbs: 355.6, fiber: 39.8, sodium: 2056, cholesterol: 1003 },
  { day: 5, calories: 2809, protein: 98.2, fat: 81.0, saturatedFat: 12.8, carbs: 425.0, fiber: 49.3, sodium: 1984, cholesterol: 39 },
  { day: 6, calories: 2869, protein: 135.5, fat: 121.7, saturatedFat: 35.8, carbs: 303.8, fiber: 42.0, sodium: 2216, cholesterol: 1003 },
  { day: 7, calories: 2752, protein: 98.0, fat: 100.2, saturatedFat: 23.0, carbs: 363.6, fiber: 46.9, sodium: 2128, cholesterol: 81 }
];

const expectedWeeklyAverage = {
  calories: 2824,
  protein: 116.9,
  fat: 102.5,
  saturatedFat: 24.4,
  carbs: 359.3,
  fiber: 45.2,
  sodium: 2205,
  cholesterol: 477
};

export function validateCalculations(
  foodDb: FoodItem[],
  meals: Meal[],
  weeklyPlan: WeeklyPlan
): {
  isValid: boolean;
  errors: string[];
  dailyResults: Array<{ day: number; calculated: NutritionFacts; expected: any; differences: any }>;
  weeklyResult: { calculated: NutritionFacts; expected: any; differences: any };
} {
  const errors: string[] = [];
  const dailyResults: Array<{ day: number; calculated: NutritionFacts; expected: any; differences: any }> = [];
  
  // Validate daily calculations
  weeklyPlan.days.forEach(dayPlan => {
    const calculated = calculateDayNutrition(dayPlan, meals, foodDb);
    const expected = expectedTable2Data.find(d => d.day === dayPlan.day);
    
    if (!expected) {
      errors.push(`No expected data found for day ${dayPlan.day}`);
      return;
    }
    
    const differences = {
      calories: Math.abs(calculated.calories - expected.calories),
      protein: Math.abs(calculated.protein - expected.protein),
      fat: Math.abs(calculated.fat - expected.fat),
      saturatedFat: Math.abs(calculated.saturatedFat - expected.saturatedFat),
      carbs: Math.abs(calculated.carbs - expected.carbs),
      fiber: Math.abs(calculated.fiber - expected.fiber),
      sodium: Math.abs(calculated.sodium - expected.sodium),
      cholesterol: Math.abs(calculated.cholesterol - expected.cholesterol)
    };
    
    // Check for significant differences (tolerance of 5% or 10 units)
    Object.entries(differences).forEach(([nutrient, diff]) => {
      const expectedValue = expected[nutrient as keyof typeof expected];
      const tolerance = Math.max(expectedValue * 0.05, 10);
      
      if (diff > tolerance) {
        errors.push(`Day ${dayPlan.day} ${nutrient}: calculated ${calculated[nutrient as keyof NutritionFacts].toFixed(1)}, expected ${expectedValue}, difference ${diff.toFixed(1)}`);
      }
    });
    
    dailyResults.push({
      day: dayPlan.day,
      calculated,
      expected,
      differences
    });
  });
  
  // Validate weekly average
  const calculatedWeekly = calculateWeeklyAverage(weeklyPlan, meals, foodDb);
  const weeklyDifferences = {
    calories: Math.abs(calculatedWeekly.calories - expectedWeeklyAverage.calories),
    protein: Math.abs(calculatedWeekly.protein - expectedWeeklyAverage.protein),
    fat: Math.abs(calculatedWeekly.fat - expectedWeeklyAverage.fat),
    saturatedFat: Math.abs(calculatedWeekly.saturatedFat - expectedWeeklyAverage.saturatedFat),
    carbs: Math.abs(calculatedWeekly.carbs - expectedWeeklyAverage.carbs),
    fiber: Math.abs(calculatedWeekly.fiber - expectedWeeklyAverage.fiber),
    sodium: Math.abs(calculatedWeekly.sodium - expectedWeeklyAverage.sodium),
    cholesterol: Math.abs(calculatedWeekly.cholesterol - expectedWeeklyAverage.cholesterol)
  };
  
  // Check weekly average differences
  Object.entries(weeklyDifferences).forEach(([nutrient, diff]) => {
    const expectedValue = expectedWeeklyAverage[nutrient as keyof typeof expectedWeeklyAverage];
    const tolerance = Math.max(expectedValue * 0.05, 5);
    
    if (diff > tolerance) {
      errors.push(`Weekly average ${nutrient}: calculated ${calculatedWeekly[nutrient as keyof NutritionFacts].toFixed(1)}, expected ${expectedValue}, difference ${diff.toFixed(1)}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    dailyResults,
    weeklyResult: {
      calculated: calculatedWeekly,
      expected: expectedWeeklyAverage,
      differences: weeklyDifferences
    }
  };
}

export function validateFoodReferences(foodDb: FoodItem[]): {
  isValid: boolean;
  errors: string[];
  missingFoods: string[];
} {
  const errors: string[] = [];
  const missingFoods: string[] = [];
  
  // Check for required food items from the research document
  const requiredFoods = [
    'large-egg',
    'rolled-oats',
    'whey-protein',
    'greek-yogurt-2percent',
    'milk-2percent',
    'brown-rice-cooked',
    'tomato-dal',
    'potato-fry',
    'chickpea-curry',
    'spaghetti-cooked',
    'paneer-curry',
    'black-bean-curry',
    'spinach-dal',
    'mixed-vegetable-curry',
    'veg-fried-rice',
    'great-grains-cereal',
    'white-bread-slice',
    'american-cheese-slice',
    'chia-seeds',
    'walnuts-quarter-cup',
    'banana-medium',
    'apple-medium',
    'peanut-butter-tbsp',
    'pomegranate-arils',
    'chapati-medium'
  ];
  
  requiredFoods.forEach(foodId => {
    const food = foodDb.find(f => f.id === foodId);
    if (!food) {
      missingFoods.push(foodId);
      errors.push(`Missing required food item: ${foodId}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    missingFoods
  };
}

export function validateMealDefinitions(meals: Meal[], foodDb: FoodItem[]): {
  isValid: boolean;
  errors: string[];
  invalidMeals: string[];
} {
  const errors: string[] = [];
  const invalidMeals: string[] = [];
  
  meals.forEach(meal => {
    meal.components.forEach(component => {
      const food = foodDb.find(f => f.id === component.foodId);
      if (!food) {
        invalidMeals.push(meal.id);
        errors.push(`Meal ${meal.id} references non-existent food: ${component.foodId}`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    invalidMeals
  };
}

export function runFullValidation(
  foodDb: FoodItem[],
  meals: Meal[],
  weeklyPlan: WeeklyPlan
): {
  overallValid: boolean;
  foodValidation: any;
  mealValidation: any;
  calculationValidation: any;
  summary: string;
} {
  const foodValidation = validateFoodReferences(foodDb);
  const mealValidation = validateMealDefinitions(meals, foodDb);
  const calculationValidation = validateCalculations(foodDb, meals, weeklyPlan);
  
  const overallValid = foodValidation.isValid && mealValidation.isValid && calculationValidation.isValid;
  
  const summary = `
Validation Summary:
- Food References: ${foodValidation.isValid ? 'PASS' : 'FAIL'} (${foodValidation.errors.length} errors)
- Meal Definitions: ${mealValidation.isValid ? 'PASS' : 'FAIL'} (${mealValidation.errors.length} errors)
- Calculations: ${calculationValidation.isValid ? 'PASS' : 'FAIL'} (${calculationValidation.errors.length} errors)

Overall: ${overallValid ? 'ALL VALIDATIONS PASSED' : 'SOME VALIDATIONS FAILED'}
  `.trim();
  
  return {
    overallValid,
    foodValidation,
    mealValidation,
    calculationValidation,
    summary
  };
}
