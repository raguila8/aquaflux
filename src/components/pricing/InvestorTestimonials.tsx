import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { StarField } from '@/components/shared/StarField'
import { cn } from '@/lib/utils'

import cosmicButterfly from '@/images/cosmic-butterfly.png'
import avatar1 from '@/images/avatars/avatar-1.png'
import avatar2 from '@/images/avatars/avatar-2.png'
import avatar3 from '@/images/avatars/avatar-3.png'
import avatar4 from '@/images/avatars/avatar-4.png'
import fictionalLogo01 from '@/images/logos/fictional-logo-01.svg'
import fictionalLogo02 from '@/images/logos/fictional-logo-02.svg'
import fictionalLogo03 from '@/images/logos/fictional-logo-03.svg'
import fictionalLogo04 from '@/images/logos/fictional-logo-04.svg'

const testimonials = [
  {
    companyLogo: fictionalLogo01,
    avatar: avatar1,
    name: 'Ethan Long',
    title: 'Marketer at Trendsetters',
    quote:
      'Lorem ipsum dolor sit amet consectetur blandit bibendum adipiscing proin tempor. Orci feugiat nec quisque tempor est neque tincidunt odio sollicitudin semper maecenas sollicitudin laoreet viverra.',
  },
  {
    companyLogo: fictionalLogo02,
    avatar: avatar2,
    name: 'Nina Tucker',
    title: 'Co-founder of Infinituma',
    quote:
      'Lorem ipsum dolor sit amet consectetur blandit bibendum adipiscing proin tempor. Orci feugiat nec quisque tempor est neque tincidunt odio sollicitudin semper maecenas sollicitudin laoreet viverra.',
  },
  {
    companyLogo: fictionalLogo03,
    avatar: avatar3,
    name: 'Olivia Simmons',
    title: 'Engineer at DevTech',
    quote:
      'Lorem ipsum dolor sit amet consectetur blandit bibendum adipiscing proin tempor. Orci feugiat nec quisque tempor est neque tincidunt odio sollicitudin semper maecenas sollicitudin laoreet viverra.',
  },
  {
    companyLogo: fictionalLogo04,
    avatar: avatar4,
    name: 'Sophia Johnson',
    title: 'Developer at Tinker',
    quote:
      'Lorem ipsum dolor sit amet consectetur blandit bibendum adipiscing proin tempor. Orci feugiat nec quisque tempor est neque tincidunt odio sollicitudin semper maecenas sollicitudin laoreet viverra.',
  },
]

export function InvestorTestimonials() {
  return (
    <Container className='relative mt-16 max-w-2xl sm:mt-20 md:max-w-(--breakpoint-xl) lg:mt-28'>
      {/* Social proof */}
      <div>
        <div className='absolute -left-96 -right-96 -top-96 bottom-0 -z-10'>
          <Image
            src={cosmicButterfly}
            alt=''
            className='h-[calc(100%_+_384px)] w-[calc(100%_+_768px)] opacity-10'
            sizes='(max-width: 1024px) 100vw, 1024px'
          />
        </div>
        <p className='text-center text-[13px] font-extrabold uppercase tracking-widest text-violet-50/80 sm:text-sm'>
          Funded by industry leading investors
        </p>

        {/* Testimonials */}
        <div className='relative mt-5 flex flex-wrap items-stretch justify-center sm:mt-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={`investor-testimonial-${index}`}
              className="group relative bg-linear-to-b after:absolute after:content-[''] md:w-1/2"
            >
              {/* left borders */}
              <div
                className={cn(
                  'absolute inset-y-0 left-0 h-full w-px bg-linear-to-b',
                  index % 2 === 0
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.025] to-violet-200/[0.1]'
                      : 'from-violet-200/[0.05] to-violet-200/[0.1] md:from-violet-200/[0.1] md:to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.05]'
                      : 'from-violet-200/[0.1] to-violet-200/[0.025] md:from-violet-200/[0.05] md:to-violet-200/[0.1]'
                )}
              />
              {/* bottom borders */}
              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 h-px w-full bg-linear-to-r',
                  Math.ceil(testimonials.length / 2) ===
                    Math.floor(index / 2) + 1 && 'md:hidden',
                  testimonials.length === index + 1 && 'hidden',
                  index % 2 === 0
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.025] to-violet-200/[0.1]'
                      : 'from-violet-200/[0.1] to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.025]'
                      : 'from-violet-200/[0.025] to-violet-200/[0.1]'
                )}
              />
              {/* Right borders */}
              <div
                className={cn(
                  'absolute inset-y-0 right-0 h-full w-px bg-linear-to-b',
                  index % 2 === 1
                    ? Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.05] to-violet-200/[0.025] md:from-violet-200/[0.025] md:to-violet-200/[0.1]'
                      : 'from-violet-200/[0.05] to-violet-200/[0.1] md:from-violet-200/[0.1] md:to-violet-200/[0.025]'
                    : Math.floor(index / 2) % 2 === 0
                      ? 'from-violet-200/[0.1] to-violet-200/[0.05] md:hidden'
                      : 'from-violet-200/[0.025] to-violet-200/[0.05] md:hidden'
                )}
              />
              <span className='absolute -left-[0.5px] top-1/2 h-8 w-px -translate-y-1/2 translate-x-1/2 bg-violet-100/40' />
              <div className='relative h-full w-full overflow-hidden'>
                <div
                  className='absolute bottom-1/2 left-1/2 right-0 top-0 opacity-0 duration-300 ease-in-out group-hover:opacity-100'
                  aria-hidden='true'
                >
                  <StarField density='high' maxRadius={1.75} minRadius={1} />
                </div>
                <div className='hover-gradient absolute inset-0 -z-10 bg-linear-to-b from-[#575EFF]/20 to-[#E478FF]/20 opacity-0 blur-4xl duration-300 ease-in-out group-hover:opacity-100' />
                <div className='relative h-full w-full px-6 py-8 lg:p-12'>
                  <testimonial.companyLogo className='h-9 w-auto md:h-10 lg:h-11 xl:h-12' />
                  <p className='mt-7 text-[17px] leading-8 text-zinc-200 sm:mt-8 sm:text-lg sm:leading-8'>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className='mt-8 flex items-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(to_top_right,rgba(113,113,122,0.3),rgba(24,24,27,1)),linear-gradient(rgba(9,9,11,0.5),rgba(9,9,11,0.5))]'>
                      <Image
                        className='h-[46px] w-[46px] rounded-full object-cover'
                        src={testimonial.avatar}
                        alt={`${testimonial.name}'s avatar`}
                      />
                    </div>
                    <div className='ml-2.5 flex flex-col justify-center'>
                      <span className='text-sm font-semibold text-white'>
                        {testimonial.name}
                      </span>
                      <span className='text-sm font-medium text-zinc-400'>
                        {testimonial.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
