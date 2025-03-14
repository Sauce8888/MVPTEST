import React from 'react';

type StatsCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
    hover: 'hover:bg-blue-100',
    iconBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    accent: 'bg-green-500',
    hover: 'hover:bg-green-100',
    iconBg: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    accent: 'bg-purple-500',
    hover: 'hover:bg-purple-100',
    iconBg: 'bg-purple-100',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    accent: 'bg-orange-500',
    hover: 'hover:bg-orange-100',
    iconBg: 'bg-orange-100',
  },
};

const StatsCard = ({ title, value, icon, color, trend }: StatsCardProps) => {
  const { bg, text, accent, hover, iconBg } = colorClasses[color];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all duration-200 ${hover} group`}>
      {/* Accent Top Border */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent}`}></div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className={`${iconBg} p-2 rounded-lg`}>
            <div className={text}>{icon}</div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? (
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {trend.value}% from last month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 