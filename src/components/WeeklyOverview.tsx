'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { NutritionFacts } from '@/types/nutrition';
import { formatNutritionValue, getMacroDistribution } from '@/utils/dataAggregator';

interface WeeklyOverviewProps {
  dailyNutrition: Array<{ day: number; nutrition: NutritionFacts }>;
  weeklyAverage: NutritionFacts;
  targets: NutritionFacts;
}

export default function WeeklyOverview({ 
  dailyNutrition, 
  weeklyAverage, 
  targets 
}: WeeklyOverviewProps) {
  const chartData = dailyNutrition.map(({ day, nutrition }) => ({
    day: `Day ${day}`,
    calories: Math.round(nutrition.calories),
    protein: Math.round(nutrition.protein),
    fat: Math.round(nutrition.fat),
    carbs: Math.round(nutrition.carbs),
    target: Math.round(targets.calories)
  }));
  
  const macroDistribution = getMacroDistribution(weeklyAverage);
  const pieData = [
    { name: 'Protein', value: macroDistribution.protein, color: '#3B82F6' },
    { name: 'Fat', value: macroDistribution.fat, color: '#F59E0B' },
    { name: 'Carbs', value: macroDistribution.carbs, color: '#10B981' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Daily Calories Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Calorie Intake</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} kcal`, 
                  name === 'calories' ? 'Actual' : 'Target'
                ]}
              />
              <Bar dataKey="calories" fill="#3B82F6" name="calories" />
              <Bar dataKey="target" fill="#E5E7EB" name="target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Macro Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Macro Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Calories:</span>
              <span className="font-semibold text-lg">
                {formatNutritionValue(weeklyAverage.calories, 'kcal')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Protein:</span>
              <span className="font-semibold text-lg">
                {formatNutritionValue(weeklyAverage.protein, 'g')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Fat:</span>
              <span className="font-semibold text-lg">
                {formatNutritionValue(weeklyAverage.fat, 'g')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Carbs:</span>
              <span className="font-semibold text-lg">
                {formatNutritionValue(weeklyAverage.carbs, 'g')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Target Achievement */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Achievement</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((weeklyAverage.calories / targets.calories) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((weeklyAverage.protein / targets.protein) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round((weeklyAverage.fat / targets.fat) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((weeklyAverage.carbs / targets.carbs) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
