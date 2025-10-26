import { FoodItem, Meal, DayPlan, WeeklyPlan, NutritionFacts, NutrientTrace } from '@/types/nutrition';

/**
 * Calculate nutrition facts for a single food item with quantity multiplier
 */
export function calculateFoodNutrition(food: FoodItem, quantity: number): NutritionFacts {
  return {
    calories: food.calories * quantity,
    protein: food.protein * quantity,
    fat: food.fat * quantity,
    saturatedFat: food.saturatedFat * quantity,
    carbs: food.carbs * quantity,
    fiber: food.fiber * quantity,
    sodium: food.sodium * quantity,
    cholesterol: food.cholesterol * quantity,
  };
}

/**
 * Calculate nutrition facts for a meal by aggregating all food components
 */
export function calculateMealNutrition(meal: Meal, foodDb: FoodItem[]): NutritionFacts {
  const foodMap = new Map(foodDb.map(food => [food.id, food]));
  
  return meal.components.reduce((total, component) => {
    const food = foodMap.get(component.foodId);
    if (!food) {
      console.warn(`Food item ${component.foodId} not found in database`);
      return total;
    }
    
    const componentNutrition = calculateFoodNutrition(food, component.quantity);
    
    return {
      calories: total.calories + componentNutrition.calories,
      protein: total.protein + componentNutrition.protein,
      fat: total.fat + componentNutrition.fat,
      saturatedFat: total.saturatedFat + componentNutrition.saturatedFat,
      carbs: total.carbs + componentNutrition.carbs,
      fiber: total.fiber + componentNutrition.fiber,
      sodium: total.sodium + componentNutrition.sodium,
      cholesterol: total.cholesterol + componentNutrition.cholesterol,
    };
  }, {
    calories: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    cholesterol: 0,
  });
}

/**
 * Calculate nutrition facts for a full day by aggregating all meals
 */
export function calculateDayNutrition(
  day: DayPlan, 
  meals: Meal[], 
  foodDb: FoodItem[]
): NutritionFacts {
  const mealMap = new Map(meals.map(meal => [meal.id, meal]));
  
  const dayMeals = [
    day.breakfast,
    day.lunch,
    day.dinner,
    day.snack1,
    day.snack2
  ];
  
  return dayMeals.reduce((total, mealId) => {
    const meal = mealMap.get(mealId);
    if (!meal) {
      console.warn(`Meal ${mealId} not found in database`);
      return total;
    }
    
    const mealNutrition = calculateMealNutrition(meal, foodDb);
    
    return {
      calories: total.calories + mealNutrition.calories,
      protein: total.protein + mealNutrition.protein,
      fat: total.fat + mealNutrition.fat,
      saturatedFat: total.saturatedFat + mealNutrition.saturatedFat,
      carbs: total.carbs + mealNutrition.carbs,
      fiber: total.fiber + mealNutrition.fiber,
      sodium: total.sodium + mealNutrition.sodium,
      cholesterol: total.cholesterol + mealNutrition.cholesterol,
    };
  }, {
    calories: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    cholesterol: 0,
  });
}

/**
 * Calculate weekly average nutrition from a weekly plan
 */
export function calculateWeeklyAverage(
  plan: WeeklyPlan, 
  meals: Meal[], 
  foodDb: FoodItem[]
): NutritionFacts {
  const weeklyTotal = plan.days.reduce((total, day) => {
    const dayNutrition = calculateDayNutrition(day, meals, foodDb);
    
    return {
      calories: total.calories + dayNutrition.calories,
      protein: total.protein + dayNutrition.protein,
      fat: total.fat + dayNutrition.fat,
      saturatedFat: total.saturatedFat + dayNutrition.saturatedFat,
      carbs: total.carbs + dayNutrition.carbs,
      fiber: total.fiber + dayNutrition.fiber,
      sodium: total.sodium + dayNutrition.sodium,
      cholesterol: total.cholesterol + dayNutrition.cholesterol,
    };
  }, {
    calories: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    carbs: 0,
    fiber: 0,
    sodium: 0,
    cholesterol: 0,
  });
  
  const dayCount = plan.days.length;
  
  return {
    calories: Math.round(weeklyTotal.calories / dayCount),
    protein: Math.round(weeklyTotal.protein / dayCount * 10) / 10,
    fat: Math.round(weeklyTotal.fat / dayCount * 10) / 10,
    saturatedFat: Math.round(weeklyTotal.saturatedFat / dayCount * 10) / 10,
    carbs: Math.round(weeklyTotal.carbs / dayCount * 10) / 10,
    fiber: Math.round(weeklyTotal.fiber / dayCount * 10) / 10,
    sodium: Math.round(weeklyTotal.sodium / dayCount),
    cholesterol: Math.round(weeklyTotal.cholesterol / dayCount),
  };
}

/**
 * Create nutrient trace for drill-down functionality
 */
export function createNutrientTrace(
  level: 'day' | 'meal' | 'food',
  id: string,
  name: string,
  value: number,
  unit: string,
  children?: NutrientTrace[],
  sourceUrl?: string,
  sourceNumber?: number
): NutrientTrace {
  return {
    level,
    id,
    name,
    value,
    unit,
    children,
    sourceUrl,
    sourceNumber,
  };
}

/**
 * Build complete nutrient trace for a day
 */
export function buildDayNutrientTrace(
  day: DayPlan,
  meals: Meal[],
  foodDb: FoodItem[],
  nutrient: keyof NutritionFacts
): NutrientTrace {
  const mealMap = new Map(meals.map(meal => [meal.id, meal]));
  const foodMap = new Map(foodDb.map(food => [food.id, food]));
  
  const dayMeals = [
    { id: day.breakfast, type: 'Breakfast' },
    { id: day.lunch, type: 'Lunch' },
    { id: day.dinner, type: 'Dinner' },
    { id: day.snack1, type: 'Snack 1' },
    { id: day.snack2, type: 'Snack 2' }
  ];
  
  const mealTraces: NutrientTrace[] = dayMeals.map(({ id, type }) => {
    const meal = mealMap.get(id);
    if (!meal) return createNutrientTrace('meal', id, type, 0, 'g');
    
    const mealNutrition = calculateMealNutrition(meal, foodDb);
    const mealValue = mealNutrition[nutrient];
    
    const foodTraces: NutrientTrace[] = meal.components.map(component => {
      const food = foodMap.get(component.foodId);
      if (!food) return createNutrientTrace('food', component.foodId, 'Unknown', 0, 'g');
      
      const foodNutrition = calculateFoodNutrition(food, component.quantity);
      const foodValue = foodNutrition[nutrient];
      
      return createNutrientTrace(
        'food',
        component.foodId,
        `${component.quantity}x ${food.name}`,
        foodValue,
        'g',
        undefined,
        food.sourceUrl,
        food.sourceNumber
      );
    });
    
    return createNutrientTrace('meal', id, type, mealValue, 'g', foodTraces);
  });
  
  const totalValue = mealTraces.reduce((sum, trace) => sum + trace.value, 0);
  
  return createNutrientTrace(
    'day',
    `day-${day.day}`,
    `Day ${day.day}`,
    totalValue,
    'g',
    mealTraces
  );
}

/**
 * Get nutrition targets for the user profile
 */
export function getUserTargets(): NutritionFacts {
  return {
    calories: 2816,
    protein: 130, // Average of 120-140 range
    fat: 94,
    saturatedFat: 25,
    carbs: 363,
    fiber: 34, // Average of 30-38 range
    sodium: 2300,
    cholesterol: 0, // No specific target
  };
}

/**
 * Check if a nutrient value meets the target
 */
export function checkNutrientStatus(
  actual: number, 
  target: number, 
  tolerance: number = 0.1
): 'excellent' | 'good' | 'deficient' {
  const ratio = actual / target;
  
  if (ratio >= 1 - tolerance) return 'excellent';
  if (ratio >= 0.8) return 'good';
  return 'deficient';
}
