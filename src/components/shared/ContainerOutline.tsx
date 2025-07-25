export const ContainerOutline = () => {
  return (
    <>
      {/* Container lines */}
      <span className='absolute -bottom-5 -top-5 left-0 w-px bg-linear-to-b from-violet-200/5 via-violet-200/[0.08] to-violet-200/5 sm:-bottom-8 sm:-top-8 lg:-bottom-16 lg:-top-16'></span>
      <span className='absolute -bottom-5 -top-5 right-0 w-px bg-linear-to-b from-violet-200/5 via-violet-200/[0.08] to-violet-200/5 sm:-bottom-8 sm:-top-8 lg:-bottom-16 lg:-top-16'></span>
      <span className='absolute -left-5 -right-5 top-0 h-px bg-linear-to-r from-violet-200/5 via-violet-200/[0.08] to-violet-200/5 sm:-left-8 sm:-right-8 lg:-left-16 lg:-right-16'></span>
      <span className='absolute -left-5 -right-5 bottom-0 h-px bg-linear-to-r from-violet-200/5 via-violet-200/[0.08] to-violet-200/5 sm:-left-8 sm:-right-8 lg:-left-16 lg:-right-16'></span>

      {/* corner dots */}
      <span className='absolute -left-[1.5px] -top-[1.5px] h-1 w-1 rounded-full bg-violet-200'></span>
      <span className='absolute -right-[1.5px] -top-[1.5px] h-1 w-1 rounded-full bg-violet-200'></span>
      <span className='absolute -bottom-[1.5px] -left-[1.5px] h-1 w-1 rounded-full bg-violet-200'></span>
      <span className='absolute -bottom-[1.5px] -right-[1.5px] h-1 w-1 rounded-full bg-violet-200'></span>
    </>
  )
}
