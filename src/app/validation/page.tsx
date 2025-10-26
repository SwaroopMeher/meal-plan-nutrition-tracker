'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

import { loadAllData } from '@/utils/dataAggregator';
import { runFullValidation } from '@/utils/validation';
import { FoodItem, Meal, WeeklyPlan } from '@/types/nutrition';

export default function ValidationPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    foodReferences: FoodItem[];
    meals: Meal[];
    weeklyPlan: { original: WeeklyPlan; optimized: WeeklyPlan };
  } | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  
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
  
  const runValidation = async () => {
    if (!data) return;
    
    setIsValidating(true);
    try {
      const results = runFullValidation(
        data.foodReferences,
        data.meals,
        data.weeklyPlan.original
      );
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };
  
  const getStatusColor = (isValid: boolean) => {
    return isValid 
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-red-50 border-red-200 text-red-800';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading validation data...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load data for validation</p>
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
                Data Validation
              </h1>
              <p className="text-gray-600 mt-1">
                Verify calculations against Table 2 data from research document
              </p>
            </div>
            
            <button
              onClick={runValidation}
              disabled={isValidating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isValidating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{isValidating ? 'Validating...' : 'Run Validation'}</span>
            </button>
          </div>
        </div>
        
        {/* Validation Results */}
        {validationResults && (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`border rounded-xl p-6 ${getStatusColor(validationResults.overallValid)}`}>
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(validationResults.overallValid)}
                <h2 className="text-xl font-semibold">
                  Overall Validation Status
                </h2>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {validationResults.summary}
                </pre>
              </div>
            </div>
            
            {/* Food References Validation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(validationResults.foodValidation.isValid)}
                <h3 className="text-lg font-semibold text-gray-900">Food References</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Validated {data.foodReferences.length} food items
                </p>
                {validationResults.foodValidation.errors.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      {validationResults.foodValidation.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationResults.foodValidation.missingFoods.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <h4 className="font-medium text-yellow-900 mb-2">Missing Foods:</h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      {validationResults.foodValidation.missingFoods.map((food: string, index: number) => (
                        <li key={index}>• {food}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Meal Definitions Validation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(validationResults.mealValidation.isValid)}
                <h3 className="text-lg font-semibold text-gray-900">Meal Definitions</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Validated {data.meals.length} meal definitions
                </p>
                {validationResults.mealValidation.errors.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                    <ul className="text-red-800 text-sm space-y-1">
                      {validationResults.mealValidation.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Calculation Validation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(validationResults.calculationValidation.isValid)}
                <h3 className="text-lg font-semibold text-gray-900">Nutrition Calculations</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Validated daily and weekly calculations against Table 2 data
                </p>
                
                {validationResults.calculationValidation.errors.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <h4 className="font-medium text-red-900 mb-2">Calculation Errors:</h4>
                    <ul className="text-red-800 text-sm space-y-1 max-h-40 overflow-y-auto">
                      {validationResults.calculationValidation.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Weekly Average Comparison */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Weekly Average Comparison</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(validationResults.calculationValidation.weeklyResult.differences).map(([nutrient, diff]) => (
                      <div key={nutrient} className="text-center">
                        <div className="font-medium capitalize">{nutrient}</div>
                        <div className={`px-2 py-1 rounded ${
                          (diff as number) < 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {(diff as number).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        {!validationResults && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Validation Instructions</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                This validation tool checks our nutrition calculations against the Table 2 data 
                from the research document to ensure accuracy.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">What gets validated:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• All food reference values match the source data</li>
                  <li>• Meal definitions reference valid food items</li>
                  <li>• Daily nutrition calculations match Table 2 values</li>
                  <li>• Weekly averages match expected values (2,824 kcal, 116.9g protein, etc.)</li>
                </ul>
              </div>
              <p className="text-sm">
                Click "Run Validation" to start the validation process. This may take a moment 
                as it calculates all daily and weekly nutrition values.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
