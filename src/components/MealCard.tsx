'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Utensils } from 'lucide-react';
import { Meal, NutritionFacts, FoodItem } from '@/types/nutrition';
import { calculateMealNutrition, buildDayNutrientTrace } from '@/utils/nutritionCalculator';
import { formatNutritionValue } from '@/utils/dataAggregator';
import NutrientAccordion from './NutrientAccordion';

interface MealCardProps {
  meal: Meal;
  nutrition: NutritionFacts;
  foodDb: FoodItem[];
  onNutrientTrace?: (trace: any) => void;
}

export default function MealCard({ 
  meal, 
  nutrition, 
  foodDb, 
  onNutrientTrace 
}: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🌞';
      case 'dinner':
        return '🌙';
      case 'snack1':
        return '🍎';
      case 'snack2':
        return '🥜';
      default:
        return '🍽️';
    }
  };
  
  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'lunch':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'dinner':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'snack1':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'snack2':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };
  
  return (
    <div className={`border rounded-lg ${getMealTypeColor(meal.type)}`}>
      <div
        className="p-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMealTypeIcon(meal.type)}</span>
            <div>
              <h3 className="font-semibold capitalize">
                {meal.type === 'snack1' ? 'Snack 1' : 
                 meal.type === 'snack2' ? 'Snack 2' : meal.type}
              </h3>
              <p className="text-sm opacity-75">{meal.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-bold">
                {formatNutritionValue(nutrition.calories, 'kcal')}
              </div>
              <div className="text-xs opacity-75">calories</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-75">
                {meal.components.length} items
              </span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t bg-white bg-opacity-50">
          <div className="p-4 space-y-4">
            {/* Nutrition Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {formatNutritionValue(nutrition.protein, 'g')}
                </div>
                <div className="text-xs text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">
                  {formatNutritionValue(nutrition.fat, 'g')}
                </div>
                <div className="text-xs text-gray-600">Fat</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {formatNutritionValue(nutrition.carbs, 'g')}
                </div>
                <div className="text-xs text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {formatNutritionValue(nutrition.fiber, 'g')}
                </div>
                <div className="text-xs text-gray-600">Fiber</div>
              </div>
            </div>
            
            {/* Food Components */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Food Components</h4>
              <div className="space-y-2">
                {meal.components.map((component, index) => {
                  const food = foodDb.find(f => f.id === component.foodId);
                  if (!food) return null;
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-white bg-opacity-50 rounded p-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🥘</span>
                        <span className="text-sm font-medium">
                          {component.quantity}x {food.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatNutritionValue(food.calories * component.quantity, 'kcal')} kcal
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Trace Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const trace = buildDayNutrientTrace(
                    { day: 1, breakfast: meal.id, lunch: '', dinner: '', snack1: '', snack2: '' },
                    [meal],
                    foodDb,
                    'calories'
                  );
                  onNutrientTrace?.(trace);
                }}
                className="w-full text-center py-2 px-4 bg-white bg-opacity-75 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Trace Nutrition Sources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
