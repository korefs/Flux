import { Calendar, DollarSign, RotateCcw, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { RecurringTransaction } from '../../types';

interface RecurringTransactionFormProps {
  onSubmit?: () => void;
  initialData?: Partial<RecurringTransaction>;
  isEditing?: boolean;
}

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false 
}) => {
  const { categories, addRecurringTransaction, updateRecurringTransaction } = useFinance();
  
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    categoryId: initialData?.categoryId || '',
    type: initialData?.type || 'expense' as 'income' | 'expense',
    frequency: initialData?.frequency || 'monthly' as 'monthly' | 'weekly' | 'yearly' | 'custom',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    dayOfMonth: initialData?.dayOfMonth?.toString() || '',
    dayOfWeek: initialData?.dayOfWeek?.toString() || '',
    intervalMonths: initialData?.intervalMonths?.toString() || '3',
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (formData.frequency === 'monthly' && formData.dayOfMonth) {
      const day = parseInt(formData.dayOfMonth);
      if (day < 1 || day > 28) {
        newErrors.dayOfMonth = 'Dia deve estar entre 1 e 28';
      }
    }

    if (formData.frequency === 'weekly' && formData.dayOfWeek) {
      const day = parseInt(formData.dayOfWeek);
      if (day < 0 || day > 6) {
        newErrors.dayOfWeek = 'Dia da semana deve estar entre 0 (domingo) e 6 (sábado)';
      }
    }

    if (formData.frequency === 'custom') {
      const months = parseInt(formData.intervalMonths);
      if (!formData.intervalMonths || months < 1 || months > 60) {
        newErrors.intervalMonths = 'Intervalo deve estar entre 1 e 60 meses';
      }
    }

    if (formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'Data de fim deve ser posterior à data de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const recurringData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      type: formData.type,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      dayOfMonth: formData.dayOfMonth ? parseInt(formData.dayOfMonth) : undefined,
      dayOfWeek: formData.dayOfWeek ? parseInt(formData.dayOfWeek) : undefined,
      intervalMonths: formData.frequency === 'custom' ? parseInt(formData.intervalMonths) : undefined,
      isActive: formData.isActive,
    };

    if (isEditing && initialData?.id) {
      updateRecurringTransaction(initialData.id, recurringData);
    } else {
      addRecurringTransaction(recurringData);
    }

    if (onSubmit) {
      onSubmit();
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição
          </label>
          <div className="relative">
            <Tag size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ex: Netflix, Spotify, Gym..."
            />
          </div>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valor
          </label>
          <div className="relative">
            <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0,00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequência
          </label>
          <div className="relative">
            <RotateCcw size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="monthly">Mensal</option>
              <option value="weekly">Semanal</option>
              <option value="yearly">Anual</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
        </div>

        {formData.frequency === 'monthly' && (
          <div>
            <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dia do Mês (opcional)
            </label>
            <input
              type="number"
              id="dayOfMonth"
              min="1"
              max="28"
              value={formData.dayOfMonth}
              onChange={(e) => handleInputChange('dayOfMonth', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.dayOfMonth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ex: 5, 15, 25..."
            />
            {errors.dayOfMonth && <p className="mt-1 text-sm text-red-600">{errors.dayOfMonth}</p>}
            <p className="mt-1 text-xs text-gray-500">Se não especificado, usará o dia da data de início</p>
          </div>
        )}

        {formData.frequency === 'weekly' && (
          <div>
            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dia da Semana (opcional)
            </label>
            <select
              id="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.dayOfWeek ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Usar dia da data de início</option>
              <option value="0">Domingo</option>
              <option value="1">Segunda-feira</option>
              <option value="2">Terça-feira</option>
              <option value="3">Quarta-feira</option>
              <option value="4">Quinta-feira</option>
              <option value="5">Sexta-feira</option>
              <option value="6">Sábado</option>
            </select>
            {errors.dayOfWeek && <p className="mt-1 text-sm text-red-600">{errors.dayOfWeek}</p>}
          </div>
        )}

        {formData.frequency === 'custom' && (
          <div>
            <label htmlFor="intervalMonths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              A Cada X Meses
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="intervalMonths"
                min="1"
                max="60"
                value={formData.intervalMonths}
                onChange={(e) => handleInputChange('intervalMonths', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.intervalMonths ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="3"
              />
              <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">meses</span>
            </div>
            {errors.intervalMonths && <p className="mt-1 text-sm text-red-600">{errors.intervalMonths}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Ex: 3 = trimestral, 6 = semestral, 12 = anual
            </p>
          </div>
        )}

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de Início
          </label>
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data de Fim (opcional)
          </label>
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          <p className="mt-1 text-xs text-gray-500">Se não especificado, a recorrência será indefinida</p>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Transação ativa
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          {isEditing ? 'Atualizar Recorrência' : 'Criar Recorrência'}
        </button>
      </div>
    </form>
  );
};

export default RecurringTransactionForm;