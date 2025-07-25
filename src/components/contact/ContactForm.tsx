import { Button } from '@/components/shared/Button'
import { TextField } from '@/components/forms/TextField'
import { SelectField } from '@/components/forms/SelectField'

export function ContactForm() {
  return (
    <form action='#' method='POST'>
      <div className='space-y-8 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 sm:space-y-0'>
        <TextField
          label='First name'
          name='first-name'
          autoComplete='given-name'
          placeholder='Johnny'
          required
        />
        <TextField
          label='Last name'
          name='last-name'
          autoComplete='family-name'
          placeholder='Bravo'
          required
        />
        <SelectField label='Choose a topic' name='topic' defaultValue='General'>
          <option value='General'>General</option>
          <option value='Request a demo'>Request a demo</option>
          <option value='Talk to sales'>Talk to sales</option>
          <option value='Support'>Support</option>
          <option value='Feedback'>Feedback</option>
          <option value='Found a bug'>Found a bug</option>
        </SelectField>
        <TextField
          label='Email'
          name='email'
          type='email'
          auto-complete='email'
          placeholder='johnnybravo@gmail.com'
          required
        />
        <TextField
          label='Company name'
          name='company-name'
          placeholder='Johnny Bravo Enterprises'
          required
        />
        <SelectField
          label='Company size'
          name='company-size'
          defaultValue='1-10'
        >
          <option value='1-10'>1-10</option>
          <option value='10-20'>10-20</option>
          <option value='20-50'>20-50</option>
          <option value='50-100'>50-100</option>
          <option value='100-1000'>100-1000</option>
          <option value='1000+'>1000+</option>
        </SelectField>
      </div>
      <TextField
        className='mt-8'
        label='How can we help you?'
        name='message'
        rows={6}
        elementType='textarea'
        aria-describedby='message-description'
        placeholder='Enter your questions, feedback or suggestions...'
        required
      />
      <div className='mt-8 flex items-center justify-between space-x-4'>
        <p className='text-sm text-violet-100/75'>
          You can also email us at{' '}
          <a
            className='text-violet-300/80 underline duration-200 ease-in-out hover:text-violet-300'
            href='mailto:sales@nebula.com'
          >
            sales@nebula.com
          </a>
        </p>
        <Button type='submit' className='sm:px-5'>
          Send message
        </Button>
      </div>
    </form>
  )
}
