'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

import { loadAllData, getOptimizationRecommendations, calculateAllDaysNutrition } from '@/utils/dataAggregator';
import { calculateWeeklyAverage } from '@/utils/nutritionCalculator';
import { FoodItem, Meal, WeeklyPlan, NutritionFacts } from '@/types/nutrition';

export default function OptimizationsPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    foodReferences: FoodItem[];
    meals: Meal[];
    weeklyPlan: { original: WeeklyPlan; optimized: WeeklyPlan };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const originalNutrition = useMemo(() => {
    if (!data) return null;
    return calculateWeeklyAverage(data.weeklyPlan.original, data.meals, data.foodReferences);
  }, [data]);
  
  const optimizedNutrition = useMemo(() => {
    if (!data) return null;
    return calculateWeeklyAverage(data.weeklyPlan.optimized, data.meals, data.foodReferences);
  }, [data]);
  
  const optimizationRecommendations = useMemo(() => {
    return getOptimizationRecommendations();
  }, []);
  
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-gray-500" />;
  };
  
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading optimization data...</p>
        </div>
      </div>
    );
  }
  
  if (!data || !originalNutrition || !optimizedNutrition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load optimization data</p>
        </div>
      </div>
    );
  }
  
  const nutritionChanges = {
    calories: optimizedNutrition.calories - originalNutrition.calories,
    protein: optimizedNutrition.protein - originalNutrition.protein,
    fat: optimizedNutrition.fat - originalNutrition.fat,
    saturatedFat: optimizedNutrition.saturatedFat - originalNutrition.saturatedFat,
    carbs: optimizedNutrition.carbs - originalNutrition.carbs,
    fiber: optimizedNutrition.fiber - originalNutrition.fiber,
    sodium: optimizedNutrition.sodium - originalNutrition.sodium,
    cholesterol: optimizedNutrition.cholesterol - originalNutrition.cholesterol,
  };
  
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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Optimization Recommendations
            </h1>
            <p className="text-gray-600 mt-1">
              Health improvements and nutritional enhancements for your meal plan
            </p>
          </div>
        </div>
        
        {/* Overview Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Nutritional Impact Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(nutritionChanges).map(([nutrient, change]) => (
              <div key={nutrient} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {getChangeIcon(change)}
                  <span className="font-medium capitalize">{nutrient}</span>
                </div>
                <div className={`px-3 py-2 rounded-lg ${getChangeColor(change)}`}>
                  <div className="text-lg font-bold">
                    {change > 0 ? '+' : ''}{change.toFixed(1)}
                  </div>
                  <div className="text-xs">
                    {nutrient === 'calories' ? 'kcal' : 
                     nutrient === 'saturatedFat' ? 'g sat fat' : 'g'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Detailed Optimizations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Specific Optimizations</h2>
          
          {optimizationRecommendations.map((optimization, index) => (
            <div key={optimization.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-900">{optimization.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Before */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Before (Original)</span>
                  </h4>
                  <div className="text-red-800 text-sm">
                    <p className="font-medium">{optimization.original}</p>
                    <p className="mt-1 opacity-75">High sodium, saturated fat, or low protein</p>
                  </div>
                </div>
                
                {/* After */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>After (Optimized)</span>
                  </h4>
                  <div className="text-green-800 text-sm">
                    <p className="font-medium">{optimization.optimized}</p>
                    <p className="mt-1 opacity-75">Heart-healthy, higher protein, better nutrition</p>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Benefits</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  {optimization.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Nutritional Impact */}
              {optimization.impact && (
                <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Nutritional Impact</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {Object.entries(optimization.impact).map(([nutrient, change]) => (
                      <div key={nutrient} className="text-center">
                        <div className={`px-2 py-1 rounded ${
                          change > 0 ? 'bg-green-100 text-green-700' : 
                          change < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {change > 0 ? '+' : ''}{change}g {nutrient}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Health Impact Summary */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Health Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Cardiovascular Health</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduced saturated fat intake</li>
                <li>• Lower sodium consumption</li>
                <li>• Heart-healthy fats from nuts</li>
                <li>• Reduced processed foods</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Protein Optimization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Higher protein density meals</li>
                <li>• Complete amino acid profiles</li>
                <li>• Better muscle protein synthesis</li>
                <li>• Improved satiety</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Micronutrient Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Increased fiber intake</li>
                <li>• Better iron absorption</li>
                <li>• Enhanced vitamin content</li>
                <li>• Reduced anti-nutrients</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Implementation Guide */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Implementation Guide</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Shopping List Updates</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Replace white bread with whole wheat bread</li>
                <li>• Switch to chickpea or lentil pasta</li>
                <li>• Use firm tofu instead of paneer</li>
                <li>• Get an air fryer for healthier potatoes</li>
                <li>• Stock up on raw almonds</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Cooking Modifications</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Use iodized salt for all cooking</li>
                <li>• Add lemon juice to dal and bean dishes</li>
                <li>• Soak legumes overnight before cooking</li>
                <li>• Separate calcium-rich foods from iron meals</li>
                <li>• Include more vegetables in curries</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Timing Considerations</h3>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Wait 2+ hours between dairy and iron-rich meals</li>
                <li>• Consume Vitamin C with iron sources</li>
                <li>• Plan B12 sources for non-egg days</li>
                <li>• Consider meal prep for consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
