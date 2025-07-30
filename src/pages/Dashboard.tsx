import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import SummaryCard from '../components/Dashboard/SummaryCard';
import SimpleChart from '../components/Dashboard/SimpleChart';
import ExpensesPieChart from '../components/Dashboard/ExpensesPieChart';
import IncomeVsExpensesChart from '../components/Dashboard/IncomeVsExpensesChart';
import BalanceEvolutionChart from '../components/Dashboard/BalanceEvolutionChart';

const Dashboard: React.FC = () => {
  const { summary } = useFinance();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das suas finanças pessoais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Saldo Total"
          amount={summary.balance}
          icon={Wallet}
          color={summary.balance >= 0 ? 'blue' : 'red'}
        />
        <SummaryCard
          title="Receitas do Mês"
          amount={summary.monthlyIncome}
          icon={TrendingUp}
          color="green"
        />
        <SummaryCard
          title="Despesas do Mês"
          amount={summary.monthlyExpenses}
          icon={TrendingDown}
          color="red"
        />
        <SummaryCard
          title="Total de Receitas"
          amount={summary.totalIncome}
          icon={DollarSign}
          color="gray"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesPieChart />
        <IncomeVsExpensesChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BalanceEvolutionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          income={summary.monthlyIncome} 
          expenses={summary.monthlyExpenses} 
        />
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumo Geral
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Receitas:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                R$ {summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total de Despesas:</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                R$ {summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
              <span className="font-semibold text-gray-900 dark:text-white">Saldo Total:</span>
              <span className={`font-bold text-lg ${
                summary.balance >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;