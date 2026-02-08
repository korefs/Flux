import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import RecurringTransactions from './pages/RecurringTransactions';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
