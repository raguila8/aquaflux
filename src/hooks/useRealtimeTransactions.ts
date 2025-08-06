'use client'

import { useEffect, useCallback, useRef } from 'react';
import { notify } from '@/lib/notify';
import { useWallet } from '@/contexts/WalletContext';

interface Transaction {
  hash: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  tokenAddress: string;
  blockNumber: string;
  timestamp: number;
  category: string;
}

interface SSEMessage {
  type: string;
  data?: Transaction[];
  timestamp: number;
}

export function useRealtimeTransactions(onNewTransaction?: (tx: Transaction) => void) {
  const { address, refreshBalances } = useWallet();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatValue = (value: string, symbol: string) => {
    const numValue = parseFloat(value);
    if (numValue < 0.01) {
      return `<0.01 ${symbol}`;
    }
    return `${numValue.toFixed(2)} ${symbol}`;
  };

  const handleNewTransaction = useCallback((transaction: Transaction) => {
    const isUserTransaction = 
      transaction.from?.toLowerCase() === address?.toLowerCase() ||
      transaction.to?.toLowerCase() === address?.toLowerCase();

    if (transaction.type === 'deposit') {
      notify.success({
        title: '💰 New Deposit',
        description: `${formatValue(transaction.value, transaction.tokenSymbol)} deposited to vault`,
        confirmLabel: 'View',
        onConfirm: () => {
          window.open(`https://basescan.org/tx/${transaction.hash}`, '_blank');
        }
      });
    } else if (transaction.type === 'withdrawal') {
      notify.success({
        title: '📤 New Withdrawal',
        description: `${formatValue(transaction.value, transaction.tokenSymbol)} withdrawn from vault`,
        confirmLabel: 'View',
        onConfirm: () => {
          window.open(`https://basescan.org/tx/${transaction.hash}`, '_blank');
        }
      });
    }

    if (isUserTransaction) {
      refreshBalances();
    }

    onNewTransaction?.(transaction);
  }, [address, refreshBalances, onNewTransaction]);

  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    try {
      const eventSource = new EventSource('/api/webhooks/alchemy');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);
          
          if (message.type === 'new_transactions' && message.data) {
            message.data.forEach(handleNewTransaction);
          }
        } catch (error) {
          // Silently ignore parsing errors
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        eventSourceRef.current = null;

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (error) {
      // Silently ignore EventSource creation errors
    }
  }, [handleNewTransaction]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connect]);

  return {
    reconnect: connect
  };
}