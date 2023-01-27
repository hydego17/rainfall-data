import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button, TextInput } from '@mantine/core';
import { http } from '@/lib/http';
import { useForm } from 'react-hook-form';

function download(payload: any) {
  return http.post('https://dataonline.bmkg.go.id/data_iklim/download', payload);
}

const useDownloadData = () => {
  return useMutation(download);
};

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
      <h1 className='text-4xl'>Data BMKG Nadhirah Lamak Syamba</h1>

      <hr />

      <div className='border p-4'>
        <form action='https://dataonline.bmkg.go.id/data_iklim/download' method='post' target='_blank'>
          <div className='space-y-2'>
            <TextInput label='Station Name' {...register('station-name')} />
            <TextInput label='Start Date' {...register('from')} />
            <TextInput label='End Date' {...register('to')} />
            <TextInput label='Parameter' {...register('parameter[]')} />
          </div>

          <hr />

          <div className='flex gap-2'>
            <Button type='submit' variant='filled' name='format' value='xls'>
              XLS
            </Button>
            <Button type='submit' variant='outline' name='format' value='pdf'>
              PDF
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
