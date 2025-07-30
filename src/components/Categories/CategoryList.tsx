import React, { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { Category } from '../../types';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { categories, deleteCategory } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    deleteCategory(id);
    setShowDeleteConfirm(null);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (showForm) {
    return (
      <CategoryForm
        initialData={editingCategory || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Suas Categorias
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {categories.length} categorias cadastradas
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Cor: 
              </span>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma categoria encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crie sua primeira categoria personalizada para organizar melhor suas transações.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Criar Primeira Categoria
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Excluir
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;