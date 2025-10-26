'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react';

import MealCard from '@/components/MealCard';
import NutrientAccordion, { NutrientSummary } from '@/components/NutrientAccordion';

import { loadAllData, getUserProfile } from '@/utils/dataAggregator';
import { calculateDayNutrition, buildDayNutrientTrace } from '@/utils/nutritionCalculator';
import { FoodItem, Meal, WeeklyPlan, NutritionFacts, NutrientTrace } from '@/types/nutrition';

export default function DayView() {
  const params = useParams();
  const router = useRouter();
  const dayId = parseInt(params.id as string);
  
  const [data, setData] = useState<{
    foodReferences: FoodItem[];
    meals: Meal[];
    weeklyPlan: { original: WeeklyPlan; optimized: WeeklyPlan };
  } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'original' | 'optimized'>('original');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientTrace | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadAllData();
        setData(loadedData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const userProfile = useMemo(() => getUserProfile(), []);
  
  const currentPlanData = useMemo(() => {
    if (!data) return null;
    return currentPlan === 'original' ? data.weeklyPlan.original : data.weeklyPlan.optimized;
  }, [data, currentPlan]);
  
  const dayData = useMemo(() => {
    if (!currentPlanData || !data) return null;
    return currentPlanData.days.find(d => d.day === dayId);
  }, [currentPlanData, dayId]);
  
  const dayNutrition = useMemo(() => {
    if (!dayData || !data) return null;
    return calculateDayNutrition(dayData, data.meals, data.foodReferences);
  }, [dayData, data]);
  
  const dayMeals = useMemo(() => {
    if (!dayData || !data) return [];
    const mealMap = new Map(data.meals.map(meal => [meal.id, meal]));
    return [
      { meal: mealMap.get(dayData.breakfast), type: 'breakfast' },
      { meal: mealMap.get(dayData.lunch), type: 'lunch' },
      { meal: mealMap.get(dayData.dinner), type: 'dinner' },
      { meal: mealMap.get(dayData.snack1), type: 'snack1' },
      { meal: mealMap.get(dayData.snack2), type: 'snack2' }
    ].filter(({ meal }) => meal !== undefined);
  }, [dayData, data]);
  
  const handleNutrientTrace = (nutrient: keyof NutritionFacts) => {
    if (!data || !dayData) return;
    
    const trace = buildDayNutrientTrace(dayData, data.meals, data.foodReferences, nutrient);
    setSelectedNutrient(trace);
  };
  
  const handleSourceClick = (url: string, sourceNumber: number) => {
    window.open(url, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading day data...</p>
        </div>
      </div>
    );
  }
  
  if (!data || !dayData || !dayNutrition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Day not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Day {dayId} - {currentPlan === 'original' ? 'Original' : 'Optimized'} Plan
              </h1>
              <p className="text-gray-600 mt-1">
                Detailed breakdown of all meals and nutrition
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPlan('original')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPlan === 'original'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setCurrentPlan('optimized')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPlan === 'optimized'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Optimized
              </button>
            </div>
          </div>
        </div>
        
        {/* Daily Summary */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Nutrition Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NutrientSummary
              label="Calories"
              value={dayNutrition.calories}
              unit="kcal"
              target={userProfile.targets.calories}
              trace={buildDayNutrientTrace(dayData, data.meals, data.foodReferences, 'calories')}
              onTraceClick={() => handleNutrientTrace('calories')}
            />
            <NutrientSummary
              label="Protein"
              value={dayNutrition.protein}
              unit="g"
              target={userProfile.targets.protein.max}
              trace={buildDayNutrientTrace(dayData, data.meals, data.foodReferences, 'protein')}
              onTraceClick={() => handleNutrientTrace('protein')}
            />
            <NutrientSummary
              label="Fat"
              value={dayNutrition.fat}
              unit="g"
              target={userProfile.targets.fat}
              trace={buildDayNutrientTrace(dayData, data.meals, data.foodReferences, 'fat')}
              onTraceClick={() => handleNutrientTrace('fat')}
            />
            <NutrientSummary
              label="Carbs"
              value={dayNutrition.carbs}
              unit="g"
              target={userProfile.targets.carbs}
              trace={buildDayNutrientTrace(dayData, data.meals, data.foodReferences, 'carbs')}
              onTraceClick={() => handleNutrientTrace('carbs')}
            />
          </div>
        </div>
        
        {/* Meals */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Meals</h2>
          <div className="space-y-4">
            {dayMeals.map(({ meal, type }, index) => {
              if (!meal) return null;
              
              const mealNutrition = calculateDayNutrition(
                { day: dayId, breakfast: meal.id, lunch: '', dinner: '', snack1: '', snack2: '' },
                [meal],
                data.foodReferences
              );
              
              return (
                <MealCard
                  key={`${meal.id}-${index}`}
                  meal={meal}
                  nutrition={mealNutrition}
                  foodDb={data.foodReferences}
                  onNutrientTrace={setSelectedNutrient}
                />
              );
            })}
          </div>
        </div>
        
        {/* Additional Nutrition Details */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Nutrition Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dayNutrition.saturatedFat.toFixed(1)}g
              </div>
              <div className="text-sm text-gray-600">Saturated Fat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dayNutrition.fiber.toFixed(1)}g
              </div>
              <div className="text-sm text-gray-600">Fiber</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dayNutrition.sodium.toFixed(0)}mg
              </div>
              <div className="text-sm text-gray-600">Sodium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {dayNutrition.cholesterol.toFixed(0)}mg
              </div>
              <div className="text-sm text-gray-600">Cholesterol</div>
            </div>
          </div>
        </div>
        
        {/* Nutrient Trace Modal */}
        {selectedNutrient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Nutrient Traceability</h3>
                  <button
                    onClick={() => setSelectedNutrient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <NutrientAccordion 
                  trace={selectedNutrient}
                  onSourceClick={handleSourceClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
