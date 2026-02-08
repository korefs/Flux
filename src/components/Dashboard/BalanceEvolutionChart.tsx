import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';

const BalanceEvolutionChart: React.FC = () => {
  const { transactions } = useFinance();

  const evolutionData = React.useMemo(() => {
    const months = [];
    const now = new Date();
    let cumulativeBalance = 0;
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthBalance = monthIncome - monthExpenses;
      cumulativeBalance += monthBalance;
      
      months.push({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        fullMonth: format(monthDate, 'MMMM yyyy', { locale: ptBR }),
        monthlyIncome: monthIncome,
        monthlyExpenses: monthExpenses,
        monthlyBalance: monthBalance,
        cumulativeBalance: cumulativeBalance,
        transactionCount: monthTransactions.length,
      });
    }
    
    return months;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
            {data.fullMonth}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Saldo Acumulado:</span>
              <span className={`font-bold ${
                data.cumulativeBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                R$ {data.cumulativeBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Movimento do Mês:</span>
              <span className={`font-medium ${
                data.monthlyBalance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {data.monthlyBalance >= 0 ? '+' : ''}R$ {data.monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Transações:</span>
              <span>{data.transactionCount}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const currentBalance = evolutionData[evolutionData.length - 1]?.cumulativeBalance || 0;
  const previousBalance = evolutionData[evolutionData.length - 2]?.cumulativeBalance || 0;
  const balanceChange = currentBalance - previousBalance;
  const hasPositiveTrend = balanceChange >= 0;

  const bestMonth = evolutionData.reduce((best, current) => 
    current.monthlyBalance > best.monthlyBalance ? current : best
  , evolutionData[0] || { monthlyBalance: 0, fullMonth: '' });

  const worstMonth = evolutionData.reduce((worst, current) => 
    current.monthlyBalance < worst.monthlyBalance ? current : worst
  , evolutionData[0] || { monthlyBalance: 0, fullMonth: '' });

  if (evolutionData.every(d => d.cumulativeBalance === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Evolução do Saldo (12 meses)
        </h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-center">
            Nenhuma transação encontrada nos últimos 12 meses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evolução do Saldo (12 meses)
        </h3>
        <div className="flex items-center gap-2 text-sm">
          {hasPositiveTrend ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}
          <span className={`font-medium ${
            hasPositiveTrend ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {hasPositiveTrend ? '+' : ''}R$ {balanceChange.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={evolutionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={currentBalance >= 0 ? "#10B981" : "#EF4444"} 
                  stopOpacity={0.8}
                />
                <stop 
                  offset="95%" 
                  stopColor={currentBalance >= 0 ? "#10B981" : "#EF4444"} 
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulativeBalance"
              stroke={currentBalance >= 0 ? "#10B981" : "#EF4444"}
              fillOpacity={1}
              fill="url(#balanceGradient)"
              strokeWidth={3}
              dot={{ r: 4, fill: currentBalance >= 0 ? "#10B981" : "#EF4444" }}
              activeDot={{ r: 6, fill: currentBalance >= 0 ? "#10B981" : "#EF4444" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-700 dark:text-blue-300 font-medium">Saldo Atual</p>
          <p className={`text-lg font-bold ${
            currentBalance >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-700 dark:text-green-300 font-medium">Melhor Mês</p>
          <p className="text-xs text-green-600 dark:text-green-400 mb-1 capitalize">
            {bestMonth.fullMonth}
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            +R$ {bestMonth.monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-700 dark:text-red-300 font-medium">Pior Mês</p>
          <p className="text-xs text-red-600 dark:text-red-400 mb-1 capitalize">
            {worstMonth.fullMonth}
          </p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            R$ {worstMonth.monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceEvolutionChart;