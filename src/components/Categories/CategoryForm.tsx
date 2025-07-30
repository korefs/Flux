import React, { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { Category } from '../../types';

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const { addCategory } = useFinance();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    color: initialData?.color || '#3B82F6',
    icon: initialData?.icon || '📦',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableIcons = [
    '🍽️', '🚗', '🎮', '🏥', '📚', '🏠', '💰', '💻', '📈', '📦',
    '🛒', '⚡', '💳', '🎬', '🏃', '✈️', '📱', '🎵', '👕', '🍕',
    '☕', '🏖️', '💊', '🔧', '🎁', '📝', '🚌', '🏦', '💡', '🌟'
  ];

  const availableColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#6B7280', '#374151', '#1F2937'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Ícone é obrigatório';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Cor é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
      };

      addCategory(categoryData);

      if (onSubmit) {
        onSubmit();
      } else {
        setFormData({
          name: '',
          color: '#3B82F6',
          icon: '📦',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {initialData?.id ? 'Editar Categoria' : 'Nova Categoria'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome da Categoria
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Alimentação"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ícone
          </label>
          <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleInputChange('icon', icon)}
                className={`p-2 text-2xl rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  formData.icon === icon ? 'bg-primary-100 dark:bg-primary-900 ring-2 ring-primary-500' : ''
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          {errors.icon && (
            <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <div className="grid grid-cols-10 gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && (
            <p className="text-red-500 text-sm mt-1">{errors.color}</p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prévia da Categoria
          </h4>
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
              style={{ backgroundColor: formData.color }}
            >
              {formData.icon}
            </div>
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.name || 'Nome da categoria'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Salvando...' : (initialData?.id ? 'Atualizar' : 'Adicionar')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;