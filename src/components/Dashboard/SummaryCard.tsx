import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'gray';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  const bgColorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    gray: 'bg-gray-50 dark:bg-gray-900/20',
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${bgColorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(amount)}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;