import React from 'react';
import CategoryList from '../components/Categories/CategoryList';

const Categories: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categorias</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as categorias para organizar suas transações
        </p>
      </div>

      <CategoryList />
    </div>
  );
};

export default Categories;