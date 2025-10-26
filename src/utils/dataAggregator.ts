import { FoodItem, Meal, WeeklyPlan, NutritionFacts, UserProfile } from '@/types/nutrition';
import { calculateDayNutrition, calculateWeeklyAverage, getUserTargets } from './nutritionCalculator';

/**
 * Load and parse all data files
 */
export async function loadAllData() {
  try {
    const [foodReferences, meals, weeklyPlan] = await Promise.all([
      import('@/data/foodReferences.json'),
      import('@/data/meals.json'),
      import('@/data/weeklyPlan.json')
    ]);
    
    return {
      foodReferences: foodReferences.default as FoodItem[],
      meals: meals.default as Meal[],
      weeklyPlan: weeklyPlan.default as { original: WeeklyPlan; optimized: WeeklyPlan }
    };
  } catch (error) {
    console.error('Error loading data:', error);
    throw new Error('Failed to load nutrition data');
  }
}

/**
 * Get user profile with calculated BMR and TDEE
 */
export function getUserProfile(): UserProfile {
  const age = 27;
  const weight = 74; // kg
  const height = 185.4; // cm
  const bmr = 1817; // kcal/day
  const tdee = 2816; // kcal/day
  
  return {
    age,
    weight,
    height,
    bmr,
    tdee,
    targets: {
      calories: tdee,
      protein: { min: 120, max: 140 },
      fat: 94,
      saturatedFat: 25,
      carbs: 363,
      fiber: { min: 30, max: 38 },
      sodium: 2300
    }
  };
}

/**
 * Calculate daily nutrition for all days in a plan
 */
export function calculateAllDaysNutrition(
  plan: WeeklyPlan,
  meals: Meal[],
  foodDb: FoodItem[]
): Array<{ day: number; nutrition: NutritionFacts }> {
  return plan.days.map(day => ({
    day: day.day,
    nutrition: calculateDayNutrition(day, meals, foodDb)
  }));
}

/**
 * Get macro distribution percentages
 */
export function getMacroDistribution(nutrition: NutritionFacts) {
  const total = nutrition.calories;
  const proteinCalories = nutrition.protein * 4;
  const fatCalories = nutrition.fat * 9;
  const carbCalories = nutrition.carbs * 4;
  
  return {
    protein: Math.round((proteinCalories / total) * 100),
    fat: Math.round((fatCalories / total) * 100),
    carbs: Math.round((carbCalories / total) * 100)
  };
}

/**
 * Get micronutrient risk assessment
 */
export function assessMicronutrientRisks(
  plan: WeeklyPlan,
  meals: Meal[],
  foodDb: FoodItem[]
) {
  const allDays = calculateAllDaysNutrition(plan, meals, foodDb);
  
  // B12 assessment
  const b12RiskDays = allDays
    .filter(day => {
      // Days without eggs or fortified cereal are at risk
      const dayPlan = plan.days.find(d => d.day === day.day);
      if (!dayPlan) return false;
      
      const hasEggs = dayPlan.breakfast === 'six-egg-omelette';
      const hasCereal = dayPlan.breakfast === 'great-grains-cereal-milk';
      
      return !hasEggs && !hasCereal;
    })
    .map(day => day.day);
  
  // Iron assessment
  const ironInhibitors = [
    'paneer-curry',
    'greek-yogurt-2percent',
    'milk-2percent'
  ];
  
  const ironEnhancers = [
    'tomato-dal',
    'spinach-dal',
    'apple-medium',
    'banana-medium'
  ];
  
  // Zinc assessment
  const highPhytateFoods = [
    'brown-rice-cooked',
    'chickpea-curry',
    'black-bean-curry',
    'chapati-medium'
  ];
  
  return {
    b12: {
      status: b12RiskDays.length === 0 ? 'excellent' : 
             b12RiskDays.length <= 2 ? 'good' : 'deficient',
      riskDays: b12RiskDays,
      sources: ['eggs', 'fortified-cereal', 'dairy']
    },
    iron: {
      status: 'at-risk', // Always at risk due to non-heme iron
      inhibitors: ironInhibitors,
      enhancers: ironEnhancers
    },
    zinc: {
      status: 'at-risk', // High phytate content
      bioavailability: 'low'
    },
    iodine: {
      status: 'good', // Dairy and eggs provide iodine
      saltRecommendation: 'Use iodized salt for all cooking'
    }
  };
}

/**
 * Get optimization recommendations
 */
export function getOptimizationRecommendations() {
  return [
    {
      id: 'white-bread-to-whole-wheat',
      name: 'Replace White Bread with Whole Wheat',
      original: 'white-bread-slice',
      optimized: 'whole-wheat-bread-slice',
      benefits: ['Increased fiber', 'Higher protein', 'Better micronutrients'],
      impact: { protein: 4, fiber: 3 }
    },
    {
      id: 'spaghetti-to-chickpea-pasta',
      name: 'Replace Spaghetti with Chickpea Pasta',
      original: 'spaghetti-cooked',
      optimized: 'chickpea-pasta-cooked',
      benefits: ['20-25g additional protein', 'Higher fiber', 'Better satiety'],
      impact: { protein: 20, fiber: 5 }
    },
    {
      id: 'paneer-curry-to-tofu-curry',
      name: 'Replace Paneer Curry with Tofu Curry',
      original: 'paneer-curry',
      optimized: 'tofu-curry',
      benefits: ['Reduced saturated fat', 'Heart-healthy fats', 'Same protein content'],
      impact: { saturatedFat: -8, fat: -5 }
    },
    {
      id: 'potato-fry-to-air-fried',
      name: 'Replace Potato Fry with Air-Fried Potatoes',
      original: 'potato-fry',
      optimized: 'air-fried-potatoes',
      benefits: ['50% less fat', 'No inflammatory compounds', 'Same taste'],
      impact: { fat: -6, calories: -100 }
    },
    {
      id: 'grilled-cheese-to-almonds',
      name: 'Replace Grilled Cheese with Almonds',
      original: 'grilled-cheese',
      optimized: 'almonds-quarter-cup',
      benefits: ['Heart-healthy fats', 'Vitamin E', 'Reduced sodium'],
      impact: { sodium: -200, saturatedFat: -2 }
    }
  ];
}

/**
 * Format nutrition value for display
 */
export function formatNutritionValue(value: number, unit: string = 'g'): string {
  if (unit === 'kcal') {
    return Math.round(value).toString();
  }
  
  if (value >= 100) {
    return Math.round(value).toString();
  }
  
  return Math.round(value * 10) / 10 + '';
}

/**
 * Get color class for nutrient status
 */
export function getNutrientStatusColor(status: 'excellent' | 'good' | 'deficient'): string {
  switch (status) {
    case 'excellent':
      return 'text-green-600 bg-green-50';
    case 'good':
      return 'text-yellow-600 bg-yellow-50';
    case 'deficient':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Calculate progress percentage for a nutrient
 */
export function calculateProgressPercentage(actual: number, target: number): number {
  return Math.min(Math.round((actual / target) * 100), 100);
}
