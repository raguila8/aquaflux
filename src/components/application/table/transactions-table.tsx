'use client'

import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { Key } from 'react-aria-components'
import { Table, TableCard } from '@/components/application/table/table'
import { PaginationPageMinimalCenter } from '@/components/application/pagination/pagination'
import { DateRangePicker } from '@/components/application/date-picker/date-range-picker'
import { getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from 'react-aria-components'
import { parseDate } from '@internationalized/date'
import { BadgeWithDot, Badge } from '@/components/base/badges/badges'
import FileDownload02 from '@/icons/untitledui/pro/file-download-02.svg'
import { TabList, Tabs } from '@/components/application/tabs/tabs'
import { Button } from '@/components/base/buttons/button'
import { Avatar } from '@/components/base/avatar/avatar'
import { cn, truncateHash } from '@/lib/utils'
import '@/styles/animations.css'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { useWallet } from '@/contexts/WalletContext'
import { fetchVaultTransactions, getWalletTransactions, getNewTransactionsForWallet, type VaultTransaction } from '@/services/vaultTransactionServiceVercel'
import { notify } from '@/lib/notify'

const USDC = { src: 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/assets/usdc.avif' }
const Flux = { src: 'https://04mu1lnp8qyyyqvs.public.blob.vercel-storage.com/assets/flux.avif' }

const assetDetails = {
  'Flux Token': {
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
  },
  USDC: {
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
  },
} as const

type AssetName = keyof typeof assetDetails

type TransactionStatus = 'confirmed' | 'pending' | 'failed'

interface Transaction {
  asset: AssetName
  amount: string
  fee: string
  transactionHash: string
  transactionURL: string
  status: TransactionStatus
  dateTime: string // ISO date in UTC
}

// Helper function to format UTC dates
const formatUTCDate = (utcDate: string): string => {
  const date = new Date(utcDate)
  return date.toISOString().slice(0, 16).replace('T', ' ')
}

const formatTransactionData = (tx: VaultTransaction): Transaction => {
  const asset: AssetName = tx.token === 'FLUX' ? 'Flux Token' : 'USDC';
  const isDeposit = tx.type === 'outgoing'; // User sending to vault
  const sign = isDeposit ? '-' : '+';
  const amountValue = parseFloat(tx.value);
  const amount = `${sign} ${amountValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  
  const feeValue = isDeposit ? amountValue * 0.01 : 0;
  const fee = feeValue.toFixed(4);
  
  // Use correct network for Basescan URL
  const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
  const transactionURL = `https://${network}basescan.org/tx/${tx.hash}`;
  
  return {
    asset,
    amount,
    fee,
    transactionHash: tx.hash,
    transactionURL,
    status: 'confirmed' as TransactionStatus,
    dateTime: new Date(tx.timestamp).toISOString(),
  };
};

const tabs = [
  { id: 'all', label: 'All transactions' },
  { id: 'deposits', label: 'Deposits' },
  { id: 'withdraws', label: 'Withdraws' },
]

interface TransactionsTableProps {
  showTabs?: boolean
  title?: string
}

export function TransactionsTable({
  showTabs = false,
  title = 'Transactions',
}: TransactionsTableProps) {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTabIndex, setSelectedTabIndex] = useState<Key>('all')
  const previousTxIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set());
  const lastFetchTime = useRef<number>(0);
  // Pagination state
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  const formatTransactionDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const analyzeTransactionPattern = useCallback((walletTxs: VaultTransaction[]) => {
    // Filter for new transactions not in the previous set
    const newTxs = walletTxs.filter(tx => !previousTxIds.current.has(tx.id));
    
    if (!isFirstLoad.current && newTxs.length > 0) {
      const sortedAllTxs = [...walletTxs].sort((a, b) => a.timestamp - b.timestamp);
      
      for (const tx of newTxs) {
        const txDate = formatTransactionDate(tx.timestamp);
        const isDeposit = tx.type === 'incoming';
        const isOutgoing = tx.type === 'outgoing';
        
        // Show pending notification for outgoing transactions
        if (isOutgoing) {
          console.log('⚠️ Table detected outgoing transaction, showing pending notification');
          notify.warning({
            title: `Sending ${tx.token}`,
            description: `${parseFloat(tx.value).toFixed(2)} ${tx.token} to vault • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
            confirmLabel: 'View on Basescan',
            onConfirm: () => {
              const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
              window.open(`https://${network}basescan.org/tx/${tx.hash}`, '_blank');
            }
          });
        }
        
        if (isDeposit && tx.token === 'USDC') {
          const nearbyFlux = sortedAllTxs.find(
            t => t.type === 'outgoing' && t.token === 'FLUX' && 
            Math.abs(t.timestamp - tx.timestamp) < 60000
          );
          
          if (nearbyFlux) {
            console.log('✅ Table detected successful USDC deposit, showing success notification');
            notify.success({
              title: 'Received USDC!',
              description: `${parseFloat(tx.value).toFixed(2)} USDC successfully received • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => {
                const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
                window.open(`https://${network}basescan.org/tx/${tx.hash}`, '_blank');
              }
            });
          } else {
            console.log('❌ Table detected failed USDC deposit, showing error notification');
            notify.error({
              title: 'Transaction Failed',
              description: `10 FLUX minimum required. ${parseFloat(tx.value).toFixed(2)} USDC returned to wallet • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}. **Minimum 10 FLUX**`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => {
                const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
                window.open(`https://${network}basescan.org/tx/${tx.hash}`, '_blank');
              }
            });
          }
        } else if (isDeposit && tx.token === 'FLUX') {
          const nearbyUsdc = sortedAllTxs.find(
            t => t.type === 'outgoing' && t.token === 'USDC' && 
            Math.abs(t.timestamp - tx.timestamp) < 60000
          );
          
          if (nearbyUsdc) {
            console.log('✅ Table detected successful FLUX withdrawal, showing success notification');
            notify.success({
              title: 'Received FLUX!',
              description: `${parseFloat(tx.value).toFixed(2)} FLUX successfully received • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => {
                const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
                window.open(`https://${network}basescan.org/tx/${tx.hash}`, '_blank');
              }
            });
          } else {
            console.log('❌ Table detected failed FLUX withdrawal, showing error notification');
            notify.error({
              title: 'Transaction Failed',
              description: `0.1 FLUX minimum required. ${parseFloat(tx.value).toFixed(2)} FLUX returned to wallet • ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}. **Minimum 0.1 FLUX**`,
              confirmLabel: 'View on Basescan',
              onConfirm: () => {
                const network = process.env.NEXT_PUBLIC_NETWORK === 'base-sepolia' ? 'sepolia.' : '';
                window.open(`https://${network}basescan.org/tx/${tx.hash}`, '_blank');
              }
            });
          }
        }
      }
    }
    
    previousTxIds.current = new Set(walletTxs.map(tx => tx.id));
    isFirstLoad.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    if (!address) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    
    let isMounted = true;
    let interval: NodeJS.Timeout;
    
    const loadTransactions = async (isInitial = false) => {
      if (!isMounted) return;
      
      await fetchVaultTransactions();
      
      if (!isMounted) return;
      
      const walletTxs = await getWalletTransactions(address);
      analyzeTransactionPattern(walletTxs);
      const formattedTxs = walletTxs.map(formatTransactionData);
      
      if (isInitial) {
        // Initial load - just set all transactions
        setTransactions(formattedTxs);
        setIsLoading(false);
        lastFetchTime.current = Date.now();
      } else {
        // Subsequent loads - intelligently merge new transactions
        setTransactions(prevTxs => {
          const existingIds = new Set(prevTxs.map(tx => tx.transactionHash));
          const newTxs = formattedTxs.filter(tx => !existingIds.has(tx.transactionHash));
          
          if (newTxs.length > 0) {
            // Mark new transactions for animation
            const newIds = new Set(newTxs.map(tx => tx.transactionHash));
            setNewTransactionIds(newIds);
            
            // Clear animation markers after animation completes
            setTimeout(() => {
              setNewTransactionIds(new Set());
            }, 1000);
            
            // Merge and sort by date
            const merged = [...newTxs, ...prevTxs];
            return merged.sort((a, b) => 
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
            );
          }
          
          return prevTxs;
        });
      }
    };
    
    const initialLoad = async () => {
      setIsLoading(true);
      isFirstLoad.current = true;
      
      await loadTransactions(true);
      
      // Removed automatic polling - websocket updates will handle real-time data
    };
    
    initialLoad();
    
    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [address, analyzeTransactionPattern]);

  // Date range state used for filtering
  const [dateRange, setDateRange] = useState<{
    start: DateValue
    end: DateValue
  } | null>({
    start: parseDate('2025-01-01'),
    end: parseDate(new Date().toISOString().split('T')[0]),
  })

  // Reset to first page whenever the selected tab changes or date range changes so pagination stays valid
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTabIndex, dateRange])

  // Use selected tab label as title when tabs are shown
  const displayTitle = showTabs
    ? tabs.find((tab) => tab.id === selectedTabIndex)?.label || title
    : title

  // Filter transactions based on the selected tab and date range
  const filteredTransactions = (() => {
    let txs = transactions

    // Tab based filtering
    if (selectedTabIndex === 'deposits') {
      txs = txs.filter((t) => t.amount.trim().startsWith('+'))
    } else if (selectedTabIndex === 'withdraws') {
      txs = txs.filter((t) => t.amount.trim().startsWith('-'))
    }

    // Date range filtering (only when a range is selected and component shows tabs)
    if (showTabs && dateRange && dateRange.start && dateRange.end) {
      const startDate = dateRange.start.toDate(getLocalTimeZone())
      const endDateObj = dateRange.end.toDate(getLocalTimeZone())
      // Include the entire end day by setting time to 23:59:59.999
      const endDate = new Date(
        endDateObj.getFullYear(),
        endDateObj.getMonth(),
        endDateObj.getDate(),
        23,
        59,
        59,
        999
      )

      txs = txs.filter((t) => {
        const txDate = new Date(t.dateTime)
        return txDate >= startDate && txDate <= endDate
      })
    }

    return txs
  })()

  // Determine which transactions to show based on the title / current page
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const displayedTransactions = useMemo(() => {
    if (displayTitle.toLowerCase() === 'recent transactions') {
      return transactions.slice(0, itemsPerPage);
    }
    return filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [transactions, filteredTransactions, displayTitle, currentPage, itemsPerPage])

  // Determine count to show in badge
  const badgeCount = isLoading ? 0 :
    displayTitle.toLowerCase() === 'recent transactions'
      ? displayedTransactions.length
      : filteredTransactions.length

  /**
   * Generates and triggers a CSV download for the currently filtered transactions.
   * The export respects the active tab (all / deposits / withdraws) but will ignore
   * pagination so the user receives the full dataset that they are viewing.
   */
  const handleDownloadCSV = useCallback(() => {
    if (!filteredTransactions.length) return

    // CSV header
    const header = [
      'Asset',
      'Amount',
      'Fee',
      'TransactionHash',
      'Status',
      'DateTime',
    ]

    // Escape double quotes by duplicating them – RFC 4180 compliant
    const escapeCell = (cell: string | number) =>
      `"${String(cell).replace(/"/g, '""')}"`

    // Build CSV rows
    const rows = filteredTransactions.map((t) =>
      [t.asset, t.amount, t.fee, t.transactionHash, t.status, t.dateTime]
        .map(escapeCell)
        .join(',')
    )

    const csvContent = [header.map(escapeCell).join(','), ...rows].join('\n')

    // Create filename with date range
    let filename = 'transactions'
    if (dateRange) {
      const startDate = new Date(
        dateRange.start.year,
        dateRange.start.month - 1,
        dateRange.start.day
      ).toISOString().split('T')[0]
      const endDate = new Date(
        dateRange.end.year,
        dateRange.end.month - 1,
        dateRange.end.day
      ).toISOString().split('T')[0]
      filename = `transactions_${startDate}_to_${endDate}`
    }
    
    // Create a blob and trigger the download
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredTransactions, dateRange])

  return (
    <div className='flex flex-col gap-8'>
      {showTabs && (
        <div className='flex items-center justify-between'>
          <Tabs
            selectedKey={selectedTabIndex}
            onSelectionChange={setSelectedTabIndex}
            className='w-max max-md:hidden'
          >
            <TabList size='sm' type='button-minimal' items={tabs} />
          </Tabs>
          <DateRangePicker
            value={dateRange}
            onChange={(range) => setDateRange(range)}
          />
        </div>
      )}
      <TableCard.Root className='ring-secondary shadow-inner-blur rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset'>
        <TableCard.Header
          title={displayTitle}
          badge={
            <Badge type='modern' size='sm' className='max-xl:hidden'>
              {badgeCount} transactions
            </Badge>
          }
          contentTrailing={
            displayTitle.toLowerCase() === 'recent transactions' ? (
              <div className='flex gap-3'>
                <Button
                  size='sm'
                  color='secondary'
                  iconTrailing={ChevronRightIcon}
                  href='/dashboard/transactions'
                >
                  View all
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                color='secondary'
                iconLeading={FileDownload02}
                onClick={handleDownloadCSV}
              >
                Download CSV
              </Button>
            )
          }
          className='px-6 pt-5 pb-6 lg:pb-5'
        />
        <div className='-mx-0'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-tertiary text-sm'>Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-tertiary text-sm'>No transactions found</div>
            </div>
          ) : (
          <Table aria-label='Transactions' className='transition-all duration-300'>
            <Table.Header className='bg-transparent'>
              <Table.Head
                id='transaction'
                label='Transaction'
                isRowHeader
                className='w-full'
              />
              <Table.Head id='amount' label='Amount' />
              <Table.Head id='fee' label='Fee' className='max-md:hidden' />
              <Table.Head
                id='transactionHash'
                label='Transaction hash'
                className='max-xl:hidden'
              />
              <Table.Head
                id='date'
                label='Date & time (UTC)'
                className='max-lg:hidden'
              />
              <Table.Head id='status' label='Status' />
            </Table.Header>
            <Table.Body items={displayedTransactions}>
              {(item) => {
                const meta = assetDetails[item.asset]

                return (
                  <Table.Row 
                    id={item.transactionHash}
                    className={cn(
                      newTransactionIds.has(item.transactionHash) && 'animate-fadeIn'
                    )}
                  >
                    <Table.Cell className='text-nowrap'>
                      <div className='flex w-max items-center gap-3'>
                        <Avatar
                          src={meta.assetURL}
                          initials={meta.initials}
                          alt={item.asset}
                          size='md'
                        />
                        <div>
                          <p className='text-primary text-sm font-medium'>
                            {item.asset}
                          </p>
                          <p className='text-tertiary text-sm'>
                            {meta.assetSymbol}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell
                      className={cn(
                        'text-nowrap',
                        item.amount[0] === '+' && 'text-success-primary'
                      )}
                    >
                      {item.amount} {meta.assetSymbol}
                    </Table.Cell>
                    <Table.Cell className='text-nowrap max-md:hidden'>
                      {item.fee} {meta.assetSymbol}
                    </Table.Cell>
                    <Table.Cell className='text-nowrap max-xl:hidden'>
                      <Tooltip
                        arrow
                        title={item.transactionHash}
                        className='max-w-sm font-mono'
                      >
                        <TooltipTrigger>
                          <a
                            href={item.transactionURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='text-indigo-blue-300 hover:text-indigo-blue-200 flex cursor-pointer items-center gap-1 font-mono text-sm leading-4 font-semibold duration-200 ease-in-out'
                          >
                            <span className='absolute inset-x-0 -top-px bottom-0 sm:hidden' />
                            {truncateHash(item.transactionHash)}
                            <span className='text-xs'>↗</span>
                          </a>
                        </TooltipTrigger>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell className='text-nowrap max-lg:hidden'>
                      {formatUTCDate(item.dateTime)}
                    </Table.Cell>
                    <Table.Cell>
                      <BadgeWithDot
                        color={
                          item.status === 'confirmed'
                            ? 'success'
                            : item.status === 'failed'
                              ? 'error'
                              : 'gray'
                        }
                        type='modern'
                        size='sm'
                        className='capitalize'
                      >
                        {item.status}
                      </BadgeWithDot>
                    </Table.Cell>
                  </Table.Row>
                )
              }}
            </Table.Body>
          </Table>
          )}
          {!isLoading && displayTitle.toLowerCase() !== 'recent transactions' &&
            filteredTransactions.length > itemsPerPage && (
              <PaginationPageMinimalCenter
                page={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
                className='px-4 py-3 md:px-6 md:pt-3 md:pb-4'
              />
            )}
        </div>
      </TableCard.Root>
    </div>
  )
}
