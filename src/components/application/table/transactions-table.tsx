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

import Avalanche from '@/images/assets/avalanche.png'
import Cardano from '@/images/assets/cardano.png'
import Dogecoin from '@/images/assets/dogecoin.png'
import Ethereum from '@/images/assets/ethereum.png'
import Litecoin from '@/images/assets/litecoin.png'
import Neo from '@/images/assets/neo.png'
import ShibaInu from '@/images/assets/shiba-inu.png'
import Tether from '@/images/assets/tether.png'
import Tron from '@/images/assets/tron.png'
import Bitcoin from '@/images/assets/bitcoin.png'

const transactions = [
  {
    id: 'transaction-01',
    asset: 'Bitcoin',
    assetURL: Bitcoin.src,
    assetSymbol: 'BTC',
    initials: 'BT',
    amount: '- 0.0015',
    fee: '0.0001',
    address: '0x1234567890123456789012345678901234567890',
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
    id: 'transaction-02',
    asset: 'Ethereum',
    assetURL: Ethereum.src,
    assetSymbol: 'ETH',
    initials: 'ET',
    amount: '- 0.750',
    fee: '0.005',
    address: '0x8ba1f109551bD432803012645Hac136c22C501e2',
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
    id: 'transaction-03',
    asset: 'Cardano',
    assetURL: Cardano.src,
    assetSymbol: 'ADA',
    initials: 'CA',
    amount: '+ 125.50',
    fee: '0.17',
    address:
      'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn493lzs9srxdxhhre',
    addressURL:
      'https://cardanoscan.io/address/addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn493lzs9srxdxhhre',
    transactionHash:
      '8c7fe40715ce1b86d24b0c4c30a0b8a76a8f6e2b7e8f9d3a5c1f4e7b2d9a6e3c',
    transactionURL:
      'https://cardanoscan.io/transaction/8c7fe40715ce1b86d24b0c4c30a0b8a76a8f6e2b7e8f9d3a5c1f4e7b2d9a6e3c',
    status: 'confirmed',
    dateTime: 'Wed 2:45am',
  },
  {
    id: 'transaction-04',
    asset: 'Dogecoin',
    assetURL: Dogecoin.src,
    assetSymbol: 'DOGE',
    initials: 'DO',
    amount: '- 245.75',
    fee: '1.0',
    address: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    addressURL:
      'https://dogechain.info/address/DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    transactionHash:
      'd5f7b2a8e9c3f6d1a4b7e2c5f8a1b4e7c0d3f6a9b2e5c8f1a4d7b0e3c6f9a2',
    transactionURL:
      'https://dogechain.info/tx/d5f7b2a8e9c3f6d1a4b7e2c5f8a1b4e7c0d3f6a9b2e5c8f1a4d7b0e3c6f9a2',
    status: 'confirmed',
    dateTime: 'Tue 6:10pm',
  },
  {
    id: 'transaction-05',
    asset: 'Tether',
    assetURL: Tether.src,
    assetSymbol: 'USDT',
    initials: 'TE',
    amount: '- 12.50',
    fee: '1.2',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    addressURL:
      'https://tronscan.org/#/address/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    transactionHash:
      'b9e4c7f2a5d8b1e4c7f0a3d6b9e2c5f8a1d4b7e0c3f6a9b2e5c8f1a4d7b0e3',
    transactionURL:
      'https://tronscan.org/#/transaction/b9e4c7f2a5d8b1e4c7f0a3d6b9e2c5f8a1d4b7e0c3f6a9b2e5c8f1a4d7b0e3',
    status: 'pending',
    dateTime: 'Tue 7:52am',
  },
  {
    id: 'transaction-06',
    asset: 'Tron',
    assetURL: Tron.src,
    assetSymbol: 'TRX',
    initials: 'TR',
    amount: '- 1,850.00',
    fee: '5.2',
    address: 'TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH',
    addressURL:
      'https://tronscan.org/#/address/TLyqzVGLV1srkB7dToTAEqgDSfPtXRJZYH',
    transactionHash:
      'e8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8',
    transactionURL:
      'https://tronscan.org/#/transaction/e8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6f9a2b5c8',
    status: 'confirmed',
    dateTime: 'Tue 12:15pm',
  },
  {
    id: 'transaction-07',
    asset: 'Litecoin',
    assetURL: Litecoin.src,
    assetSymbol: 'LTC',
    initials: 'LT',
    amount: '+ 1.25',
    fee: '0.003',
    address: 'LhK2YNvMZbLQe3y1sMxr4j8Q7TGfnrhqrL',
    addressURL:
      'https://litecoin.com/en/explorer/address/LhK2YNvMZbLQe3y1sMxr4j8Q7TGfnrhqrL',
    transactionHash:
      'c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    transactionURL:
      'https://blockchair.com/litecoin/transaction/c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2f5e8b1d4a7c0f3e6b9c2',
    status: 'pending',
    dateTime: 'Tue 5:40am',
  },
  {
    id: 'transaction-08',
    asset: 'Neo',
    assetURL: Neo.src,
    assetSymbol: 'NEO',
    initials: 'NE',
    amount: '- 2.80',
    fee: '0.0',
    address: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',
    addressURL:
      'https://neo.org/explorer/address/AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',
    transactionHash:
      '0x7a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    transactionURL:
      'https://neoscan.io/transaction/0x7a3b8f2e5c9d1a4e7b0c3f6a9b2e5c8f1a4d7b0e3c6f9a2b5c8f1a4d7b0e3c6',
    status: 'confirmed',
    dateTime: 'Tue 6:10pm',
  },
  {
    id: 'transaction-09',
    asset: 'Bitcoin',
    assetURL: Bitcoin.src,
    assetSymbol: 'BTC',
    initials: 'BT',
    amount: '- 0.0045',
    fee: '0.00015',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    addressURL:
      'https://blockstream.info/address/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    transactionHash:
      '9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    transactionURL:
      'https://blockstream.info/tx/9f6c3a8d2b5e7f0c3a6d9b2e5f8a1c4e7b0d3f6a9c2e5f8b1d4a7c0f3e6b9c2',
    status: 'failed',
    dateTime: 'Wed 7:20am',
  },
  {
    id: 'transaction-10',
    asset: 'Avalanche',
    assetURL: Avalanche.src,
    assetSymbol: 'AVAX',
    initials: 'AV',
    amount: '+ 3.25',
    fee: '0.008',
    address: '0x742d35cc6436c0532925a3b8fc9563a678f9c0c3',
    addressURL:
      'https://etherscan.io/address/0x742d35cc6436c0532925a3b8fc9563a678f9c0c3',
    transactionHash:
      '0x6e9b2f5a8c1e4d7b0f3a6c9e2f5b8a1d4e7c0f3a6b9c2f5e8b1d4a7c0f3e6b9',
    transactionURL:
      'https://snowtrace.io/tx/0x6e9b2f5a8c1e4d7b0f3a6c9e2f5b8a1d4e7c0f3a6b9c2f5e8b1d4a7c0f3e6b9',
    status: 'confirmed',
    dateTime: 'Wed 2:45am',
  },
]

const truncateAddress = (address: string, maxLength: number = 14): string => {
  if (address.length <= maxLength) {
    return address
  }

  const firstPart = address.slice(0, 7)
  const lastPart = address.slice(-7)
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
            <Table.Head id='address' label='Address' />
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
                    title={item.address}
                    className='max-w-sm font-mono'
                  >
                    <TooltipTrigger>
                      <a
                        href={item.addressURL}
                        className='text-indigo-blue-300 hover:text-indigo-blue-200 flex cursor-pointer items-center font-mono text-sm leading-4 font-semibold duration-200 ease-in-out'
                      >
                        <span className='absolute inset-x-0 -top-px bottom-0 sm:hidden' />
                        {truncateAddress(item.address)}
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
                        {truncateAddress(item.transactionHash)}
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
