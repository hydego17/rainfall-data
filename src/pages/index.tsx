import { Button, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';

import { BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs';

export default function Home() {
  const { register } = useForm({
    defaultValues: {
      ['station-name']: 'Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto',
      ['from']: '01-01-2021',
      ['to']: '31-01-2021',
      ['parameter[]']: 'rainfall',
      ['type']: 'mkg',
      ['format']: 'xls',
    },
  });

  return (
    <main className='py-8 container'>
      <h1 className='text-3xl font-bold'>Data BMKG Nadhirah Lamak Syamba</h1>

      <hr />

      <div className='border p-4 max-w-[500px]'>
        <form action='https://dataonline.bmkg.go.id/data_iklim/download' method='post' target='_blank'>
          <div className='space-y-2'>
            <TextInput label='Station Name' {...register('station-name')} />
            <TextInput label='Start Date (MM-DD-YYYY)' {...register('from')} />
            <TextInput label='End Date (MM-DD-YYYY)' {...register('to')} />
            <TextInput label='Parameter' {...register('parameter[]')} />
          </div>

          <hr />

          <div className='flex gap-2'>
            <Button type='submit' variant='filled' name='format' value='xls' leftIcon={<BsFileEarmarkExcel />}>
              XLS
            </Button>
            <Button type='submit' variant='outline' name='format' value='pdf' leftIcon={<BsFilePdf />}>
              PDF
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
