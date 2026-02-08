import { supabase, TABLES } from './supabaseClient';
import { Transaction, Category, RecurringTransaction } from '../types';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncState {
  status: SyncStatus;
  lastSync: Date | null;
  error: string | null;
}

class SyncManager {
  private state: SyncState = {
    status: 'idle',
    lastSync: null,
    error: null,
  };

  private listeners: Set<(state: SyncState) => void> = new Set();

  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  clearUserId() {
    this.userId = null;
  }

  subscribe(listener: (state: SyncState) => void) {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private setState(newState: Partial<SyncState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  getState(): SyncState {
    return { ...this.state };
  }

  async uploadAllData(
    transactions: Transaction[],
    categories: Category[],
    recurringTransactions: RecurringTransaction[]
  ): Promise<void> {
    if (!supabase || !this.userId) {
      throw new Error('Supabase not configured or user not authenticated');
    }

    try {
      this.setState({ status: 'syncing', error: null });

      // Upload categories
      const { error: categoriesError } = await supabase
        .from(TABLES.CATEGORIES)
        .upsert(
          categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            icon: cat.icon,
            user_id: this.userId,
          })),
          { onConflict: 'id,user_id' }
        );

      if (categoriesError) throw categoriesError;

      // Upload transactions
      const { error: transactionsError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .upsert(
          transactions.map((t) => ({
            id: t.id,
            description: t.description,
            amount: t.amount,
            category_id: t.categoryId,
            date: t.date,
            type: t.type,
            user_id: this.userId,
            created_at: t.createdAt,
            updated_at: t.updatedAt,
          })),
          { onConflict: 'id,user_id' }
        );

      if (transactionsError) throw transactionsError;

      // Upload recurring transactions
      const { error: recurringError } = await supabase
        .from(TABLES.RECURRING_TRANSACTIONS)
        .upsert(
          recurringTransactions.map((rt) => ({
            id: rt.id,
            description: rt.description,
            amount: rt.amount,
            category_id: rt.categoryId,
            type: rt.type,
            frequency: rt.frequency,
            start_date: rt.startDate,
            end_date: rt.endDate,
            day_of_month: rt.dayOfMonth,
            day_of_week: rt.dayOfWeek,
            interval_months: rt.intervalMonths,
            is_active: rt.isActive,
            user_id: this.userId,
            created_at: rt.createdAt,
            updated_at: rt.updatedAt,
            last_generated: rt.lastGenerated,
          })),
          { onConflict: 'id,user_id' }
        );

      if (recurringError) throw recurringError;

      this.setState({
        status: 'success',
        lastSync: new Date(),
        error: null,
      });
    } catch (error: any) {
      this.setState({
        status: 'error',
        error: error.message || 'Sync failed',
      });
      throw error;
    }
  }

  async downloadAllData(): Promise<{
    transactions: Transaction[];
    categories: Category[];
    recurringTransactions: RecurringTransaction[];
  }> {
    if (!supabase || !this.userId) {
      throw new Error('Supabase not configured or user not authenticated');
    }

    try {
      this.setState({ status: 'syncing', error: null });

      // Download categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('user_id', this.userId);

      if (categoriesError) throw categoriesError;

      const categories: Category[] = (categoriesData || []).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
      }));

      // Download transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from(TABLES.TRANSACTIONS)
        .select('*')
        .eq('user_id', this.userId)
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      const transactions: Transaction[] = (transactionsData || []).map((t: any) => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        categoryId: t.category_id,
        date: t.date,
        type: t.type,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      }));

      // Download recurring transactions
      const { data: recurringData, error: recurringError } = await supabase
        .from(TABLES.RECURRING_TRANSACTIONS)
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (recurringError) throw recurringError;

      const recurringTransactions: RecurringTransaction[] = (recurringData || []).map(
        (rt: any) => ({
          id: rt.id,
          description: rt.description,
          amount: rt.amount,
          categoryId: rt.category_id,
          type: rt.type,
          frequency: rt.frequency,
          startDate: rt.start_date,
          endDate: rt.end_date,
          dayOfMonth: rt.day_of_month,
          dayOfWeek: rt.day_of_week,
          intervalMonths: rt.interval_months,
          isActive: rt.is_active,
          createdAt: rt.created_at,
          updatedAt: rt.updated_at,
          lastGenerated: rt.last_generated,
        })
      );

      this.setState({
        status: 'success',
        lastSync: new Date(),
        error: null,
      });

      return {
        transactions,
        categories,
        recurringTransactions,
      };
    } catch (error: any) {
      this.setState({
        status: 'error',
        error: error.message || 'Sync failed',
      });
      throw error;
    }
  }

  async mergeData(
    localTransactions: Transaction[],
    localCategories: Category[],
    localRecurring: RecurringTransaction[]
  ): Promise<{
    transactions: Transaction[];
    categories: Category[];
    recurringTransactions: RecurringTransaction[];
  }> {
    // Download cloud data
    const cloudData = await this.downloadAllData();

    // Merge strategy: Last write wins based on updated_at timestamp
    const mergedTransactions = this.mergeArrays(
      localTransactions,
      cloudData.transactions,
      (t) => t.updatedAt
    );

    const mergedCategories = this.mergeArrays(localCategories, cloudData.categories, () => '');
    // Categories don't have updatedAt, so we just take the local version if there's a conflict

    const mergedRecurring = this.mergeArrays(
      localRecurring,
      cloudData.recurringTransactions,
      (rt) => rt.updatedAt
    );

    return {
      transactions: mergedTransactions,
      categories: mergedCategories,
      recurringTransactions: mergedRecurring,
    };
  }

  private mergeArrays<T>(
    local: T[],
    cloud: T[],
    getTimestamp: (item: T) => string
  ): T[] {
    const map = new Map<string, { item: T; timestamp: string }>();

    // Add local items
    local.forEach((item) => {
      const id = (item as any).id;
      map.set(id, { item, timestamp: getTimestamp(item) });
    });

    // Add or update with cloud items
    cloud.forEach((item) => {
      const id = (item as any).id;
      const timestamp = getTimestamp(item);
      const existing = map.get(id);

      if (!existing || timestamp > existing.timestamp) {
        map.set(id, { item, timestamp });
      }
    });

    return Array.from(map.values()).map(({ item }) => item);
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    if (!supabase || !this.userId) {
      throw new Error('Supabase not configured or user not authenticated');
    }

    const { error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .delete()
      .eq('id', transactionId)
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    if (!supabase || !this.userId) {
      throw new Error('Supabase not configured or user not authenticated');
    }

    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('id', categoryId)
      .eq('user_id', this.userId);

    if (error) throw error;
  }

  async deleteRecurringTransaction(recurringTransactionId: string): Promise<void> {
    if (!supabase || !this.userId) {
      throw new Error('Supabase not configured or user not authenticated');
    }

    const { error } = await supabase
      .from(TABLES.RECURRING_TRANSACTIONS)
      .delete()
      .eq('id', recurringTransactionId)
      .eq('user_id', this.userId);

    if (error) throw error;
  }
}

export const syncManager = new SyncManager();
