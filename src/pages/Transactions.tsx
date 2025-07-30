import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinance } from '../contexts/FinanceContext';
import { TransactionFilters as FilterType } from '../types';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionTable from '../components/Transactions/TransactionTable';

const Transactions: React.FC = () => {
  const { getFilteredTransactions } = useFinance();
  const [filters, setFilters] = useState<FilterType>({});

  const filteredTransactions = useMemo(() => {
    return getFilteredTransactions(filters);
  }, [getFilteredTransactions, filters]);

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      return transaction.type === 'income' 
        ? sum + transaction.amount 
        : sum - transaction.amount;
    }, 0);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todas as suas receitas e despesas
          </p>
        </div>
        
        <Link
          to="/add-transaction"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Transação
        </Link>
      </div>

      <TransactionFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredTransactions.length} transações encontradas
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total: </span>
            <span className={`text-lg font-bold ${
              totalAmount >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {totalAmount >= 0 ? '+' : ''} R$ {Math.abs(totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};

export default Transactions;