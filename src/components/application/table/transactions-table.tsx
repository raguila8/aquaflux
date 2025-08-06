import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import { useState, useEffect, useCallback } from 'react'
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
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import USDC from '@/images/assets/usdc.png'
import Flux from '@/images/assets/flux.png'

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

// -----------------------------------------------------------------------------
// Auto-generated mock transactions
// -----------------------------------------------------------------------------

const transactions: Transaction[] = Array.from({ length: 100 }, (_, idx) => {
  const index = idx + 1 // 1-based index for clarity
  const asset: AssetName = Math.random() < 0.5 ? 'Flux Token' : 'USDC'

  // Randomized amount between 0.01 and 9,999.00 (2 decimal places)
  const amountValue = parseFloat(
    (Math.random() * (1500 - 0.01) + 0.01).toFixed(2)
  )
  const sign = Math.random() < 0.5 ? '+' : '-'
  const amount = `${sign} ${amountValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
  const fee = (0.005 + (index % 5) * 0.001).toFixed(3)

  const randomHex = (length: number) =>
    Array.from({ length }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')

  const transactionHash = `0x${randomHex(64)}`

  const transactionURL = `https://etherscan.io/tx/${transactionHash}`

  // Skewed random status: ~70% confirmed, 20% pending, 10% failed
  const rand = Math.random()
  const status: TransactionStatus =
    rand < 0.7 ? 'confirmed' : rand < 0.9 ? 'pending' : 'failed'

  // Random date in 2025 but before the current date
  const startRange = Date.UTC(2025, 0, 1) // Jan 1 2025 UTC
  const now = Date.now()
  // Ensure the upper bound is still within 2025
  const endOf2025 = Date.UTC(2025, 11, 31, 23, 59, 59, 999)
  const endRange = Math.min(now, endOf2025)

  const dateTime = new Date(
    startRange + Math.random() * (endRange - startRange)
  ).toISOString()

  return {
    asset,
    amount,
    fee,
    transactionHash,
    transactionURL,
    status,
    dateTime,
  }
}).sort(
  (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
)

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
  const [selectedTabIndex, setSelectedTabIndex] = useState<Key>('all')
  // Pagination state
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState<number>(1)

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
  const displayedTransactions =
    displayTitle.toLowerCase() === 'recent transactions'
      ? transactions.slice(0, itemsPerPage)
      : filteredTransactions.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )

  // Determine count to show in badge
  const badgeCount =
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

    // Create a blob and trigger the download
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'transactions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredTransactions])

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
          <Table aria-label='Transactions'>
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
                  <Table.Row id={item.transactionHash}>
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
                            className='text-indigo-blue-300 hover:text-indigo-blue-200 flex cursor-pointer items-center font-mono text-sm leading-4 font-semibold duration-200 ease-in-out'
                          >
                            <span className='absolute inset-x-0 -top-px bottom-0 sm:hidden' />
                            {truncateHash(item.transactionHash)}
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
          {displayTitle.toLowerCase() !== 'recent transactions' &&
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
