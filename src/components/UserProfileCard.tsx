'use client';

import { User, Activity, Target, Zap } from 'lucide-react';
import { UserProfile } from '@/types/nutrition';

interface UserProfileCardProps {
  profile: UserProfile;
}

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-blue-500 p-3 rounded-full">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
          <p className="text-sm text-gray-600">Active Male, 27 years</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">BMR</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {profile.bmr.toLocaleString()} kcal
          </div>
          <div className="text-xs text-gray-500">Basal Metabolic Rate</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600">TDEE</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {profile.tdee.toLocaleString()} kcal
          </div>
          <div className="text-xs text-gray-500">Total Daily Energy</div>
        </div>
      </div>
      
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-gray-900">Daily Targets</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Protein:</span>
            <span className="font-medium">
              {profile.targets.protein.min}-{profile.targets.protein.max}g
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fat:</span>
            <span className="font-medium">{profile.targets.fat}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Carbs:</span>
            <span className="font-medium">{profile.targets.carbs}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fiber:</span>
            <span className="font-medium">
              {profile.targets.fiber.min}-{profile.targets.fiber.max}g
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
