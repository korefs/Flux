import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface SimpleChartProps {
  income: number;
  expenses: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ income, expenses }) => {
  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;
  const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Receitas vs Despesas (Este Mês)
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="text-green-500 mr-2" size={20} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Receitas</span>
          </div>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(income)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${incomePercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingDown className="text-red-500 mr-2" size={20} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Despesas</span>
          </div>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">
            {formatCurrency(expenses)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-red-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${expensesPercentage}%` }}
          />
        </div>
      </div>
      
      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Saldo do Mês:
            </span>
            <span className={`text-lg font-bold ${
              income - expenses >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(income - expenses)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleChart;