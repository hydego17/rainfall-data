import Head from 'next/head';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput, Select } from '@mantine/core';
import { BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs';

import { http } from '@/lib/http';
import { isEmpty, omit } from '@s-libs/micro-dash';
import { createPayload } from '@/utils';
import { useGetStation } from '@/services/station';

const formatMap = {
  xls: {
    type: 'data:application/vnd.ms-excel',
    ext: '.xlsx',
  },
  pdf: {
    type: 'application/pdf',
    ext: '.pdf',
  },
};

export default function Home() {
  // Get station name
  const { data } = useGetStation();
  let stationList = (data?.output || [])
    .filter((s) => !!s.station_number)
    .map((s) => ({
      label: `${s.station_number} - ${s.station_name}`,
      value: s.station_name,
    }));

  // Initialize Form
  const { register, getValues, setValue, control } = useForm({
    defaultValues: {
      ['station-name']: 'Stasiun Meteorologi Aji Pangeran Tumenggung Pranoto',
      ['from']: '01-01-2021',
      ['to']: '31-01-2021',
      ['parameter[]']: 'rainfall',
      ['type']: 'mkg',
      ['format']: '',
    },
  });

  // Submit Handler
  const handleDownload = async (format: 'xls' | 'pdf') => {
    setValue('format', format);
    let data = getValues() as any;
    let payload = omit(data, 'parameter');

    await http('/data_iklim/download', {
      method: 'POST',
      responseType: 'arraybuffer',
      data: createPayload(payload),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => {
      let data = res.data;
      let blob = new Blob([data], { type: formatMap[format].type });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan_iklim_harian${formatMap[format].ext}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <>
      <Head>
        <title>Nadhirah Lamak Syamba</title>
      </Head>

      <div className='h-screen centered p-4'>
        <main className='max-w-[750px]'>
          <h1 className='text-3xl font-bold text-center'>Data BMKG Nadhirah Lamak Syamba</h1>

          <hr />

          <div className='rounded drop-shadow p-6 bg-white'>
            <form>
              <div className='space-y-3'>
                <Controller
                  control={control}
                  name='station-name'
                  render={({ field }) => (
                    <Select
                      disabled={isEmpty(stationList)}
                      searchable
                      label='Station Name'
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                      data={stationList}
                    />
                  )}
                />

                <TextInput label='Start Date (MM-DD-YYYY)' {...register('from')} />
                <TextInput label='End Date (MM-DD-YYYY)' {...register('to')} />
                <TextInput label='Parameter' {...register('parameter[]')} disabled />
                <TextInput label='Type' {...register('type')} disabled />
              </div>

              <hr className='my-4' />

              <div className='flex gap-4'>
                <Button
                  size='md'
                  fullWidth
                  type='button'
                  variant='filled'
                  leftIcon={<BsFileEarmarkExcel />}
                  onClick={() => handleDownload('xls')}
                >
                  XLS
                </Button>
                <Button
                  size='md'
                  fullWidth
                  type='button'
                  variant='outline'
                  leftIcon={<BsFilePdf />}
                  onClick={() => handleDownload('pdf')}
                >
                  PDF
                </Button>
              </div>
            </form>
          </div>

          {/* 
        <hr />

        <div className='border p-4 max-w-[500px]'>
          <form action='https://dataonline.bmkg.go.id/data_iklim/download' method='post'>
            <div className='space-y-2'>
              <TextInput label='Station Name' {...register('station-name')} />
              <TextInput label='Start Date (MM-DD-YYYY)' {...register('from')} />
              <TextInput label='End Date (MM-DD-YYYY)' {...register('to')} />
              <TextInput label='Parameter' {...register('parameter[]')} />
              <TextInput label='type' hidden {...register('type')} />
              <TextInput label='idmcfeedback' hidden {...register('idmcfeedback')} />
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
        </div> */}
        </main>
      </div>
    </>
  );
}
