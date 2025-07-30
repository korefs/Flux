import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FinanceProvider } from './contexts/FinanceContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import RecurringTransactions from './pages/RecurringTransactions';

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="add-transaction" element={<AddTransaction />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="recurring-transactions" element={<RecurringTransactions />} />
                <Route path="categories" element={<Categories />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
