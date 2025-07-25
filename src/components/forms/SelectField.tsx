import { Label } from './Label'

interface CustomProps {
  label?: string
  name: string
  defaultValue?: string
}

type Props = CustomProps & React.SelectHTMLAttributes<HTMLSelectElement>

const inputClasses =
  'px-3 py-2.5 transition-colors duration-200 ease-in-out text-sm text-violet-50 placeholder:text-zinc-400/80 focus:outline-hidden rounded-md ring-1 ring-inset ring-violet-200/[0.06] focus:ring-2 focus:ring-inset focus:ring-violet-300/15 w-full bg-transparent border-0 cursor-pointer'

export function SelectField({
  label,
  name,
  className,
  children,
  defaultValue,
  ...attrs
}: Props) {
  return (
    <div className={className}>
      {label && <Label name={name}>{label}</Label>}
      <div className='group relative mt-2 flex w-full rounded-md bg-zinc-950/[.01] shadow-inner-blur duration-200 ease-in-out hover:bg-zinc-950/10 has-focus:bg-zinc-950/15'>
        <select
          id={name}
          name={name}
          className={inputClasses}
          defaultValue={defaultValue}
          {...attrs}
        >
          {children}
        </select>
      </div>
    </div>
  )
}
