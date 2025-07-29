import Link from 'next/link'

type Props = {
  name: string
  link?: { href: string; text: string }
  children: React.ReactNode
}

export function Label({ name, link, children }: Props) {
  return (
    <div className='flex items-end justify-between text-sm leading-none'>
      <label htmlFor={name} className='text-indigo-blue-100/75 block'>
        {children}
      </label>

      {link && (
        <Link
          href={link.href}
          className='text-aqua-300/80 hover:text-aqua-300 underline duration-200 ease-in-out'
        >
          {link.text}
        </Link>
      )}
    </div>
  )
}
