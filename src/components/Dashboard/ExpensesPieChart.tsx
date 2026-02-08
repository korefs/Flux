import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from 'date-fns';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';

const ExpensesPieChart: React.FC = () => {
  const { transactions, categories } = useFinance();

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const expensesData = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyExpenses = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    const categoryTotals = monthlyExpenses.reduce((acc, transaction) => {
      const category = getCategoryById(transaction.categoryId);
      const categoryName = category?.name || 'Outros';
      const categoryColor = category?.color || '#6B7280';
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: categoryColor,
          count: 0,
        };
      }
      
      acc[categoryName].value += transaction.amount;
      acc[categoryName].count += 1;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string; count: number }>);

    return Object.values(categoryTotals).sort((a, b) => b.value - a.value);
    // eslint-disable-next-line
  }, [transactions, categories]);

  const totalExpenses = expensesData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-red-600 dark:text-red-400">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {percentage}% do total • {data.count} transação{data.count !== 1 ? 'ões' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  // eslint-disable-next-line
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (expensesData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gastos por Categoria
        </h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-center">
            Nenhuma despesa encontrada neste mês
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Gastos por Categoria
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total do mês</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expensesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {expensesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {expensesData.slice(0, 5).map((category, index) => {
          const percentage = ((category.value / totalExpenses) * 100).toFixed(1);
          return (
            <div key={category.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 dark:text-gray-400">
                  {percentage}%
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
        {expensesData.length > 5 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            E mais {expensesData.length - 5} categoria{expensesData.length - 5 !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpensesPieChart;