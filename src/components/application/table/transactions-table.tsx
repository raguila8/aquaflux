import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import {
  Table,
  TableCard,
  TableRowActionsDropdown,
} from '@/components/application/table/table'
import {
  BadgeWithDot,
  BadgeWithIcon,
  Badge,
} from '@/components/base/badges/badges'
import { Button } from '@/components/base/buttons/button'
import { Avatar } from '@/components/base/avatar/avatar'
import { cn } from '@/lib/utils'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

import USDC from '@/images/assets/usdc.png'
import Flux from '@/images/assets/flux.png'

const transactions = [
  {
    id: 'transaction-01',
    asset: 'Flux Token',
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
    amount: '- 0.0015',
    fee: '0.0001',
    hash: '0x1234567890123456789012345678901234567890', // TODO: replace with actual hash
    addressURL:
      'https://etherscan.io/address/0x1234567890123456789012345678901234567890',
    transactionHash:
      'f2ca1bb6c7e907d06dafe4687cf025f395b16d1b459e0c4fb8c6e0b11e467e3a',
    transactionURL:
      'https://blockstream.info/tx/f2ca1bb6c7e907d06dafe4687cf025f395b16d1b459e0c4fb8c6e0b11e467e3a',
    status: 'confirmed',
    dateTime: 'Wed 1:00pm',
  },
  {
    id: 'transaction-03',
    asset: 'Flux Token',
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
    amount: '+ 25.75',
    fee: '0.0012',
    hash: '0x9f2e7a5c1b8d4e6f3a9c2e5b8f1a4d7c0e3f6b9a2c5e8f1b4d7a0c3e6f9b2a5',
    addressURL:
      'https://etherscan.io/address/0x9f2e7a5c1b8d4e6f3a9c2e5b8f1a4d7c0e3f6b9a2c5e8f1b4d7a0c3e6f9b2a5',
    transactionHash:
      '0x8c7fe40715ce1b86d24b0c4c30a0b8a76a8f6e2b7e8f9d3a5c1f4e7b2d9a6e3c',
    transactionURL:
      'https://etherscan.io/tx/0x8c7fe40715ce1b86d24b0c4c30a0b8a76a8f6e2b7e8f9d3a5c1f4e7b2d9a6e3c',
    status: 'confirmed',
    dateTime: 'Wed 2:45am',
  },
  {
    id: 'transaction-04',
    asset: 'USDC',
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
    amount: '+ 1,245.75',
    fee: '0.0018',
    hash: '0x4d8b2a9c7e1f5b3a6d0c8f2e5a9b7c1d4e8f0a3c6b9d2e5f8a1c4d7b0e3c6f9',
    addressURL:
      'https://etherscan.io/address/0x4d8b2a9c7e1f5b3a6d0c8f2e5a9b7c1d4e8f0a3c6b9d2e5f8a1c4d7b0e3c6f9',
    transactionHash:
      '0xd5f7b2a8e9c3f6d1a4b7e2c5f8a1b4e7c0d3f6a9b2e5c8f1a4d7b0e3c6f9a2',
    transactionURL:
      'https://etherscan.io/tx/0xd5f7b2a8e9c3f6d1a4b7e2c5f8a1b4e7c0d3f6a9b2e5c8f1a4d7b0e3c6f9a2',
    status: 'confirmed',
    dateTime: 'Tue 6:10pm',
  },

  {
    id: 'transaction-02',
    asset: 'USDC',
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
    amount: '- 0.750',
    fee: '0.005',
    hash: '0x8ba1f109551bD432803012645Hac136c22C501e2',
    addressURL:
      'https://etherscan.io/address/0x8ba1f109551bD432803012645Hac136c22C501e2',
    transactionHash:
      '0xa3d0bbc84b2e5ab7c7f4cb5d6e3fd8a2b9c8e7f1d4e9a6b3c5f2e8d7a4b1c9e6',
    transactionURL:
      'https://etherscan.io/tx/0xa3d0bbc84b2e5ab7c7f4cb5d6e3fd8a2b9c8e7f1d4e9a6b3c5f2e8d7a4b1c9e6',
    status: 'confirmed',
    dateTime: 'Wed 7:20am',
  },
  {
    id: 'transaction-05',
    asset: 'Flux Token',
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
    amount: '- 8.42',
    fee: '0.0009',
    hash: '0x5e7a1d4b8c2f6a9e3c7f1b5a8d2e6c9f3a7d1b4e8c2f5a9d3c6f0b4e7a1d5c8',
    addressURL:
      'https://etherscan.io/address/0x5e7a1d4b8c2f6a9e3c7f1b5a8d2e6c9f3a7d1b4e8c2f5a9d3c6f0b4e7a1d5c8',
    transactionHash:
      '0xb9e4c7f2a5d8b1e4c7f0a3d6b9e2c5f8a1d4b7e0c3f6a9b2e5c8f1a4d7b0e3',
    transactionURL:
      'https://etherscan.io/tx/0xb9e4c7f2a5d8b1e4c7f0a3d6b9e2c5f8a1d4b7e0c3f6a9b2e5c8f1a4d7b0e3',
    status: 'pending',
    dateTime: 'Tue 7:52am',
  },
  {
    id: 'transaction-10',
    asset: 'USDC',
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
    amount: '+ 567.25',
    fee: '0.0013',
    hash: '0x742d35cc6436c0532925a3b8fc9563a678f9c0c3f6a9b2c5e8f1a4d7b0e3c6f9',
    addressURL:
      'https://etherscan.io/address/0x742d35cc6436c0532925a3b8fc9563a678f9c0c3f6a9b2c5e8f1a4d7b0e3c6f9',
    transactionHash:
      '0x6e9b2f5a8c1e4d7b0f3a6c9e2f5b8a1d4e7c0f3a6b9c2f5e8b1d4a7c0f3e6b9',
    transactionURL:
      'https://etherscan.io/tx/0x6e9b2f5a8c1e4d7b0f3a6c9e2f5b8a1d4e7c0f3a6b9c2f5e8b1d4a7c0f3e6b9',
    status: 'confirmed',
    dateTime: 'Wed 2:45am',
  },
  {
    id: 'transaction-07',
    asset: 'Flux Token',
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
    amount: '+ 12.85',
    fee: '0.0007',
    hash: '0x7c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    addressURL:
      'https://etherscan.io/address/0x7c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    transactionHash:
      '0xc2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    transactionURL:
      'https://etherscan.io/tx/0xc2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    status: 'pending',
    dateTime: 'Tue 5:40am',
  },
  {
    id: 'transaction-08',
    asset: 'USDC',
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
    amount: '+ 428.90',
    fee: '0.0014',
    hash: '0x8a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    addressURL:
      'https://etherscan.io/address/0x8a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    transactionHash:
      '0x7a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    transactionURL:
      'https://etherscan.io/tx/0x7a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    status: 'confirmed',
    dateTime: 'Tue 6:10pm',
  },
  {
    id: 'transaction-06',
    asset: 'USDC',
    assetURL: USDC.src,
    assetSymbol: 'USDC',
    initials: 'US',
    amount: '- 2,150.00',
    fee: '0.0021',
    hash: '0x6f9b3e8c1a5d7f2b6a9c3e7f1b4d8a2c5e9f3a6d0c8f1b4e7a3c6f9b2d5e8a1',
    addressURL:
      'https://etherscan.io/address/0x6f9b3e8c1a5d7f2b6a9c3e7f1b4d8a2c5e9f3a6d0c8f1b4e7a3c6f9b2d5e8a1',
    transactionHash:
      '0xe8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8',
    transactionURL:
      'https://etherscan.io/tx/0xe8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8',
    status: 'confirmed',
    dateTime: 'Tue 12:15pm',
  },
  {
    id: 'transaction-09',
    asset: 'Flux Token',
    assetURL: Flux.src,
    assetSymbol: 'FLUX',
    initials: 'FL',
    amount: '- 3.45',
    fee: '0.0015',
    hash: '0x9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    addressURL:
      'https://etherscan.io/address/0x9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    transactionHash:
      '0x9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    transactionURL:
      'https://etherscan.io/tx/0x9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    status: 'failed',
    dateTime: 'Wed 7:20am',
  },
]

const truncateHash = (hash: string, maxLength: number = 14): string => {
  if (hash.length <= maxLength) {
    return hash
  }

  const firstPart = hash.slice(0, 7)
  const lastPart = hash.slice(-7)
  return `${firstPart}...${lastPart}`
}

export function TransactionsTable() {
  return (
    <TableCard.Root className='ring-secondary shadow-inner-blur rounded-xl bg-[linear-gradient(rgba(9,9,11,0.66),rgba(9,9,11,0.66)),linear-gradient(#07344550,#07344550)] ring-1 ring-inset'>
      <TableCard.Header
        title='Recent transactions'
        badge={
          <Badge type='modern' size='sm' className='max-xl:hidden'>
            {transactions.length} transactions
          </Badge>
        }
        contentTrailing={
          <div className='flex gap-3'>
            <Button size='sm' color='secondary' iconTrailing={ChevronRightIcon}>
              View all
            </Button>
          </div>
        }
        className='px-6 pt-5 pb-6 lg:pb-5'
      />
      <div className='-mx-0'>
        <Table aria-label='Recent transactions'>
          <Table.Header className='bg-transparent'>
            <Table.Head
              id='transaction'
              label='Transaction'
              isRowHeader
              className='w-full'
            />
            <Table.Head id='amount' label='Amount' />
            <Table.Head id='fee' label='Fee' className='max-md:hidden' />
            <Table.Head id='hash' label='Hash' />
            <Table.Head
              id='transactionHash'
              label='Transaction hash'
              className='max-xl:hidden'
            />
            <Table.Head id='date' label='Date' className='max-lg:hidden' />
            <Table.Head id='status' label='Status' />
          </Table.Header>
          <Table.Body items={transactions}>
            {(item) => (
              <Table.Row id={item.id}>
                <Table.Cell className='text-nowrap'>
                  <div className='flex w-max items-center gap-3'>
                    <Avatar
                      src={item.assetURL}
                      initials={item.initials}
                      alt={item.asset}
                      size='md'
                    />
                    <div>
                      <p className='text-primary text-sm font-medium'>
                        {item.asset}
                      </p>
                      <p className='text-tertiary text-sm'>
                        {item.assetSymbol}
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
                  {item.amount} {item.assetSymbol}
                </Table.Cell>
                <Table.Cell className='text-nowrap max-md:hidden'>
                  {item.fee} {item.assetSymbol}
                </Table.Cell>
                <Table.Cell className='text-nowrap'>
                  <Tooltip
                    arrow
                    title={item.hash}
                    className='max-w-sm font-mono'
                  >
                    <TooltipTrigger>
                      <a
                        href={item.addressURL}
                        className='text-indigo-blue-300 hover:text-indigo-blue-200 flex cursor-pointer items-center font-mono text-sm leading-4 font-semibold duration-200 ease-in-out'
                      >
                        <span className='absolute inset-x-0 -top-px bottom-0 sm:hidden' />
                        {truncateHash(item.hash)}
                      </a>
                    </TooltipTrigger>
                  </Tooltip>
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
                  {item.dateTime}
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
            )}
          </Table.Body>
        </Table>
      </div>
    </TableCard.Root>
  )
}
