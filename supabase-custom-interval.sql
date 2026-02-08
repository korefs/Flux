-- Adicionar suporte a intervalos personalizados em transações recorrentes
-- Execute este SQL no SQL Editor do Supabase

-- Adicionar coluna interval_months à tabela recurring_transactions
ALTER TABLE recurring_transactions
ADD COLUMN IF NOT EXISTS interval_months INTEGER;

-- Adicionar coluna frequency 'custom' ao check constraint
ALTER TABLE recurring_transactions
DROP CONSTRAINT IF EXISTS recurring_transactions_frequency_check;

ALTER TABLE recurring_transactions
ADD CONSTRAINT recurring_transactions_frequency_check
CHECK (frequency IN ('monthly', 'weekly', 'yearly', 'custom'));

-- Adicionar comentário à coluna
COMMENT ON COLUMN recurring_transactions.interval_months IS 'Número de meses para recorrência personalizada. Usado apenas quando frequency = "custom". Ex: 3 = trimestral, 6 = semestral';
