'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface PlanToggleProps {
  currentPlan: 'original' | 'optimized';
  onPlanChange: (plan: 'original' | 'optimized') => void;
  isLoading?: boolean;
}

export default function PlanToggle({ 
  currentPlan, 
  onPlanChange, 
  isLoading = false 
}: PlanToggleProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Meal Plan Version</h3>
        {isLoading && (
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={() => onPlanChange('original')}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            currentPlan === 'original'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              currentPlan === 'original' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <span className="font-medium">Original Plan</span>
          </div>
          <p className="text-sm mt-1 opacity-75">
            As specified in research document
          </p>
        </button>
        
        <button
          onClick={() => onPlanChange('optimized')}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            currentPlan === 'optimized'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-4 h-4 ${
              currentPlan === 'optimized' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="font-medium">Optimized Plan</span>
          </div>
          <p className="text-sm mt-1 opacity-75">
            With health improvements applied
          </p>
        </button>
      </div>
      
      {currentPlan === 'optimized' && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Optimizations Applied:</span>
          </div>
          <ul className="text-sm text-green-600 mt-2 space-y-1">
            <li>• Whole wheat bread instead of white bread</li>
            <li>• Chickpea pasta instead of regular spaghetti</li>
            <li>• Tofu curry instead of paneer curry</li>
            <li>• Air-fried potatoes instead of pan-fried</li>
            <li>• Almonds instead of grilled cheese snacks</li>
          </ul>
        </div>
      )}
    </div>
  );
}
