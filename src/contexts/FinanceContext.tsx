import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, FinancialSummary, TransactionFilters, FinanceContextType, RecurringTransaction } from '../types';
import { isWithinInterval, parseISO, startOfMonth, endOfMonth, addMonths, addWeeks, addYears, format, isSameMonth, isAfter } from 'date-fns';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Alimentação', color: '#EF4444', icon: '🍽️' },
  { id: '2', name: 'Transporte', color: '#3B82F6', icon: '🚗' },
  { id: '3', name: 'Lazer', color: '#8B5CF6', icon: '🎮' },
  { id: '4', name: 'Saúde', color: '#10B981', icon: '🏥' },
  { id: '5', name: 'Educação', color: '#F59E0B', icon: '📚' },
  { id: '6', name: 'Casa', color: '#6B7280', icon: '🏠' },
  { id: '7', name: 'Salário', color: '#059669', icon: '💰' },
  { id: '8', name: 'Freelance', color: '#7C3AED', icon: '💻' },
  { id: '9', name: 'Investimentos', color: '#DC2626', icon: '📈' },
  { id: '10', name: 'Outros', color: '#6B7280', icon: '📦' },
];

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem('recurringTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  useEffect(() => {
    const generateRecurringTransactions = () => {
      const now = new Date();
      const currentMonth = startOfMonth(now);
      
      recurringTransactions.forEach(recurring => {
        if (!recurring.isActive) return;
        
        const lastGenerated = recurring.lastGenerated ? parseISO(recurring.lastGenerated) : null;
        const startDate = parseISO(recurring.startDate);
        
        if (isAfter(startDate, now)) return;
        
        if (recurring.endDate && isAfter(now, parseISO(recurring.endDate))) return;
        
        let shouldGenerate = false;
        let nextDate = new Date();
        
        switch (recurring.frequency) {
          case 'monthly':
            if (!lastGenerated || !isSameMonth(lastGenerated, currentMonth)) {
              const day = recurring.dayOfMonth || new Date(startDate).getDate();
              nextDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Math.min(day, 28));
              shouldGenerate = true;
            }
            break;
          case 'weekly':
            if (!lastGenerated || (now.getTime() - lastGenerated.getTime()) >= 7 * 24 * 60 * 60 * 1000) {
              shouldGenerate = true;
            }
            break;
          case 'yearly':
            if (!lastGenerated || now.getFullYear() > lastGenerated.getFullYear()) {
              nextDate = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
              shouldGenerate = true;
            }
            break;
        }
        
        if (shouldGenerate) {
          const existingTransaction = transactions.find(t => 
            t.description === `${recurring.description} (Recorrente)` &&
            format(parseISO(t.date), 'yyyy-MM') === format(nextDate, 'yyyy-MM')
          );
          
          if (!existingTransaction) {
            const newTransaction: Transaction = {
              id: `recurring-${recurring.id}-${Date.now()}`,
              description: `${recurring.description} (Recorrente)`,
              amount: recurring.amount,
              categoryId: recurring.categoryId,
              type: recurring.type,
              date: format(nextDate, 'yyyy-MM-dd'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            setTransactions(prev => [newTransaction, ...prev]);
            
            setRecurringTransactions(prev => 
              prev.map(r => 
                r.id === recurring.id 
                  ? { ...r, lastGenerated: new Date().toISOString() }
                  : r
              )
            );
          }
        }
      });
    };
    
    generateRecurringTransactions();
    const interval = setInterval(generateRecurringTransactions, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [recurringTransactions, transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? { ...transaction, ...updatedTransaction, updatedAt: new Date().toISOString() }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getFilteredTransactions = (filters: TransactionFilters): Transaction[] => {
    return transactions.filter(transaction => {
      if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
        return false;
      }
      
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      
      if (filters.startDate && filters.endDate) {
        const transactionDate = parseISO(transaction.date);
        const start = parseISO(filters.startDate);
        const end = parseISO(filters.endDate);
        
        if (!isWithinInterval(transactionDate, { start, end })) {
          return false;
        }
      }
      
      return true;
    });
  };

  const summary: FinancialSummary = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = transactions
      .filter(t => {
        const transactionDate = parseISO(t.date);
        return t.type === 'income' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => {
        const transactionDate = parseISO(t.date);
        return t.type === 'expense' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
    };
  }, [transactions]);

  const addRecurringTransaction = (recurring: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecurring: RecurringTransaction = {
      ...recurring,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecurringTransactions(prev => [newRecurring, ...prev]);
  };

  const updateRecurringTransaction = (id: string, updatedRecurring: Partial<RecurringTransaction>) => {
    setRecurringTransactions(prev =>
      prev.map(recurring =>
        recurring.id === id
          ? { ...recurring, ...updatedRecurring, updatedAt: new Date().toISOString() }
          : recurring
      )
    );
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(recurring => recurring.id !== id));
  };

  const generateRecurringTransactions = () => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    
    recurringTransactions.forEach(recurring => {
      if (!recurring.isActive) return;
      
      const lastGenerated = recurring.lastGenerated ? parseISO(recurring.lastGenerated) : null;
      const startDate = parseISO(recurring.startDate);
      
      if (isAfter(startDate, now)) return;
      
      if (recurring.endDate && isAfter(now, parseISO(recurring.endDate))) return;
      
      let shouldGenerate = false;
      let nextDate = new Date();
      
      switch (recurring.frequency) {
        case 'monthly':
          if (!lastGenerated || !isSameMonth(lastGenerated, currentMonth)) {
            const day = recurring.dayOfMonth || new Date(startDate).getDate();
            nextDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), Math.min(day, 28));
            shouldGenerate = true;
          }
          break;
        case 'weekly':
          if (!lastGenerated || (now.getTime() - lastGenerated.getTime()) >= 7 * 24 * 60 * 60 * 1000) {
            shouldGenerate = true;
          }
          break;
        case 'yearly':
          if (!lastGenerated || now.getFullYear() > lastGenerated.getFullYear()) {
            nextDate = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());
            shouldGenerate = true;
          }
          break;
      }
      
      if (shouldGenerate) {
        const existingTransaction = transactions.find(t => 
          t.description === `${recurring.description} (Recorrente)` &&
          format(parseISO(t.date), 'yyyy-MM') === format(nextDate, 'yyyy-MM')
        );
        
        if (!existingTransaction) {
          const newTransaction: Transaction = {
            id: `recurring-${recurring.id}-${Date.now()}`,
            description: `${recurring.description} (Recorrente)`,
            amount: recurring.amount,
            categoryId: recurring.categoryId,
            type: recurring.type,
            date: format(nextDate, 'yyyy-MM-dd'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          setTransactions(prev => [newTransaction, ...prev]);
          
          setRecurringTransactions(prev => 
            prev.map(r => 
              r.id === recurring.id 
                ? { ...r, lastGenerated: new Date().toISOString() }
                : r
            )
          );
        }
      }
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        recurringTransactions,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        getFilteredTransactions,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        generateRecurringTransactions,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};