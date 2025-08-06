'use client'

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { calculateFluxPrice, getPriceHistory, type FluxPriceData } from '@/services/fluxPriceService';
import { getUserBalancerPositions } from '@/services/balancerV3Service';
import { VAULT_ADDRESS } from '@/config/constants';
import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon } from '@heroicons/react/16/solid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeRange {
  label: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 }
];

export function FluxAnalytics() {
  const [priceData, setPriceData] = useState<FluxPriceData | null>(null);
  const [historicalData, setHistoricalData] = useState<FluxPriceData[]>([]);
  const [balancerPositions, setBalancerPositions] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[1]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch current price data
      const currentPrice = await calculateFluxPrice(VAULT_ADDRESS);
      setPriceData(currentPrice);

      // Fetch historical data
      const history = getPriceHistory(selectedRange.days);
      setHistoricalData(history);

      // Fetch Balancer positions
      const positions = await getUserBalancerPositions(VAULT_ADDRESS);
      setBalancerPositions(positions);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (historicalData.length < 2) {
      return {
        highPrice: priceData?.price || 0,
        lowPrice: priceData?.price || 0,
        avgPrice: priceData?.price || 0,
        volatility: 0
      };
    }

    const prices = historicalData.map(d => d.price);
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate volatility (standard deviation)
    const variance = prices.reduce((sum, price) => {
      return sum + Math.pow(price - avgPrice, 2);
    }, 0) / prices.length;
    const volatility = (Math.sqrt(variance) / avgPrice) * 100;

    return { highPrice, lowPrice, avgPrice, volatility };
  };

  const metrics = calculateMetrics();

  // Prepare chart data
  const chartData = {
    labels: historicalData.map(d => {
      const date = new Date(d.timestamp);
      if (selectedRange.days <= 1) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (selectedRange.days <= 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' });
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }),
    datasets: [
      {
        label: 'FLUX Price',
        data: historicalData.map(d => d.price),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            return `Price: $${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return '$' + (value as number).toFixed(4);
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with current price */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              FLUX Token Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time price and performance metrics
            </p>
          </div>
          <ChartBarIcon className="h-8 w-8 text-indigo-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Price */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Current Price
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${priceData?.price.toFixed(4)}
            </div>
            <div className="flex items-center mt-2">
              {(priceData?.priceChangePercentage24h || 0) >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                (priceData?.priceChangePercentage24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercentage(priceData?.priceChangePercentage24h || 0)}
              </span>
            </div>
          </div>

          {/* Market Cap */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Market Cap
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue((priceData?.price || 0) * (priceData?.totalSupply || 0))}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {priceData?.totalSupply.toLocaleString()} FLUX
            </div>
          </div>

          {/* Total Value Locked */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Total Value Locked
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue((priceData?.baseTokensValue || 0) + (priceData?.balancerPoolsValue || 0))}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Base + Balancer
            </div>
          </div>

          {/* Volatility */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {selectedRange.label} Volatility
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.volatility.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Standard deviation
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Price History
          </h3>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  selectedRange.label === range.label
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-96">
          {historicalData.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No historical data available for this period
            </div>
          )}
        </div>

        {/* Price Range Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedRange.label} High
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${metrics.highPrice.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedRange.label} Low
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${metrics.lowPrice.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedRange.label} Average
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${metrics.avgPrice.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Portfolio Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Assets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Base Assets
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatValue(priceData?.baseTokensValue || 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${((priceData?.baseTokensValue || 0) / ((priceData?.baseTokensValue || 0) + (priceData?.balancerPoolsValue || 0))) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Balancer Pools */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Balancer v3 Pools
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatValue(priceData?.balancerPoolsValue || 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${((priceData?.balancerPoolsValue || 0) / ((priceData?.baseTokensValue || 0) + (priceData?.balancerPoolsValue || 0))) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Balancer Pool Details */}
        {balancerPositions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Active Balancer Positions
            </h4>
            <div className="space-y-3">
              {balancerPositions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {position.poolName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {position.poolTokens.map((token: any) => token.symbol).join(' / ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatValue(position.totalValueUSD)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {((position.totalValueUSD / (priceData?.balancerPoolsValue || 1)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}