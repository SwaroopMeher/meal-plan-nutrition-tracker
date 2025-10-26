'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { NutrientTrace } from '@/types/nutrition';
import { formatNutritionValue, getNutrientStatusColor } from '@/utils/dataAggregator';

interface NutrientAccordionProps {
  trace: NutrientTrace;
  level?: number;
  onSourceClick?: (url: string, sourceNumber: number) => void;
}

export default function NutrientAccordion({ 
  trace, 
  level = 0, 
  onSourceClick 
}: NutrientAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = trace.children && trace.children.length > 0;
  
  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };
  
  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trace.sourceUrl && trace.sourceNumber && onSourceClick) {
      onSourceClick(trace.sourceUrl, trace.sourceNumber);
    }
  };
  
  const getLevelStyles = () => {
    switch (level) {
      case 0:
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 1:
        return 'bg-green-50 border-green-200 text-green-900';
      case 2:
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };
  
  const getLevelIcon = () => {
    switch (trace.level) {
      case 'day':
        return '📅';
      case 'meal':
        return '🍽️';
      case 'food':
        return '🥘';
      default:
        return '📊';
    }
  };
  
  return (
    <div className={`border rounded-lg ${getLevelStyles()}`}>
      <div
        className={`p-4 cursor-pointer transition-colors hover:bg-opacity-80 ${
          hasChildren ? 'hover:bg-opacity-70' : ''
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getLevelIcon()}</span>
            <div>
              <h3 className="font-semibold text-sm">
                {trace.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold">
                  {formatNutritionValue(trace.value, trace.unit)}
                </span>
                <span className="text-sm opacity-75">{trace.unit}</span>
                {trace.sourceNumber && (
                  <button
                    onClick={handleSourceClick}
                    className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-75 transition-colors flex items-center space-x-1"
                  >
                    <span>Source {trace.sourceNumber}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {hasChildren && (
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-75">
                {trace.children?.length} items
              </span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="border-t bg-white bg-opacity-50">
          <div className="p-2 space-y-1">
            {trace.children?.map((child, index) => (
              <div key={`${child.id}-${index}`} className="ml-4">
                <NutrientAccordion
                  trace={child}
                  level={level + 1}
                  onSourceClick={onSourceClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface NutrientSummaryProps {
  label: string;
  value: number;
  unit: string;
  target?: number;
  trace: NutrientTrace;
  onTraceClick?: (trace: NutrientTrace) => void;
}

export function NutrientSummary({ 
  label, 
  value, 
  unit, 
  target, 
  trace, 
  onTraceClick 
}: NutrientSummaryProps) {
  const status = target ? 
    (value >= target * 0.9 ? 'excellent' : value >= target * 0.8 ? 'good' : 'deficient') :
    'good';
  
  const statusColor = getNutrientStatusColor(status);
  const progressPercentage = target ? Math.min((value / target) * 100, 100) : 100;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{label}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs ${statusColor}`}>
            {status}
          </span>
          {target && (
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatNutritionValue(value, unit)}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
          {target && (
            <span className="text-sm text-gray-400">
              / {formatNutritionValue(target, unit)}
            </span>
          )}
        </div>
        
        <button
          onClick={() => onTraceClick?.(trace)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Trace Sources
        </button>
      </div>
      
      {target && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'excellent' ? 'bg-green-500' :
                status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
