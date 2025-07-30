import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/Forms/TransactionForm';

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/transactions');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Transação</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione uma nova receita ou despesa ao seu controle financeiro
        </p>
      </div>

      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddTransaction;