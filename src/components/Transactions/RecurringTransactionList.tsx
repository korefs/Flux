import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, DollarSign, Edit2, Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { RecurringTransaction } from '../../types';

interface RecurringTransactionListProps {
  onEdit?: (recurring: RecurringTransaction) => void;
}

const RecurringTransactionList: React.FC<RecurringTransactionListProps> = ({ onEdit }) => {
  const { recurringTransactions, categories, updateRecurringTransaction, deleteRecurringTransaction } = useFinance();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const getFrequencyLabel = (frequency: string, intervalMonths?: number | undefined) => {
    const labels = {
      monthly: 'Mensal',
      weekly: 'Semanal',
      yearly: 'Anual',
    };

    if(frequency === 'custom') {
      switch (intervalMonths) {
        case 1:
          return 'Mensal';
        case 3:
          return 'Trimestral';
        case 6:
          return 'Semestral';
        case 12:
          return 'Anual';
        case 24:
          return 'Bienal';
        default:
          return `A cada ${intervalMonths} meses`;
    }

  }



    return labels[frequency as keyof typeof labels] || frequency;
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateRecurringTransaction(id, { isActive: !isActive });
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await deleteRecurringTransaction(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getNextPaymentInfo = (recurring: RecurringTransaction) => {
    const now = new Date();
    const startDate = parseISO(recurring.startDate);
    
    if (recurring.lastGenerated) {
      const lastGenerated = parseISO(recurring.lastGenerated);
      let nextDate = new Date(lastGenerated);
      
      switch (recurring.frequency) {
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }
      
      return formatDate(nextDate.toISOString());
    }
    
    return formatDate(recurring.startDate);
  };

  if (recurringTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <RotateCcw size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma transação recorrente
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Crie sua primeira transação recorrente para automatizar seus gastos mensais.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recurringTransactions.map((recurring) => {
        const category = getCategoryById(recurring.categoryId);
        const isExpired = recurring.endDate && parseISO(recurring.endDate) < new Date();
        
        return (
          <div
            key={recurring.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${
              !recurring.isActive || isExpired ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{category?.icon || '📦'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {recurring.description}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category?.name} • {getFrequencyLabel(recurring.frequency, recurring.intervalMonths)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      recurring.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {recurring.type === 'income' ? '+' : '-'} R$ {recurring.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Início: {formatDate(recurring.startDate)}</span>
                  </div>
                  
                  {recurring.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Fim: {formatDate(recurring.endDate)}</span>
                    </div>
                  )}
                  
                  {recurring.isActive && !isExpired && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <span>Próximo: {getNextPaymentInfo(recurring)}</span>
                    </div>
                  )}
                </div>

                {(recurring.dayOfMonth || recurring.dayOfWeek !== undefined) && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {recurring.frequency === 'monthly' && recurring.dayOfMonth && (
                      <span>Todo dia {recurring.dayOfMonth} do mês</span>
                    )}
                    {recurring.frequency === 'weekly' && recurring.dayOfWeek !== undefined && (
                      <span>
                        Toda {['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'][recurring.dayOfWeek]}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    recurring.isActive && !isExpired
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : isExpired
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {isExpired ? 'Expirada' : recurring.isActive ? 'Ativa' : 'Pausada'}
                  </span>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    recurring.type === 'income'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {recurring.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {!isExpired && (
                  <button
                    onClick={() => handleToggleActive(recurring.id, recurring.isActive)}
                    className={`p-2 rounded-md transition-colors ${
                      recurring.isActive
                        ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                        : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={recurring.isActive ? 'Pausar recorrência' : 'Ativar recorrência'}
                  >
                    {recurring.isActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                )}

                <button
                  onClick={() => onEdit?.(recurring)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                  title="Editar recorrência"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(recurring.id)}
                  className={`p-2 rounded-md transition-colors ${
                    deleteConfirm === recurring.id
                      ? 'text-white bg-red-600 hover:bg-red-700'
                      : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  title={deleteConfirm === recurring.id ? 'Confirmar exclusão' : 'Excluir recorrência'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecurringTransactionList;