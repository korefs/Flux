export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface TransactionFilters {
  search?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'all';
  startDate?: string;
  endDate?: string;
}

export interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  type: 'income' | 'expense';
  frequency: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  recurringTransactions: RecurringTransaction[];
  summary: FinancialSummary;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getFilteredTransactions: (filters: TransactionFilters) => Transaction[];
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecurringTransaction: (id: string, recurring: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => void;
  generateRecurringTransactions: () => void;
}