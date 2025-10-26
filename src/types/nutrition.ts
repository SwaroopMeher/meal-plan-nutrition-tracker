export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  fiber: number;
  sodium: number;
  cholesterol: number;
  sourceUrl: string;
  sourceNumber: number; // Citation number
}

export interface MealComponent {
  foodId: string;
  quantity: number; // multiplier of serving size
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';
  components: MealComponent[];
}

export interface DayPlan {
  day: number;
  breakfast: string; // meal id
  lunch: string;
  dinner: string;
  snack1: string;
  snack2: string;
}

export interface WeeklyPlan {
  version: 'original' | 'optimized';
  days: DayPlan[];
  swapsApplied?: string[]; // for optimized version
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  fiber: number;
  sodium: number;
  cholesterol: number;
}

export interface NutritionTargets {
  calories: number;
  protein: { min: number; max: number };
  fat: number;
  saturatedFat: number;
  carbs: number;
  fiber: { min: number; max: number };
  sodium: number;
}

export interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  bmr: number;
  tdee: number;
  targets: NutritionTargets;
}

export interface NutrientTrace {
  level: 'day' | 'meal' | 'food';
  id: string;
  name: string;
  value: number;
  unit: string;
  children?: NutrientTrace[];
  sourceUrl?: string;
  sourceNumber?: number;
}

export interface MicronutrientStatus {
  b12: {
    status: 'excellent' | 'good' | 'deficient';
    riskDays: number[];
    sources: string[];
  };
  iron: {
    status: 'good' | 'at-risk' | 'deficient';
    inhibitors: string[];
    enhancers: string[];
  };
  zinc: {
    status: 'good' | 'at-risk' | 'deficient';
    bioavailability: 'high' | 'medium' | 'low';
  };
  iodine: {
    status: 'good' | 'at-risk' | 'deficient';
    saltRecommendation: string;
  };
}

export interface OptimizationSwap {
  id: string;
  name: string;
  original: {
    foodId: string;
    quantity: number;
  };
  optimized: {
    foodId: string;
    quantity: number;
  };
  benefits: string[];
  nutritionalImpact: Partial<NutritionFacts>;
}
