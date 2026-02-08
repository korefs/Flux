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
  frequency: 'monthly' | 'weekly' | 'yearly' | 'custom';
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  intervalMonths?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  recurringTransactions: RecurringTransaction[];
  summary: FinancialSummary;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => Promise<void>;
  getFilteredTransactions: (filters: TransactionFilters) => Transaction[];
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecurringTransaction: (id: string, recurring: Partial<RecurringTransaction>) => void;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  generateRecurringTransactions: () => void;
  manualSync: () => Promise<void>;
}