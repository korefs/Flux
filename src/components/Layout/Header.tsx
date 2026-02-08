import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFinance } from '../../contexts/FinanceContext';
import { syncManager, SyncStatus } from '../../utils/syncManager';
import { format } from 'date-fns';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { manualSync } = useFinance();
  const [syncState, setSyncState] = useState(syncManager.getState());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((state) => {
      setSyncState(state);
      if (state.status === 'syncing') {
        setIsSyncing(true);
      } else {
        setIsSyncing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    try {
      await manualSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getSyncIcon = () => {
    if (!user) return <CloudOff size={16} className="text-gray-400" />;

    if (isSyncing || syncState.status === 'syncing') {
      return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
    }

    switch (syncState.status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Cloud size={16} className="text-gray-400" />;
    }
  };

  const getSyncText = () => {
    if (!user) return 'Not signed in';
    if (isSyncing || syncState.status === 'syncing') return 'Syncing...';
    if (syncState.status === 'error') return 'Sync failed';
    if (syncState.lastSync) {
      return `Synced ${format(new Date(syncState.lastSync), 'HH:mm')}`;
    }
    return 'Synced';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Controle Financeiro
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync Status */}
          {user && (
            <div className="flex items-center gap-2">
              <div
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${
                  syncState.status === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {getSyncIcon()}
                <span>{getSyncText()}</span>
              </div>

              <button
                onClick={handleManualSync}
                disabled={isSyncing || !user}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sync now"
              >
                <RefreshCw
                  size={18}
                  className={isSyncing ? 'animate-spin' : ''}
                />
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;