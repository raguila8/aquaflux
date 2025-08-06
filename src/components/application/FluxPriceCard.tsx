'use client'

import { useEffect, useState } from 'react';
import { calculateFluxPrice, type FluxPriceData } from '@/services/fluxPriceService';
import { VAULT_ADDRESS } from '@/config/constants';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/16/solid';

export function FluxPriceCard() {
  const [priceData, setPriceData] = useState<FluxPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrice = async () => {
    try {
      const data = await calculateFluxPrice(VAULT_ADDRESS);
      setPriceData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching FLUX price:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPrice();

    // Update every 30 seconds for real-time pricing
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(price);
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatSupply = (supply: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(supply);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
        </div>
      </div>
    );
  }

  if (!priceData) {
    return null;
  }

  const isPositive = (priceData.priceChangePercentage24h || 0) >= 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          FLUX Token Price
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(priceData.price)}
          </div>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(priceData.priceChangePercentage24h || 0).toFixed(2)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              24h
            </span>
          </div>
        </div>

        {/* Value Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Base Assets
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatValue(priceData.baseTokensValue)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Balancer Pools
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatValue(priceData.balancerPoolsValue)}
            </div>
          </div>
        </div>

        {/* Total Value and Supply */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Value
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatValue(priceData.baseTokensValue + priceData.balancerPoolsValue)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Supply
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatSupply(priceData.totalSupply)} FLUX
            </div>
          </div>
        </div>

        {/* Market Cap */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Market Cap
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatValue(priceData.price * priceData.totalSupply)}
          </div>
        </div>
      </div>
    </div>
  );
}