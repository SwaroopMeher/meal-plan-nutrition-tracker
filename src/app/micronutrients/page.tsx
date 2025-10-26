'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';

import { loadAllData, assessMicronutrientRisks } from '@/utils/dataAggregator';
import { FoodItem, Meal, WeeklyPlan, MicronutrientStatus } from '@/types/nutrition';

export default function MicronutrientsPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    foodReferences: FoodItem[];
    meals: Meal[];
    weeklyPlan: { original: WeeklyPlan; optimized: WeeklyPlan };
  } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'original' | 'optimized'>('original');
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
  
  const currentPlanData = useMemo(() => {
    if (!data) return null;
    return currentPlan === 'original' ? data.weeklyPlan.original : data.weeklyPlan.optimized;
  }, [data, currentPlan]);
  
  const micronutrientRisks = useMemo(() => {
    if (!data || !currentPlanData) return null;
    return assessMicronutrientRisks(currentPlanData, data.meals, data.foodReferences);
  }, [data, currentPlanData]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'deficient':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'good':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'at-risk':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'deficient':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading micronutrient analysis...</p>
        </div>
      </div>
    );
  }
  
  if (!data || !micronutrientRisks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load micronutrient data</p>
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
                Micronutrient Analysis
              </h1>
              <p className="text-gray-600 mt-1">
                Assessment of B12, Iron, Zinc, and Iodine status with optimization recommendations
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
        
        {/* Micronutrient Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* B12 Status */}
          <div className={`border rounded-xl p-6 ${getStatusColor(micronutrientRisks.b12.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(micronutrientRisks.b12.status)}
              <h3 className="text-lg font-semibold">Vitamin B12</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                Status: <span className="font-medium capitalize">{micronutrientRisks.b12.status}</span>
              </div>
              {micronutrientRisks.b12.riskDays.length > 0 && (
                <div className="text-sm">
                  Risk days: {micronutrientRisks.b12.riskDays.join(', ')}
                </div>
              )}
              <div className="text-sm">
                Sources: {micronutrientRisks.b12.sources.join(', ')}
              </div>
            </div>
          </div>
          
          {/* Iron Status */}
          <div className={`border rounded-xl p-6 ${getStatusColor(micronutrientRisks.iron.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(micronutrientRisks.iron.status)}
              <h3 className="text-lg font-semibold">Iron</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                Status: <span className="font-medium capitalize">{micronutrientRisks.iron.status}</span>
              </div>
              <div className="text-sm">
                Type: Non-heme iron only
              </div>
              <div className="text-sm">
                Inhibitors: {micronutrientRisks.iron.inhibitors.length} foods
              </div>
              <div className="text-sm">
                Enhancers: {micronutrientRisks.iron.enhancers.length} foods
              </div>
            </div>
          </div>
          
          {/* Zinc Status */}
          <div className={`border rounded-xl p-6 ${getStatusColor(micronutrientRisks.zinc.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(micronutrientRisks.zinc.status)}
              <h3 className="text-lg font-semibold">Zinc</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                Status: <span className="font-medium capitalize">{micronutrientRisks.zinc.status}</span>
              </div>
              <div className="text-sm">
                Bioavailability: <span className="font-medium capitalize">{micronutrientRisks.zinc.bioavailability}</span>
              </div>
              <div className="text-sm">
                Issue: High phytate content
              </div>
            </div>
          </div>
          
          {/* Iodine Status */}
          <div className={`border rounded-xl p-6 ${getStatusColor(micronutrientRisks.iodine.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(micronutrientRisks.iodine.status)}
              <h3 className="text-lg font-semibold">Iodine</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                Status: <span className="font-medium capitalize">{micronutrientRisks.iodine.status}</span>
              </div>
              <div className="text-sm">
                Sources: Dairy, eggs
              </div>
              <div className="text-sm">
                Recommendation: {micronutrientRisks.iodine.saltRecommendation}
              </div>
            </div>
          </div>
        </div>
        
        {/* Optimization Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Optimization Recommendations</h2>
          
          {/* B12 Optimization */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Vitamin B12 Optimization</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Current Status</h4>
                <p className="text-blue-800 text-sm">
                  B12 intake is {micronutrientRisks.b12.status} on most days. 
                  {micronutrientRisks.b12.riskDays.length > 0 && 
                    ` Risk days: ${micronutrientRisks.b12.riskDays.join(', ')}.`
                  }
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Recommendations</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• On days without eggs or fortified cereal, add fortified nutritional yeast</li>
                  <li>• Consider B12 supplement on risk days</li>
                  <li>• Ensure adequate dairy intake (yogurt, milk)</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Iron Optimization */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Iron Absorption Optimization</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Current Issues</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Only non-heme iron sources (lower bioavailability)</li>
                  <li>• High calcium intake inhibits iron absorption</li>
                  <li>• Phytates in legumes and grains bind iron</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Optimization Strategies</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Separate high-calcium foods (yogurt, milk) from iron-rich meals by 2+ hours</li>
                  <li>• Add lemon juice to all dal and bean dishes for Vitamin C</li>
                  <li>• Include bell peppers and tomatoes with iron-rich meals</li>
                  <li>• Soak legumes overnight before cooking to reduce phytates</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Zinc Optimization */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Zinc Bioavailability</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Current Status</h4>
                <p className="text-yellow-800 text-sm">
                  Zinc bioavailability is {micronutrientRisks.zinc.bioavailability} due to high phytate content 
                  in legumes and whole grains.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Improvement Strategies</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Choose leavened bread over unleavened chapati when possible</li>
                  <li>• Soak dried legumes overnight before cooking</li>
                  <li>• Include zinc-rich foods: nuts, seeds, dairy</li>
                  <li>• Consider zinc supplement if needed</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Iodine Optimization */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Iodine Intake</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Current Status</h4>
                <p className="text-green-800 text-sm">
                  Iodine status is {micronutrientRisks.iodine.status} due to adequate dairy and egg intake.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Critical Recommendation</h4>
                <p className="text-blue-800 text-sm">
                  <strong>Use iodized salt for all home cooking.</strong> This is the most important 
                  intervention to prevent iodine deficiency on a vegetarian diet.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Calendar */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Risk Assessment</h3>
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map(day => {
              const isB12Risk = micronutrientRisks.b12.riskDays.includes(day);
              const riskLevel = isB12Risk ? 'high' : 'low';
              
              return (
                <div key={day} className={`p-3 rounded-lg text-center ${
                  riskLevel === 'high' 
                    ? 'bg-red-50 border border-red-200 text-red-700' 
                    : 'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  <div className="font-medium">Day {day}</div>
                  <div className="text-xs mt-1">
                    {riskLevel === 'high' ? 'B12 Risk' : 'Good'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
