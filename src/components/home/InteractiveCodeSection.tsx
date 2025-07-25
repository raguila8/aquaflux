import Image from 'next/image'
import { CodeShowcase } from '@/components/home/CodeShowcase'
import { StarField } from '@/components/shared/StarField'
import { codeToHtml } from 'shiki'

import spaceSpotlight from '@/images/space-spotlight.png'

export async function InteractiveCodeSection() {
  const sampleCodeBlock = `module.exports = leftpad;

function leftpad(str, len, ch) {
  str = String(str);
  var i = -1;

  if (!ch && ch != 0) ch = ' ';

  len = len - str.length;

  while (i++ < len) {
    str = ch + str;
  }
  return str;
}
`

  const defaultHTML = await codeToHtml(sampleCodeBlock, {
    lang: 'javascript',
    theme: 'material-theme-palenight',
  })

  const features = [
    {
      title: 'Real-time collaboration',
      description:
        'Seasonal latte black java dark blue fair grounds barista black origin french caffeine body. ',
      icon: 'ClockIcon',
      codeBlocks: [defaultHTML, defaultHTML],
    },
    {
      title: 'Customize your stack',
      description:
        'Seasonal latte black java dark blue fair grounds barista black origin french caffeine body. ',
      icon: 'RectangleStackIcon',
      codeBlocks: [defaultHTML, defaultHTML],
    },
    {
      title: 'Port to any environment',
      description:
        'Seasonal latte black java dark blue fair grounds barista black origin french caffeine body. ',
      icon: 'ComputerDesktopIcon',
      codeBlocks: [defaultHTML, defaultHTML],
    },
    {
      title: 'Integrate modern tools',
      description:
        'Seasonal latte black java dark blue fair grounds barista black origin french caffeine body. ',
      icon: 'SquaresPlusIcon',
      codeBlocks: [defaultHTML, defaultHTML],
    },
  ]

  return (
    <section className='relative overflow-hidden bg-[linear-gradient(rgba(24,24,27,0.95),rgba(24,24,27,0.95)),linear-gradient(#2E1065,#2E1065)] py-20 sm:py-24 lg:py-32 xl:py-40'>
      <div className='absolute left-0 top-0 w-full max-w-7xl -translate-x-1/2 -translate-y-1/2'>
        <Image
          src={spaceSpotlight}
          alt=''
          className='h-full w-full object-contain'
          sizes='(max-width: 1024px) 100vw, 1280px'
        />
      </div>

      {/* Stars */}
      <div className='absolute left-0 top-0 z-0 h-72 w-72' aria-hidden='true'>
        <StarField density='high' maxRadius={2.5} minRadius={1.25} />
      </div>
      <CodeShowcase features={features} />
    </section>
  )
}
