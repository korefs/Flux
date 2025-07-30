import React, { useState } from 'react';
import { Plus, RotateCcw, ArrowLeft } from 'lucide-react';
import { RecurringTransaction } from '../types';
import RecurringTransactionForm from '../components/Forms/RecurringTransactionForm';
import RecurringTransactionList from '../components/Transactions/RecurringTransactionList';

const RecurringTransactions: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingRecurring(null);
  };

  const handleEdit = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setShowForm(true);
  };

  const handleNewRecurring = () => {
    setEditingRecurring(null);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setEditingRecurring(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingRecurring ? 'Editar Transação Recorrente' : 'Nova Transação Recorrente'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {editingRecurring 
                ? 'Atualize os dados da transação recorrente'
                : 'Configure uma nova transação que se repetirá automaticamente'
              }
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <RecurringTransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingRecurring || undefined}
            isEditing={!!editingRecurring}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações Recorrentes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas assinaturas e gastos automáticos mensais
          </p>
        </div>
        
        <button
          onClick={handleNewRecurring}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Recorrência
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <RotateCcw size={20} className="text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Suas Recorrências</h2>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
          <p>• <strong>Transações ativas</strong> geram automaticamente novas transações nas datas programadas</p>
          <p>• <strong>Mensais:</strong> Geradas todo mês no dia especificado (padrão: dia da data de início)</p>
          <p>• <strong>Semanais:</strong> Geradas toda semana no dia especificado</p>
          <p>• <strong>Anuais:</strong> Geradas todo ano na mesma data</p>
        </div>
        
        <RecurringTransactionList onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default RecurringTransactions;